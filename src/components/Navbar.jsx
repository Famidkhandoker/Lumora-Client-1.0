import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX, FiArrowRight } from "react-icons/fi";
import { auth } from "../utilits/firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";
import { Logo } from "./Logo";

const navLinks = [
  { to: "/services", label: "Services" },
  { to: "/coverage-map", label: "Coverage" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenu(false);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <nav
          className={`flex items-center justify-between gap-4 rounded-full px-3.5 py-1.5 transition-all duration-300 ${scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(94,155,213,0.18)] border border-[var(--lum-primary)]/25"
            : "bg-white/50 backdrop-blur-md border border-transparent"
            }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Logo />
          </Link>

          {/* Center pill links (desktop) */}
          <div className="hidden lg:flex items-center gap-1 bg-[#F2F8FD] rounded-full p-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-1 rounded-full text-sm font-medium transition-all ${isActive
                    ? "bg-white text-[var(--lum-accent)] shadow-sm"
                    : "text-[var(--lum-text)]/55 hover:text-[var(--lum-text)]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] text-white shadow-[0_4px_14px_rgba(140,192,235,0.45)] hover:shadow-[0_8px_22px_rgba(140,192,235,0.55)] transition-all"
              >
                Dashboard
                <FiArrowRight size={15} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] text-white shadow-[0_4px_14px_rgba(140,192,235,0.45)] hover:shadow-[0_8px_22px_rgba(140,192,235,0.55)] transition-all"
              >
                Sign In
                <FiArrowRight size={15} />
              </Link>
            )}

            <button
              onClick={() => setMobileMenu((v) => !v)}
              className="lg:hidden w-9 h-9 grid place-items-center rounded-full bg-[#F2F8FD] text-[var(--lum-text)]"
              aria-label="Toggle menu"
            >
              {mobileMenu ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden mt-2 bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(94,155,213,0.2)] border border-[var(--lum-primary)]/25 p-4"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-2xl text-sm font-medium transition-all ${isActive
                      ? "bg-[var(--lum-primary)]/15 text-[var(--lum-accent)]"
                      : "text-[var(--lum-text)]/70 hover:bg-[#F2F8FD]"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[var(--lum-primary)]/20">
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] text-white"
                >
                  Dashboard
                  <FiArrowRight size={16} />
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] text-white"
                >
                  Sign In
                  <FiArrowRight size={16} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
