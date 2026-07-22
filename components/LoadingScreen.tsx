'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useProgress } from '@react-three/drei';
import { WEDDING_CONFIG } from '../app/weddingConfig';

export function LoadingScreen() {
  const { progress } = useProgress();
  const [show, setShow] = useState(true);
  const [delayedProgress, setDelayedProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const loadingPhrases = useMemo(() => [
    "Preparing beautiful memories...",
    "Menyiapkan hari bahagia...",
    "Menyusun setiap detail kisah...",
    "Sesaat lagi...",
    "Symphony of love is tuning..."
  ], []);

  // 1. Handle Back/Forward Cache Restorations
  useEffect(() => {
    const handlePageShow = (event: { persisted: any; }) => {
      // If the page was restored from bfcache
      if (event.persisted) {
        // Option A: Just keep it hidden cleanly
        setShow(false);
        window.dispatchEvent(new Event('weddingLoaded'));
        
        // Option B: If you WANT them to see a quick 1-second elegant reload animation:
        // setDelayedProgress(0);
        // setShow(true);
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  // Cycle romantic phrases gently
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [loadingPhrases.length]);

  // Smooth progress bar dampening
  useEffect(() => {
    const interval = setInterval(() => {
      setDelayedProgress((prev) => {
        if (prev < progress) {
          return Math.min(prev + 1.2, progress);
        } else if (progress === 100 && prev < 100) {
          return Math.min(prev + 1.5, 100);
        }
        return prev;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [progress]);

  // Trigger elegant fade out once progress hits 100%
  useEffect(() => {
    if (delayedProgress >= 100) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('weddingLoaded'));
      }
      const timer = setTimeout(() => {
        setShow(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [delayedProgress]);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#0A120D]/65 backdrop-blur-[6px] transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
        delayedProgress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* ... keeping all your beautiful SVG and premium styling identical ... */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#4B182B]/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#A8B8A6]/10 blur-[120px] pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm px-6 text-center select-none">
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          <div className="absolute bottom-0 text-[11px] font-sans tracking-widest text-[#F8F3ED] bg-[#4B182B] px-3 py-0.5 border border-[#4B182B]/35 rounded-full shadow-lg shadow-[#4B182B]/10">
            {Math.floor(delayedProgress)}%
          </div>
        </div>

        <h1 className="text-[#F8F3ED] font-serif text-lg tracking-[0.2em] uppercase font-light mb-3">
          Yuliana &amp; Bayu
        </h1>

        <div className="h-6 overflow-hidden relative w-64 flex items-center justify-center">
          {loadingPhrases.map((phrase, idx) => (
            <p
              key={idx}
              className={`absolute text-[11px] font-serif italic text-[#A8B8A6] tracking-wider transition-all duration-700 ease-in-out ${
                idx === phraseIndex 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
              }`}
            >
              "{phrase}"
            </p>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-8 flex flex-col items-center opacity-30 tracking-[0.4em] uppercase text-[8px] text-[#F8F3ED]">
        <span>Loading Experience</span>
      </div>
    </div>
  );
}
