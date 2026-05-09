import { createSvgTexture } from './svgTextures';

export const textures = {
  background: createSvgTexture(`<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg"><rect width="1024" height="1024" fill="#0E1A11"/></svg>`),
  envelopeBack: createSvgTexture(`<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="600" fill="#2E0E1A" rx="10"/></svg>`),
  envelopeFront: createSvgTexture(`<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><path d="M0,600 L0,150 L400,350 L800,150 L800,600 Z" fill="#4B182B"/><path d="M0,600 L400,300 L800,600 Z" fill="#3D1323"/></svg>`),
  envelopeFlap: createSvgTexture(`<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 L800,0 L400,350 Z" fill="#4B182B" stroke="#3D1323" stroke-width="4"/></svg>`),
  card: createSvgTexture(`<svg width="720" height="520" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="520" fill="#F8F3ED" rx="8"/><rect width="680" height="480" x="20" y="20" fill="none" stroke="#D3C5C1" stroke-width="2" stroke-dasharray="5,5" rx="8"/></svg>`),
  floral: createSvgTexture(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><path d="M100,50 Q150,0 200,50 Q150,100 100,50 Z" fill="#FCDFE6" opacity="0.9"/><path d="M100,50 Q50,0 0,50 Q50,100 100,50 Z" fill="#FAEEF1" opacity="0.9"/><circle cx="100" cy="50" r="10" fill="#E8B4C8"/></svg>`),
  ornamentStar: createSvgTexture(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M50,0 Q60,40 100,50 Q60,60 50,100 Q40,60 0,50 Q40,40 50,0 Z" fill="#E8B4C8" opacity="0.6"/></svg>`),
  ornamentLeaf: createSvgTexture(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M50,0 Q100,50 50,100 Q0,50 50,0 Z" fill="#A8B8A6" opacity="0.6"/></svg>`)
};
