import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import axios from "../utilits/axiosInstance";
import {
  FiStar,
  FiArrowRight,
  FiCheck,
  FiShield,
  FiZap,
  FiAward,
  FiHeart,
  FiMapPin,
  FiClock,
  FiMessageSquare,
  FiSearch,
  FiEdit3,
  FiCalendar,
  FiDollarSign,
  FiGrid,
  FiHome,
  FiBriefcase,
  FiGift,
  FiSmile,
  FiUsers,
  FiSun,
  FiBookmark,
  FiX,
} from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Home = () => {
  const [services, setServices] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardRefs = useRef([]);
  const stepsRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  /* GSAP scroll reveal for the How-It-Works milestone steps */
  useEffect(() => {
    if (!stepsRef.current) return;
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray(".hiw-step");
      gsap.set(steps, { opacity: 0, y: 28 });
      gsap.to(steps, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.18,
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 78%",
        },
      });
      gsap.fromTo(
        ".hiw-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 80%",
          },
        }
      );
    }, stepsRef);
    return () => ctx.revert();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, decoratorsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/services?limit=8`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/decorators`),
      ]);
      setServices(servicesRes.data.services || []);
      setDecorators(decoratorsRes.data.slice(0, 8) || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ── Hero (centered editorial, no image banner) ───────────── */
  const Hero = () => (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--lum-cream)]/60 via-white to-[var(--lum-skysoft)]/30">
      {/* soft blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="soft-blob bg-[var(--lum-primary)] w-[28rem] h-[28rem] -top-32 -right-24 opacity-25" />
        <div className="soft-blob bg-[var(--lum-peach)] w-[26rem] h-[26rem] -bottom-40 -left-24 opacity-50" />
        <div className="soft-blob bg-[var(--lum-skysoft)] w-80 h-80 top-1/3 left-1/3 opacity-25" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-28 pb-24">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[var(--lum-primary)]/40 text-[var(--lum-accent)] text-sm font-medium shadow-[0_2px_10px_rgba(140,192,235,0.15)] mb-8"
        >
          <FiZap size={14} />
          Trusted by 500+ happy clients
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] text-[var(--lum-text)]"
        >
          Beautiful spaces,
          <br />
          <span className="bg-gradient-to-r from-[var(--lum-primary)] via-[var(--lum-accent)] to-[#3E7CB1] bg-clip-text text-transparent">
            effortlessly designed
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-7 text-lg text-[var(--lum-text)]/60 max-w-xl mx-auto leading-relaxed"
        >
          Lumora brings professional home, wedding and event decoration to
          Dhaka — curated by expert decorators, delivered with care.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] text-white shadow-[0_10px_28px_rgba(140,192,235,0.45)] hover:shadow-[0_14px_36px_rgba(140,192,235,0.55)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Explore Services
            <FiArrowRight size={18} />
          </Link>
          <Link
            to="/coverage-map"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border border-[var(--lum-primary)]/50 text-[var(--lum-accent)] hover:bg-[var(--lum-primary)]/10 transition-all duration-300"
          >
            <FiMapPin size={18} />
            Check Coverage
          </Link>
        </motion.div>

        {/* value strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-[var(--lum-text)]/55"
        >
          {[
            { Icon: FiShield, label: "Quality Guaranteed" },
            { Icon: FiZap, label: "Fast Delivery" },
            { Icon: FiAward, label: "Expert Team" },
            { Icon: FiHeart, label: "Made With Love" },
          ].map((v, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              <v.Icon className="text-[var(--lum-accent)]" size={18} />
              {v.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );

  /* ── Stats (editorial band with dividers) ────────────── */
  const StatsBar = () => (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="soft-blob bg-[var(--lum-skysoft)] w-96 h-96 -top-24 -right-20 opacity-25" />
        <div className="soft-blob bg-[var(--lum-peach)] w-96 h-96 -bottom-24 -left-20 opacity-30" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white/55 backdrop-blur-xl border border-[var(--lum-primary)]/20 rounded-[2rem] shadow-[0_20px_50px_rgba(140,192,235,0.14)] divide-y md:divide-y-0 md:divide-x divide-[var(--lum-primary)]/15">
          {[
            { num: "250+", label: "Events Styled" },
            { num: "12+", label: "Years of Craft" },
            { num: "98%", label: "Happy Clients" },
            { num: "45+", label: "Decorators" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="px-6 py-9 text-center"
            >
              <div className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
                {s.num}
              </div>
              <div className="mt-2 text-[13px] font-medium uppercase tracking-wider text-[var(--lum-text)]/50">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ── Events We Cover (glass chips) ───────────────────── */
  const EventsWeCover = () => (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="soft-blob bg-[var(--lum-primary)] w-[24rem] h-[24rem] top-0 right-0 opacity-20" />
        <div className="soft-blob bg-[var(--lum-cream)] w-[20rem] h-[20rem] bottom-0 left-0 opacity-50" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-[var(--lum-accent)] uppercase tracking-wider">
            For every moment
          </span>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[var(--lum-text)]">
            Events we{" "}
            <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
              cover
            </span>
          </h2>
          <p className="mt-3 text-[var(--lum-text)]/55 max-w-xl mx-auto">
            Not just weddings — Lumora styles any space that deserves to feel special.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: FiGift, label: "Weddings" },
            { icon: FiHome, label: "Home interiors" },
            { icon: FiSmile, label: "Birthdays" },
            { icon: FiBriefcase, label: "Corporate" },
            { icon: FiUsers, label: "Anniversaries" },
            { icon: FiSun, label: "Festivals" },
          ].map((e, i) => {
            const Icon = e.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col items-center gap-3 px-4 py-7 rounded-3xl bg-white/55 backdrop-blur-xl border border-white/60 shadow-[0_12px_34px_rgba(140,192,235,0.12)] hover:-translate-y-1 hover:bg-white/75 hover:shadow-[0_18px_44px_rgba(140,192,235,0.20)] transition-all duration-300"
              >
                <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--lum-primary)] to-[var(--lum-accent)] flex items-center justify-center shadow-[0_8px_20px_rgba(94,155,213,0.35)] group-hover:scale-105 transition-transform">
                  <Icon size={24} className="text-white" />
                </span>
                <span className="text-[14px] font-semibold text-[var(--lum-text)]">{e.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );

  /* ── Upcoming Live Events (booking — no payment) ──────── */
  const LIVE_EVENTS = [
    { id: 1, title: "Grand Wedding Expo 2026", venue: "Pan Pacific Sonargaon", city: "Dhaka", date: "Sep 12, 2026", time: "11:00 AM", seats: 24, tag: "Wedding" },
    { id: 2, title: "Festive Home Styling Live", venue: "Lumora Studio, Gulshan", city: "Dhaka", date: "Sep 20, 2026", time: "04:00 PM", seats: 18, tag: "Home" },
    { id: 3, title: "Birthday Theme Showcase", venue: "Conrad Ballroom", city: "Dhaka", date: "Oct 03, 2026", time: "02:30 PM", seats: 31, tag: "Birthday" },
    { id: 4, title: "Corporate Launch Preview", venue: "Le Méridien", city: "Dhaka", date: "Oct 15, 2026", time: "06:00 PM", seats: 12, tag: "Corporate" },
  ];

  const UpcomingLiveEvents = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [seat, setSeat] = useState("");
    const [done, setDone] = useState(false);

    const openBooking = (ev) => {
      setSelected(ev);
      setSeat("");
      setDone(false);
      setOpen(true);
    };

    const confirmSeat = (e) => {
      e.preventDefault();
      if (!seat) return;
      setDone(true);
    };

    return (
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="soft-blob bg-[var(--lum-skysoft)] w-[26rem] h-[26rem] -top-20 -left-16 opacity-25" />
          <div className="soft-blob bg-[var(--lum-peach)] w-[22rem] h-[22rem] -bottom-20 -right-16 opacity-35" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
          >
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--lum-accent)] uppercase tracking-wider">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--lum-accent)] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--lum-accent)]" />
                </span>
                Live &amp; Upcoming
              </span>
              <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[var(--lum-text)]">
                Upcoming{" "}
                <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
                  live events
                </span>
              </h2>
              <p className="mt-3 text-[var(--lum-text)]/55 max-w-xl">
                Join a Lumora showcase near you. Reserve a seat — no payment needed, just book your spot.
              </p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 self-start md:self-auto rounded-full bg-[var(--lum-text)] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[var(--lum-text)]/85 transition"
            >
              View all events <FiArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {LIVE_EVENTS.map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group flex flex-col p-6 rounded-3xl bg-white/55 backdrop-blur-xl border border-white/60 shadow-[0_14px_38px_rgba(140,192,235,0.12)] hover:-translate-y-1 hover:bg-white/75 hover:shadow-[0_20px_48px_rgba(140,192,235,0.20)] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--lum-accent)] bg-[var(--lum-primary)]/15 px-2.5 py-1 rounded-full">
                    {ev.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--lum-text)]/45">
                    <FiUsers size={14} /> {ev.seats} seats
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--lum-text)] leading-snug">{ev.title}</h3>
                <div className="mt-3 space-y-1.5 text-sm text-[var(--lum-text)]/55">
                  <p className="flex items-center gap-2"><FiMapPin size={15} className="text-[var(--lum-accent)]" /> {ev.venue}, {ev.city}</p>
                  <p className="flex items-center gap-2"><FiCalendar size={15} className="text-[var(--lum-accent)]" /> {ev.date}</p>
                  <p className="flex items-center gap-2"><FiClock size={15} className="text-[var(--lum-accent)]" /> {ev.time}</p>
                </div>
                <button
                  onClick={() => openBooking(ev)}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] text-white px-4 py-2.5 text-sm font-semibold shadow-[0_8px_20px_rgba(94,155,213,0.35)] hover:shadow-[0_12px_28px_rgba(94,155,213,0.45)] transition"
                >
                  <FiBookmark size={15} /> Book your seat
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[var(--lum-text)]/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl border border-[var(--lum-primary)]/20"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-[var(--lum-text)]/40 hover:text-[var(--lum-text)] transition"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
              {done ? (
                <div className="text-center py-6">
                  <div className="mx-auto w-14 h-14 rounded-full bg-[var(--lum-primary)]/20 flex items-center justify-center mb-4">
                    <FiCheck size={26} className="text-[var(--lum-accent)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--lum-text)]">Seat reserved!</h3>
                  <p className="mt-2 text-sm text-[var(--lum-text)]/55">
                    Your spot for <span className="font-semibold">{selected.title}</span> is held. We'll confirm details by email shortly.
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--lum-text)] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[var(--lum-text)]/85 transition"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--lum-accent)]">
                    Book your seat
                  </span>
                  <h3 className="mt-1 text-2xl font-bold text-[var(--lum-text)]">{selected.title}</h3>
                  <p className="mt-2 text-sm text-[var(--lum-text)]/55 flex items-center gap-2">
                    <FiMapPin size={15} className="text-[var(--lum-accent)]" /> {selected.venue}, {selected.city}
                  </p>
                  <p className="text-sm text-[var(--lum-text)]/55 flex items-center gap-2">
                    <FiCalendar size={15} className="text-[var(--lum-accent)]" /> {selected.date} · {selected.time}
                  </p>
                  <form onSubmit={confirmSeat} className="mt-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-[var(--lum-text)]">Your name</label>
                      <input
                        type="text"
                        required
                        value={seat}
                        onChange={(e) => setSeat(e.target.value)}
                        placeholder="e.g. Famid Khandoker"
                        className="mt-1.5 w-full rounded-2xl border border-[var(--lum-primary)]/30 bg-[var(--lum-cream)]/40 px-4 py-3 text-sm text-[var(--lum-text)] outline-none focus:border-[var(--lum-accent)] focus:ring-2 focus:ring-[var(--lum-primary)]/30"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] text-white px-4 py-3 text-sm font-semibold shadow-[0_8px_20px_rgba(94,155,213,0.35)] hover:shadow-[0_12px_28px_rgba(94,155,213,0.45)] transition"
                    >
                      <FiBookmark size={16} /> Confirm seat
                    </button>
                    <p className="text-center text-xs text-[var(--lum-text)]/40">No payment required — just reserve your spot.</p>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </section>
    );
  };

  /* ── Services (bento, no card grid) ───────────────────────── */
  const ServicesSection = () => (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-[var(--lum-accent)] uppercase tracking-wider">
              What we do
            </span>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[var(--lum-text)]">
              Services crafted for{" "}
              <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
                every occasion
              </span>
            </h2>
          </motion.div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-[var(--lum-primary)]/50 text-[var(--lum-accent)] hover:bg-[var(--lum-primary)]/10 transition-all shrink-0"
          >
            View All
            <FiArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden bg-[#F2F8FD]"
              >
                <Skeleton height={i % 3 === 0 ? 320 : 200} borderRadius={24} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-4 auto-rows-[200px] gap-5">
            {services.map((service, index) => {
              const feature = index % 5 === 0;
              const handleEnter = () => {
                if (cardRefs.current[index])
                  gsap.to(cardRefs.current[index], {
                    y: -8,
                    boxShadow: "0 30px 60px rgba(94,155,213,0.3)",
                    duration: 0.5,
                    ease: "power3.out",
                  });
              };
              const handleLeave = () => {
                if (cardRefs.current[index])
                  gsap.to(cardRefs.current[index], {
                    y: 0,
                    boxShadow: "0 10px 30px rgba(140,192,235,0.12)",
                    duration: 0.5,
                    ease: "power3.out",
                  });
              };

              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={feature ? "md:col-span-2 md:row-span-2" : ""}
                >
                  <Link to={`/services/${service._id}`} className="block h-full">
                    <div
                      ref={(el) => (cardRefs.current[index] = el)}
                      onMouseEnter={handleEnter}
                      onMouseLeave={handleLeave}
                      className="group relative h-full min-h-[200px] rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(140,192,235,0.12)] border border-[var(--lum-primary)]/15"
                      style={{ boxShadow: "0 10px 30px rgba(140,192,235,0.12)" }}
                    >
                      <img
                        src={
                          service.image ||
                          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
                        }
                        alt={service.service_name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--lum-text)]/80 via-[var(--lum-text)]/20 to-transparent" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <span className="self-start px-3 py-1 rounded-full bg-white/90 text-[var(--lum-accent)] text-xs font-semibold mb-3">
                          {service.service_category}
                        </span>
                        <h3
                          className={`font-bold text-white ${feature ? "text-3xl" : "text-xl"
                            }`}
                        >
                          {service.service_name}
                        </h3>
                        {feature && (
                          <p className="text-white/75 text-sm mt-2 line-clamp-2 max-w-md">
                            {service.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-3 text-white">
                          <span className="font-bold text-lg">
                            BDT {service.cost}
                          </span>
                          <span className="text-white/70 text-sm">
                            /{service.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );

  /* ── How it works (horizontal steps) ──────────────────────── */
  const HowItWorksSection = () => (
    <section className="py-24 bg-gradient-to-br from-[var(--lum-skysoft)]/30 via-white to-[var(--lum-cream)]/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-[var(--lum-accent)] uppercase tracking-wider">
            Simple process
          </span>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[var(--lum-text)]">
            How it{" "}
            <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
              works
            </span>
          </h2>
          <p className="mt-3 text-[var(--lum-text)]/55 max-w-xl mx-auto">
            From first idea to the finished room — four calm steps.
          </p>
        </motion.div>

        <div ref={stepsRef} className="relative">
          {/* connector line */}
          <div className="hiw-line absolute top-9 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--lum-primary)] via-[var(--lum-accent)] to-[var(--lum-primary)] origin-left hidden md:block" />

          <div className="grid md:grid-cols-4 gap-8 md:gap-6">
            {[
              { step: "01", icon: FiSearch, title: "Choose", text: "Pick the decoration package that fits your moment." },
              { step: "02", icon: FiCalendar, title: "Book", text: "Schedule a time that works for you in a few taps." },
              { step: "03", icon: FiEdit3, title: "Customize", text: "Shape the look with our expert decorators." },
              { step: "04", icon: FiSmile, title: "Enjoy", text: "Relax while we bring the vision to life." },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="hiw-step relative text-center">
                  <div className="relative z-10 mx-auto w-18 h-18 rounded-full bg-gradient-to-br from-[var(--lum-primary)] to-[var(--lum-accent)] flex items-center justify-center shadow-[0_12px_30px_rgba(94,155,213,0.4)] ring-8 ring-white">
                    <Icon size={28} className="text-white" />
                  </div>
                  <span className="mt-5 block text-3xl font-bold text-[var(--lum-primary)]/40">
                    {s.step}
                  </span>
                  <h3 className="text-xl font-bold text-[var(--lum-text)] mt-1">{s.title}</h3>
                  <p className="text-[var(--lum-text)]/55 text-sm mt-2 leading-relaxed max-w-[15rem] mx-auto">
                    {s.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );

  /* ── Decorators (horizontal scroll) ───────────────────────── */
  const DecoratorsSection = () => (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col items-center text-center gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-[var(--lum-accent)] uppercase tracking-wider">
              The people
            </span>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[var(--lum-text)]">
              Meet our{" "}
              <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
                decorators
              </span>
            </h2>
          </motion.div>
          <Link
            to="/decorators"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-[var(--lum-primary)]/50 text-[var(--lum-accent)] hover:bg-[var(--lum-primary)]/10 transition-all"
          >
            All Decorators
            <FiArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center">
          {decorators.map((d, i) => (
            <motion.div
              key={d._id}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="w-full max-w-[240px] bg-white rounded-3xl p-6 text-center shadow-[0_12px_36px_rgba(140,192,235,0.14)] border border-[var(--lum-primary)]/15 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(140,192,235,0.22)] transition-all duration-300"
            >
              <img
                src={d.photoURL || "https://i.ibb.co/3YRjQxv/user.png"}
                alt={d.displayName}
                className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-[var(--lum-primary)]/30"
              />
              <h3 className="text-lg font-bold text-[var(--lum-text)] mt-4">
                {d.displayName}
              </h3>
              <p className="text-sm text-[var(--lum-text)]/55">
                {d.specialty || "Professional Decorator"}
              </p>
              <div className="flex items-center justify-center gap-1 mt-3">
                {[...Array(5)].map((_, k) => (
                  <FiStar key={k} className="text-[var(--lum-primary)] fill-[var(--lum-primary)]" size={14} />
                ))}
                <span className="text-xs text-[var(--lum-text)]/55 ml-1">(4.9)</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ── Testimonials (clean cards) ───────────────────────────── */
  const TestimonialsSection = () => (
    <section className="py-24 bg-gradient-to-br from-[var(--lum-cream)]/40 via-white to-[var(--lum-skysoft)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-[var(--lum-accent)] uppercase tracking-wider">
            Loved by clients
          </span>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[var(--lum-text)]">
            What people{" "}
            <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
              say
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Tasmia Azam Neeti", role: "Wedding Client", img: "https://i.pravatar.cc/150?img=1", text: "Lumora made our wedding day absolutely magical! The attention to detail was incredible." },
            { name: "Famid Khandoker", role: "Corporate Event", img: "https://i.pravatar.cc/150?img=2", text: "Professional service and stunning results. Our office event was a huge success!" },
            { name: "Ryin Akand", role: "Home Decoration", img: "https://i.pravatar.cc/150?img=3", text: "They transformed my home beautifully. Highly recommend their services!" },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/80 backdrop-blur rounded-3xl p-7 border border-[var(--lum-primary)]/20 shadow-[0_12px_36px_rgba(140,192,235,0.12)]"
            >
              <FiMessageSquare className="text-[var(--lum-primary)] mb-4" size={28} />
              <p className="text-[var(--lum-text)]/70 leading-relaxed">{t.text}</p>
              <div className="flex items-center gap-3 mt-6">
                <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-[var(--lum-text)]">{t.name}</h4>
                  <p className="text-sm text-[var(--lum-text)]/55">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ── Coverage map ─────────────────────────────────────────── */
  const CoverageMapSection = () => (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-[var(--lum-accent)] uppercase tracking-wider">
              Where we work
            </span>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[var(--lum-text)]">
              Service{" "}
              <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
                coverage
              </span>
            </h2>
            <p className="mt-4 text-[var(--lum-text)]/60 max-w-md leading-relaxed">
              We provide decoration services across Dhaka and surrounding areas.
              Explore the map to see where we operate.
            </p>
            <Link
              to="/coverage-map"
              className="inline-flex items-center gap-2 mt-7 px-7 py-3.5 rounded-full text-sm font-semibold bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] text-white shadow-[0_10px_28px_rgba(140,192,235,0.45)] hover:-translate-y-0.5 transition-all"
            >
              View full map
              <FiArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-[420px] rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(94,155,213,0.25)] border border-[var(--lum-primary)]/20"
          >
            <MapContainer
              center={[23.8103, 90.4125]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={[23.8103, 90.4125]}>
                <Popup>
                  <div className="text-center">
                    <strong>Lumora HQ</strong>
                    <br />
                    Dhaka, Bangladesh
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );

  /* ── FAQ (clean accordion) ────────────────────────────────── */
  const FaqSection = () => (
    <section className="py-24 bg-gradient-to-br from-[var(--lum-skysoft)]/30 via-white to-[var(--lum-cream)]/40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-[var(--lum-accent)] uppercase tracking-wider">
            Good to know
          </span>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[var(--lum-text)]">
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
              questions
            </span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {[
            { q: "How far in advance should I book?", a: "We recommend booking at least 2–4 weeks in advance for regular events and 2–3 months for weddings." },
            { q: "Do you provide customization options?", a: "Yes! We work closely with you to customize every aspect of your decoration to match your vision." },
            { q: "What areas do you serve?", a: "We currently serve Dhaka and surrounding areas. Check our coverage map for specific locations." },
            { q: "What is your cancellation policy?", a: "Cancellations made 7 days before the event receive a full refund. Within 7 days, a 50% fee applies." },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="collapse collapse-plus bg-white shadow-[0_10px_30px_rgba(140,192,235,0.1)] rounded-2xl border border-[var(--lum-primary)]/15"
            >
              <input type="radio" name="faq" />
              <div className="collapse-title text-lg font-semibold text-[var(--lum-text)]">
                {f.q}
              </div>
              <div className="collapse-content">
                <p className="text-[var(--lum-text)]/60">{f.a}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ── CTA banner ───────────────────────────────────────────── */
  const CtaSection = () => (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[var(--lum-primary)] via-[var(--lum-accent)] to-[#3E7CB1] px-8 py-16 sm:px-16 text-center shadow-[0_30px_70px_rgba(94,155,213,0.4)]"
        >
          <div className="absolute -top-20 -right-16 w-72 h-72 bg-white/15 rounded-full blur-2xl" />
          <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Ready to transform your space?
            </h2>
            <p className="mt-4 text-white/85 text-lg">
              Book a decorator today and let us create something unforgettable.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full text-sm font-semibold bg-white text-[#3E7CB1] shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              Get Started
              <FiArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );

  return (
    <div>
      <Hero />
      <StatsBar />
      <ServicesSection />
      <EventsWeCover />
      <HowItWorksSection />
      <UpcomingLiveEvents />
      <DecoratorsSection />
      <TestimonialsSection />
      <CoverageMapSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
};

export default Home;
