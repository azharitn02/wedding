'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Flower1, Flower3, Flower4, Flower5 } from './ArtAssets';

export default function FloralFrame() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Elegant swaying floating animation for the flowers
    const flowers = gsap.utils.toArray('.flower-el');
    
    flowers.forEach((flower: any, i) => {
      gsap.to(flower, {
        y: i % 2 === 0 ? 15 : -15,
        x: i % 2 !== 0 ? 10 : -10,
        rotation: i % 2 === 0 ? "+=5" : "-=5",
        duration: 4 + i,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Gold aesthetic wireframe matching the reference image */}
      <div className="absolute inset-4 md:inset-8 border-[2px] border-[#D4AF37]/50 rounded-xl" />
      <div className="absolute inset-[1.25rem] md:inset-[2.25rem] border border-[#D4AF37]/30 rounded-lg" />
      
      {/* Top Left Corner */}
      <div className="flower-el absolute -top-20 -left-20 w-48 h-48 md:w-64 md:h-64 opacity-80 drop-shadow-md rotate-[120deg]">
        <Flower4 />
      </div>

      {/* Top Right Corner */}
      <div className="flower-el absolute -top-12 -right-12 w-36 h-36 md:w-44 md:h-44 opacity-75 drop-shadow-sm -rotate-45">
        <Flower1 />
      </div>

      {/* Bottom Left Corner */}
      <div className="flower-el absolute -bottom-12 -left-12 w-36 h-36 md:w-52 md:h-52 opacity-75 drop-shadow-sm rotate-45">
        <Flower5 />
      </div>

      {/* Bottom Right Corner */}
      <div className="flower-el absolute -bottom-20 -right-20 w-56 h-56 md:w-72 md:h-72 opacity-80 drop-shadow-md -rotate-[60deg]">
        <Flower3 />
      </div>
    </div>
  );
}
