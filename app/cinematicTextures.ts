import { generateElementSvg, createSvgTexture } from './svgTextures';
import { WEDDING_CONFIG, getAssetPath } from './weddingConfig';

// Backgrounds
export const backgroundTextures = WEDDING_CONFIG.slides.map(s => getAssetPath(s.background));

// Slide Elements
export const slideElementTextures = WEDDING_CONFIG.slides.map(slide => 
  slide.elements.map(el => generateElementSvg(el))
);

// Decorative Textures (Raw definitions)
const rawDecorationTextures = {
  orchid: createSvgTexture(`<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <path d="M200,200 Q250,80 320,120 Q380,250 200,200 Z" fill="#F8F3ED" opacity="0.95"/>
    <path d="M200,200 Q150,80 80,120 Q20,250 200,200 Z" fill="#F1EBE4" opacity="0.95"/>
    <path d="M200,200 Q80,280 120,350 Q250,380 200,200 Z" fill="#FAF5F0" opacity="0.95"/>
    <path d="M200,200 Q320,280 280,350 Q150,380 200,200 Z" fill="#EAE2DA" opacity="0.9"/>
    <path d="M200,200 Q180,150 200,160 Q220,150 200,200 Z" fill="#D4AF37" opacity="0.8"/>
    <circle cx="200" cy="205" r="12" fill="#C59B27"/>
  </svg>`),

  goldMotif: createSvgTexture(`<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <path d="M150,10 L165,135 L290,150 L165,165 L150,290 L135,165 L10,150 L135,135 Z" fill="#D4AF37" opacity="0.7"/>
    <path d="M150,40 L160,140 L260,150 L160,160 L150,260 L140,160 L40,150 L140,140 Z" fill="#F8F3ED" opacity="0.3"/>
    <circle cx="150" cy="150" r="90" fill="none" stroke="#D4AF37" stroke-width="1.5" opacity="0.5" stroke-dasharray="6,6"/>
  </svg>`),

  petal: createSvgTexture(`<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
    <path d="M32,10 Q45,32 32,54 Q19,32 32,10 Z" fill="#F8F3ED" opacity="0.8"/>
    <circle cx="32" cy="32" r="28" fill="url(#gradGlow)" opacity="0.2"/>
    <defs>
      <radialGradient id="gradGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#F8F3ED"/>
        <stop offset="100%" stop-color="#F8F3ED" stop-opacity="0"/>
      </radialGradient>
    </defs>
  </svg>`),

  custom: WEDDING_CONFIG.decorations.assets.custom.url,
  bunga1: "/Bunga1.png",
  bunga2: "/Bunga2.png",
  bunga3: "/Bunga3.png",
  //slides1
  logo1 : "/background/logo.png",
  text11: "/slide1/Tulisan1.png",
  text12: "/slide1/Tulisan2.png",
  text13: "/slide1/Tulisan3.png",
  text14: "/slide1/Tulisan4.png",
  text15: "/slide1/Tulisan5.png",
  //slides2
  text21: "/slide2/Tulisan1.png",
  text22: "/slide2/Tulisan2.png",
  text23: "/slide2/Tulisan3.png",
  border2: "/slide2/border.png",
  couple2: "/slide2/couple.png",
  //slides3
  surah3: "/slide3/surah.png",
  terjemah3: "/slide3/terjemah.png",
  //slides4
  bride4: "slide4/IMG_0823.PNG",
  text41: "slide4/Tulisan1.png",
  text42: "slide4/Tulisan2.png",
  text43: "slide4/Tulisan3.png",
  //slides5
  bride5: "slide5/IMG_0824.PNG",
  text51: "slide5/Tulisan1.png",
  text52: "slide5/Tulisan2.png",
  text53: "slide5/Tulisan3.png",
  //slides6
  border6: "slide6/border.PNG",
  text61: "slide6/Tulisan1.png",
  text62: "slide6/Tulisan2.png",
  //slides7
  text71: "slide7/Tulisan1.png",
  text72: "slide7/Tulisan2.png",
  text7Akad: "slide7/1akad nikah/Tulisan1.png",
  text7AkadTgl: "slide7/1akad nikah/Tulisan2.png",
  text7Resepsi: "slide7/2resepsi/Tulisan1.png",
  text7ResepsiTgl: "slide7/2resepsi/Tulisan2.png",
  text7Alamat: "slide7/3Alamat/Tulisan1.png",
  text7AlamatJln: "slide7/3Alamat/Tulisan2.png",
  //slides8
  text81: "slide8/Tulisan1.png",
  text82: "slide8/Tulisan2.png",
  palette8: "slide8/IMG_0836.PNG",
  //slides9
  text91: "slide9/Tulisan1.png",
  text92: "slide9/Tulisan2.png",
  text93: "slide9/Tulisan3.png",
  text94: "slide9/Tulisan4.png",
  image91: "slide9/image1.PNG",
  image92: "slide9/image2.PNG",
  //slides10
  text111: "slide11/Tulisan1.png",
  //slides12
  text121: "slide12/Tulisan1.png",
  text122: "slide12/Tulisan2.png",
  //slides13
  logo131: "slide13/logo.png",
};

// Process paths automatically with getAssetPath
export const decorationTextures = (() => {
  const processed = { ...rawDecorationTextures } as any;
  for (const key in processed) {
    const val = processed[key];
    if (typeof val === 'string' && !val.trim().startsWith('<svg')) {
      processed[key] = getAssetPath(val);
    }
  }
  return processed as typeof rawDecorationTextures;
})();
