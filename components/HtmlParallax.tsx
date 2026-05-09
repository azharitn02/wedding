import React, { useRef } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

interface HtmlParallaxProps {
  children: React.ReactNode;
  speed: number;
  className?: string;
  horizontalSpeed?: number;
}

export function HtmlParallax({ children, speed, className = "", horizontalSpeed = 0 }: HtmlParallaxProps) {
  const scroll = useScroll();
  const ref = useRef<HTMLDivElement>(null);

  useFrame(() => {
    if (ref.current && scroll) {
      ref.current.style.transform = `translate(${scroll.offset * horizontalSpeed}px, ${scroll.offset * speed}px)`;
    }
  });

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
