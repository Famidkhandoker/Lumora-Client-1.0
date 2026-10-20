import { useEffect, useState } from "react";
import axiosInstance from "../utilits/axiosInstance";
import { FiX } from "react-icons/fi";

const SESSION_KEY = "lumora_promo_seen";

const PromoModal = () => {
  const [promo, setPromo] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only show once per browser session.
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let active = true;
    axiosInstance
      .get("/api/promotions/active")
      .then(({ data }) => {
        if (!active || !data) return;
        setPromo(data);
        setOpen(true);
        sessionStorage.setItem(SESSION_KEY, data._id || "1");
      })
      .catch(() => {
        /* no active promo or offline — silently skip */
      });
    return () => {
      active = false;
    };
  }, []);

  if (!open || !promo) return null;

  const close = () => setOpen(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={close}
      />

      {/* card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-[var(--lum-skysoft)]">
        <button
          onClick={close}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-[var(--lum-text)] hover:bg-[var(--lum-peach)] transition"
          aria-label="Close"
        >
          <FiX size={18} />
        </button>

        {promo.imageUrl && (
          <img
            src={promo.imageUrl}
            alt={promo.title}
            className="h-44 w-full object-cover"
          />
        )}

        <div className="p-6 text-center">
          <span className="inline-block rounded-full bg-[var(--lum-peach)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--lum-text)]">
            Special Offer
          </span>
          <h3 className="mt-3 text-xl font-bold text-[var(--lum-text)]">
            {promo.title}
          </h3>
          {promo.message && (
            <p className="mt-2 text-sm leading-relaxed text-[var(--lum-text)]/70">
              {promo.message}
            </p>
          )}

          {promo.ctaLink ? (
            <a
              href={promo.ctaLink}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-block w-full rounded-xl bg-[var(--lum-accent)] px-5 py-3 font-semibold text-white transition hover:opacity-90"
            >
              {promo.ctaText || "Learn more"}
            </a>
          ) : (
            <button
              onClick={close}
              className="mt-5 inline-block w-full rounded-xl bg-[var(--lum-accent)] px-5 py-3 font-semibold text-white transition hover:opacity-90"
            >
              {promo.ctaText || "Got it"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoModal;
