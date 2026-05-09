import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { textures } from '../textures';

export function EnvelopeScene() {
  const scroll = useScroll();

  const flapRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Group>(null);
  const floral1Ref = useRef<THREE.Mesh>(null);
  const floral2Ref = useRef<THREE.Mesh>(null);
  const envelopeGroupRef = useRef<THREE.Group>(null);
  const ornamentsRef = useRef<THREE.Group>(null);

  // Load textures
  const [
    bgTex,
    envBackTex,
    envFrontTex,
    envFlapTex,
    cardTex,
    floralTex,
    ornamentStarTex,
    ornamentLeafTex
  ] = useTexture([
    textures.background,
    textures.envelopeBack,
    textures.envelopeFront,
    textures.envelopeFlap,
    textures.card,
    textures.floral,
    textures.ornamentStar,
    textures.ornamentLeaf
  ]);

  // Apply Texture settings
  React.useLayoutEffect(() => {
    [bgTex, envBackTex, envFrontTex, envFlapTex, cardTex, floralTex, ornamentStarTex, ornamentLeafTex].forEach(tex => {
      tex.anisotropy = 16;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    });
  }, [bgTex, envBackTex, envFrontTex, envFlapTex, cardTex, floralTex]);

  useFrame(() => {
    if (!scroll) return;

    // 1. Flap Animation: offset 0 to 0.1
    if (flapRef.current) {
      const flapProgress = Math.min(Math.max(scroll.offset / 0.1, 0), 1);
      // rotate x from 0 to -180 deg (-Math.PI) to swing towards the camera
      flapRef.current.rotation.x = -flapProgress * Math.PI;
    }

    // 2. Card Animation: offset 0.1 to 0.25
    if (cardRef.current) {
      const cardProgress = Math.min(Math.max((scroll.offset - 0.1) / 0.15, 0), 1);
      // Move Y up steadily
      cardRef.current.position.y = THREE.MathUtils.lerp(0, 3, cardProgress);
      // Increase Z mostly at the end so it doesn't clip through the front too early
      // pow(cardProgress, 4) means it stays flat until the very end of the Y move
      cardRef.current.position.z = THREE.MathUtils.lerp(0.01, 0.2, Math.pow(cardProgress, 4));
    }

    // 3. Parallax for Florals
    if (floral1Ref.current) {
      // Moves up but slower than the envelope, plus sine wave
      floral1Ref.current.position.y = Math.sin(scroll.offset * Math.PI * 4) * 0.2 + scroll.offset * 25 + 1;
    }
    if (floral2Ref.current) {
      // Moves up a bit faster than envelope, plus sine wave
      floral2Ref.current.position.y = Math.sin(scroll.offset * Math.PI * 4 + 1) * 0.2 + scroll.offset * 32 - 1;
    }

    // 4. Parallax for the Envelope
    if (envelopeGroupRef.current) {
      // The envelope itself moves up to disappear as we scroll down
      envelopeGroupRef.current.position.y = scroll.offset * 28;
    }

    // 5. Parallax for ornaments
    if (ornamentsRef.current) {
      ornamentsRef.current.children.forEach((child, i) => {
        // Different speeds and wave motions for each ornament
        const speed = 15 + (i % 5) * 5;
        const wave = Math.sin(scroll.offset * Math.PI * (i % 3 + 2) + i) * (1 + (i % 2));
        
        // Base start positions roughly spread vertically
        const startY = -4 - i * 1.8; 
        const baseX = ((i % 5) - 2) * 2.8;
        
        child.position.y = startY + scroll.offset * speed;
        child.position.x = baseX + wave;
        child.rotation.z = scroll.offset * Math.PI * (i % 2 === 0 ? 1 : -1);
      });
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Background */}
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial map={bgTex} />
      </mesh>

      {/* Florals */}
      <mesh ref={floral1Ref} position={[-3, 1, -1]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial map={floralTex} transparent />
      </mesh>
      <mesh ref={floral2Ref} position={[3, -1, -1]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial map={floralTex} transparent />
      </mesh>

      {/* Ornaments Group */}
      <group ref={ornamentsRef} position={[0, 0, -1.5]}>
        {Array.from({ length: 30 }).map((_, i) => (
          <mesh key={i}>
            <planeGeometry args={[0.8, 0.8]} />
            <meshBasicMaterial 
              map={i % 2 === 0 ? ornamentStarTex : ornamentLeafTex} 
              transparent 
              opacity={(i % 2 === 0 ? 0.3 : 0.6) + (i % 3) * 0.15}
            />
          </mesh>
        ))}
      </group>

      {/* Envelope Group for Parallax */}
      <group ref={envelopeGroupRef}>
        {/* Envelope Back */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[4, 3]} />
          <meshBasicMaterial map={envBackTex} transparent />
        </mesh>

        {/* Invitation Card */}
        <group ref={cardRef} position={[0, 0, 0.01]}>
          <mesh>
            <planeGeometry args={[3.6, 2.6]} />
            <meshBasicMaterial map={cardTex} transparent />
          </mesh>
        </group>

        {/* Envelope Front */}
        <mesh position={[0, 0, 0.05]}>
          {/* Same size as back, but visual shapes are at the bottom */}
          <planeGeometry args={[4, 3]} />
          <meshBasicMaterial map={envFrontTex} transparent />
        </mesh>

        {/* Envelope Flap Group - Pivot at the top edge */}
        {/* The back is 3 units tall, so top edge is at y = 1.5 */}
        <group ref={flapRef} position={[0, 1.5, 0.06]}>
          {/* Flap geometry is offset so its top is at the pivot */}
          {/* If height is 2, center is at y = -1 */}
          <mesh position={[0, -1, 0]}>
            <planeGeometry args={[4, 2]} />
            <meshBasicMaterial map={envFlapTex} transparent side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
