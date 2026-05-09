'use client';
import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, useTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { backgroundTextures, slideElementTextures, decorationTextures } from '../app/cinematicTextures';
import { WEDDING_CONFIG } from '../app/weddingConfig';

function ParallaxContent({ tex, index, multiplier, zOffset = 0, width, height }: any) {
    const ref = useRef<THREE.Mesh>(null);
    const scroll = useScroll();
    const { viewport } = useThree();

    useFrame(() => {
        if (!scroll) return;
        const t = scroll.offset;
        const TOTAL_PAGES = WEDDING_CONFIG.pages;
        const D = viewport.height * (TOTAL_PAGES - 1);
        
        const currentY = t * D;
        const targetY = index * viewport.height;
        const distanceToTarget = currentY - targetY;

        if (ref.current) {
            ref.current.position.y = distanceToTarget * multiplier;
        }
    });

    return (
        <mesh ref={ref} position={[0, 0, zOffset]}>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial map={tex} transparent />
        </mesh>
    );
}

function ResponsiveBackground({ tex }: { tex: THREE.Texture }) {
    const { viewport } = useThree();
    
    const img = tex.image as HTMLImageElement;
    const imageAspect = img && img.width ? img.width / img.height : 1.5;
    const viewportAspect = viewport.width / viewport.height;
    
    let scale: [number, number, number];
    if (viewportAspect > imageAspect) {
        scale = [viewport.width, viewport.width / imageAspect, 1];
    } else {
        scale = [viewport.height * imageAspect, viewport.height, 1];
    }
    
    scale[0] *= 1.2;
    scale[1] *= 1.2;

    return (
        <mesh position={[0, 0, -10]} scale={scale}>
            <planeGeometry />
            <meshBasicMaterial map={tex} color="#ffffff" transparent={true} depthWrite={false} />
        </mesh>
    );
}

function FloatingOrnament({ tex, baseX, baseY, baseZ, size, delay, isGold = false, layerMultiplier = 0.5 }: any) {
    const ref = useRef<THREE.Mesh>(null);
    const scroll = useScroll();
    
    useFrame((state) => {
        if (!scroll) return;
        const t = scroll.offset;
        const D = state.viewport.height * WEDDING_CONFIG.pages;

        const targetY = baseY + t * D * layerMultiplier;

        if (ref.current) {
            ref.current.userData.y = THREE.MathUtils.lerp(ref.current.userData.y || baseY, targetY, 0.08);
            const time = state.clock.elapsedTime;
            ref.current.position.y = ref.current.userData.y + Math.cos(time * 0.8 + delay) * (isGold ? 0.05 : 0.15);
            ref.current.position.x = baseX + Math.sin(time * 0.6 + delay) * (isGold ? 0.05 : 0.15);
            ref.current.rotation.z = Math.sin(time * 0.4 + delay) * 0.05;
        }
    });

    return (
        <mesh ref={ref} position={[baseX, baseY, baseZ]}>
            <planeGeometry args={[size, size]} />
            <meshBasicMaterial map={tex} transparent />
        </mesh>
    );
}

function Particle({ tex, baseX, baseY, baseZ, size, speedFactor, delay }: any) {
    const ref = useRef<THREE.Mesh>(null);
    const scroll = useScroll();

    useFrame((state) => {
        if (!scroll) return;
        const t = scroll.offset;
        const D = state.viewport.height * WEDDING_CONFIG.pages;
        const M = 1.2 * speedFactor;

        const targetY = baseY + t * D * M;

        if (ref.current) {
            ref.current.userData.y = THREE.MathUtils.lerp(ref.current.userData.y || baseY, targetY, 0.08);
            const time = state.clock.elapsedTime * speedFactor;
            ref.current.position.y = ref.current.userData.y + Math.cos(time + delay) * 0.2;
            ref.current.position.x = baseX + Math.sin(time + delay) * 0.3;
        }
    });

    return (
        <mesh ref={ref} position={[baseX, baseY, baseZ]}>
            <planeGeometry args={[size, size]} />
            <meshBasicMaterial map={tex} transparent opacity={0.6} />
        </mesh>
    );
}

export function CinematicScene() {
  const scroll = useScroll();
  const { viewport } = useThree();
  const slidesGroup = useRef<THREE.Group>(null);

  // Flatten all slide elements and backgrounds for useTexture
  const texturePaths = useMemo(() => [
    ...backgroundTextures,
    ...slideElementTextures.flat(),
    decorationTextures.orchid,
    decorationTextures.goldMotif,
    decorationTextures.petal,
    decorationTextures.custom
  ], []);

  const loadedTextures = useTexture(texturePaths);

  useLayoutEffect(() => {
    loadedTextures.forEach(tex => {
      tex.anisotropy = 16;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    });
  }, [loadedTextures]);

  useFrame(() => {
    if (!scroll || !slidesGroup.current) return;
    const t = scroll.offset;
    const D = viewport.height * (WEDDING_CONFIG.pages - 1);
    slidesGroup.current.position.y = THREE.MathUtils.lerp(slidesGroup.current.position.y, t * D, 0.08);
  });

  // Re-map loaded textures back to their roles
  let pointer = 0;
  const bgTextures = loadedTextures.slice(pointer, pointer += backgroundTextures.length);
  const elementTextures = slideElementTextures.map(group => 
    loadedTextures.slice(pointer, pointer += group.length)
  );
  const [orchidTex, goldMotifTex, petalTex, customOrnamentTex] = loadedTextures.slice(pointer);

  const w = Math.min(viewport.width * 0.9, 12);
  const h = w * (800 / 1200);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />

      <group ref={slidesGroup}>
        {WEDDING_CONFIG.slides.map((slide, index) => (
          <group key={slide.id} position={[0, -viewport.height * index, 0]}>
            <ResponsiveBackground tex={bgTextures[index]} />
            {slide.elements.map((el, elIdx) => (
              <ParallaxContent 
                key={elIdx}
                tex={elementTextures[index][elIdx]}
                index={index}
                multiplier={el.multiplier || 0}
                zOffset={0.1 + (elIdx * 0.01)}
                width={w}
                height={h}
              />
            ))}
          </group>
        ))}
      </group>

      {/* Decorations */}
      {Array.from({ length: WEDDING_CONFIG.decorations.ornamentCount }).map((_, i) => {
         const isGold = i % 3 === 0;
         const tex = isGold ? customOrnamentTex : orchidTex;
         const baseY = -viewport.height * (i * 0.5);
         const baseX = (i % 2 === 0 ? 1 : -1) * (w / 2.5 + Math.random() * 2);
         const baseZ = -2 - Math.random() * 2;
         const size = isGold ? w * 0.3 : w * 0.45;
         
         return (
           <FloatingOrnament 
             key={i}
             tex={tex} 
             baseX={baseX} baseY={baseY} baseZ={baseZ} 
             size={size} delay={i} isGold={isGold} 
             layerMultiplier={0.5}
           />
         );
      })}

      {Array.from({ length: WEDDING_CONFIG.decorations.particleCount }).map((_, i) => (
         <Particle 
           key={i}
           tex={petalTex} 
           baseX={(Math.random() - 0.5) * viewport.width * 2} 
           baseY={(Math.random() * 0.5 - 7.5) * viewport.height}
           baseZ={Math.random() * 4 + 1} 
           size={0.1 + Math.random() * 0.3} 
           speedFactor={1 + Math.random() * 0.8} 
           delay={i * 1.5} 
         />
      ))}
    </>
  );
}
