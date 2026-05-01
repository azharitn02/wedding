'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { WeddingData } from '@/lib/data';
import { getAssetPath } from '@/lib/utils';
import FloralFrame from './FloralFrame';

interface CoverProps {
  data: WeddingData['event'];
  onOpen: () => void;
}

export default function Cover({ data, onOpen }: CoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useGSAP(() => {
    // Initial entrance animation
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    
    tl.from(elementsRef.current?.querySelectorAll('.stagger-el') || [], {
      y: 100,
      opacity: 0,
      stagger: 0.15,
      duration: 2,
      delay: 0.5
    });

  }, { scope: containerRef });

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    
    // Play music here if we had an audio element
    
    const tl = gsap.timeline({
      onComplete: onOpen
    });

    const els = elementsRef.current?.querySelectorAll('.stagger-el');
    
    if (els && els.length > 0) {
      const btnContainer = els[els.length - 1];
      const nameImages = Array.from(els).slice(0, els.length - 1);
      
      // 1. Button click effect: shrink and fade down
      tl.to(btnContainer, {
        scale: 0.5,
        opacity: 0,
        y: 40,
        duration: 0.5,
        ease: "back.in(1.7)"
      })
      // 2. Images: float away (up and down), scale up and fade out
      .to(nameImages, {
        y: (i) => i === 0 ? -150 : 150,
        x: (i) => i === 0 ? -30 : 30,
        rotation: (i) => i === 0 ? -5 : 5,
        scale: 1.3,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.inOut"
      }, "-=0.2");
    }

    // Exit animation (sliding up like a curtain)
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 1.4,
      ease: "expo.inOut"
    }, "-=0.6");
  };

  // Prevent scrolling while cover is active
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'auto' : 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <div 
      ref={containerRef}
      className="w-full bg-[#E8E4DC] flex justify-center overflow-hidden"
    >
      <div className="relative w-full max-w-[500px] min-h-screen shadow-2xl">
        <img src={getAssetPath('/bgfix.jpg')} alt="Cover Background" className="w-full min-h-screen object-cover block pointer-events-none" />
        
        <div ref={elementsRef} className="absolute inset-0 z-10 w-full h-full mx-auto">
          
          {/* Bride Name */}
          <div className="stagger-el absolute left-5 right-0 top-[29%] h-[25%] flex justify-center items-center pointer-events-none">
            <div className="relative w-full h-full mx-8">
              <Image 
                src={getAssetPath('/bridename.gif')} 
                alt="Bride Name" 
                fill 
                className="object-contain" 
                unoptimized 
              />
            </div>
          </div>

          {/* Groom Name */}
          <div className="stagger-el absolute left-5 right-0 top-[46%] h-[25%] flex justify-center items-center pointer-events-none">
            <div className="relative w-full h-full mx-8">
              <Image 
                src={getAssetPath('/groomname.gif')} 
                alt="Groom Name" 
                fill 
                className="object-contain" 
                unoptimized 
              />
            </div>
          </div>

          {/* Bottom button region */}
          <div className="stagger-el absolute bottom-[12%] left-0 right-0 flex justify-center">
            <button 
              onClick={handleOpen}
              className="group relative px-8 py-3 overflow-hidden rounded-full text-[#F9F8F6] transition-transform hover:scale-105 active:scale-95 shadow-xl"
            >
              <span className="relative z-10 text-xs font-semibold uppercase tracking-widest text-white">
                Open Invitation
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
