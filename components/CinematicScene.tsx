'use client';
import React, { useRef, useLayoutEffect, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, useTexture, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { backgroundTextures, slideElementTextures, decorationTextures } from '../app/cinematicTextures';
import { WEDDING_CONFIG } from '../app/weddingConfig';

export function getSlideY(index: number, viewportHeight: number) {
  let y = 0;
  for (let i = 0; i < index; i++) {
    const currentMult = (WEDDING_CONFIG.slides[i] as any).bgHeightMultiplier ?? 1.0;
    const nextMult = (WEDDING_CONFIG.slides[i + 1] as any).bgHeightMultiplier ?? 1.0;
    y -= viewportHeight * (currentMult / 2 + nextMult / 2);
  }
  return y;
}

export function getScrollDist(viewportHeight: number) {
  const lastIndex = WEDDING_CONFIG.slides.length - 1;
  const lastMult = (WEDDING_CONFIG.slides[lastIndex] as any).bgHeightMultiplier ?? 1.0;
  return -getSlideY(lastIndex, viewportHeight) - viewportHeight * (0.5 - lastMult / 2);
}

export const LAYERS = {
  BACKGROUND: 0,
  TEXT: 0.1,
  PARTICLES: 1,
  ORNAMENTS: 2,
};

function ParallaxContent({ tex, index, multiplier, zOffset = 0, width, height }: any) {
    const ref = useRef<THREE.Mesh>(null);
    const scroll = useScroll();
    const { viewport } = useThree();

    useFrame(() => {
        if (!scroll || !ref.current) return;
        if (ref.current.parent && !ref.current.parent.visible) return;
        const t = scroll.offset;
        const D = getScrollDist(viewport.height);
        
        const currentY = t * D;
        const targetY = -getSlideY(index, viewport.height);
        const distanceToTarget = currentY - targetY;

        ref.current.position.y = distanceToTarget * multiplier;
    });

    return (
        <mesh ref={ref} position={[0, 0, zOffset]}>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial map={tex} transparent toneMapped={false} />
        </mesh>
    );
}

// FIX 1: OPTIMIZED BACKGROUND COMPONENT (No more memory-leaking .clone())
function ResponsiveBackground({ 
    tex, 
    bgHeightMultiplier = 1,
    bgWidthMultiplier = 1
}: { 
    tex: THREE.Texture, 
    isIntro?: boolean,
    bgHeightMultiplier?: number,
    bgWidthMultiplier?: number
}) {
    const { viewport } = useThree();
    
    const imgObj = tex.image as any;
    const sourceObj = tex.source as any;
    
    const width = imgObj?.videoWidth || imgObj?.width || sourceObj?.data?.width || 1;
    const height = imgObj?.videoHeight || imgObj?.height || sourceObj?.data?.height || 1.5;
    const imageAspect = width / height;
    const viewportAspect = viewport.width / viewport.height;
    
    let baseWidth = 0;
    let baseHeight = 0;
    
    if (viewportAspect > imageAspect) {
        baseWidth = viewport.width;
        baseHeight = viewport.width / imageAspect;
    } else {
        baseWidth = viewport.height * imageAspect;
        baseHeight = viewport.height;
    }
    
    const meshWidth = baseWidth * bgWidthMultiplier;
    const meshHeight = baseHeight * bgHeightMultiplier;
    const meshAspect = meshWidth / meshHeight;
    
    // Mutate matrix transforms directly on the existing texture asset instead of duplicating memory chunks
    useLayoutEffect(() => {
        if (!tex) return;
        if (meshAspect > imageAspect) {
            tex.repeat.set(1, imageAspect / meshAspect);
            tex.offset.set(0, (1 - imageAspect / meshAspect) / 2);
        } else {
            tex.repeat.set(meshAspect / imageAspect, 1);
            tex.offset.set((1 - meshAspect / imageAspect) / 2, 0);
        }
        tex.needsUpdate = true;
    }, [tex, meshAspect, imageAspect]);

    return (
        <mesh position={[0, 0, LAYERS.BACKGROUND]} scale={[meshWidth, meshHeight, 1]} renderOrder={-10}>
            <planeGeometry />
            <meshBasicMaterial map={tex} color="#ffffff" transparent={true} depthTest={false} depthWrite={false} toneMapped={true} />
        </mesh>
    );
}

function SlideOrnament({ tex, x = 0, y = 0, bgW, bgH, size, delay, multiplier = 0, zOffset = 0 }: any) {
    const ref = useRef<THREE.Mesh>(null);
    const scroll = useScroll();
    const { viewport } = useThree();
    
    const aspect = useMemo(() => {
        if (!tex || !tex.image) return 1;
        const w = tex.image.width || tex.image.videoWidth || 1;
        const h = tex.image.height || tex.image.videoHeight || 1;
        return w / h;
    }, [tex]);
    
    const worldX = (x / 100) * bgW;
    const worldY = (y / 100) * bgH;

    useFrame((state) => {
        if (!ref.current || !scroll) return;
        if (ref.current.parent && !ref.current.parent.visible) return;
        const t = scroll.offset;
        const D = getScrollDist(viewport.height);
        const parallaxOffset = t * D * multiplier;

        const time = state.clock.elapsedTime;
        ref.current.position.y = worldY + parallaxOffset + Math.cos(time * 0.6 + delay) * 0.05;
        ref.current.position.x = worldX + Math.sin(time * 0.4 + delay) * 0.05;
        ref.current.rotation.z = Math.sin(time * 0.3 + delay) * 0.02;
    });

    return (
        <mesh ref={ref} position={[worldX, worldY, LAYERS.ORNAMENTS + zOffset]}>
            <planeGeometry args={[size, size / aspect]} />
            <meshBasicMaterial map={tex} transparent toneMapped={true} />
        </mesh>
    );
}

function SlideText({ tex, x = 0, y = 0, bgW, bgH, size, delay, multiplier = 0, zOffset = 0, animation = true, link }: any) {
    const ref = useRef<THREE.Mesh>(null);
    const scroll = useScroll();
    const { viewport } = useThree();
    
    const aspect = useMemo(() => {
        if (!tex || !tex.image) return 1;
        const w = tex.image.width || tex.image.videoWidth || 1;
        const h = tex.image.height || tex.image.videoHeight || 1;
        return w / h;
    }, [tex]);
    
    const worldX = (x / 100) * bgW;
    const worldY = (y / 100) * bgH;

    useFrame((state) => {
        if (!ref.current || !scroll) return;
        if (ref.current.parent && !ref.current.parent.visible) return;
        const t = scroll.offset;
        const D = getScrollDist(viewport.height);
        const parallaxOffset = t * D * multiplier;

        if (animation) {
            const time = state.clock.elapsedTime;
            ref.current.position.y = worldY + parallaxOffset + Math.cos(time * 0.6 + delay) * 0.05;
            ref.current.position.x = worldX + Math.sin(time * 0.4 + delay) * 0.05;
            ref.current.rotation.z = Math.sin(time * 0.3 + delay) * 0.02;
        } else {
            ref.current.position.y = worldY + parallaxOffset;
            ref.current.position.x = worldX;
            ref.current.rotation.z = 0;
        }
    });

    const handlePointerOver = () => { if (link) document.body.style.cursor = 'pointer'; };
    const handlePointerOut = () => { if (link) document.body.style.cursor = 'auto'; };
    const handleClick = () => { if (link) window.open(link, '_blank'); };

    return (
        <mesh 
            ref={ref} 
            position={[worldX, worldY, LAYERS.TEXT + zOffset]}
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        >
            <planeGeometry args={[size, size / aspect]} />
            <meshBasicMaterial map={tex} transparent toneMapped={true} />
        </mesh>
    );
}

function SlideHeartbeat({ tex, x = 0, y = 0, bgW, bgH, size, delay = 0, multiplier = 0, zOffset = 0, beatSpeed = 3, beatDelay = 0 }: any) {
    const ref = useRef<THREE.Mesh>(null);
    const scroll = useScroll();
    const { viewport } = useThree();
    
    const aspect = useMemo(() => {
        if (!tex || !tex.image) return 1;
        const w = tex.image.width || tex.image.videoWidth || 1;
        const h = tex.image.height || tex.image.videoHeight || 1;
        return w / h;
    }, [tex]);
    
    const worldX = (x / 100) * bgW;
    const worldY = (y / 100) * bgH;

    useFrame((state) => {
        if (!ref.current || !scroll) return;
        if (ref.current.parent && !ref.current.parent.visible) return;
        const t = scroll.offset;
        const D = getScrollDist(viewport.height);
        const parallaxOffset = t * D * multiplier;

        const time = state.clock.elapsedTime;
        ref.current.position.y = worldY + parallaxOffset + Math.cos(time * 0.6 + delay) * 0.05;
        ref.current.position.x = worldX + Math.sin(time * 0.4 + delay) * 0.05;
        ref.current.rotation.z = Math.sin(time * 0.3 + delay) * 0.02;

        const beat = Math.pow(Math.sin(time * beatSpeed + beatDelay), 12) * 0.15 + Math.pow(Math.sin(time * beatSpeed + 0.3 + beatDelay), 12) * 0.05;
        const scale = 1 + beat;
        ref.current.scale.set(scale, scale, 1);
    });

    return (
        <mesh ref={ref} position={[worldX, worldY, LAYERS.TEXT + zOffset]}>
            <planeGeometry args={[size, size / aspect]} />
            <meshBasicMaterial map={tex} transparent toneMapped={true} />
        </mesh>
    );
}

function SlideRotate({ tex, x = 0, y = 0, bgW, bgH, size, delay = 0, multiplier = 0, zOffset = 0, rotateSpeed = 2, rotateAmount = 0.15, pivot = "top", randomize = true }: any) {
    const ref = useRef<THREE.Group>(null);
    const scroll = useScroll();
    const { viewport } = useThree();
    
    const randomPhase = useMemo(() => Math.random() * Math.PI * 2, []);
    const randomSpeedMod = useMemo(() => 0.8 + Math.random() * 0.4, []); 

    const aspect = useMemo(() => {
        if (!tex || !tex.image) return 1;
        const w = tex.image.width || tex.image.videoWidth || 1;
        const h = tex.image.height || tex.image.videoHeight || 1;
        return w / h;
    }, [tex]);
    
    const height = size / aspect;
    const worldX = (x / 100) * bgW;
    const baseY = (y / 100) * bgH;

    const pivotOffsetY = pivot === "top" ? height / 2 : (pivot === "bottom" ? -height / 2 : 0);
    const meshOffsetY = pivot === "top" ? -height / 2 : (pivot === "bottom" ? height / 2 : 0);
    const worldY = baseY + pivotOffsetY;

    useFrame((state) => {
        if (!ref.current || !scroll) return;
        if (ref.current.parent && !ref.current.parent.visible) return;
        const t = scroll.offset;
        const D = getScrollDist(viewport.height);
        const parallaxOffset = t * D * multiplier;

        const time = state.clock.elapsedTime;
        ref.current.position.y = worldY + parallaxOffset;
        ref.current.position.x = worldX;
        
        if (randomize) {
            const baseSwing = Math.sin(time * rotateSpeed * randomSpeedMod + delay + randomPhase);
            const amplitudeMod = 0.6 + 0.4 * Math.sin(time * rotateSpeed * 0.3 + randomPhase * 2);
            const wobble = 0.1 * Math.sin(time * rotateSpeed * 1.6 + randomPhase * 3);
            ref.current.rotation.z = (baseSwing + wobble) * (rotateAmount * amplitudeMod);
        } else {
            ref.current.rotation.z = Math.sin(time * rotateSpeed + delay) * rotateAmount;
        }
    });

    return (
        <group ref={ref} position={[worldX, worldY, LAYERS.TEXT + zOffset]}>
            <mesh position={[0, meshOffsetY, 0]}>
                <planeGeometry args={[size, height]} />
                <meshBasicMaterial map={tex} transparent toneMapped={true} premultipliedAlpha={false} depthTest={false} />
            </mesh>
        </group>
    );
}

function SlidePicture({ tex, x = 0, y = 0, bgW, bgH, size, delay, multiplier = 0, zOffset = 0 }: any) {
    const ref = useRef<THREE.Mesh>(null);
    const scroll = useScroll();
    const { viewport } = useThree();
    
    const aspect = useMemo(() => {
        if (!tex || !tex.image) return 1;
        const w = tex.image.width || tex.image.videoWidth || 1;
        const h = tex.image.height || tex.image.videoHeight || 1;
        return w / h;
    }, [tex]);
    
    const worldX = (x / 100) * bgW;
    const worldY = (y / 100) * bgH;

    useFrame(() => {
        if (!ref.current || !scroll) return;
        if (ref.current.parent && !ref.current.parent.visible) return;
        const t = scroll.offset;
        const D = getScrollDist(viewport.height);
        const parallaxOffset = t * D * multiplier;
        ref.current.position.y = worldY + parallaxOffset;
    });

    return (
        <mesh ref={ref} position={[worldX, worldY, LAYERS.ORNAMENTS + zOffset]}>
            <planeGeometry args={[size, size / aspect]} />
            <meshBasicMaterial map={tex} transparent toneMapped={false} />
        </mesh>
    );
}

function SlideHtml({ x = 0, y = 0, bgW, bgH, text, link, multiplier = 0, zOffset = 0, animation = "none", delay = 0, beatSpeed = 2, rotateSpeed = 2, rotateAmount = 0.1, randomize = true }: any) {
    const ref = useRef<THREE.Group>(null);
    const scroll = useScroll();
    const { viewport, gl } = useThree();

    const worldX = (x / 100) * bgW;
    const worldY = (y / 100) * bgH;

    const portalRef = useRef<HTMLElement | null>(null);
    if (!portalRef.current && gl.domElement) {
        portalRef.current = gl.domElement.parentElement;
    }

    const randomPhase = useMemo(() => Math.random() * Math.PI * 2, []);
    const randomSpeedMod = useMemo(() => 0.8 + Math.random() * 0.4, []); 

    useFrame((state) => {
        if (!ref.current || !scroll) return;
        if (ref.current.parent && !ref.current.parent.visible) return;
        const t = scroll.offset;
        const D = getScrollDist(viewport.height);
        const parallaxOffset = t * D * multiplier;
        ref.current.position.y = worldY + parallaxOffset;
        
        const time = state.clock.elapsedTime;

        if (animation === "heartbeat") {
            const beat = Math.pow(Math.sin(time * beatSpeed + delay), 12) * 0.15 + Math.pow(Math.sin(time * beatSpeed + 0.3 + delay), 12) * 0.05;
            const scale = 1 + beat;
            ref.current.scale.set(scale, scale, 1);
        } else if (animation === "rotate") {
            if (randomize) {
                const baseSwing = Math.sin(time * rotateSpeed * randomSpeedMod + delay + randomPhase);
                const amplitudeMod = 0.6 + 0.4 * Math.sin(time * rotateSpeed * 0.3 + randomPhase * 2);
                const wobble = 0.1 * Math.sin(time * rotateSpeed * 1.6 + randomPhase * 3);
                ref.current.rotation.z = (baseSwing + wobble) * (rotateAmount * amplitudeMod);
            } else {
                ref.current.rotation.z = Math.sin(time * rotateSpeed + delay) * rotateAmount;
            }
        }
    });

    const isMap = link && (link.includes('maps') || link.includes('google') || link.includes('goo.gl'));

    return (
        <group ref={ref} position={[worldX, worldY, LAYERS.TEXT + zOffset]}>
            <Html center zIndexRange={[100, 0]} portal={portalRef as any}>
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`px-5 py-2 text-xs font-sans tracking-widest hover:bg-[#32101c]/80 transition-all rounded whitespace-nowrap flex items-center gap-2 ${link.includes("maps") ? "text-[#4B182B]" : "text-[#F8F3ED]"}`}
                  style={{ pointerEvents: 'auto' }}
                >
                  {isMap ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  )}
                  {text}
                </a>
            </Html>
        </group>
    );
}

