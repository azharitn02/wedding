/**
 * Wedding Story Configuration
 * Edit this file to change the text, images, and layout of the wedding parallax.
 */

export const WEDDING_CONFIG = {
  // Global settings
  pages: 12,
  scrollMode: "strict", // "strict" (page-by-page lock) or "smooth" (momentum-based snap)
  transitionSpeed: 0.5, // Slide transition speed. Lower values (e.g. 0.1) are faster, higher values (e.g. 0.4) are slower.
  musicStartSecond: 0, // Start background music at this second
  colors: {
    text: "#F8F3ED",
    text2: "#4B182B",
    accent: "#D4AF37",
    subtext: "#A8B8A6",
    selection: "#4B182B",
    background: "#0A120D",
  },
  
  // Slide Content
  slides: [
    {
      id: "intro",
      background: "/background/01_cover.jpg",
      elements: [
        // { text: "you're invited", font: "zapfino", style: "normal", size: 160, x: 600, y: 125, color: "text2", letterSpacing: 2, multiplier: 0.15 },
        // { text: "to our wedding", font: "serif", style: "italic", size: 30, x: 600, y: 380, color: "text2", letterSpacing: 2, multiplier: -0.05 },
        // { text: "Qonita", font: "serif", weight: "bold", size: 65, x: 600, y: 480, color: "text2", multiplier: 0.1 },
        // { text: "and", font: "serif", size: 30, x: 600, y: 550, color: "text2", multiplier: 0.05 },
        // { text: "Bagja", font: "serif", weight: "bold", size: 65, x: 600, y: 620, color: "text2", multiplier: 0.1 },
      ]
    },
    {
      id: "couples",
      background: "/background/02_were_getting_married.jpg",
      elements: [
        // { text: "We're Getting Married", font: "serif", style: "italic", size: 40, y: 340, color: "text", multiplier: 0.2 },
        // { text: "JUNE 6, 2026", font: "sans", size: 24, y: 440, color: "accent", letterSpacing: 10, multiplier: 0.05 },
        // { text: "Qonita & Bagja", font: "serif", size: 60, y: 540, color: "text", multiplier: -0.15 },
      ]
    },
    // {
    //   id: "announcement",
    //   background: "/background/02_were_getting_married.jpg",
    //   elements: [
    //     { text: "We're Getting Married", font: "serif", style: "italic", size: 40, y: 340, color: "text", multiplier: 0.2 },
    //     { text: "JUNE 6, 2026", font: "sans", size: 24, y: 440, color: "accent", letterSpacing: 10, multiplier: 0.05 },
    //     { text: "Qonita & Bagja", font: "serif", size: 60, y: 540, color: "text", multiplier: -0.15 },
    //   ]
    // },
    {
      id: "quote",
      background: "/background/12 logo.JPG",
      bgHeightMultiplier: 0.5, // Adjust height of the background (e.g., 0.8 to shrink, 1.2 to stretch vertically)
      bgWidthMultiplier: 1.0,  // Adjust width of the background (e.g., 0.8 to shrink, 1.2 to stretch horizontally)
      elements: [
        // { text: "QS. AR-RUM AYAT 21", font: "serif", weight: "bold", size: 28, y: 300, color: "accent", letterSpacing: 8, multiplier: 0.15 },
        // { 
        //   lines: [
        //     "\"Dan di antara tanda-tanda (kebesaran)-Nya",
        //     "ialah Dia menciptakan pasangan-pasangan untukmu",
        //     "dari jenismu sendiri...\""
        //   ], 
        //   font: "serif", style: "italic", size: 28, y: 400, lineHeight: 60, color: "text", multiplier: -0.05 
        // },
      ]
    },
    {
      id: "bride",
      background: "/background/04&05 The Bride.JPG",
      elements: [
        // { text: "THE BRIDE", font: "sans", size: 20, y: 220, color: "subtext", letterSpacing: 8, multiplier: 0.2 },
        // { text: "Qonita", font: "serif", weight: "bold", size: 80, y: 340, color: "text", multiplier: 0.15 },
        // { text: "Putri dari", font: "serif", style: "italic", size: 22, y: 440, color: "subtext", multiplier: -0.1 },
        // { text: "Bapak Nama Bapak & Ibu Nama Ibu", font: "serif", size: 70, y: 500, color: "text", multiplier: -0.15 },
        // { text: "@qonitaaf_", font: "serif", size: 100, y: 820, color: "text", multiplier: -0.15, link: 'https://www.instagram.com/qonitaaf_?igsh=MWh6cDg4eWtvZjZtcQ%3D%3D&utm_source=qr' },
      ]
    },
    {
      id: "groom",
      background: "/background/04&05 The Bride.JPG",
      elements: [
        // { text: "THE GROOM", font: "sans", size: 20, y: 220, color: "subtext", letterSpacing: 8, multiplier: 0.2 },
        // { text: "Bagja", font: "serif", weight: "bold", size: 80, y: 340, color: "text", multiplier: 0.15 },
        // { text: "Putra dari", font: "serif", style: "italic", size: 22, y: 440, color: "subtext", multiplier: -0.1 },
        // { text: "Bapak Nama Bapak & Ibu Nama Ibu", font: "serif", size: 20, y: 500, color: "text", multiplier: -0.15 },
      ]
    },
    {
      id: "daydate",
      background: "/background/06 Days Dates.JPG",
      bgHeightMultiplier: 0.5, // Adjust height of the background (e.g., 0.8 to shrink, 1.2 to stretch vertically)
      bgWidthMultiplier: 1.0,  // Adjust width of the background (e.g., 0.8 to shrink, 1.2 to stretch horizontally)
      elements: [
        // { text: "COUNTING DOWN", font: "sans", size: 20, y: 280, color: "subtext", letterSpacing: 8, multiplier: 0.2 },
        // { text: "To the big day", font: "serif", style: "italic", size: 40, y: 360, color: "text", multiplier: 0.1 },
        // { text: "06 . 06 . 2026", font: "serif", size: 70, y: 500, color: "accent", multiplier: -0.15 },
      ]
    },
    {
      id: "rundown",
      background: "/background/07 Akad Nikah….JPG",
      elements: [
      ]
    },
    {
      id: "dresscode",
      background: "/background/08&11 dresscode dan gift.JPG",
      bgHeightMultiplier: 0.5, // Adjust height of the background (e.g., 0.8 to shrink, 1.2 to stretch vertically)
      bgWidthMultiplier: 0.75,  // Adjust width of the background (e.g., 0.8 to shrink, 1.2 to stretch horizontally)
      elements: [
      ]
    },
    {
      id: "stories",
      background: "/background/09 Kata kata.JPG",
      elements: [
      ]
    },
    //slide10 rsvp and ucapan
    {
      id: "rsvp",
      background: "/background/10 RSVP.JPG",
      elements: [
      ]
    },
    {
      id: "gift",
      background: "/background/09 Kata kata.JPG",
      bgHeightMultiplier: 0.5, // Adjust height of the background (e.g., 0.8 to shrink, 1.2 to stretch vertically)
      bgWidthMultiplier: 1,  // Adjust width of the background (e.g., 0.8 to shrink, 1.2 to stretch horizontally)
      elements: [
      ]
    },
    {
      id: "thanks",
      background: "/background/12 logo.JPG",
      bgHeightMultiplier: 0.3, // Adjust height of the background (e.g., 0.8 to shrink, 1.2 to stretch vertically)
      bgWidthMultiplier: 1,  // Adjust width of the background (e.g., 0.8 to shrink, 1.2 to stretch horizontally)
      elements: [
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

export const getAssetPath = (path: string): string => {
  if (!path) return '';
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  // Normalize the path so it starts with a leading slash if it's local
  let normalizedPath = path;
  if (!path.startsWith('/') && !path.startsWith('http') && !path.startsWith('data:')) {
    normalizedPath = '/' + path;
  }
  
  if (basePath && normalizedPath.startsWith('/') && !normalizedPath.startsWith(basePath)) {
    return `${basePath}${normalizedPath}`;
  }
  return normalizedPath;
};
