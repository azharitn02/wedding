'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { getAssetPath } from '@/lib/utils';

export default function ThankYou() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section ref={containerRef} className="w-full bg-[#E8E4DC] flex justify-center overflow-hidden">
      <div className="relative w-full max-w-[500px] min-h-screen">
        {/* Background Image - The "Frame" */}
        <img 
          src={getAssetPath('/section10.gif')} 
          alt="Thank You" 
          className="w-full min-h-screen object-cover block" 
        />
      </div>
    </section>
  );
}
