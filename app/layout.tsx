import type { Metadata } from 'next';
import { Playfair_Display, Montserrat, Mogra, Great_Vibes } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
});

const mogra = Mogra({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mogra',
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-cursive',
});

export const metadata: Metadata = {
  title: 'Elowen & Julian | Wedding Invitation',
  description: 'Join us in celebrating the wedding of Elowen and Julian.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} ${mogra.variable} ${greatVibes.variable}`}>
      <body suppressHydrationWarning className="bg-[#D1C7BD] text-[#4E362A] antialiased">
        {children}
      </body>
    </html>
  );
}
