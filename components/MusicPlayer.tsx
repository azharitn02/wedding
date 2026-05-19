'use client';
import React, { useState, useEffect, useRef } from 'react';
import { WEDDING_CONFIG, getAssetPath } from '../app/weddingConfig';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const needsSeek = useRef(true);
  const startSecond = (WEDDING_CONFIG as any).musicStartSecond ?? 47;
  
  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log('Autoplay prevented by browser security policy:', err);
        });
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  // Subscribe to the custom loading screen finished event
  useEffect(() => {
    const handleLoaded = () => {
      setIsLoaded(true);
    };
    window.addEventListener('weddingLoaded', handleLoaded);
    return () => window.removeEventListener('weddingLoaded', handleLoaded);
  }, []);

  // Try to autoplay once loaded and setup fallback interaction listeners
  useEffect(() => {
    if (!isLoaded) return;

    // Attempt autoplay once assets are fully loaded and reveal begins
    const timer = setTimeout(() => {
      handlePlay();
    }, 400); // 400ms delay to align perfectly with the loading screen dissolving

    // Fallback: Start playing on first user interaction anywhere on the window
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        handlePlay();
        setHasInteracted(true);
        cleanupListeners();
      }
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('scroll', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });

    return () => {
      clearTimeout(timer);
      cleanupListeners();
    };
  }, [isLoaded, hasInteracted]);

  return (
    <>
      {/* Native HTML5 Audio Player preloaded during loading screen */}
      <audio
        ref={audioRef}
        src={getAssetPath('/musicbgScript.mp3')}
        loop
        preload="auto"
        onPlaying={() => {
          // Seek AFTER playback starts — the only reliable method on mobile Safari/Chrome
          if (audioRef.current && needsSeek.current) {
            audioRef.current.currentTime = startSecond;
            needsSeek.current = false;
          }
        }}
        className="hidden absolute w-0 h-0 pointer-events-none opacity-0 border-0"
      />

      {/* Embedded Rich CSS Animations for Vinyl & Floating Notes */}
      <style>{`
        @keyframes spin-vinyl {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float-note-1 {
          0% { transform: translateY(10px) translateX(0) scale(0.6); opacity: 0; }
          30% { opacity: 0.8; }
          100% { transform: translateY(-50px) translateX(-20px) scale(1) rotate(15deg); opacity: 0; }
        }
        @keyframes float-note-2 {
          0% { transform: translateY(10px) translateX(0) scale(0.6); opacity: 0; }
          30% { opacity: 0.8; }
          100% { transform: translateY(-55px) translateX(20px) scale(1.1) rotate(-20deg); opacity: 0; }
        }
        .animate-spin-vinyl {
          animation: spin-vinyl 8s linear infinite;
        }
        .note-1 {
          animation: float-note-1 3s ease-out infinite;
        }
        .note-2 {
          animation: float-note-2 3.5s ease-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>

      {/* Floating Controller Button */}
      <div className="fixed bottom-2 right-7 z-[9999] flex flex-col items-center">
        <button
          onClick={togglePlay}
          className="relative w-12 h-12 flex items-center justify-center bg-[#0A120D]/15 hover:bg-[#32101c]/20 border border-[#D4AF37]/15 hover:border-[#D4AF37] rounded-full shadow-2xl transition-all duration-300 group cursor-pointer select-none active:scale-95"
          aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {/* Active Vinyl Disc Graphic */}
          <div className={`absolute inset-1 border border-[#D4AF37]/10 rounded-full flex items-center justify-center bg-[#151C18]/15 ${isPlaying ? 'animate-spin-vinyl' : ''}`}>
            {/* Inner vinyl ridges */}
            <div className="absolute inset-2 border border-[#D4AF37]/15 rounded-full" />
            <div className="absolute inset-3 border border-[#D4AF37]/10 rounded-full" />
            
            {/* Center Label */}
            <div className="w-3.5 h-3.5 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-inner">
              {/* Spindle hole */}
              <div className="w-1 h-1 bg-[#0A120D] rounded-full" />
            </div>
          </div>

          {/* Micro Visual Floating Music Notes (Only active when playing) */}
          {isPlaying && (
            <>
              <span className="absolute text-[10px] text-[#D4AF37] note-1 pointer-events-none select-none font-serif">🎵</span>
              <span className="absolute text-[10px] text-[#D4AF37] note-2 pointer-events-none select-none font-serif">🎶</span>
            </>
          )}

          {/* Simple overlay pause/play icons on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full">
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F8F3ED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="4" x2="18" y2="20"></line>
                <line x1="6" y1="4" x2="6" y2="20"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="translate-x-[1px]">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </div>
        </button>

        {/* Pulse Hint (Disappears once playing starts or user interacts) */}
        {!isPlaying && !hasInteracted && (
          <div className="absolute bottom-14 bg-[#32101c]/80 border border-[#D4AF37]/30 px-3 py-1 rounded text-[9px] text-[#D4AF37] font-serif tracking-widest uppercase whitespace-nowrap animate-pulse shadow-md pointer-events-none">
            Tap to Play
          </div>
        )}
      </div>
    </>
  );
}
