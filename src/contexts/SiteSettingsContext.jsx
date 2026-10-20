import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utilits/axiosInstance";

const SiteSettingsContext = createContext(null);

const DEFAULTS = {
  primary: "#8CC0EB",
  accent: "#5B9BD5",
  text: "#14202C",
  bg: "#FFF9D2",
  cream: "#FFF9D2",
  peach: "#FFEBCC",
  skysoft: "#BFDDF0",
  logoUrl: "",
  brandName: "Lumora",
};

// Ready-made palette groups. Each click applies the whole set at once.
// `swatches` are the 4 colors shown in the preview bar; `values` maps them
// onto the theme keys (bg/cream = lightest, skysoft/peach = soft,
// primary/accent = vivid, text = darkest).
export const PALETTES = [
  {
    id: "sky",
    name: "Ocean Calm",
    swatches: ["#E3F2FD", "#90CAF9", "#2196F3", "#0D47A1"],
    values: {
      bg: "#E3F2FD",
      cream: "#E3F2FD",
      skysoft: "#90CAF9",
      peach: "#90CAF9",
      primary: "#2196F3",
      accent: "#2196F3",
      text: "#0D47A1",
    },
  },
  {
    id: "green",
    name: "Fresh Meadow",
    swatches: ["#EEFABD", "#A0D585", "#6984A9", "#263B6A"],
    values: {
      bg: "#EEFABD",
      cream: "#EEFABD",
      skysoft: "#A0D585",
      peach: "#A0D585",
      primary: "#6984A9",
      accent: "#6984A9",
      text: "#263B6A",
    },
  },
  {
    id: "sage",
    name: "Soft Sage",
    swatches: ["#E8F5BD", "#C7EABB", "#A2CB8B", "#84B179"],
    values: {
      bg: "#E8F5BD",
      cream: "#E8F5BD",
      skysoft: "#C7EABB",
      peach: "#C7EABB",
      primary: "#A2CB8B",
      accent: "#84B179",
      text: "#84B179",
    },
  },
  {
    id: "bloom",
    name: "Blossom",
    swatches: ["#F5D3C4", "#A7AAE1", "#F2AEBB", "#696FC7"],
    values: {
      bg: "#F5D3C4",
      cream: "#F5D3C4",
      skysoft: "#A7AAE1",
      peach: "#F2AEBB",
      primary: "#696FC7",
      accent: "#696FC7",
      text: "#696FC7",
    },
  },
];

// Map admin settings -> the CSS variables components reference.
function applyToDocument(settings) {
  const root = document.documentElement;
  if (settings.primary) root.style.setProperty("--lum-primary", settings.primary);
  if (settings.accent) root.style.setProperty("--lum-accent", settings.accent);
  if (settings.text) root.style.setProperty("--lum-text", settings.text);
  if (settings.bg) root.style.setProperty("--lum-bg", settings.bg);
  if (settings.cream) root.style.setProperty("--lum-cream", settings.cream);
  if (settings.peach) root.style.setProperty("--lum-peach", settings.peach);
  if (settings.skysoft) root.style.setProperty("--lum-skysoft", settings.skysoft);
  // keep the legacy gold in sync with accent for any leftover usages
  if (settings.accent)
    root.style.setProperty("--lum-legacy", settings.accent);
}

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    axiosInstance
      .get("/api/site-settings")
      .then(({ data }) => {
        if (!active) return;
        const merged = { ...DEFAULTS, ...data };
        setSettings(merged);
        applyToDocument(merged);
      })
      .catch((err) => {
        console.warn("Site settings load failed, using defaults:", err?.message);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // Expose a helper so admin pages can push live updates.
  const updateSettings = (next) => {
    const merged = { ...settings, ...next };
    setSettings(merged);
    applyToDocument(merged);
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    return { settings: DEFAULTS, loading: false, updateSettings: () => {} };
  }
  return ctx;
}
