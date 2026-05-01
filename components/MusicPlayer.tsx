import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Music, Music2, Volume2, Volume1, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MusicPlayerProps {
  isOpened: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isOpened }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showVolume, setShowVolume] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const playerRef = useRef<any>(null);
  const volumeTimeoutRef = useRef<any>(null);
  const retryTimeoutRef = useRef<any>(null);
  const playerReadyRef = useRef(false);

  // Load YouTube IFrame API
  useEffect(() => {
    if ((window as any).YT && (window as any).YT.Player) {
      setIsApiReady(true);
    } else {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      (window as any).onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
      };
    }
  }, []);

  // Listen for the first user interaction on the document (tap/click anywhere)
  // This is needed because mobile browsers require a user gesture to play media
  useEffect(() => {
    const handleInteraction = () => {
      setHasUserInteracted(true);
    };

    // These events count as "user gestures" for autoplay policy
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchend', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchend', handleInteraction);
    };
  }, []);

  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Create the player when API is ready and gate is opened
  const createPlayer = useCallback(() => {
    if (playerRef.current || !isApiReady || !playerContainerRef.current) return;

    try {
      playerRef.current = new (window as any).YT.Player(playerContainerRef.current, {
        height: '0',
        width: '0',
        videoId: 'l38Aru5jICw',
        playerVars: {
          autoplay: 0, // Don't autoplay — we'll call playVideo() manually after user gesture
          loop: 2,
          playlist: 'l38Aru5jICw',
          start: 47, // Start the music at 46 seconds
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
          playsinline: 1,  // Critical for iOS — play inline instead of fullscreen
        },
        events: {
          onReady: (event: any) => {
            playerReadyRef.current = true;
            event.target.setVolume(volume);
            // Attempt to play — will work if called within user gesture context
            attemptPlay();
          },
          onStateChange: (event: any) => {
            const YT = (window as any).YT;
            if (!YT) return;

            switch (event.data) {
              case YT.PlayerState.PLAYING:
                setIsPlaying(true);
                break;
              case YT.PlayerState.PAUSED:
              case YT.PlayerState.ENDED:
                setIsPlaying(false);
                break;
              case YT.PlayerState.UNSTARTED:
                // On mobile, the player might go to UNSTARTED if autoplay was blocked
                setIsPlaying(false);
                break;
            }
          },
          onError: (event: any) => {
            console.warn('YouTube player error:', event.data);
            setIsPlaying(false);
          },
        },
      });
    } catch (err) {
      console.warn('Failed to create YouTube player:', err);
    }
  }, [isApiReady, volume]);

  // Attempt to play the video
  const attemptPlay = useCallback(() => {
    if (!playerRef.current || !playerReadyRef.current) return;

    try {
      const state = playerRef.current.getPlayerState?.();
      const YT = (window as any).YT;
      
      // Only play if not already playing
      if (state !== YT?.PlayerState?.PLAYING) {
        playerRef.current.playVideo();
      }
    } catch (err) {
      console.warn('playVideo failed:', err);
    }
  }, []);

  // Create player immediately once API is ready, regardless of isOpened
  useEffect(() => {
    if (isApiReady && !playerRef.current) {
      createPlayer();
    }
  }, [isApiReady, createPlayer]);

  // Listen for the specific 'Buka Undangan' click event to trigger synchronous playback
  useEffect(() => {
    const handleBukaUndangan = () => {
      // Must execute synchronously here to satisfy mobile Chrome/Safari user-gesture limits
      attemptPlay();
    };
    window.addEventListener('bukaUndangan', handleBukaUndangan);
    return () => window.removeEventListener('bukaUndangan', handleBukaUndangan);
  }, [attemptPlay]);

  // If player was created before user gesture, retry play after interaction
  useEffect(() => {
    if (hasUserInteracted && playerReadyRef.current && !isPlaying) {
      attemptPlay();
    }
  }, [hasUserInteracted, isPlaying, attemptPlay]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  const resetVolumeTimeout = () => {
    if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolume(false);
    }, 3000);
  };

  const togglePlay = () => {
    if (!playerRef.current || !playerReadyRef.current) {
      // Player not ready yet — try creating it now (user is tapping, so we have a gesture)
      if (!playerRef.current && isApiReady) {
        createPlayer();
      }
      return;
    }

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      // Don't set isPlaying here — let onStateChange handle it for accuracy
    } catch (err) {
      console.warn('Toggle play failed:', err);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (playerRef.current && playerReadyRef.current) {
      try {
        playerRef.current.setVolume(newVolume);
      } catch (err) {
        // Player might not be ready
      }
    }
    resetVolumeTimeout();
  };

  const toggleVolumeUI = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setShowVolume(!showVolume);
    if (!showVolume) {
      resetVolumeTimeout();
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-4 h-4" />;
    if (volume < 50) return <Volume1 className="w-4 h-4" />;
    return <Volume2 className="w-4 h-4" />;
  };

  return (
    <>
      {/* Stable container for YouTube to prevent DOM reconciliation errors */}
      <div className="hidden" aria-hidden="true">
        <div ref={playerContainerRef} />
      </div>
      
      <AnimatePresence>
        {isOpened && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed bottom-8 left-8 z-[100] flex items-center gap-3"
          >
            <div className="relative flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="relative w-12 h-12 flex items-center justify-center bg-brand-espresso/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl group transition-all duration-500 hover:border-brand-gold"
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
              >
                {/* Pulsing background effect */}
                {isPlaying && (
                  <span className="absolute inset-0 rounded-full bg-brand-gold/20 animate-ping" />
                )}
                
                <motion.div
                  animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                  transition={isPlaying ? { repeat: Infinity, duration: 4, ease: "linear" } : { duration: 0.5 }}
                >
                  {isPlaying ? (
                    <Music2 className="w-5 h-5 text-brand-gold" />
                  ) : (
                    <Music className="w-5 h-5 text-brand-bone/60" />
                  )}
                </motion.div>
              </button>

              <button 
                onClick={toggleVolumeUI}
                className="w-8 h-8 flex items-center justify-center bg-brand-espresso/80 backdrop-blur-md border border-white/10 rounded-full shadow-lg text-brand-bone/40 hover:text-brand-gold transition-colors"
                aria-label="Volume control"
              >
                {getVolumeIcon()}
              </button>
            </div>

            <AnimatePresence>
              {showVolume && (
                <motion.div
                  initial={{ opacity: 0, width: 0, x: -10 }}
                  animate={{ opacity: 1, width: 'auto', x: 0 }}
                  exit={{ opacity: 0, width: 0, x: -10 }}
                  onPointerEnter={() => { if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current); }}
                  onPointerLeave={resetVolumeTimeout}
                  onPointerDown={() => { if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current); }}
                  onPointerUp={resetVolumeTimeout}
                  onPointerCancel={resetVolumeTimeout}
                  className="bg-brand-espresso/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3 overflow-hidden shadow-xl"
                >
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold touch-none group-hover:opacity-100"
                  />
                  <span className="font-sans text-[10px] text-brand-bone/60 w-6 tabular-nums">
                    {volume}%
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;
