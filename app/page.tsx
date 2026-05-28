"use client";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  type TargetAndTransition,
} from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Shield,
  Users,
  MapPin,
  TrendingUp,
  Star,
} from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

/* ─── Images ──────────────────────────────────────────────────── */
const IMG = {
  serviceCredit:
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=700&q=80",
  serviceSavings:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=700&q=80",
  impact: "../other/impact 1.jpeg",
  t1: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=120&q=80",
  t2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  t3: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
};

/* ─── Hero slideshow ───────────────────────────────────────────── */
type TransitionType = "fade" | "slideRight" | "zoomIn";
const heroSlides: {
  src: string;
  kenFrom: TargetAndTransition;
  kenTo: TargetAndTransition;
  transition: TransitionType;
}[] = [
  {
    src: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1600&q=85",
    kenFrom: { scale: 1.1, x: "2%" },
    kenTo: { scale: 1, x: "0%" },
    transition: "fade",
  },
  {
    src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80",
    kenFrom: { scale: 1, x: "0%" },
    kenTo: { scale: 1.08, x: "-2%" },
    transition: "slideRight",
  },
  {
    src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=80",
    kenFrom: { scale: 1.12, y: "-1.5%" },
    kenTo: { scale: 1, y: "1%" },
    transition: "zoomIn",
  },
  {
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80",
    kenFrom: { scale: 1, y: "1%" },
    kenTo: { scale: 1.07, y: "-1%" },
    transition: "fade",
  },
  {
    src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
    kenFrom: { scale: 1.06, x: "-1.5%", y: "1%" },
    kenTo: { scale: 1, x: "1%", y: "-1%" },
    transition: "slideRight",
  },
];
const slideVariants: Record<
  TransitionType,
  {
    enter: TargetAndTransition;
    center: TargetAndTransition;
    exit: TargetAndTransition;
  }
