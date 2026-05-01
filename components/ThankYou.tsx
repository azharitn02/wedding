'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import Image from 'next/image';
import { getAssetPath } from '@/lib/utils';

export default function ThankYou() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section ref={containerRef} className="w-full bg-[#E8E4DC] flex justify-center overflow-hidden">
      <div className="relative w-full max-w-[500px] min-h-screen">
        {/* Background Image - The "Frame" */}
        <Image 
          src={getAssetPath('/section10.gif')} 
          alt="Thank You" 
          fill
          className="object-cover block" 
          unoptimized
        />
      </div>
    </section>
  );
}
