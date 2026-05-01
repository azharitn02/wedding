'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import FloralFrame from './FloralFrame';

import { WeddingData } from '@/lib/data';

interface JourneyProps {
  data: WeddingData['journey'];
}

export default function Journey({ data }: JourneyProps) {
  const containerRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = itemsRef.current?.querySelectorAll('.journey-item');
    if (!items) return;

    // Center line drawing animation
    gsap.from(".journey-line", {
      scrollTrigger: {
        trigger: itemsRef.current,
        start: "top 75%",
        end: "bottom 25%",
        scrub: 1,
      },
      scaleY: 0,
      transformOrigin: "top",
      ease: "none",
    });

    items.forEach((item, index) => {
      const content = item.querySelector('.journey-content');
      const dot = item.querySelector('.journey-dot');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      });

      // 1. Frame/Dot Reveal
      tl.from(dot, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      });

      // 2. Content Entrance
      tl.from(content, {
        opacity: 0,
        x: index % 2 === 0 ? -30 : 30,
        y: 20,
        duration: 1.5,
        ease: "power3.out",
      }, "-=0.4");

      // Continuous soft-float for content
      gsap.to(content, {
        y: -8,
        duration: 3 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 md:py-32 px-6 relative overflow-hidden bg-brand-bone">
      <FloralFrame />
      
      <div className="max-w-xl mx-auto mb-20 text-center relative z-10">
        <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-brand-espresso/40 block mb-3">Our History</span>
        <h2 className="font-premium-serif text-5xl text-brand-burgundy italic">The Journey</h2>
        <div className="w-12 h-[1px] bg-brand-gold/40 mx-auto mt-6" />
      </div>

      <div ref={itemsRef} className="max-w-2xl mx-auto relative z-10 px-6 md:px-0">
        {/* Center line */}
        <div className="journey-line absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-brand-espresso/10 md:-translate-x-1/2" />
        
        <div className="space-y-24 md:space-y-32">
          {data.map((step, idx) => (
            <div 
              key={idx} 
              className={`journey-item relative flex items-start gap-8 md:gap-12 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Content Block */}
              <div className="journey-content flex-1 pt-0 md:pt-0">
                <div className={`flex flex-col ${idx % 2 === 0 ? 'md:items-start text-left' : 'md:items-end md:text-right'}`}>
                  <span className="font-premium-serif text-brand-burgundy/30 text-5xl md:text-6xl mb-2 italic select-none">{step.year}</span>
                  <h3 className="font-premium-serif text-2xl md:text-3xl text-brand-espresso mb-4 tracking-tight">{step.title}</h3>
                  <div className={`h-[1px] w-8 bg-brand-gold/20 mb-4 ${idx % 2 === 0 ? '' : 'md:ml-auto'}`} />
                  <p className="font-sans text-brand-espresso/70 text-sm md:text-base leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* Central Marker */}
              <div className="journey-dot relative z-10 flex flex-col items-center pt-4 md:pt-6">
                <div className="w-4 h-4 rounded-full border-2 border-brand-burgundy bg-brand-bone relative">
                  <div className="absolute inset-0 bg-brand-burgundy scale-0 rounded-full transition-transform" />
                  <div className="absolute inset-[-6px] border border-brand-burgundy/20 rounded-full animate-ping" />
                </div>
              </div>

              {/* Spacer for Desktop Layout */}
              <div className="flex-1 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
