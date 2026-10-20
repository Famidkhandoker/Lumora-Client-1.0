import { useSiteSettings } from "../contexts/SiteSettingsContext";

export const LogoDark = () => {
  const { settings } = useSiteSettings();
  const logoSrc = settings.logoUrl || "logo-dark-theme-Photoroom.png";
  return (
    <img
      className="w-28 h-auto"
      src={logoSrc}
      alt={settings.brandName}
    />
  );
};