function SlideCopyButton({ x = 0, y = 0, bgW, bgH, text, copyText, multiplier = 0, zOffset = 0 }: any) {
    const ref = useRef<THREE.Group>(null);
    const scroll = useScroll();
    const { viewport, gl } = useThree();
    const [copied, setCopied] = useState(false);

    const worldX = (x / 100) * bgW;
    const worldY = (y / 100) * bgH;

    const portalRef = useRef<HTMLElement | null>(null);
    if (!portalRef.current && gl.domElement) {
        portalRef.current = gl.domElement.parentElement;
    }

    useFrame(() => {
        if (!ref.current || !scroll) return;
        if (ref.current.parent && !ref.current.parent.visible) return;
        const t = scroll.offset;
        const D = getScrollDist(viewport.height);
        const parallaxOffset = t * D * multiplier;
        ref.current.position.y = worldY + parallaxOffset;
    });

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(copyText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = copyText;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <group ref={ref} position={[worldX, worldY, LAYERS.TEXT + zOffset]}>
            <Html center zIndexRange={[100, 0]} portal={portalRef as any}>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 active:scale-95 cursor-pointer group"
                  style={{ pointerEvents: 'auto' }}
                >
                  <span className="text-[#F8F3ED] text-[11px] font-serif tracking-wider whitespace-nowrap">
                    Copy
                  </span>
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-opacity">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  )}
                </button>
                {copied && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0A120D]/90 border border-[#4ade80]/40 text-[#4ade80] text-[9px] font-serif tracking-widest uppercase px-3 py-1 rounded whitespace-nowrap animate-pulse">
                    Copied!
                  </div>
                )}
            </Html>
        </group>
    );
}

