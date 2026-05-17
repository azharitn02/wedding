"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { CinematicScene, getScrollDist } from '@/components/CinematicScene';
import { WEDDING_CONFIG, getAssetPath } from '@/app/weddingConfig';
import { MusicPlayer } from '@/components/MusicPlayer';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function App() {
  const totalPages = getScrollDist(1) + 1;

  return (
    <div 
      className="w-screen h-screen h-[100dvh] bg-[#0A120D] font-sans selection:bg-[#4B182B] selection:text-[#F8F3ED] text-[#F8F3ED] overflow-hidden"
      style={{
        backgroundImage: `url('${getAssetPath('/background/01_cover.jpg')}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100dvh',
      }}
    >
      <Canvas 
        dpr={[1, 2]}
        gl={{ 
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          alpha: true
        }}
      >
        <Suspense fallback={null}>
          <ScrollControls pages={totalPages} damping={WEDDING_CONFIG.transitionSpeed ?? 0.2}>
            <CinematicScene />
          </ScrollControls>
        </Suspense>
      </Canvas>
      <MusicPlayer />
      <LoadingScreen />
      {/* Subtle visual hint for scrolling at the very bottom initially */}
      {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full flex flex-col items-center pointer-events-none animate-pulse">
        <span className="text-xs text-white/50 tracking-[0.3em] uppercase mb-2">Scroll</span>
        <div className="w-[1px] h-12 bg-white/30"></div>
      </div> */}
    </div>
  );
}
