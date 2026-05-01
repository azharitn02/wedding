import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Music, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MusicPlayerProps {
  isOpened: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isOpened }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const playerRef = useRef<any>(null);
  const playerReadyRef = useRef(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);

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

  // Listen for the first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      setHasUserInteracted(true);
    };
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchend', handleInteraction, { once: true });
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchend', handleInteraction);
    };
  }, []);

  // Create the player
  const createPlayer = useCallback(() => {
    if (playerRef.current || !isApiReady || !playerContainerRef.current) return;

    try {
      playerRef.current = new (window as any).YT.Player(playerContainerRef.current, {
        height: '0',
        width: '0',
        videoId: 'l38Aru5jICw',
        playerVars: {
          autoplay: 0,
          loop: 2,
          playlist: 'l38Aru5jICw',
          start: 47,
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            playerReadyRef.current = true;
            event.target.setVolume(70); // Set a comfortable default volume
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
            }
          },
        },
      });
    } catch (err) {
      console.warn('Failed to create YouTube player:', err);
    }
  }, [isApiReady]);

  // Attempt to play
  const attemptPlay = useCallback(() => {
    if (!playerRef.current || !playerReadyRef.current) return;
    try {
      const state = playerRef.current.getPlayerState?.();
      const YT = (window as any).YT;
      if (state !== YT?.PlayerState?.PLAYING) {
        playerRef.current.playVideo();
      }
    } catch (err) {
      console.warn('playVideo failed:', err);
    }
  }, []);

  useEffect(() => {
    if (isApiReady && !playerRef.current) {
      createPlayer();
    }
  }, [isApiReady, createPlayer]);

  useEffect(() => {
    const handleBukaUndangan = () => {
      attemptPlay();
    };
    window.addEventListener('bukaUndangan', handleBukaUndangan);
    return () => window.removeEventListener('bukaUndangan', handleBukaUndangan);
  }, [attemptPlay]);

  useEffect(() => {
    if (hasUserInteracted && playerReadyRef.current && !isPlaying) {
      attemptPlay();
    }
  }, [hasUserInteracted, isPlaying, attemptPlay]);

  const togglePlay = () => {
    if (!playerRef.current || !playerReadyRef.current) {
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
    } catch (err) {
      console.warn('Toggle play failed:', err);
    }
  };

  return (
    <>
      <div className="hidden" aria-hidden="true">
        <div ref={playerContainerRef} />
      </div>
      
      <AnimatePresence>
        {isOpened && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed bottom-8 left-8 z-[100]"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;
