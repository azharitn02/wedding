"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { CinematicScene } from '@/components/CinematicScene';

export default function App() {
  return (
    <div className="w-screen h-screen bg-[#0A120D] font-sans selection:bg-[#4B182B] selection:text-[#F8F3ED] text-[#F8F3ED] overflow-hidden">
      <Canvas dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ScrollControls pages={7} damping={0.2}>
            <CinematicScene />
          </ScrollControls>
        </Suspense>
      </Canvas>
      {/* Subtle visual hint for scrolling at the very bottom initially */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full flex flex-col items-center pointer-events-none animate-pulse">
        <span className="text-xs text-white/50 tracking-[0.3em] uppercase mb-2">Scroll</span>
        <div className="w-[1px] h-12 bg-white/30"></div>
      </div>
    </div>
  );
}
