import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSiteSettings } from "../contexts/SiteSettingsContext";

export const Logo = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("storage", handleThemeChange);

    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  // Admin-configured logo wins; else the embedded default asset.
  const logoSrc = settings.logoUrl
    ? settings.logoUrl
    : theme === "dark"
      ? "logo-dark-theme-Photoroom.png"
      : "logo-white-theme-Photoroom.png";

  return (
    <motion.div
      className="flex items-center cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <img
        className="w-32 h-auto"
        src={logoSrc}
        alt={settings.brandName}
      />
    </motion.div>
  );
};