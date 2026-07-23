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
      ]
    },
    {
      id: "couples",
      background: "/background/02_were_getting_married.jpg",
      elements: [
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
      ]
    },
    {
      id: "bride",
      background: "/background/04&05 The Bride.JPG",
      elements: [
      ]
    },
    {
      id: "groom",
      background: "/background/04&05 The Bride.JPG",
      elements: [
      ]
    },
    {
      id: "daydate",
      background: "/background/06 Days Dates.JPG",
      bgHeightMultiplier: 0.5, // Adjust height of the background (e.g., 0.8 to shrink, 1.2 to stretch vertically)
      bgWidthMultiplier: 1.0,  // Adjust width of the background (e.g., 0.8 to shrink, 1.2 to stretch horizontally)
      elements: [
      ]
    },
    {
      id: "rundown",
      background: "/background/07AkadNikah2.jpg",
      elements: [
      ]
    },
    // {
    //   id: "dresscode",
    //   background: "/background/08&11 dresscode dan gift.JPG",
    //   bgHeightMultiplier: 0.5, // Adjust height of the background (e.g., 0.8 to shrink, 1.2 to stretch vertically)
    //   bgWidthMultiplier: 0.75,  // Adjust width of the background (e.g., 0.8 to shrink, 1.2 to stretch horizontally)
    //   elements: [
    //   ]
    // },
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
    // {
    //   id: "gift",
    //   background: "/background/09 Kata kata.JPG",
    //   bgHeightMultiplier: 0.8, // Adjust height of the background (e.g., 0.8 to shrink, 1.2 to stretch vertically)
    //   bgWidthMultiplier: 1,  // Adjust width of the background (e.g., 0.8 to shrink, 1.2 to stretch horizontally)
    //   elements: [
    //   ]
    // },
    {
      id: "thanks",
      background: "/background/12 logo.JPG",
      bgHeightMultiplier: 0.3, // Adjust height of the background (e.g., 0.8 to shrink, 1.2 to stretch vertically)
      bgWidthMultiplier: 1,  // Adjust width of the background (e.g., 0.8 to shrink, 1.2 to stretch horizontally)
      elements: [
      ]
    }
  ],
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
