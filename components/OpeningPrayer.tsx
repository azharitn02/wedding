'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { WeddingData } from '@/lib/data';
import { getAssetPath } from '@/lib/utils';
import Image from 'next/image';

interface OpeningPrayerProps {
  data: WeddingData['prayer'];
}

export default function OpeningPrayer({ data }: OpeningPrayerProps) {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(contentRef.current?.querySelectorAll('.stagger-el') || [], {
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none none",
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-[#E8E4DC] flex justify-center overflow-hidden">
      <div className="relative w-full max-w-[500px] min-h-screen">
        {/* Background Image - The "Frame" */}
        <Image 
          src={getAssetPath('/illusbg.gif')} 
          alt="Opening Prayer Background" 
          fill
          className="prayer-bg-img object-cover block" 
          unoptimized
        />
        
        {/* Decorative center element - Providing safe contrast for text */}
        <div className="prayer-bg-circle absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-square rounded-full bg-white/20 blur-3xl z-0"/>
        
        {/* Overlay Content */}
        <div ref={contentRef} className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 py-12">
          <div className="w-full max-w-[340px] flex flex-col items-center space-y-8">
            <div className="stagger-el text-center">
              {/* <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-brand-espresso/40 block mb-2">The Blessing</span> */}
              <h2 className="mogra-regular text-2xl text-brand-burgundy tracking-wide">{data.surah}</h2>
              <div className="w-8 h-[1px] bg-brand-gold/40 mx-auto mt-2" />
            </div>
            
            <div className="stagger-el space-y-6 flex flex-col items-center w-full relative z-10">
              <p className="font-serif text-2xl md:text-3xl text-brand-espresso leading-relaxed dir-rtl text-center drop-shadow-sm" dir="rtl">
                {data.arabic}
              </p>
              
              <div className="h-px w-12 bg-brand-gold/40" />
              
              <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm relative">
                <p className="font-premium-serif text-[#2D1E17] text-sm md:text-base leading-relaxed text-center italic font-medium">
                  &quot;{data.translation}&quot;
                </p>
                {/* <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full text-center">
                   <p className="font-sans text-[9px] uppercase tracking-[0.4em] text-brand-espresso font-bold">
                    {data.surah}
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
