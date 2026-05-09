import { generateElementSvg, createSvgTexture } from './svgTextures';
import { WEDDING_CONFIG } from './weddingConfig';

// Backgrounds
export const backgroundTextures = WEDDING_CONFIG.slides.map(s => s.background);

// Slide Elements
export const slideElementTextures = WEDDING_CONFIG.slides.map(slide => 
  slide.elements.map(el => generateElementSvg(el))
);

// Decorative Textures
export const decorationTextures = {
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

  custom: WEDDING_CONFIG.decorations.assets.custom.url
};
