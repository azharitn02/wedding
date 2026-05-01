'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { getAssetPath } from '@/lib/utils';
import { FlowerShape } from './ArtAssets';

interface Wish {
  id?: number;
  name: string;
  message: string;
  attending: boolean;
  created_at: string;
}

export default function Guestbook({ rsvpDeadline }: { rsvpDeadline: string }) {
  const containerRef = useRef<HTMLElement>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [formData, setFormData] = useState({ name: '', note: '', attending: 'yes' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchWishes = async () => {
    try {
      const response = await fetch('/api/guestbook');
      if (response.ok) {
        const data = await response.json();
        setWishes(data);
      }
    } catch (error) {
      console.error('Error fetching wishes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  const loadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < wishes.length) {
          loadMore();
        }
      },
      { threshold: 0.1, root: scrollContainerRef.current }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, wishes.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          message: formData.note,
          attending: formData.attending === 'yes'
        }),
      });

      if (response.ok) {
        const newWish = await response.json();
        setWishes([newWish, ...wishes]);
        setFormData({ name: '', note: '', attending: 'yes' });
      }
    } catch (error) {
      console.error('Error submitting wish:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  useGSAP(() => {
    gsap.from(".guestbook-header, .guestbook-form, .guestbook-list", {
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none none",
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-[#E8E4DC] flex justify-center overflow-hidden">
      <div className="relative w-full max-w-[500px] min-h-screen">
        {/* Background Image */}
        <img 
          src={getAssetPath('/bg5.jpg')} 
          alt="Guestbook Background" 
          className="w-full min-h-screen object-cover block" 
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
          {/* Header */}
          <div className="guestbook-header text-center pt-[10%] pb-4 px-8">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-brand-espresso/50 block mb-2">RSVP &amp; Wishes</span>
            <h2 className="mogra-regular text-3xl md:text-4xl text-brand-burgundy leading-tight text-shadow-safe">Digital Guestbook</h2>
            <div className="w-10 h-[1px] bg-brand-gold/40 mx-auto mt-4" />
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-5 pb-6 pointer-events-auto custom-scrollbar">
            {/* Form */}
            <div className="guestbook-form mb-6">
              <div className="relative p-6 md:p-8 bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl border border-white/40 overflow-hidden">
                <div className="relative z-10">
                  <h3 className="mogra-regular text-xl text-brand-espresso mb-6">Share Your Blessing</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                      <label className="block text-[9px] uppercase tracking-[0.2em] text-brand-espresso/40 mb-2 font-bold transition-colors group-focus-within:text-brand-burgundy">Your Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. John Doe"
                        className="w-full bg-transparent border-b border-brand-espresso/10 py-3 focus:outline-none focus:border-brand-burgundy font-sans text-sm text-brand-espresso transition-all placeholder:text-brand-espresso/20"
                        required
                      />
                    </div>
                    
                    <div className="relative group">
                      <label className="block text-[9px] uppercase tracking-[0.3em] text-brand-espresso/40 mb-2 font-bold transition-colors group-focus-within:text-brand-burgundy">Attendance Confirmation</label>
                      <select 
                        value={formData.attending}
                        onChange={(e) => setFormData({...formData, attending: e.target.value})}
                        className="w-full bg-transparent border-b border-brand-espresso/10 py-3 focus:outline-none focus:border-brand-burgundy font-sans text-sm text-brand-espresso transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="yes">Joyfully Accepts</option>
                        <option value="no">Regretfully Declines</option>
                      </select>
                    </div>
                    
                    <div className="relative group">
                      <label className="block text-[9px] uppercase tracking-[0.3em] text-brand-espresso/40 mb-2 font-bold transition-colors group-focus-within:text-brand-burgundy">Your Wishes</label>
                      <textarea 
                        value={formData.note}
                        onChange={(e) => setFormData({...formData, note: e.target.value})}
                        placeholder="Write your heartfelt message..."
                        rows={3}
                        className="w-full bg-transparent border-b border-brand-espresso/10 py-3 focus:outline-none focus:border-brand-burgundy font-sans text-sm text-brand-espresso transition-all resize-none placeholder:text-brand-espresso/20"
                        required
                      />
                    </div>
                    
                    <div className="pt-2">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-submit w-full py-4 px-8 bg-brand-burgundy text-white font-sans uppercase tracking-[0.3em] text-[10px] font-bold shadow-lg rounded-xl transition-all hover:bg-brand-burgundy/90 active:scale-[0.98] disabled:opacity-50"
                      >
                        {isSubmitting ? 'Sending Blessing...' : 'Send Wishes'}
                      </button>
                      <p className="text-center text-[8px] uppercase tracking-[0.3em] text-brand-espresso/40 mt-4 font-medium">
                        Kindly respond by {rsvpDeadline}
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Wish List */}
            <div className="guestbook-list space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-10">
                   <div className="w-8 h-8 border-4 border-brand-burgundy/20 border-t-brand-burgundy rounded-full animate-spin" />
                </div>
              ) : (
                wishes.slice(0, visibleCount).map((wish, idx) => (
                  <div key={wish.id || idx} className="wish-card bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/30 shadow-sm relative overflow-hidden group transition-all duration-500 hover:shadow-md hover:bg-white/80">
                    <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.03] rotate-12 -mr-3 -mt-3 transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-[-10deg]">
                       <FlowerShape className="text-brand-burgundy" />
                    </div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col space-y-1">
                        <span className="font-premium-serif text-lg text-brand-espresso italic">{wish.name}</span>
                        <span className="text-[8px] uppercase tracking-[0.3em] text-brand-espresso/30 font-bold">{formatDate(wish.created_at)}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[7px] uppercase tracking-[0.3em] font-bold ${wish.attending ? 'bg-green-50/80 text-green-700 border border-green-100' : 'bg-red-50/80 text-red-700 border border-red-100'}`}>
                        {wish.attending ? 'Attending' : 'Not Attending'}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-3 top-0 bottom-0 w-[1px] bg-brand-gold/20" />
                      <p className="font-sans text-sm text-brand-espresso/70 italic leading-relaxed pl-2">
                        &quot;{wish.message}&quot;
                      </p>
                    </div>
                  </div>
                ))
              )}
              
              {/* Observer Sentinel */}
              {!isLoading && visibleCount < wishes.length && (
                <div ref={observerTarget} className="h-16 w-full flex items-center justify-center">
                   <div className="w-5 h-5 border-2 border-brand-burgundy/10 border-t-brand-burgundy rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(78, 54, 42, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128, 0, 32, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(128, 0, 32, 0.4);
        }
      `}</style>
    </section>
  );
}
