/* eslint no-cond-assign: 0 */
const rHex = /^\s*#([A-Fa-f0-9]{2})([A-f0-A-Fa-f0-9]{2})([A-Fa-f0-9]{2})\s*$/i;
const rHexShort = /^\s*#([A-Fa-f0-9])([A-Fa-f0-9])([A-Fa-f0-9])\s*$/i;

function luminance(colStr) {
  let m;
  let r;
  let g;
  let b;

  if ((m = (rHex.exec(colStr) || rHexShort.exec(colStr)))) {
    [r, g, b] = m.slice(1).map(v => parseInt(v.length === 1 ? v + v : v, 16));
  } else if ((m = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(colStr))) {
    [, r, g, b] = m.map(v => parseInt(v, 10));
  } else if ((m = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d(\.\d+)?)\s*\)$/i.exec(colStr))) {
    [, r, g, b] = m.map(v => parseInt(v, 10));
  } else {
    return 0;
  }

  // https://www.w3.org/TR/WCAG20/#relativeluminancedef
  const [sR, sG, sB] = [r, g, b].map(v => v / 255);
  const [R, G, B] = [sR, sG, sB].map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

const MAX_SIZE = 1000;

export default function colorFn({
  dark = '#404040',
  light = '#ffffff',
} = {}) {
  let cache = {};
  let n = 0;

  const darkColorLuminance = luminance(dark);
  const lightColorLuminance = luminance(light);

  return {
    getBestContrastColor(colorString) {
      if (!cache[colorString]) {
        if (n > MAX_SIZE) {
          cache = {};
          n = 0;
        }
        const L = luminance(colorString);

        // https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html#contrast-ratiodef
        const lightContrast = (Math.max(L, lightColorLuminance) + 0.05) / (Math.min(L, lightColorLuminance) + 0.05);
        const darkContrast = (Math.max(L, darkColorLuminance) + 0.05) / (Math.min(L, darkColorLuminance) + 0.05);
        cache[colorString] = lightContrast > darkContrast ? light : dark;
        n++;
      }
      return cache[colorString];
    },
  };
}
