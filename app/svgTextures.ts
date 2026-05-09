import { WEDDING_CONFIG } from './weddingConfig';

export const createSvgTexture = (svgString: string) => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
};

const escapeXml = (unsafe: string) => {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return c;
    }
  });
};

export const generateElementSvg = (element: any) => {
  const { 
    text, 
    lines, 
    font = 'serif', 
    style = 'normal', 
    weight = 'normal', 
    size = 24, 
    y = 400, 
    color = 'text', 
    letterSpacing = 0, 
    opacity = 1,
    lineHeight = 40
  } = element;

  const fontStack = font === 'serif' ? 'Georgia, serif' : 'Arial, sans-serif';
  const fillColor = (WEDDING_CONFIG.colors as any)[color] || color;

  let content = '';
  if (lines) {
    content = lines.map((line: string, i: number) => `
      <text 
        x="600" 
        y="${y + (i * lineHeight)}" 
        font-family="${fontStack}" 
        font-style="${style}" 
        font-weight="${weight}"
        font-size="${size}" 
        text-anchor="middle" 
        fill="${fillColor}" 
        opacity="${opacity}"
        letter-spacing="${letterSpacing}"
      >${escapeXml(line)}</text>
    `).join('');
  } else {
    content = `
      <text 
        x="600" 
        y="${y}" 
        font-family="${fontStack}" 
        font-style="${style}" 
        font-weight="${weight}"
        font-size="${size}" 
        text-anchor="middle" 
        fill="${fillColor}" 
        opacity="${opacity}"
        letter-spacing="${letterSpacing}"
      >${escapeXml(text)}</text>
    `;
  }

  return createSvgTexture(`
    <svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
      ${content}
    </svg>
  `);
};
