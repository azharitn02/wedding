'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

export default function CoupleClosing() {
  const containerRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const els = elementsRef.current?.querySelectorAll('.stagger-el');
    if (!els) return;

    gsap.from(els, {
      opacity: 0,
      y: 30,
      x: (i) => i === 0 ? -40 : i === 2 ? 40 : 0, // Slide Blueberry from L, Strawberry from R
      stagger: 0.2,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 25%",
        toggleActions: "play none none none",
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-[#E8E4DC] flex justify-center overflow-hidden">
      <div className="relative w-full max-w-[500px] min-h-screen shadow-2xl">
        {/* Background Image */}
        <img src="/b2/section9.JPG" alt="Cover Background" className="w-full min-h-screen object-cover block pointer-events-none"/>

        {/* Content Overlay */}
        <div ref={elementsRef} className="absolute inset-0 z-10 w-full h-full pointer-events-none flex flex-col items-center pt-[12%] px-8">
          
          {/* Grouped Names at Top */}
          <div className="flex flex-col w-full">
            <h2 className="stagger-el font-cursive text-5xl md:text-6xl text-brand-brown drop-shadow-sm leading-tight self-start ml-[10%]">
              Blueberry
            </h2>
            
            <h2 className="stagger-el font-cursive text-2xl md:text-3xl text-brand-brown drop-shadow-sm leading-tight self-center">
              &
            </h2>
            
            <h2 className="stagger-el font-cursive text-5xl md:text-5xl text-brand-brown drop-shadow-sm leading-tight self-end mr-[10%]">
              Strawberry
            </h2>

            <div className="stagger-el pt-10">
               <div className="w-12 h-[1px] bg-brand-gold/40 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
