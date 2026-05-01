'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
// import Image from 'next/image';

import { WeddingData } from '@/lib/data';
import { getAssetPath } from '@/lib/utils';

interface CoupleProps {
  data: WeddingData['couple'];
}

export default function Couple({ data }: CoupleProps) {
  const containerRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    gsap.from(elementsRef.current?.querySelectorAll('.stagger-el') || [], {
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-[#E8E4DC] flex justify-center overflow-hidden">
      <div className="relative w-full max-w-[500px] min-h-screen">
        {/* Background Image - The "Frame" */}
        <img 
          ref={bgRef}
          src={getAssetPath('/couplesbg.jpg')} 
          alt="Couple full screen" 
          className="w-full min-h-screen object-cover block" 
        />

        {/* Content Overlay - Centered in Safe Zones */}
        <div ref={elementsRef} className="absolute inset-0 z-10 w-full h-full pointer-events-none flex flex-col justify-between pt-[15%] pb-[20%] px-8">
          
          {/* Top Content */}
          <div className="flex flex-col items-center space-y-3">
            <div className="stagger-el">
              <h2 className="idle-motion text-2xl md:text-4xl mogra-regular tracking-wider text-[#e8e4dc] drop-shadow-xl text-center">
                We&apos;re getting married
              </h2>
            </div>
            <div className="stagger-el">
              <div className="h-[1px] w-12 bg-brand-bone/40 mx-auto my-2" />
              <p className="font-sans text-sm md:text-base font-medium tracking-[0.3em] text-[#e8e4dc]/90 text-glow text-center uppercase">
                April 8, 2026
              </p>
            </div>
          </div>

          {/* Bottom Content */}
          <div className="flex flex-col items-center space-y-4">
            <div className="stagger-el">
              <h2 className="idle-motion text-3xl md:text-5xl mogra-regular text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-wide text-center leading-tight">
                Blueberry & <br/> Strawberry
              </h2>
            </div>
            <div className="stagger-el">
              <p className="font-premium-serif text-lg md:text-2xl text-brand-bone/90 tracking-wide text-glow text-center italic">
                #sehatselamanya
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
