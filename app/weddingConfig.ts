/**
 * Wedding Story Configuration
 * Edit this file to change the text, images, and layout of the wedding parallax.
 */

export const WEDDING_CONFIG = {
  // Global settings
  pages: 8,
  colors: {
    text: "#F8F3ED",
    accent: "#D4AF37",
    subtext: "#A8B8A6",
    selection: "#4B182B",
    background: "#0A120D",
  },
  
  // Slide Content
  slides: [
    {
      id: "intro",
      background: "/flower1.png",
      elements: [
        { text: "You're Invited", font: "serif", style: "italic", size: 70, y: 380, color: "text", letterSpacing: 4, multiplier: 0.15 },
        { text: "TO OUR WEDDING", font: "sans", size: 24, y: 460, color: "subtext", letterSpacing: 8, multiplier: -0.05 },
      ]
    },
    {
      id: "names",
      background: "/flower2.png",
      elements: [
        { text: "Hana", font: "serif", size: 100, y: 360, color: "text", multiplier: 0.2 },
        { text: "&", font: "serif", style: "italic", size: 60, y: 460, color: "accent", multiplier: 0.05 },
        { text: "Gufron", font: "serif", size: 100, y: 560, color: "text", multiplier: -0.15 },
      ]
    },
    {
      id: "quote",
      background: "/flower3.png",
      elements: [
        { text: "QS. AR-RUM AYAT 21", font: "serif", weight: "bold", size: 28, y: 300, color: "accent", letterSpacing: 8, multiplier: 0.15 },
        { 
          lines: [
            "\"Dan di antara tanda-tanda (kebesaran)-Nya",
            "ialah Dia menciptakan pasangan-pasangan untukmu",
            "dari jenismu sendiri...\""
          ], 
          font: "serif", style: "italic", size: 28, y: 400, lineHeight: 60, color: "text", multiplier: -0.05 
        },
      ]
    },
    {
      id: "parents",
      background: "/flower4.png",
      elements: [
        { text: "PUTRI KEDUA DARI", font: "sans", size: 16, y: 220, color: "subtext", letterSpacing: 6, multiplier: 0.2 },
        { text: "Habibah Amara Syakira, S.Ds", font: "serif", weight: "bold", size: 36, y: 280, color: "text", multiplier: 0.2 },
        { text: "Bapak Widiyomukti & Ibu Puji Wahyuni", font: "serif", style: "italic", size: 20, y: 330, color: "text", opacity: 0.8, multiplier: 0.2 },
        { text: "&", font: "serif", style: "italic", size: 50, y: 440, color: "accent", multiplier: 0 },
        { text: "PUTRA PERTAMA DARI", font: "sans", size: 16, y: 540, color: "subtext", letterSpacing: 6, multiplier: -0.2 },
        { text: "Gufron Malik Azhar, S.H", font: "serif", weight: "bold", size: 36, y: 600, color: "text", multiplier: -0.2 },
        { text: "Bapak Suroyo & Ibu Sri Mulyani", font: "serif", style: "italic", size: 20, y: 650, color: "text", opacity: 0.8, multiplier: -0.2 },
      ]
    },
    {
      id: "date",
      background: "/flower5.png",
      elements: [
        { text: "SAVE THE DATE", font: "sans", size: 20, y: 250, color: "subtext", letterSpacing: 12, multiplier: 0.25 },
        { text: "Sabtu,", font: "serif", style: "italic", size: 60, y: 360, color: "text", multiplier: 0.1 },
        { text: "09", font: "serif", size: 140, y: 500, color: "text", multiplier: 0 },
        { text: "MEI 2026", font: "sans", size: 30, y: 600, color: "accent", letterSpacing: 12, multiplier: -0.15 },
      ]
    },
    {
      id: "details",
      background: "/flower1.png",
      elements: [
        { text: "Akad Nikah", font: "serif", weight: "bold", size: 36, y: 260, color: "accent", multiplier: 0.15 },
        { text: "Pukul 08.00 - 10.00 WIB", font: "sans", size: 20, y: 320, color: "text", opacity: 0.9, letterSpacing: 2, multiplier: 0.15 },
        { text: "Resepsi Pernikahan", font: "serif", weight: "bold", size: 36, y: 440, color: "accent", multiplier: 0 },
        { text: "Pukul 11.00 - 14.00 WIB", font: "sans", size: 20, y: 500, color: "text", opacity: 0.9, letterSpacing: 2, multiplier: 0 },
        { text: "GRAND SULANJANA", font: "serif", weight: "bold", size: 36, y: 620, color: "text", letterSpacing: 8, multiplier: -0.15 },
        { text: "Sukabumi, Jawa Barat", font: "serif", style: "italic", size: 22, y: 670, color: "subtext", multiplier: -0.15 },
      ]
    },
    {
      id: "details2",
      background: "/flower1.png",
      elements: [
        { text: "Akad Nikah", font: "serif", weight: "bold", size: 36, y: 260, color: "accent", multiplier: 0.15 },
        { text: "Pukul 08.00 - 10.00 WIB", font: "sans", size: 20, y: 320, color: "text", opacity: 0.9, letterSpacing: 2, multiplier: 0.15 },
        { text: "Resepsi Pernikahan", font: "serif", weight: "bold", size: 36, y: 440, color: "accent", multiplier: 0 },
        { text: "Pukul 11.00 - 14.00 WIB", font: "sans", size: 20, y: 500, color: "text", opacity: 0.9, letterSpacing: 2, multiplier: 0 },
        { text: "GRAND SULANJANA", font: "serif", weight: "bold", size: 36, y: 620, color: "text", letterSpacing: 8, multiplier: -0.15 },
        { text: "Sukabumi, Jawa Barat", font: "serif", style: "italic", size: 22, y: 670, color: "subtext", multiplier: -0.15 },
      ]
    },
    {
      id: "closing",
      background: "/flower2.png",
      elements: [
        { 
          lines: [
            "Merupakan suatu kehormatan dan kebahagiaan bagi kami",
            "apabila Bapak/Ibu/Saudara/i berkenan hadir",
            "untuk memberikan do'a restu."
          ], 
          font: "serif", size: 26, y: 300, lineHeight: 50, color: "text", multiplier: 0.1 
        },
        { text: "Kami yang berbahagia,", font: "serif", style: "italic", size: 24, y: 550, color: "subtext", multiplier: -0.1 },
        { text: "Hana & Gufron", font: "serif", weight: "bold", size: 46, y: 620, color: "accent", multiplier: -0.1 },
      ]
    }
  ],
  
  // Decorative Elements
  decorations: {
    ornamentCount: 14,
    particleCount: 100,
    assets: {
      orchid: { type: "svg", multiplier: 0.5 },
      goldMotif: { type: "svg", multiplier: 0.3 },
      petal: { type: "svg" },
      // custom: { type: "url", url: "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=500&auto=format&fit=crop&bg=transparent" }
      custom: { type: "url", url: "https://picsum.photos/200/300?random=1" }
    }
  }
};
