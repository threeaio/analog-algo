import { HSLColor, getHSLFromProperty, toHexString, toHSLString } from './color-utils';

// Type-safe color names based on our CSS variables
export type ThemeColorName = 
  | 'green'
  | 'red'
  | 'redAggressive'
  | 'redDark'
  | 'blue'
  | 'white'
  | 'paper'
  | 'gray'
  | 'grayDarker'
  | 'grayDarkest'
  | 'black';

// Mapping between color names and their CSS variable names
const colorMap: Record<ThemeColorName, string> = {
  green: '--color-3a-green',
  red: '--color-3a-red',
  redAggressive: '--color-3a-red-aggressive',
  redDark: '--color-3a-red-dark',
  blue: '--color-3a-blue',
  white: '--color-3a-white',
  paper: '--color-3a-paper',
  gray: '--color-3a-gray',
  grayDarker: '--color-3a-gray-darker',
  grayDarkest: '--color-3a-gray-darkest',
  black: '--color-3a-black',
};

interface ColorFormats {
  hsl: HSLColor;
  cssHsl: string;
  hex: string;
}

/**
 * Gets all available formats for a theme color
 * @param colorName - Name of the theme color
 * @returns Object containing the color in different formats
 * @throws Error if the color value cannot be retrieved
 */
export function getThemeColor(colorName: ThemeColorName): ColorFormats {
  const color = getHSLFromProperty(colorMap[colorName]);
  if (!color) {
    throw new Error(`Failed to get color value for theme color: ${colorName}`);
  }

  return {
    hsl: color,
    cssHsl: toHSLString(color),
    hex: toHexString(color),
  };
}

/**
 * Gets the HSL format of a theme color
 * @param colorName - Name of the theme color
 * @returns HSLColor object
 * @throws Error if the color value cannot be retrieved
 */
export function getThemeColorHSL(colorName: ThemeColorName): HSLColor {
  const color = getHSLFromProperty(colorMap[colorName]);
  if (!color) {
    throw new Error(`Failed to get HSL value for theme color: ${colorName}`);
  }
  return color;
}

/**
 * Gets the hex format of a theme color
 * @param colorName - Name of the theme color
 * @returns Hex color string
 * @throws Error if the color value cannot be retrieved
 */
export function getThemeColorHex(colorName: ThemeColorName): string {
  const color = getHSLFromProperty(colorMap[colorName]);
  if (!color) {
    throw new Error(`Failed to get HEX value for theme color: ${colorName}`);
  }
  return toHexString(color);
}

/**
 * Gets the CSS HSL format of a theme color
 * @param colorName - Name of the theme color
 * @returns CSS HSL color string
 * @throws Error if the color value cannot be retrieved
 */
export function getThemeColorCSSHsl(colorName: ThemeColorName): string {
  const color = getHSLFromProperty(colorMap[colorName]);
  if (!color) {
    throw new Error(`Failed to get CSS HSL value for theme color: ${colorName}`);
  }
  return toHSLString(color);
}

// Type-safe object containing all theme colors
export const themeColors: Record<ThemeColorName, ColorFormats> = Object.keys(colorMap).reduce((acc, key) => {
  const colorName = key as ThemeColorName;
  return {
    ...acc,
    [colorName]: getThemeColor(colorName)
  };
}, {} as Record<ThemeColorName, ColorFormats>); 