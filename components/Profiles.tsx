'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import Image from 'next/image';
import { WeddingData } from '@/lib/data';
import { getAssetPath } from '@/lib/utils';
import FloralFrame from './FloralFrame';

interface ProfilesProps {
  data: WeddingData['couple'];
}

export default function Profiles({ data }: ProfilesProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.profile-section');
    
    cards.forEach((section, index) => {
      const content = section.querySelectorAll('.stagger-content');
      const frame = section.querySelector('.frame-image');

      // Main content stagger
      gsap.from(content, {
        opacity: 0,
        y: 20,
        stagger: 0.12,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        }
      });

      // Frame "Alive" Animation
      if (frame) {
        gsap.fromTo(frame, 
          { 
            filter: "drop-shadow(0 0 0px rgba(197, 160, 89, 0))",
            opacity: 0,
            scale: 0.95
          },
          {
            filter: "drop-shadow(0 0 20px rgba(197, 160, 89, 0.4))",
            opacity: 1,
            scale: 1,
            duration: 3,
            delay: index * 0.5, // Slight delay between Groom and Bride
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none none",
            }
          }
        );

        // Continuous gentle shimmer/glow pulse
        gsap.to(frame, {
          filter: "drop-shadow(0 0 25px rgba(197, 160, 89, 0.6))",
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 3 + (index * 0.5)
        });
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-[#E8E4DC] flex flex-col items-center overflow-hidden">
      {/* Groom Section */}
      <div className="profile-section relative w-full max-w-[500px] min-h-screen">
        {/* Background Image */}
        <Image 
          src={getAssetPath('/bg5.jpg')} 
          alt="Groom Background" 
          fill
          className="bg-image object-cover block pointer-events-none" 
        />
        
        <div className="absolute inset-0 z-10 w-full h-full pointer-events-none flex flex-col items-center pt-[8%]">
          <div className="stagger-content text-center mb-4">
            <h2 className="mogra-regular text-3xl md:text-4xl text-white tracking-wider text-shadow-safe">The Groom</h2>
            <div className="w-8 h-[1px] bg-brand-gold/40 mx-auto mt-1" />
          </div>

          <div className="flex flex-col items-center w-full flex-1 justify-center -mt-[50%]">
            <div className="relative flex flex-col items-center text-center w-full">
              <Image 
                src={getAssetPath('/groomborder1.png')} 
                alt="Groom Frame" 
                width={500}
                height={700}
                className="frame-image w-full h-auto object-contain" 
              />
              
              {/* <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-8">
                <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm relative space-y-1.5 flex flex-col items-center">
                  <p className="stagger-content font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#1a120f] font-bold">
                    {data.groom.parents}
                  </p>
                  <p className="stagger-content font-premium-serif text-[#1a120f] text-[14px] md:text-[15px] max-w-[220px] leading-relaxed italic font-medium">
                    &quot;{data.groom.description}&quot;
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Bride Section */}
      <div className="profile-section relative w-full max-w-[500px] min-h-screen">
        {/* Background Image */}
        <Image 
          src={getAssetPath('/bg5.jpg')} 
          alt="Bride Background" 
          fill
          className="bg-image object-cover block pointer-events-none" 
        />
        <div className="absolute inset-0 z-10 w-full h-full pointer-events-none flex flex-col items-center pt-[8%]">
          <div className="stagger-content text-center mb-4">
            <h2 className="mogra-regular text-3xl md:text-4xl text-white tracking-wider text-shadow-safe">The Bride</h2>
            <div className="w-8 h-[1px] bg-brand-gold/40 mx-auto mt-1" />
          </div>

          <div className="flex flex-col items-center w-full flex-1 justify-center -mt-[50%]">
            <div className="relative flex flex-col items-center text-center w-full">
              <Image 
                src={getAssetPath('/brideborder1.png')} 
                alt="Bride Frame" 
                width={500}
                height={700}
                className="frame-image w-full h-auto object-contain" 
              />
              
              {/* <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-8">
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-sm relative space-y-1.5 flex flex-col items-center">
                  <p className="stagger-content font-sans text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#1a120f] font-bold">
                    {data.bride.name}
                  </p>
                  <p className="stagger-content font-sans text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#1a120f] font-bold">
                    {data.bride.parents}
                  </p>
                  <p className="stagger-content font-premium-serif text-[#1a120f] text-[14px] md:text-[15px] max-w-[220px] leading-relaxed italic font-medium">
                    &quot;{data.bride.description}&quot;
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