function SlideForm({ x = 0, y = 0, bgW, bgH, multiplier = 0, zOffset = 0 }: any) {
    const ref = useRef<THREE.Group>(null);
    const scroll = useScroll();
    const { viewport, gl } = useThree();

    const worldX = (x / 100) * bgW;
    const worldY = (y / 100) * bgH;

    const [name, setName] = useState('');
    const [attending, setAttending] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [wishes, setWishes] = useState<any[]>([]);
    const [currentWishIndex, setCurrentWishIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'rsvp' | 'wishes'>('rsvp');

    const portalRef = useRef<HTMLElement | null>(null);
    if (!portalRef.current && gl.domElement) {
        portalRef.current = gl.domElement.parentElement;
    }

    useFrame(() => {
        if (!ref.current || !scroll) return;
        if (ref.current.parent && !ref.current.parent.visible) return;
        const t = scroll.offset;
        const D = getScrollDist(viewport.height);
        const parallaxOffset = t * D * multiplier;
        ref.current.position.y = worldY + parallaxOffset;
    });

    const fetchWishes = async () => {
        try {
            const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
            const res = await fetch(`${basePath}/api/guestbook`);
            if (res.ok) {
                const data = await res.json();
                setWishes(data || []);
            }
        } catch (err) {
            console.error('Error fetching wishes:', err);
        }
    };

    useEffect(() => {
        fetchWishes();
    }, []);

    useEffect(() => {
        if (wishes.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentWishIndex((prevIndex) => (prevIndex + 1) % wishes.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [wishes]);

    const handlePrevWish = () => {
        if (wishes.length === 0) return;
        setCurrentWishIndex((prev) => (prev - 1 + wishes.length) % wishes.length);
    };

    const handleNextWish = () => {
        if (wishes.length === 0) return;
        setCurrentWishIndex((prev) => (prev + 1) % wishes.length);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !message || !attending) {
            setErrorMessage('Please fill in all fields');
            setStatus('error');
            return;
        }

        setStatus('submitting');
        setErrorMessage(null);

        try {
            const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
            const res = await fetch(`${basePath}/api/guestbook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    message,
                    attending: attending === 'yes',
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Failed to submit RSVP');
            }

            setStatus('success');
            setName('');
            setAttending('');
            setMessage('');
            await fetchWishes();
            setCurrentWishIndex(0);
        } catch (error: any) {
            console.error('Error submitting guestbook:', error);
            setStatus('error');
            setErrorMessage(error.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <group ref={ref} position={[worldX, worldY, LAYERS.TEXT + zOffset]}>
            <Html center zIndexRange={[100, 0]} portal={portalRef as any}>
                <div className="flex flex-col items-center animate-fade-in" style={{ pointerEvents: 'auto' }}>
                    <div 
                        className="p-5 w-[75vw] max-w-[300px] flex flex-col items-center transition-all duration-300"
                    >
                        <div className="flex border-b border-[#D4AF37]/20 w-full mb-4">
                            <button
                                type="button"
                                onClick={() => setActiveTab('rsvp')}
                                className={`flex-1 pb-2 text-[10px] font-serif tracking-widest text-center transition-all cursor-pointer ${
                                    activeTab === 'rsvp' 
                                        ? 'text-[#D4AF37] border-b border-[#D4AF37] font-semibold' 
                                        : 'text-[#F8F3ED]/50 hover:text-[#F8F3ED]'
                                }`}
                            >
                                RSVP
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('wishes')}
                                className={`flex-1 pb-2 text-[10px] font-serif tracking-widest text-center transition-all cursor-pointer ${
                                    activeTab === 'wishes' 
                                        ? 'text-[#D4AF37] border-b border-[#D4AF37] font-semibold' 
                                        : 'text-[#F8F3ED]/50 hover:text-[#F8F3ED]'
                                }`}
                            >
                                WISHES
                            </button>
                        </div>

                        {activeTab === 'rsvp' ? (
                            <div className="w-full">
                                {status === 'success' ? (
                                    <div className="flex flex-col items-center justify-center text-center py-4 px-2 transition-all duration-500">
                                        <div className="w-12 h-12 flex items-center justify-center mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-[#F8F3ED] font-serif text-sm tracking-widest mb-1.5">Thank You!</h3>
                                        <p className="text-[#F8F3ED]/75 text-[11px] leading-relaxed mb-5 font-sans">
                                            Your RSVP & wishes have been saved successfully. We look forward to celebrating together!
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setStatus('idle')}
                                            className="text-[#D4AF37] hover:text-[#F8F3ED] text-[10px] font-serif tracking-widest border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-md px-4 py-1.5 transition-all cursor-pointer"
                                        >
                                            Send Another Wish
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 w-full">
                                        {status === 'error' && errorMessage && (
                                            <div className="text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg p-2.5 text-xs leading-relaxed text-center">
                                                {errorMessage}
                                            </div>
                                        )}
                                        <div>
                                            <input 
                                                type="text" 
                                                placeholder="Name" 
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                disabled={status === 'submitting'}
                                                className="w-full bg-[#F8F3ED]/10 border border-[#D4AF37]/30 rounded-lg px-4 py-2 text-[#F8F3ED] placeholder:text-[#F8F3ED]/50 focus:outline-none focus:border-[#D4AF37] transition-colors text-xs disabled:opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <select 
                                                required
                                                value={attending}
                                                onChange={(e) => setAttending(e.target.value)}
                                                disabled={status === 'submitting'}
                                                className="w-full bg-[#1A2421] border border-[#D4AF37]/30 rounded-lg px-4 py-2 text-[#F8F3ED] focus:outline-none focus:border-[#D4AF37] transition-colors text-xs disabled:opacity-50"
                                            >
                                                <option value="" disabled hidden>Will you attend?</option>
                                                <option value="yes">Yes, I will attend</option>
                                                <option value="no">Sorry, I can't attend</option>
                                            </select>
                                        </div>
                                        <div>
                                            <textarea 
                                                placeholder="Wishes for the couple..." 
                                                required
                                                rows={3}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                disabled={status === 'submitting'}
                                                className="w-full bg-[#F8F3ED]/10 border border-[#D4AF37]/30 rounded-lg px-4 py-2 text-[#F8F3ED] placeholder:text-[#F8F3ED]/50 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none text-xs disabled:opacity-50"
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={status === 'submitting'}
                                            className="w-full mt-1 text-[#F8F3ED] border border-[#D4AF37]/40 rounded-lg py-2.5 font-serif tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-xs cursor-pointer"
                                        >
                                            {status === 'submitting' ? 'Sending...' : 'Send'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        ) : (
                            <div className="w-full flex flex-col items-center animate-fade-in">
                                {wishes.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-[#F8F3ED]/60 text-xs font-serif tracking-wider italic">
                                            Be the first to share a warm wish! ✨
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative min-h-[200px] w-full flex items-center justify-center overflow-hidden">
                                            {wishes.map((wish, index) => (
                                                <div
                                                    key={wish.id}
                                                    className={`absolute inset-x-0 top-0 flex flex-col items-center transition-all duration-700 ease-in-out ${
                                                        index === currentWishIndex 
                                                            ? 'opacity-100 translate-x-0 pointer-events-auto' 
                                                            : 'opacity-0 translate-x-8 pointer-events-none'
                                                    }`}
                                                >
                                                    <h5 className="text-[#D4AF37] font-serif text-sm tracking-wider font-semibold text-center">
                                                        {wish.name}
                                                    </h5>
                                                    {wish.attending && (
                                                        <span className="text-[9px] text-[#D4AF37]/60 tracking-widest uppercase mt-0.5">
                                                            — Attending
                                                        </span>
                                                    )}
                                                    <div 
                                                        className="w-full max-h-[150px] overflow-y-auto mt-2 px-2 text-center scrollbar-thin"
                                                        style={{ 
                                                            scrollbarWidth: 'thin', 
                                                            scrollbarColor: 'rgba(212,175,55,0.3) transparent' 
                                                        }}
                                                    >
                                                        <p className="text-[#F8F3ED]/85 italic text-xs leading-relaxed break-words">
                                                            "{wish.message}"
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {wishes.length > 1 && (
                                            <div className="flex justify-between items-center w-full mt-3 px-1 border-t border-[#D4AF37]/15 pt-2 text-[10px] text-[#F8F3ED]/60 font-serif">
                                                <button 
                                                    type="button" 
                                                    onClick={handlePrevWish} 
                                                    className="hover:text-[#D4AF37] transition-colors cursor-pointer p-1"
                                                >
                                                    ← Prev
                                                </button>
                                                <span className="tracking-widest">{currentWishIndex + 1} of {wishes.length}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={handleNextWish} 
                                                    className="hover:text-[#D4AF37] transition-colors cursor-pointer p-1"
                                                >
                                                    Next →
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Html>
        </group>
    );
}

export function CinematicScene() {
  const scroll = useScroll();
  const { viewport } = useThree();
  const slidesGroup = useRef<THREE.Group>(null);

  const texturePaths = useMemo(() => [
    ...backgroundTextures,
    ...slideElementTextures.flat(),
    decorationTextures.orchid,
    decorationTextures.goldMotif,
    decorationTextures.petal,
    decorationTextures.custom,
    decorationTextures.logo1,
    decorationTextures.text11,
    decorationTextures.text12,
    decorationTextures.text13,
    decorationTextures.text14,
    decorationTextures.text15,
    decorationTextures.bunga1,
    decorationTextures.bunga2,
    decorationTextures.bunga3,
    decorationTextures.couple2,
    decorationTextures.border2,
    decorationTextures.text21,
    decorationTextures.text22,
    decorationTextures.text23,
    decorationTextures.surah3,
    decorationTextures.terjemah3,
    decorationTextures.bride4,
    decorationTextures.text41,
    decorationTextures.text42,
    decorationTextures.text43,
    decorationTextures.bride5,
    decorationTextures.text51,
    decorationTextures.text52,
    decorationTextures.text53,
    decorationTextures.border6,
    decorationTextures.text61,
    decorationTextures.text62,
    decorationTextures.text71,
    decorationTextures.text72,
    decorationTextures.text7Akad,
    decorationTextures.text7AkadTgl,
    decorationTextures.text7Resepsi,
    decorationTextures.text7ResepsiTgl,
    decorationTextures.text7Alamat,
    decorationTextures.text7AlamatJln,
    decorationTextures.text81,
    decorationTextures.text82,
    decorationTextures.palette8,
    decorationTextures.text91,
    decorationTextures.text92,
    decorationTextures.text93,
    decorationTextures.text94,
    decorationTextures.image91,
    decorationTextures.image92,
    decorationTextures.text111,
    decorationTextures.text121,
    decorationTextures.text122,
    decorationTextures.border12,
    decorationTextures.logo131,
  ], []);

  const loadedTextures = useTexture(texturePaths);

  // FIX 2: MOBILE ANISOTROPY LOWERED (Crucial to prevent iOS engine tab crashes)
  useLayoutEffect(() => {
    const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone/i.test(navigator.userAgent);
    
    loadedTextures.forEach(tex => {
      // Set to 1 on mobile (turns off filtering over-computation), 4 on Desktop
      tex.anisotropy = isMobile ? 1 : 4; 
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    });
  }, [loadedTextures]);

  const activeSlideIndex = useRef(0);
  const initialized = useRef(false);
  const scrollCooldown = useRef(false);
  
  const isUserScrolling = useRef(false);
  const scrollListenerAttached = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollHandlerRef = useRef<(() => void) | null>(null);
  const scrollElementRef = useRef<HTMLElement | null>(null);

  const scrollMode = (WEDDING_CONFIG as any).scrollMode ?? 'strict';

  const getClosestSlideIndex = (currentScrollTop: number, maxScroll: number, D: number) => {
    if (maxScroll <= 0) return 0;
    const currentOffset = currentScrollTop / maxScroll;
    
    let closestIndex = 0;
    let minDiff = Infinity;
    
    for (let i = 0; i < WEDDING_CONFIG.slides.length; i++) {
      const targetY = -getSlideY(i, viewport.height);
      const targetOffset = Math.max(0, Math.min(1, targetY / D));
      const diff = Math.abs(currentOffset - targetOffset);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    return closestIndex;
  };

  const triggerSlideTransition = (isDown: boolean) => {
    const totalSlides = WEDDING_CONFIG.slides.length;
    let nextIndex = activeSlideIndex.current;
    
    if (isDown) {
      nextIndex = Math.min(nextIndex + 1, totalSlides - 1);
    } else {
      nextIndex = Math.max(nextIndex - 1, 0);
    }
    
    if (nextIndex !== activeSlideIndex.current) {
      activeSlideIndex.current = nextIndex;
      scrollCooldown.current = true;
      setTimeout(() => {
        scrollCooldown.current = false;
      }, 600); 
    }
  };

  useEffect(() => {
    const isInsideScrollableHTML = (target: HTMLElement | null): boolean => {
      let curr: HTMLElement | null = target;
      while (curr) {
        if (curr.classList && curr.classList.contains('overflow-y-auto')) {
          return true;
        }
        curr = curr.parentElement;
      }
      return false;
    };

    const handleWheelStrict = (e: WheelEvent) => {
      if (isInsideScrollableHTML(e.target as HTMLElement)) return;
      e.preventDefault();
      if (scrollCooldown.current) return;
      if (Math.abs(e.deltaY) > 5) {
        triggerSlideTransition(e.deltaY > 0);
      }
    };
    
    let touchStartY = 0;
    const handleTouchStartStrict = (e: TouchEvent) => {
      if (isInsideScrollableHTML(e.target as HTMLElement)) return;
      if (e.touches.length > 0) touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMoveStrict = (e: TouchEvent) => {
      if (isInsideScrollableHTML(e.target as HTMLElement)) return;
      e.preventDefault();
    };
    
    const handleTouchEndStrict = (e: TouchEvent) => {
      if (isInsideScrollableHTML(e.target as HTMLElement)) return;
      if (scrollCooldown.current) return;
      if (e.changedTouches.length > 0) {
        const deltaY = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(deltaY) > 15) {
          triggerSlideTransition(deltaY > 0);
        }
      }
    };

    if (scrollMode === 'strict') {
      window.addEventListener('wheel', handleWheelStrict, { passive: false });
      window.addEventListener('touchstart', handleTouchStartStrict, { passive: true });
      window.addEventListener('touchmove', handleTouchMoveStrict, { passive: false });
      window.addEventListener('touchend', handleTouchEndStrict, { passive: true });
    }
    
    return () => {
      if (scrollMode === 'strict') {
        window.removeEventListener('wheel', handleWheelStrict);
        window.removeEventListener('touchstart', handleTouchStartStrict);
        window.removeEventListener('touchmove', handleTouchMoveStrict);
        window.removeEventListener('touchend', handleTouchEndStrict);
      }
      
      if (scrollElementRef.current && scrollHandlerRef.current) {
        scrollElementRef.current.removeEventListener('scroll', scrollHandlerRef.current);
      }
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [viewport.height, scrollMode]);

  useFrame(() => {
    if (!scroll || !slidesGroup.current || !scroll.el) return;
    
    const maxScroll = scroll.el.scrollHeight - scroll.el.clientHeight;
    const D = getScrollDist(viewport.height);
    
    if (!initialized.current && maxScroll > 0) {
      activeSlideIndex.current = getClosestSlideIndex(scroll.el.scrollTop, maxScroll, D);
      initialized.current = true;
    }
    
    if (scrollMode === 'smooth' && !scrollListenerAttached.current && scroll.el) {
      const handleScroll = () => {
        isUserScrolling.current = true;
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
          isUserScrolling.current = false;
        }, 150);
      };
      
      scroll.el.addEventListener('scroll', handleScroll, { passive: true });
      scrollElementRef.current = scroll.el;
      scrollHandlerRef.current = handleScroll;
      scrollListenerAttached.current = true;
    }
    
    if (initialized.current && scroll.el) {
      if (scrollMode === 'smooth' && isUserScrolling.current) {
        activeSlideIndex.current = getClosestSlideIndex(scroll.el.scrollTop, maxScroll, D);
      } else {
        const targetY = -getSlideY(activeSlideIndex.current, viewport.height);
        const targetOffset = Math.max(0, Math.min(1, targetY / D));
        const targetScroll = targetOffset * maxScroll;
        
        if (scrollMode === 'strict') {
          scroll.el.scrollTop = targetScroll;
        } else {
          const speed = (WEDDING_CONFIG as any).transitionSpeed ?? 0.2;
          const lerpSpeed = Math.max(0.01, Math.min(0.5, 0.016 / speed));
          scroll.el.scrollTop = THREE.MathUtils.lerp(scroll.el.scrollTop, targetScroll, lerpSpeed);
        }
      }
    }
    
    const t = scroll.offset;
    slidesGroup.current.position.y = t * D;

    const vh = viewport.height;
    const groupY = slidesGroup.current.position.y;
    slidesGroup.current.children.forEach((child, index) => {
      const slideY = getSlideY(index, vh) + groupY;
      const isVisible = Math.abs(slideY) < vh * 1.5;
      if (child.visible !== isVisible) {
        child.visible = isVisible;
      }
    });
  });

  let pointer = 0;
  const bgTextures = loadedTextures.slice(pointer, pointer += backgroundTextures.length);
  const elementTextures = slideElementTextures.map(group => 
    loadedTextures.slice(pointer, pointer += group.length)
  );
  const [orchidTex, goldMotifTex, petalTex, customOrnamentTex, logo1Tex, text11Tex, text12Tex, text13Tex, text14Tex, text15Tex, bunga1Tex, bunga2Tex, bunga3Tex, couple2Tex, border2Tex, text21Tex, text22Tex, text23Tex, surah3Tex, terjemah3Tex, bride4Tex, text41Tex, text42Tex, text43Tex, bride5Tex, text51Tex, text52Tex, text53Tex, border6Tex, text61Tex, text62Tex, text71Tex, text72Tex, text7AkadTex, text7AkadTglTex, text7ResepsiTex, text7ResepsiTglTex, text7AlamatTex, text7AlamatJlnTex, text81Tex, text82Tex, palette8Tex, text91Tex, text92Tex, text93Tex, text94Tex, image91Tex, image92Tex, text111Tex, text121Tex, text122Tex, border12Tex, logo131Tex] = loadedTextures.slice(pointer);

  const introSlideConfig = [
    { type: 'SlideText', tex: logo1Tex, x: 1, y: 16.5, sizeMult: 0.1, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideText', tex: text11Tex, x: 1, y: 0, sizeMult: 0.68, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideText', tex: text12Tex, x: 1, y: 1, sizeMult: 0.68, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideRotate', tex: text13Tex, x: 1, y: -1.5, sizeMult: 0.26, delay: 2, multiplier: 0.12, zOffset: 2, rotateSpeed: 1.5, rotateAmount: 0.1, pivot: "middle" },
    { type: 'SlideText', tex: text14Tex, x: -2, y: -6, sizeMult: 0.4, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideRotate', tex: text15Tex, x: 0, y: -12, sizeMult: 0.23, delay: 2, multiplier: 0.12, zOffset: 2, rotateSpeed: 2, rotateAmount: 0.08, pivot: "middle" },
    { type: 'SlideRotate', tex: bunga1Tex, x: -25, y: 20, sizeMult: 0.5, delay: 0, multiplier: 0.2,rotateSpeed: 1.8, rotateAmount: 0.1, pivot: "middle" },
    { type: 'SlideRotate', tex: bunga2Tex, x: 24, y: -14.5, sizeMult: 0.5, delay: 1, multiplier: 0.25, rotateSpeed: 2, rotateAmount: 0.08, pivot: "middle" },
  ];

  const couplesSlideConfig = [
    { type: 'SlidePicture', tex: border2Tex, x: 1, y: -2, sizeRaw: 4, delay: 1, multiplier: 0.02 },
    { type: 'SlidePicture', tex: couple2Tex, x: 1, y: -1, sizeRaw: 4, delay: 1, multiplier: 0.0 },
    { type: 'SlideRotate', tex: bunga1Tex, x: 21, y: 3, sizeMult: 0.4, delay: 2, multiplier: 0.12, zOffset: 2, rotateSpeed: 1.5, rotateAmount: 0.1, pivot: "middle"  },
    { type: 'SlideRotate', tex: bunga2Tex, x: 23, y: -24.5, sizeMult: 0.4, delay: 2, multiplier: 0.12, zOffset: 2, rotateSpeed: 1.5, rotateAmount: 0.1, pivot: "middle" },
    { type: 'SlideRotate', tex: bunga3Tex, x: -19, y: -14, sizeMult: 0.5, delay: 2, multiplier: 0.12, zOffset: 2, rotateSpeed: 1.5, rotateAmount: 0.1, pivot: "middle" },
    { type: 'SlideText', tex: text21Tex, x: 1, y: 10, sizeMult: 0.85, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideText', tex: text22Tex, x: 1, y: 11, sizeMult: 0.68, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideText', tex: text23Tex, x: -1, y: -24, sizeMult: 1, delay: 2, multiplier: 0.12, zOffset: 2},
  ];

  const quoteSlideConfig = [
    { type: 'SlideText', tex: surah3Tex, x: -8, y: -30, sizeMult: 0.55, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideText', tex: terjemah3Tex, x:8, y: -60, sizeMult: 0.58, delay: 2, multiplier: 0.12, zOffset: 2 },
  ]

  const brideSlideConfig = [
    { type: 'SlidePicture', tex: bride4Tex, x: 1, y: -22, sizeRaw: 2.5, delay: 1, multiplier: 0.1 },
    { type: 'SlideRotate', tex: text41Tex, x: 2.5, y: -1.5, sizeMult: 0.55, delay: 2, multiplier: 0.12, zOffset: 2, rotateSpeed: 1, rotateAmount: 0.1, pivot: "top" },
    { type: 'SlideText', tex: text42Tex, x: 1, y: -58, sizeMult: 0.68, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideText', tex: text43Tex, x: 1, y: -63, sizeMult: 0.6, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideHtml', x: 2, y: -58, sizeRaw: 0.5, delay: 1, multiplier: 0.12, link: "https://www.instagram.com/qonitaaf_?igsh=MWh6cDg4eWtvZjZtcQ%3D%3D&utm_source=qr", text: "@qonitaaf_" }
  ];

  const groomSlideConfig = [
    { type: 'SlidePicture', tex: bride5Tex, x: 1, y: -35.5, sizeRaw: 2.57, delay: 1, multiplier: 0.1 },
    { type: 'SlideRotate', tex: text51Tex, x: 1, y: -14, sizeMult: 0.55, delay: 2, multiplier: 0.12, zOffset: 2, rotateSpeed: 1, rotateAmount: 0.1, pivot: "top" },
    { type: 'SlideText', tex: text52Tex, x: 1, y: -73.5, sizeMult: 0.68, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideText', tex: text53Tex, x: 1, y: -78.5, sizeMult: 0.6, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideHtml', x: 2, y: -75, sizeRaw: 0.5, delay: 1, multiplier: 0.12, link: "https://www.instagram.com/bagjamulyana_?igsh=bno5NjY5ang4OGFm", text: "@bagjamulyana_" }
  ];

  const daydateSlideConfig = [
    { type: 'SlidePicture', tex: border6Tex, x: 1, y: -85.5, sizeRaw: 5.2, delay: 1, multiplier: 0.1 },
    { type: 'SlideText', tex: text61Tex, x: 1, y: -102, sizeMult: 1.2, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideHeartbeat', tex: text62Tex, x: 1, y: -101.5, sizeMult: 0.75, delay: 2, multiplier: 0.12, zOffset: 2 }
  ];

  const rundownSlideConfig = [
    { type: 'SlidePicture', tex: text71Tex, x: 1, y: 22, sizeMult: 0.6, delay: 2, multiplier: 0, zOffset: 2 },
    { type: 'SlidePicture', tex: text72Tex, x: 1, y: -19, sizeMult: 0.55, delay: 2, multiplier: 0, zOffset: 2 },
    { type: 'SlideText', tex: text7AkadTex, x: 0, y: -50, sizeMult: 0.6, delay: 2, multiplier: 0.12, zOffset: 2, animation: false },
    { type: 'SlideText', tex: text7AkadTglTex, x: 1, y: -53, sizeMult: 0.55, delay: 2, multiplier: 0.12, zOffset: 2, animation: false },
    { type: 'SlideText', tex: text7ResepsiTex, x: 0, y: -60.5, sizeMult: 0.6, delay: 2, multiplier: 0.12, zOffset: 2, animation: false },
    { type: 'SlideText', tex: text7ResepsiTglTex, x: 0, y: -72.5, sizeMult: 0.55, delay: 2, multiplier: 0.12, zOffset: 2, animation: false },
    { type: 'SlideText', tex: text7AlamatTex, x: 0, y: -77, sizeMult: 0.6, delay: 2, multiplier: 0.12, zOffset: 2, animation: false },
    { type: 'SlideText', tex: text7AlamatJlnTex, x: 1, y: -81.5, sizeMult: 0.55, delay: 2, multiplier: 0.12, zOffset: 2, animation: false, link: "https://maps.app.goo.gl/DL9GCEW3aqSUiKGh9" },
    { type: 'SlideHtml', x: 1, y: -90.5, sizeRaw: 0.2, delay: 1, multiplier: 0.12, link: "https://maps.app.goo.gl/DL9GCEW3aqSUiKGh9", text: "Open Maps" },
    { type: 'SlideRotate', tex: bunga1Tex, x: 27, y: -38.5, sizeMult: 0.5, delay: 2, multiplier: 0.12, zOffset: 2, rotateSpeed: 1.5, rotateAmount: 0.05, pivot: "middle" },
    { type: 'SlideRotate', tex: bunga3Tex, x: -27, y: -59, sizeMult: 0.5, delay: 2, multiplier: 0.12, zOffset: 2, rotateSpeed: 1.5, rotateAmount: 0.05, pivot: "middle" }
  ];

  const dresscodeSlideConfig = [
    { type: 'SlidePicture', tex: palette8Tex, x: 0, y: -143, sizeRaw: 3.5, delay: 1, multiplier: 0.1 },
    { type: 'SlidePicture', tex: text81Tex, x: 0, y: -125, sizeMult: 0.6, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlidePicture', tex: text82Tex, x: 1, y: -151, sizeMult: 0.4, delay: 2, multiplier: 0.12, zOffset: 2 }
  ];

  const storySlideConfig = [
    { type: 'SlideText', tex: image91Tex, x: 1, y: -66.5, sizeRaw: 4, delay: 1, multiplier: 0.1 },
    { type: 'SlideText', tex: image92Tex, x: 1, y: -99.3, sizeRaw: 4, delay: 1, multiplier: 0.15 },
    { type: 'SlideText', tex: text91Tex, x: 1, y: -55.5, sizeMult: 0.8, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideText', tex: text92Tex, x: 20, y: -116.5, sizeMult: 0.68, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideText', tex: text93Tex, x: -12, y: -88.5, sizeMult: 0.7, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideText', tex: text94Tex, x: 1, y: -103.5, sizeMult: 1.5, delay: 2, multiplier: 0.12, zOffset: 2 }
  ];

  const rsvpSlideConfig = [
    { type: 'SlideText', tex: text111Tex, x: -0, y: -62.5, sizeMult: 0.8, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideForm', x: 1, y: -94.5, delay: undefined, multiplier: 0.12, zOffset: 2 }
  ];

  const giftSlideConfig = [
    { type: 'SlidePicture', tex: border12Tex, x: 0, y: -198.5, sizeMult: 0.6, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlidePicture', tex: text121Tex, x: 0, y: -198.5, sizeMult: 0.45, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlidePicture', tex: text122Tex, x: 0, y: -200, sizeMult: 0.4, delay: 2, multiplier: 0.12, zOffset: 2 },
    { type: 'SlideCopyButton', x: 0, y: -214, multiplier: 0.12, zOffset: 2, copyText: '1832595092' }
  ];

  const logoSlideConfig = [
    { type: 'SlidePicture', tex: logo131Tex, x: 1, y: -250, sizeRaw: 1, delay: 1, multiplier: 0.1 },
  ]

  const renderSlideElement = (config: any, i: number, slideW: number, bgW: number, bgH: number) => {
    const zOffset = config.zOffset !== undefined ? config.zOffset : (config.type.includes('Text') || config.type.includes('Rotate') ? 2 : 0);
    const size = config.sizeRaw !== undefined ? config.sizeRaw : slideW * (config.sizeMult || 1);
    const props = { bgW, bgH, size, zOffset, ...config };
    
    switch (config.type) {
      case 'SlideText': return <SlideText key={i} {...props} />;
      case 'SlideRotate': return <SlideRotate key={i} {...props} />;
      case 'SlideHeartbeat': return <SlideHeartbeat key={i} {...props} />;
      case 'SlideOrnament': return <SlideOrnament key={i} {...props} />;
      case 'SlidePicture': return <SlidePicture key={i} {...props} />;
      case 'SlideHtml': return <SlideHtml key={i} {...props} />;
      case 'SlideCopyButton': return <SlideCopyButton key={i} {...props} />;
      case 'SlideForm': return <SlideForm key={i} {...props} />;
      default: return null;
    }
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />

      <group ref={slidesGroup}>
        {WEDDING_CONFIG.slides.map((slide, index) => {
          const tex = bgTextures[index];
          const isIntro = index === 0;
          
          const imgObj = tex.image as any;
          const sourceObj = tex.source as any;
          const bgImgW = imgObj?.videoWidth || imgObj?.width || sourceObj?.data?.width || 1;
          const bgImgH = imgObj?.videoHeight || imgObj?.height || sourceObj?.data?.height || 1.5;
          const imageAspect = bgImgW / bgImgH;
          const viewportAspect = viewport.width / viewport.height;
          
          const bgWidthMultiplier = (slide as any).bgWidthMultiplier ?? 1;
          const bgHeightMultiplier = (slide as any).bgHeightMultiplier ?? 1;

          let bgW, bgH;
          if (viewportAspect > imageAspect) {
              bgW = viewport.width;
              bgH = viewport.width / imageAspect;
          } else {
              bgW = viewport.height * imageAspect;
              bgH = viewport.height;
          }

          bgW = bgW * bgWidthMultiplier;
          bgH = bgH * bgHeightMultiplier;

          const slideW = Math.min(viewport.width * 0.9, 12);
          const slideH = slideW * (800 / 1200);

          return (
            <group key={slide.id} position={[0, getSlideY(index, viewport.height), 0]}>
              <ResponsiveBackground 
                tex={bgTextures[index]} 
                isIntro={isIntro} 
                bgWidthMultiplier={bgWidthMultiplier}
                bgHeightMultiplier={bgHeightMultiplier}
              />
              {slide.elements.map((el:any, elIdx:any) => (
                <ParallaxContent 
                  key={elIdx}
                  tex={elementTextures[index][elIdx]}
                  index={index}
                  multiplier={el.multiplier || 0}
                  zOffset={LAYERS.TEXT + (elIdx * 0.01)}
                  width={slideW}
                  height={slideH}
                />
              ))}
              {slide.id === "intro" && (
                <>
                  {introSlideConfig.map((config, i) => renderSlideElement(config, i, slideW, bgW, bgH))}
                </>
              )}
              {slide.id === "couples" && (
                <>
                  {couplesSlideConfig.map((config, i) => renderSlideElement(config, i, slideW, bgW, bgH))}
                </>
              )}
              {slide.id === "quote" && (
                <>
                  {quoteSlideConfig.map((config, i) => renderSlideElement(config, i, slideW, bgW, bgH))}
                </>
              )}
              {slide.id === "bride" && (
                <>
                  {brideSlideConfig.map((config, i) => renderSlideElement(config, i, slideW, bgW, bgH))}
                </>
              )}
              {slide.id === "groom" && (
                <>
                  {groomSlideConfig.map((config, i) => renderSlideElement(config, i, slideW, bgW, bgH))}
                </>
              )}
              {slide.id === "daydate" && (
                <>
                  {daydateSlideConfig.map((config, i) => renderSlideElement(config, i, slideW, bgW, bgH))}
                </>
              )}
              {slide.id === "rundown" && (
                <>
                  {rundownSlideConfig.map((config, i) => renderSlideElement(config, i, slideW, bgW, bgH))}
                </>
              )}
              {slide.id === "dresscode" && (
                <>
                  {dresscodeSlideConfig.map((config, i) => renderSlideElement(config, i, slideW, bgW, bgH))}
                </>
              )}
              {slide.id === "stories" && (
                <>
                  {storySlideConfig.map((config, i) => renderSlideElement(config, i, slideW, bgW, bgH))}
                </>
              )}
              {slide.id === "rsvp" && (
                <>
                  {rsvpSlideConfig.map((config, i) => renderSlideElement(config, i, slideW, bgW, bgH))}
                </>
              )}
              {slide.id === "gift" && (
                <>
                  {giftSlideConfig.map((config, i) => renderSlideElement(config, i, slideW, bgW, bgH))}
                </>
              )}
              {slide.id === "thanks" && (
                <>
                  {logoSlideConfig.map((config, i) => renderSlideElement(config, i, slideW, bgW, bgH))}
                </>
              )}
            </group>
          );
        })}
      </group>
    </>
  );
}