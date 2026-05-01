'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { WeddingData } from '@/lib/data';
import FloralFrame from './FloralFrame';

interface ClosingProps {
  data: WeddingData['event'];
}

export default function Closing({ data }: ClosingProps) {
  const containerRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    // 1. Frame Reveal
    tl.from(".closing-frame", {
      opacity: 0,
      scale: 1.05,
      duration: 1.5,
      ease: "power2.out"
    });

    // 2. Content Stagger
    tl.from(elementsRef.current?.querySelectorAll('.stagger-el') || [], {
      opacity: 0,
      y: 20,
      stagger: 0.2,
      duration: 1.2,
      ease: "power3.out",
    }, "-=1.0");

    // Continuous soft-float
    gsap.to(".closing-names", {
      y: -8,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 md:py-32 px-6 text-center relative bg-brand-bone overflow-hidden">
      <div className="closing-frame absolute inset-0 opacity-40">
        <FloralFrame />
      </div>

      <div ref={elementsRef} className="max-w-2xl mx-auto space-y-12 relative z-10">
        <div className="stagger-el">
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-brand-espresso/40 block mb-3">Our Gratitude</span>
          <h2 className="font-premium-serif text-5xl text-brand-burgundy italic">Heartfelt Thanks</h2>
          <div className="w-12 h-[1px] bg-brand-gold/40 mx-auto mt-6" />
        </div>
        
        <p className="stagger-el font-premium-serif text-brand-espresso/80 leading-relaxed text-lg italic px-4">
          &quot;It would be our greatest honor to have you witness our union. Your love and presence throughout our journey mean more to us than words can express.&quot;
        </p>

        <div className="stagger-el space-y-4 closing-names pt-8">
          <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-brand-espresso/30 font-bold">Sincerely,</p>
          <div className="flex flex-col items-center gap-3">
            <span className="font-premium-serif text-4xl text-brand-espresso italic">{data.names}</span>
            <div className="w-8 h-[1px] bg-brand-gold/40" />
            <p className="font-sans text-[9px] uppercase tracking-[0.6em] text-brand-espresso/40 font-bold">AND OUR FAMILIES</p>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="stagger-el pt-16">
          <svg width="80" height="24" viewBox="0 0 80 24" fill="none" stroke="currentColor" className="text-brand-gold/30 mx-auto">
             <path d="M0 12 Q20 0 40 12 Q60 24 80 12" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </section>
  );
}