> = {
  fade: {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideRight: {
    enter: { opacity: 0, x: "100%" },
    center: { opacity: 1, x: "0%" },
    exit: { opacity: 0, x: "-20%" },
  },
  zoomIn: {
    enter: { opacity: 0, scale: 1.15 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.92 },
  },
};

/* ─── Animated counter ─────────────────────────────────────────── */
function Counter({
  target,
  suffix = "",
  start,
}: {
  target: number;
  suffix?: string;
  start: boolean;
}) {
  const n = useCountUp(target, 2200, start);
  return (
    <>
      {n.toLocaleString()}
      {suffix}
    </>
  );
}

/* ─── Stat pill that triggers count-up when visible ───────────── */
function StatPill({
  value,
  num,
  suffix,
  label,
}: {
  value?: string;
  num?: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="flex flex-col gap-1">
      <div className="text-white text-2xl sm:text-3xl font-bold tabular-nums">
        {num !== undefined ? (
          <Counter target={num} suffix={suffix ?? ""} start={inView} />
        ) : (
          value
        )}
      </div>
      <div className="text-white/45 text-xs tracking-wide">{label}</div>
    </div>
  );
}

/* ─── Word-by-word headline ────────────────────────────────────── */
const headline = ["Your", "Trusted", "Financial", "Growth", "Partner"];
const headlineAccent = ["in", "Ethiopia."];

/* ─── Services ─────────────────────────────────────────────────── */
const services = [
  {
    title: "Credit Services",
    desc: "Flexible loans for businesses, farmers, and entrepreneurs — designed around Ethiopia's real economy.",
    href: "/credit",
    img: IMG.serviceCredit,
    tags: ["Business Loans", "Agriculture", "Micro-Enterprise", "Emergency"],
  },
  {
    title: "Savings Services",
    desc: "Build lasting wealth with competitive interest rates and disciplined savings products for every goal.",
    href: "/savings",
    img: IMG.serviceSavings,
    tags: ["Regular Savings", "Fixed Deposit", "Goal Savings", "Group Savings"],
  },
];

/* ─── Principles ───────────────────────────────────────────────── */
const principles = [
  {
    icon: Shield,
    title: "Regulated & Trusted",
    desc: "Licensed by the National Bank of Ethiopia, backed by 10+ years of responsible lending.",
  },
  {
    icon: Users,
    title: "Customer-Centred",
    desc: "Every product is designed around the real lives of Ethiopian entrepreneurs and families.",
  },
  {
    icon: MapPin,
    title: "Locally Present",
    desc: "20+ branches spanning Addis Ababa and regional cities across Ethiopia.",
  },
  {
    icon: TrendingUp,
    title: "Growth-Focused",
    desc: "We measure our success by the financial progress of the communities we serve.",
  },
];

/* ─── Testimonials ─────────────────────────────────────────────── */
const testimonials = [
  {
    quote:
      "Nisir MFI understood my business when banks wouldn't open the door. The loan changed everything for my Business",
    name: "Yohannes Haile",
    role: "Barber Shop owner, Addis Ababa",
    img: IMG.t1,
  },
  {
    quote:
      "The agriculture loan covered my seeds and a water pump. This season I harvested twice what I expected.",
    name: "Bekele Tesema",
    role: "Farmer, Adama",
    img: IMG.t2,
  },
  {
    quote:
      "Goal savings gave me the discipline I needed. Within 18 months I had capital to open my restaurant.",
    name: "Meron Alemu",
    role: "Restaurant owner, Hawassa",
    img: IMG.t3,
  },
];

/* ─── Impact stat cell (needs its own ref for inView hook) ────── */
function ImpactStat({
  num,
  suffix,
  label,
}: {
  num: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div
      ref={ref}
      className="bg-white/5 p-8 hover:bg-white/8 transition-colors"
    >
      <div className="text-3xl font-bold text-white mb-2">
        <Counter target={num} suffix={suffix} start={inView} />
      </div>
      <div className="text-white/40 text-xs">{label}</div>
    </div>
  );
}

/* ─── Animation variants ───────────────────────────────────────── */
const easeOut = [0.22, 1, 0.36, 1] as const;

const slideInUp = {
  hidden: { opacity: 0, y: 28, x: -16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: easeOut },
  }),
};

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const [slideIdx, setSlideIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setSlideIdx((i) => (i + 1) % heroSlides.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);

  const currentSlide = heroSlides[slideIdx];

  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════
          HERO — fullscreen image slideshow
      ═══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden flex items-end"
      >
        {/* ── Slideshow background ── */}
        <AnimatePresence mode="sync">
          <motion.div
            key={slideIdx}
            className="absolute inset-0"
            initial={slideVariants[currentSlide.transition].enter}
            animate={slideVariants[currentSlide.transition].center}
            exit={slideVariants[currentSlide.transition].exit}
            transition={{
              duration: currentSlide.transition === "fade" ? 1.4 : 1.0,
              ease: easeOut,
            }}
          >
            <motion.div
              className="absolute inset-0 scale-110"
              style={{ y: bgY }}
              initial={currentSlide.kenFrom}
              animate={currentSlide.kenTo}
              transition={{ duration: 6.5, ease: "linear" }}
            >
              <img
                src={currentSlide.src}
                alt="Nisir MFI"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a52] via-[#0d1a52]/65 to-[#22348A]/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a52]/60 via-transparent to-transparent pointer-events-none" />

        {/* Dot-grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* ── Text content — overlaid on the slideshow ── */}
        <div className="relative w-full pb-24 pt-32">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <motion.div
              style={{ y: textY }}
              className="max-w-3xl flex flex-col"
            >
              {/* Trust badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 self-start border border-white/20 bg-white/8 backdrop-blur-sm rounded-full px-4 py-2 mb-10"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/80 text-xs font-medium tracking-wide">
                  A Treasure For All!
                </span>
              </motion.div>

              {/* Headline — word by word */}
              <h1 className="display-text text-white text-5xl sm:text-6xl lg:text-7xl leading-[1.08] mb-4">
                {headline.map((word, i) => (
                  <motion.span
                    key={word}
                    className="inline-block mr-[0.25em]"
                    initial={{ opacity: 0, y: 40, rotateX: -30 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      delay: 0.1 + i * 0.1,
                      duration: 0.65,
                      ease: easeOut,
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
                <br />
                {headlineAccent.map((word, i) => (
                  <motion.span
                    key={word}
                    className={`inline-block mr-[0.25em] ${i === 1 ? "text-[#BCBDC1]" : "text-white"}`}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.6 + i * 0.1,
                      duration: 0.65,
                      ease: easeOut,
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: 0.85,
                  duration: 0.5,
                  ease: easeOut,
                }}
                className="h-px w-16 bg-[#BCBDC1] origin-left mb-6"
              />

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl"
              >
                Serving over 20,000 Ethiopian entrepreneurs, farmers, and
                families since 2014 through accessible credit and savings
                solutions.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.05, duration: 0.5 }}
                className="flex flex-wrap gap-4 mb-14"
              >
                <Link href="/apply">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 bg-white text-[#22348A] text-sm font-bold px-7 py-3.5 rounded-full cursor-pointer shadow-lg"
                  >
                    Apply for a Loan <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
                <Link href="/savings">
                  <motion.div
                    whileHover={{
                      scale: 1.03,
                      backgroundColor: "rgba(255,255,255,0.1)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 border border-white/30 text-white text-sm font-medium px-7 py-3.5 rounded-full cursor-pointer"
                  >
                    Open Savings Account
                  </motion.div>
                </Link>
              </motion.div>

              {/* Inline stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-white/15 max-w-lg"
              >
                <StatPill num={20000} suffix="+" label="Active Customers" />
                <StatPill num={10} suffix="+" label="Years of Service" />
                <StatPill num={20} suffix="+" label="Branch Offices" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ── Slide dots + scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-8 sm:px-12"
        >
          {/* Dots */}
          <div className="flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIdx(i)}
                className="relative h-1 rounded-full overflow-hidden transition-all duration-300 cursor-pointer"
                style={{
                  width: i === slideIdx ? "2rem" : "0.5rem",
                  background:
                    i === slideIdx
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>
          {/* Scroll cue */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-white/35" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SERVICES WITH IMAGES
      ═══════════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInUp}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16"
          >
            <div>
              <span className="divider-accent mb-5 block" />
              <h2 className="display-text text-[#22348A] text-3xl sm:text-4xl">
                Financial solutions built
                <br className="hidden sm:block" /> for Ethiopians
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              We bridge the gap between informal lending and conventional
              banking.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {services.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -36 : 36, y: 18 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.15,
                  duration: 0.65,
                  ease: easeOut,
                }}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:shadow-xl transition-shadow duration-500"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <motion.img
                    src={svc.img}
                    alt={svc.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: easeOut }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#22348A]/80 via-[#22348A]/20 to-transparent" />
                  <div className="absolute bottom-5 left-6">
                    <h3 className="display-text text-white text-2xl">
                      {svc.title}
                    </h3>
                  </div>
                </div>
                {/* Body */}
                <div className="p-7">
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">
                    {svc.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {svc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#f0f3fc] text-[#22348A] text-xs font-medium px-3 py-1.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={svc.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="inline-flex items-center gap-2 text-[#22348A] text-sm font-bold cursor-pointer"
                    >
                      Explore {svc.title} <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHY NISIR — PANEL GRID
      ═══════════════════════════════════════════════════ */}
      <section className="py-28 bg-[#f0f3fc]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInUp}
            className="mb-14"
          >
            <span className="divider-accent mb-5 block" />
            <h2 className="display-text text-[#22348A] text-3xl sm:text-4xl">
              Why Nisir MFI?
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden border border-gray-200">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -28 : 28, y: 16 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ backgroundColor: "#f8f9fe" }}
                className="bg-white p-8 transition-colors"
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="w-11 h-11 rounded-xl bg-[#f0f3fc] flex items-center justify-center mb-5"
                >
                  <p.icon className="w-5 h-5 text-[#22348A]" />
                </motion.div>
                <h3 className="font-bold text-[#22348A] mb-3 text-sm">
                  {p.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          IMPACT — image bg + animated counters
      ═══════════════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden">
        {/* Background image with parallax */}
        <div className="absolute inset-0">
          <img
            src={IMG.impact}
            alt="Impact"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0d1a52]/88" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInUp}
              className=""
            >
              <span className="block w-8 h-px bg-[#BCBDC1] mb-6" />
              <h2 className="display-text text-white text-3xl sm:text-4xl mb-5">
                A decade of real impact
                <br />
                across Ethiopia
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-8">
                Since 2014, we have disbursed financing to thousands of
                businesses and individuals in communities often overlooked by
                conventional finance. Our growth reflects the trust our
                customers place in us.
              </p>
              <Link href="/about">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="inline-flex items-center gap-2 border border-white/25 text-white text-sm font-medium px-6 py-3 rounded-full cursor-pointer hover:bg-white/8 transition-colors"
                >
                  Our Story <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30, y: 12 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: easeOut }}
              className="grid grid-cols-2 gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/10"
            >
              <ImpactStat num={94} suffix="%" label="Loan disbursement rate" />
              <ImpactStat num={96} suffix="%" label="Customer satisfaction" />
              <ImpactStat num={92} suffix="%" label="Repayment performance" />
              <ImpactStat num={88} suffix="%" label="MSME coverage rate" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInUp}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-14"
          >
            <div>
              <span className="divider-accent mb-5 block" />
              <h2 className="display-text text-[#22348A] text-3xl sm:text-4xl">
                Trusted by thousands
              </h2>
            </div>
            <Link href="/testimonials">
              <motion.div
                whileHover={{ x: 4 }}
                className="inline-flex items-center gap-2 text-[#22348A] text-sm font-bold cursor-pointer shrink-0"
              >
                All stories <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -32 : 32, y: 18 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.12,
                  duration: 0.6,
                  ease: easeOut,
                }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 16px 40px rgba(34,52,138,0.10)",
                }}
                className="border border-gray-100 rounded-2xl p-7 transition-all duration-300 bg-white"
              >
                <div className="text-[#22348A] text-5xl font-serif leading-none opacity-15 mb-3">
                  "
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic mb-7">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-[#f0f3fc]"
                  />
                  <div>
                    <div className="font-bold text-[#22348A] text-sm">
                      {t.name}
                    </div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden bg-[#0d1a52]">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -right-40 -top-40 w-[500px] h-[500px] rounded-full border border-white/5 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -right-20 -top-20 w-[300px] h-[300px] rounded-full border border-white/5 pointer-events-none"
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInUp}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10"
          >
            <div className="max-w-xl">
              <h2 className="display-text text-white text-3xl sm:text-4xl mb-4">
                Ready to take the next step?
              </h2>
              <p className="text-white/50 text-sm leading-relaxed">
                Apply for a loan or open a savings account today. Our team will
                review your application within 48 hours.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              <Link href="/apply">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white text-[#22348A] text-sm font-bold px-7 py-3.5 rounded-full cursor-pointer shadow-lg shadow-white/10"
                >
                  Apply for a Loan <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
              <Link href="/contact">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="inline-flex items-center gap-2 border border-white/25 text-white text-sm font-medium px-7 py-3.5 rounded-full cursor-pointer hover:bg-white/8 transition-colors"
                >
                  Speak to an Advisor
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
