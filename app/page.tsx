'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Couple from '@/components/Couple';
import OpeningPrayer from '@/components/OpeningPrayer';
import Profiles from '@/components/Profiles';
import Location from '@/components/Location';
import Journey from '@/components/Journey';
import MemoryStrip from '@/components/MemoryStrip';
import Details from '@/components/Details';
import CountdownSection from '@/components/CountdownSection';
import Guestbook from '@/components/Guestbook';
import CoupleClosing from '@/components/CoupleClosing';
import ThankYou from '@/components/ThankYou';
import Footer from '@/components/Footer';
import Cover from '@/components/Cover';
import { weddingData } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

// Global ScrollTrigger optimization for touch devices
if (typeof window !== 'undefined') {
  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
  });
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpened, setIsOpened] = useState(false);

  useGSAP(() => {
    // Only init advanced scroll triggers after cover is opened
    if (!isOpened) return;
    ScrollTrigger.refresh();
  }, { scope: containerRef, dependencies: [isOpened] });

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {!isOpened && (
        <Cover data={weddingData.event} onOpen={() => setIsOpened(true)} />
      )}
      {isOpened && (
        <main ref={containerRef} className="relative min-h-screen">
          <Couple data={weddingData.couple} />
          <OpeningPrayer data={weddingData.prayer} />
          <Profiles data={weddingData.couple} />
          <CountdownSection />
          {/* <Location data={weddingData.event} /> */}
          <Details data={weddingData.event} />
          {/* <Journey data={weddingData.journey} /> */}
          {/* <MemoryStrip data={weddingData.memories} /> */}
          <Guestbook rsvpDeadline={weddingData.event.rsvpDeadline} />
          <CoupleClosing />
          <ThankYou />
        </main>
      )}
    </>
  );
}
