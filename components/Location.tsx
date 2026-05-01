'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { WeddingData } from '@/lib/data';
import { getAssetPath } from '@/lib/utils';
import FloralFrame from './FloralFrame';

interface LocationProps {
  data: WeddingData['event'];
}

export default function Location({ data }: LocationProps) {
  const containerRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      }
    });

    // 1. Frame Reveal (Floral frame and Map card)
    tl.from(".location-map", {
      opacity: 0,
      scale: 0.9,
      duration: 1.5,
      ease: "power2.out"
    });

    // 2. Content Stagger
    tl.from(elementsRef.current?.querySelectorAll('.stagger-el') || [], {
      opacity: 0,
      x: -30,
      stagger: 0.2,
      duration: 1.2,
      ease: "power3.out",
    }, "-=1.0");

    // Continuous pin pulse
    gsap.to(".location-pin", {
      scale: 2,
      opacity: 0.1,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 md:py-32 px-6 relative bg-brand-bone overflow-hidden">
      <FloralFrame />
      
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20 relative z-10">
        {/* Text Content */}
        <div ref={elementsRef} className="flex-1 space-y-8 text-center md:text-left">
          <div className="stagger-el inline-flex items-center gap-3 text-brand-burgundy mb-2">
            <MapPin className="w-5 h-5" />
            <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold">Venue Location</span>
          </div>
          
          <div className="stagger-el space-y-4">
            <h2 className="font-premium-serif text-5xl md:text-6xl text-brand-espresso italic leading-tight">{data.venue}</h2>
            <div className="w-12 h-[1px] bg-brand-gold/40 mx-auto md:mx-0 my-6" />
            <div className="space-y-2 font-sans text-brand-espresso/60 tracking-wider text-sm md:text-base leading-relaxed">
              <p>{data.address}</p>
              <p>{data.city}</p>
            </div>
          </div>
          
          <div className="stagger-el pt-8">
            <a 
              href={data.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-4 py-4 px-12 bg-brand-espresso text-brand-bone overflow-hidden transition-all duration-500 hover:pr-14 active:scale-95 shadow-xl"
            >
              <div className="absolute inset-0 bg-brand-burgundy translate-y-full transition-transform duration-500 group-hover:translate-y-0" />
              <Navigation className="relative z-10 w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
              <span className="relative z-10 font-sans text-[11px] uppercase tracking-[0.3em] font-bold">
                Navigate to Venue
              </span>
            </a>
          </div>
        </div>

        {/* Map Card with Premium Border */}
        <div className="location-map flex-1 w-full max-w-md aspect-[4/5] relative">
           <div className="absolute inset-0 border-premium transform rotate-2 z-0 opacity-40" />
           <div className="absolute inset-0 bg-[#E8E1DA] flex items-center justify-center overflow-hidden z-10 border border-brand-espresso/10 soft-shadow">
              {/* Abstract Map Visualization */}
              <div className="w-full h-full opacity-40 select-none pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 120" fill="none" stroke="currentColor" className="text-brand-espresso">
                   <path d="M0 20 H100 M0 40 H100 M0 60 H100 M0 80 H100 M0 100 H100 M20 0 V120 M40 0 V120 M60 0 V120 M80 0 V120" strokeOpacity="0.08" />
                   <path d="M-10 10 Q50 60 110 110" strokeWidth="3" strokeOpacity="0.15" />
                   <path d="M110 -10 Q50 60 -10 130" strokeWidth="2" strokeOpacity="0.1" />
                   <circle cx="50" cy="60" r="4" fill="#800020" />
                   <circle className="location-pin" cx="50" cy="60" r="8" fill="#800020" fillOpacity="0.4" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-bone/20 to-transparent" />
              
              {/* Decorative Frame Overlay */}
              <div className="absolute inset-4 border border-brand-espresso/5 pointer-events-none" />
           </div>
           
           {/* Decorative Stamp */}
           <div className="absolute -top-6 -right-6 w-20 h-20 z-20 transform -rotate-12 pointer-events-none opacity-90">
              <img src={getAssetPath('/border.png')} alt="Stamp" className="w-full h-full object-contain" />
           </div>
        </div>
      </div>
    </section>
  );
}
