'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState, useEffect } from 'react';
import { getAssetPath } from '@/lib/utils';

export default function CountdownSection() {
  const containerRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date('May 8, 2026 08:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    gsap.from(elementsRef.current?.querySelectorAll('.stagger-el') || [], {
      opacity: 0,
      y: 15,
      stagger: 0.1,
      duration: 0.7,
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
      <div className="relative w-full max-w-[500px]">
        {/* Background Image - The "Frame" */}
        <img 
          ref={bgRef}
          src={getAssetPath('/bgcount1.jpg')} 
          alt="Countdown Background" 
          className="w-full h-auto block" 
        />
        
        {/* Content Overlay */}
        <div ref={elementsRef} className="absolute inset-0 z-10 w-full h-full pointer-events-none">
           <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-2 md:gap-4 text-brand-espresso w-[10%] max-w-[100px]">
             
             <div className="stagger-el flex flex-col items-center flex-1">
                 <span className="digit font-premium-serif text-3xl md:text-4xl italic text-brand-espresso drop-shadow-sm">{timeLeft.days}</span>
                 <span className="font-sans text-[10px] md:text-[11px] uppercase font-bold tracking-[0.3em] mt-2 text-brand-espresso/60">Days</span>
             </div>
             
             <span className="stagger-el font-premium-serif text-xl text-brand-espresso/30 mb-6">:</span>
             
             <div className="stagger-el flex flex-col items-center flex-1">
                 <span className="digit font-premium-serif text-3xl md:text-4xl italic text-brand-espresso drop-shadow-sm">{timeLeft.hours}</span>
                 <span className="font-sans text-[10px] md:text-[11px] uppercase font-bold tracking-[0.3em] mt-2 text-brand-espresso/60">Hours</span>
             </div>
             
             <span className="stagger-el font-premium-serif text-xl text-brand-espresso/30 mb-6">:</span>
             
             <div className="stagger-el flex flex-col items-center flex-1">
                 <span className="digit font-premium-serif text-3xl md:text-4xl italic text-brand-espresso drop-shadow-sm">{timeLeft.minutes}</span>
                 <span className="font-sans text-[10px] md:text-[11px] uppercase font-bold tracking-[0.3em] mt-2 text-brand-espresso/60">Mins</span>
             </div>
             
             <span className="stagger-el font-premium-serif text-xl text-brand-espresso/30 mb-6">:</span>
             
             <div className="stagger-el flex flex-col items-center flex-1">
                 <span className="digit font-premium-serif text-3xl md:text-4xl italic text-brand-espresso drop-shadow-sm">{timeLeft.seconds}</span>
                 <span className="font-sans text-[10px] md:text-[11px] uppercase font-bold tracking-[0.3em] mt-2 text-brand-espresso/60">Secs</span>
             </div>
             
           </div>
        </div>
      </div>
    </section>
  );
}
