export interface HSLColor {
  hue: number;
  saturation: number;
  lightness: number;
}

/**
 * Parses an HSL string from CSS custom property format into an HSLColor object
 * @param hslString - String in format "346 100% 69.8%"
 */
export function parseHSL(hslString: string): HSLColor | null {
  try {
    const [hue, saturationStr, lightnessStr] = hslString.trim().split(/\s+/);
    
    if (!hue || !saturationStr || !lightnessStr) {
      return null;
    }

    const saturation = parseFloat(saturationStr);
    const lightness = parseFloat(lightnessStr);

    if (isNaN(saturation) || isNaN(lightness)) {
      return null;
    }

    return {
      hue: parseFloat(hue),
      saturation,
      lightness,
    };
  } catch {
    return null;
  }
}

/**
 * Gets an HSL color value from a CSS custom property
 * @param propertyName - CSS custom property name (e.g., "--color-3a-red")
 */
export function getHSLFromProperty(propertyName: string): HSLColor | null {
  if (typeof window === 'undefined') throw new Error('Window is not defined');
  
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(propertyName)
    .trim();
  
  return parseHSL(value);
}

/**
 * Converts an HSLColor object to a CSS-compatible HSL string
 * @param color - HSLColor object
 * @returns string in format "hsl(346, 100%, 69.8%)"
 */
export function toHSLString(color: HSLColor): string {
  return `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
}

/**
 * Converts an HSLColor object to a CSS custom property compatible string
 * @param color - HSLColor object
 * @returns string in format "346 100% 69.8%"
 */
export function toCSSCustomPropertyString(color: HSLColor): string {
  return `${color.hue} ${color.saturation}% ${color.lightness}%`;
}

/**
 * Converts an HSLColor object to a HEX color string
 * @param color - HSLColor object
 * @returns string in format "#RRGGBB"
 */
export function toHexString(color: HSLColor): string {
  // Convert HSL to RGB first
  const h = color.hue;
  const s = color.saturation / 100;
  const l = color.lightness / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  // Convert RGB to hex
  const toHex = (n: number): string => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
} 