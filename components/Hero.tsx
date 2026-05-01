'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import Image from 'next/image';
import { WeddingData } from '@/lib/data';
import { getAssetPath } from '@/lib/utils';
import Stamp from './Stamp';
import { HeartIcon, StampCorner } from './ArtAssets';
import FloralFrame from './FloralFrame';

interface HeroProps {
  data: WeddingData['event'];
}

export default function Hero({ data }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Animate background slow zoom
    gsap.fromTo('.hero-bg', 
      { scale: 1.15 },
      { 
        scale: 1, 
        duration: 8, 
        ease: "power2.out" 
      }
    );

    // Parallax on scroll for background
    gsap.to('.hero-bg', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      yPercent: 30,
      ease: "none"
    });

    tl.from(stampRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 60,
      duration: 2,
      ease: "power4.out"
    })
    .from(textRef.current?.querySelectorAll('span, h1, div, p') || [], {
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 1.5,
      ease: "power3.out"
    }, "-=1.2");
  }, { scope: containerRef });

  const [bride, groom] = data.names.split(' & ');

  return (
    <section 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-brand-bone"
    >
      {/* Full Screen Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image 
          src={getAssetPath('/bg.jpg')} 
          alt="Hero background" 
          fill
          className="hero-bg object-cover object-center"
          referrerPolicy="no-referrer"
          sizes="100vw"
          priority
        />
      </div>

      <div className="relative z-0 pointer-events-none">
        <FloralFrame />
      </div>
      
      <div ref={stampRef} className="w-full max-w-2xl relative z-10 transition-transform md:scale-90 lg:scale-75">
        <Stamp className="w-full min-h-[400px] flex flex-col items-center justify-center">
          {/* Right Column: Key Details */}
          <div ref={textRef} className="p-8 md:p-12 flex flex-col text-center justify-center">
            <div className="flex justify-center items-center mb-8 gap-4">
              <span className="uppercase tracking-[0.4em] text-[10px] font-sans text-brand-espresso/60 font-semibold">
                Invitation No. {data.invitationNo}
              </span>
              <div className="w-10 h-10 border border-brand-espresso flex items-center justify-center text-brand-burgundy font-serif italic text-lg leading-none">
                {data.initials}
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="font-serif text-5xl md:text-6xl text-brand-espresso leading-[1.1]">
                The Wedding of
              </h1>
              
              <div className="h-[1.5px] w-16 bg-brand-espresso mx-auto" />

              <div className="space-y-3 pt-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest font-sans text-brand-espresso/40">When</span>
                  <span className="font-serif text-xl italic font-light text-brand-espresso/80">{data.date}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest font-sans text-brand-espresso/40">Where</span>
                  <span className="font-serif text-xl italic font-light text-brand-espresso/80">{data.venue}, {data.location.split(',')[0]}</span>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center gap-6">
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-widest text-brand-espresso/60">Ceremony at {data.time}</p>
                <p className="text-[9px] uppercase tracking-widest text-brand-espresso/60">Reception to follow</p>
              </div>
              <div className="border-b border-brand-espresso pb-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-espresso">RSVP BY {data.rsvpDeadline.split(',')[0].toUpperCase()}</span>
              </div>
            </div>
          </div>
        </Stamp>
      </div>
    </section>
  );
}
