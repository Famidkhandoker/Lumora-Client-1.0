import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
} from "react-icons/fi";
import { Logo } from "./Logo";

const Footer = () => {
  const services = [
    { to: "/services", label: "Home Decoration" },
    { to: "/services", label: "Wedding" },
    { to: "/services", label: "Birthday" },
    { to: "/services", label: "Corporate" },
  ];

  const company = [
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
    { to: "/decorators", label: "Decorators" },
    { to: "/coverage-map", label: "Coverage Map" },
  ];

  return (
    <footer className="bg-gradient-to-br from-[var(--lum-cream)]/50 via-white to-[var(--lum-skysoft)]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top: brand + links + contact */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          {/* Brand */}
          <div className="max-w-sm">
            <Logo />
            <p className="text-[var(--lum-text)]/60 leading-relaxed mt-4">
              Transform your spaces into extraordinary experiences with our
              professional decoration services across Dhaka.
            </p>
            <div className="flex items-center gap-2 mt-6">
              {[
                { Icon: FiFacebook, label: "Facebook" },
                { Icon: FiInstagram, label: "Instagram" },
                { Icon: FiTwitter, label: "Twitter" },
              ].map(({ Icon, label }, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 grid place-items-center rounded-full bg-white shadow-[0_4px_12px_rgba(140,192,235,0.18)] text-[var(--lum-accent)] hover:bg-[var(--lum-primary)] hover:text-white transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h4 className="text-sm font-semibold text-[var(--lum-text)] uppercase tracking-wider mb-4">
                Services
              </h4>
              <ul className="space-y-3">
                {services.map((s, i) => (
                  <li key={i}>
                    <Link
                      to={s.to}
                      className="text-[var(--lum-text)]/60 hover:text-[var(--lum-accent)] transition-colors"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--lum-text)] uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                {company.map((c, i) => (
                  <li key={i}>
                    <Link
                      to={c.to}
                      className="text-[var(--lum-text)]/60 hover:text-[var(--lum-accent)] transition-colors"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact card */}
          <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-[0_14px_40px_rgba(140,192,235,0.16)] border border-[var(--lum-primary)]/20 w-full max-w-xs">
            <h4 className="text-sm font-semibold text-[var(--lum-text)] uppercase tracking-wider mb-4">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-sm text-[var(--lum-text)]/65">
              <li className="flex items-center gap-3">
                <FiPhone className="text-[var(--lum-accent)]" size={16} />
                +880 1234-567890
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-[var(--lum-accent)]" size={16} />
                info@lumora.com
              </li>
              <li className="flex items-center gap-3">
                <FiMapPin className="text-[var(--lum-accent)]" size={16} />
                Dhaka, Bangladesh
              </li>
              <li className="flex items-center gap-3">
                <FiClock className="text-[var(--lum-accent)]" size={16} />
                Mon–Fri, 9am–8pm
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-[var(--lum-primary)]/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--lum-text)]/50">
            <p>© 2026 Lumora. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/" className="hover:text-[var(--lum-accent)] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/" className="hover:text-[var(--lum-accent)] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
          <p className="mt-4 text-xs text-[var(--lum-text)]/40 leading-relaxed">
            Lumora is a proprietary decoration-booking platform. All brand names,
            service marks, and imagery shown are the property of their respective
            owners and are used for demonstration purposes only. This site and its
            contents are provided "as is" without warranty of any kind. Unauthorized
            copying, redistribution, or commercial use is strictly prohibited.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
