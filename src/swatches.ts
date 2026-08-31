export const SWATCH_KEYS = ["green", "amber", "red", "indigo", "blue", "grey"] as const;

export type SwatchKey = (typeof SWATCH_KEYS)[number];

export interface SwatchPair {
  fg: string;
  bg: string;
}

export interface Swatch {
  key: SwatchKey;
  label: string;
  light: SwatchPair;
  dark: SwatchPair;
}

export const SWATCHES: Record<SwatchKey, Swatch> = {
  green: {
    key: "green",
    label: "Green",
    light: { fg: "#0F7A4F", bg: "#E6F4EC" },
    dark: { fg: "#5FD3A0", bg: "#0F2A20" },
  },
  amber: {
    key: "amber",
    label: "Amber",
    light: { fg: "#8A5A00", bg: "#FBF0DC" },
    dark: { fg: "#E0AC55", bg: "#2E2210" },
  },
  red: {
    key: "red",
    label: "Red",
    light: { fg: "#A32B21", bg: "#FBE9E7" },
    dark: { fg: "#F08A80", bg: "#301513" },
  },
  indigo: {
    key: "indigo",
    label: "Indigo",
    light: { fg: "#3727C8", bg: "#EFEDFB" },
    dark: { fg: "#8574F3", bg: "#1E1A3D" },
  },
  blue: {
    key: "blue",
    label: "Blue",
    light: { fg: "#12628F", bg: "#E3F1FA" },
    dark: { fg: "#6FBEE8", bg: "#0E2432" },
  },
  grey: {
    key: "grey",
    label: "Grey",
    light: { fg: "#61617A", bg: "#F0F0F5" },
    dark: { fg: "#9C9CB4", bg: "#22222E" },
  },
};

export function isSwatchKey(value: string): value is SwatchKey {
  return (SWATCH_KEYS as readonly string[]).includes(value);
}
