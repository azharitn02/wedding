'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Stamp from './Stamp'; 
import FloralFrame from './FloralFrame';

import { WeddingData } from '@/lib/data';
interface MemoryStripProps {
  data: WeddingData['memories'];
}

export default function MemoryStrip({ data }: MemoryStripProps) {
  const containerRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      }
    });

    // 1. Header Reveal
    tl.from(".memory-header", {
      opacity: 0,
      y: 30,
      duration: 1.2,
      ease: "power2.out"
    });

    // 2. Cards Stagger
    tl.from(".memory-card", {
      opacity: 0,
      x: 50,
      stagger: 0.2,
      duration: 1.5,
      ease: "power3.out",
    }, "-=0.8");

    // Continuous soft-float for cards
    gsap.to(".memory-card-content", {
      y: -10,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.6
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-brand-bone relative overflow-hidden">
      <FloralFrame />
      
      <div className="memory-header max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-brand-espresso/40 block mb-3">Our Moments</span>
          <h2 className="font-premium-serif text-5xl text-brand-burgundy italic leading-tight">
            A Memory Strip
          </h2>
          <div className="w-12 h-[1px] bg-brand-gold/40 mt-6" />
        </div>
        <div className="hidden md:flex items-center gap-4 text-brand-espresso/40 font-sans uppercase tracking-[0.3em] text-[9px] font-bold">
          <span>Shift + Scroll to navigate</span>
          <div className="w-12 h-[1px] bg-brand-espresso/20" />
        </div>
      </div>

      <div 
        ref={scrollContainerRef} 
        className="flex flex-row overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-8 px-6 md:px-[15vw] lg:px-[20vw] pb-12 transition-all duration-700"
      >
        {/* Intro Slide */}
        <div className="memory-card flex-shrink-0 w-[85vw] md:w-[600px] snap-center">
          <div className="memory-card-content h-[50vh] md:h-[60vh] flex flex-col items-center justify-center border border-brand-espresso/10 rounded-[2rem] p-12 text-center group bg-white shadow-sm relative overflow-hidden">
             <div className="absolute inset-0 border-premium opacity-5 pointer-events-none" />
             <div className="w-16 h-16 border border-brand-gold/30 rounded-full flex items-center justify-center mb-8 transition-transform duration-700 md:group-hover:scale-110 md:group-hover:rotate-12">
               <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
             </div>
             <h3 className="font-premium-serif text-3xl text-brand-espresso mb-4 italic">Our Love in Frames</h3>
             <p className="font-sans text-sm text-brand-espresso/50 leading-relaxed max-w-xs mx-auto italic">
               Swipe or scroll to explore the shared chapters of our journey.
             </p>
          </div>
        </div>

        {/* Cards */}
        {data.map((memory) => (
          <div 
            key={memory.id} 
            className="memory-card flex-shrink-0 w-[85vw] md:w-[600px] snap-center"
          >
            <div className="memory-card-content h-[50vh] md:h-[60vh] flex flex-col justify-center items-center gap-8 relative overflow-hidden rounded-[2rem] bg-white shadow-sm group">
              <div className={`absolute inset-0 ${memory.color} opacity-10 z-0 transition-opacity duration-700 md:group-hover:opacity-20`} />
              <div className="absolute inset-0 border-premium opacity-5 pointer-events-none" />
              
              <div className="relative z-10 text-center px-10 md:px-16">
                <span className="font-premium-serif text-6xl md:text-8xl text-brand-espresso/5 mb-4 block select-none">0{memory.id}</span>
                <h3 className="font-premium-serif text-3xl md:text-4xl text-brand-espresso tracking-tight mb-6 italic leading-tight">{memory.title}</h3>
                <div className="w-12 h-[1px] bg-brand-gold/30 mx-auto mb-8" />
                <p className="font-sans text-[10px] md:text-xs text-brand-espresso/60 leading-relaxed uppercase tracking-[0.3em] font-bold max-w-[280px] mx-auto italic">
                  {memory.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
