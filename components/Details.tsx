'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import Image from 'next/image';

import { WeddingData } from '@/lib/data';

interface DetailsProps {
  data: WeddingData['event'];
}

export default function Details({ data }: DetailsProps) {
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
        start: "top 75%",
        toggleActions: "play none none none",
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-[#f4f1eb] flex justify-center overflow-hidden">
      <div className="relative w-full max-w-[500px] min-h-screen">
        {/* Background Image - The "Frame" */}
        <img 
          ref={bgRef}
          src="/section7.jpeg" 
          alt="Details Background" 
          className="w-full min-h-screen object-cover block" 
        />
        
        {/* Overlay Content */}
        <div ref={elementsRef} className="absolute inset-0 z-10 pointer-events-none">
          
          {/* Akad Ceremony */}
          <div className="absolute top-[8%] left-0 right-0 h-[26%] flex justify-center items-center">
            <div className="stagger-el flex flex-col items-center justify-center text-center px-14 md:px-16">
              <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-brand-espresso/40 block mb-1">The Ceremony</span>
              <h3 className="mogra-regular text-2xl md:text-3xl text-brand-burgundy mb-2 tracking-wide text-shadow-safe">Akad Ceremony</h3>
              <div className="w-8 h-[1px] bg-brand-gold/40 mb-3" />
              <p className="font-premium-serif text-brand-espresso text-sm md:text-base mb-1 italic text-shadow-safe">{data.date.split(',')[0]}</p>
              <p className="font-sans font-medium text-brand-espresso/60 text-[10px] tracking-[0.2em] uppercase text-shadow-safe">08:00 AM Sharp</p>
            </div>
          </div>

          {/* Reception */}
          <div className="absolute top-[39%] left-0 right-0 h-[26%] flex justify-center items-center">
            <div className="stagger-el flex flex-col items-center justify-center text-center px-14 md:px-16">
              <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-brand-espresso/40 block mb-1">The Celebration</span>
              <h3 className="mogra-regular text-2xl md:text-3xl text-brand-burgundy mb-2 tracking-wide text-shadow-safe">Grand Reception</h3>
              <div className="w-8 h-[1px] bg-brand-gold/40 mb-3" />
              <p className="font-premium-serif text-brand-espresso text-sm md:text-base mb-1 italic text-shadow-safe">{data.date.split(',')[0]}</p>
              <p className="font-sans font-medium text-brand-espresso/60 text-[10px] tracking-[0.2em] uppercase text-shadow-safe">11:00 AM — 02:00 PM</p>
            </div>
          </div>

          {/* Location */}
          <div className="absolute top-[71%] left-0 right-0 h-[26%] flex justify-center items-center">
            <div className="stagger-el flex flex-col items-center justify-center text-center px-14 md:px-16">
              <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-brand-espresso/40 block mb-1">The Venue</span>
              <h3 className="mogra-regular text-2xl md:text-3xl text-brand-burgundy mb-1 tracking-wide text-shadow-safe">{data.venue}</h3>
              <div className="w-8 h-[1px] bg-brand-gold/40 mb-3" />
              <p className="font-sans text-brand-espresso/60 text-[10px] max-w-[180px] leading-relaxed mb-4 tracking-wide text-shadow-safe">{data.address}</p>
              <a 
                href={data.googleMapsUrl} 
                target="_blank" 
                rel="noreferrer"
                className="pointer-events-auto group relative inline-flex items-center px-6 py-2 border border-brand-burgundy/30 text-brand-burgundy text-[9px] uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all duration-300 hover:border-brand-burgundy"
              >
                <div className="absolute inset-0 bg-brand-burgundy translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
                <span className="relative z-10 group-hover:text-white transition-colors duration-300 text-shadow-safe">View Map</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

