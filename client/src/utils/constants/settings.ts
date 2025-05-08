// src/utils/constants/settings.ts

export const COLORS = {
    html: 0xff6600,
    css: 0x00ccff,
    text: 0xffffff,
    background: 0x101010,
    grid: 0x444444,
    wireframe: 0x0000ff
  }
  
  export const LABEL = {
    font: '28px Arial',
    color: '#ffffff',
    background: '#000000'
  }
  
  export const GEOMETRY = {
    node: {
      size: 2,
      spacing: 4,
      verticalGap: 4
    },
    arrow: {
      width: 0.05,
      headSize: 0.3,
      colorHtml: COLORS.html,
      colorCss: COLORS.css
    }
  }
  
  export const PANEL = {
    width: 3,
    height: 1.5,
    offsetZ: -2
  }
  