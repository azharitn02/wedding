'use client';

import { WeddingData } from '@/lib/data';

interface FooterProps {
  data: WeddingData['event'];
}

export default function Footer({ data }: FooterProps) {
  return (
    <footer className="py-12 bg-brand-bone border-t border-brand-espresso/5 text-center">
      <div className="max-w-2xl mx-auto space-y-4">
        <p className="font-serif text-2xl text-brand-espresso italic">{data.names}</p>
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-[0.6em] text-brand-espresso/30">
            {data.date} • {data.venue}
          </p>
          <p className="text-[9px] uppercase tracking-[0.4em] text-brand-espresso/20">
            Design & Motion • Geometric Balance Theme
          </p>
        </div>
      </div>
    </footer>
  );
}
