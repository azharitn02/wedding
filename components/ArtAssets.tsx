'use client';

import React from 'react';
import Image from 'next/image';

export const FlowerShape = ({ className }: { className?: string }) => (
  <div className={`relative w-full h-full ${className || ''}`}>
    <Image 
      src="/flower2.png" 
      alt="Flower Decoration" 
      fill 
      className="object-contain opacity-50"
      referrerPolicy="no-referrer"
    />
  </div>
);

export const Flower1 = ({ className }: { className?: string }) => (
  <div className={`relative w-full h-full ${className || ''}`}>
    <Image 
      src="/flower1.png" 
      alt="Flower Decoration 1" 
      fill 
      className="object-contain opacity-80"
      referrerPolicy="no-referrer"
    />
  </div>
);

export const Flower3 = ({ className }: { className?: string }) => (
  <div className={`relative w-full h-full ${className || ''}`}>
    <Image 
      src="/flower3.png" 
      alt="Flower Decoration 3" 
      fill 
      className="object-contain opacity-80"
      referrerPolicy="no-referrer"
    />
  </div>
);

export const Flower4 = ({ className }: { className?: string }) => (
  <div className={`relative w-full h-full ${className || ''}`}>
    <Image 
      src="/flower4.png" 
      alt="Flower Decoration 4" 
      fill 
      className="object-contain opacity-80"
      referrerPolicy="no-referrer"
    />
  </div>
);

export const Flower5 = ({ className }: { className?: string }) => (
  <div className={`relative w-full h-full ${className || ''}`}>
    <Image 
      src="/flower5.png" 
      alt="Flower Decoration 5" 
      fill 
      className="object-contain opacity-80"
      referrerPolicy="no-referrer"
    />
  </div>
);



export const HeartIcon = ({ className, fillOpacity = 0.1 }: { className?: string, fillOpacity?: number }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" fillOpacity={fillOpacity} />
  </svg>
);

export const StampCorner = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <Image 
      src="/border.png" 
      alt="Corner Decoration" 
      width={100} 
      height={100} 
      className="object-contain"
      referrerPolicy="no-referrer"
    />
  </div>
);

export const BrideIllustration = ({ className }: { className?: string }) => (
  <div className={`relative flex flex-col items-center justify-center w-32 h-32 ${className || ''}`}>
    <Image 
      src="/bride.png" 
      alt="Bride Illustration" 
      fill
      className="object-contain"
      referrerPolicy="no-referrer"
    />
  </div>
);

export const GroomIllustration = ({ className }: { className?: string }) => (
  <div className={`relative flex flex-col items-center justify-center w-32 h-32 ${className || ''}`}>
    <Image 
      src="/groom.png" 
      alt="Groom Illustration" 
      fill
      className="object-contain"
      referrerPolicy="no-referrer"
    />
  </div>
);

export const CoupleIllustration = ({ className }: { className?: string }) => (
  <div className={`relative flex flex-col items-center justify-center w-64 h-64 ${className || ''}`}>
    <Image 
      src="/couple-with-background.png" 
      alt="Couple Illustration" 
      fill
      className="object-contain opacity-90"
      referrerPolicy="no-referrer"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  </div>
);


