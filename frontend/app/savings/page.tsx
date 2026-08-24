"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import SavingsStackSection from "../components/SavingsStackSection";

const IMG = {
  hero: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80",
  regular:
    "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=600&q=80",
  fixed:
    "https://images.unsplash.com/photo-1565514020179-026b92b2d70b?auto=format&fit=crop&w=600&q=80",
  goal: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?auto=format&fit=crop&w=600&q=80",
  group:
    "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=600&q=80",
};

const products = [

  {
    title: "Regular Savings",
    tagline: "Your daily savings, growing steadily",
    color: "from-emerald-900 to-emerald-950",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    benefits: ["Interest rate of 10%", "500 Minimum Balance", "Instant withdrawals"]
  },
  {
    title: "Fixed Time Deposit",
    tagline: "Lock in guaranteed returns",
    color: "from-blue-900 to-blue-950",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    benefits: ["Rate Starting From 12%", "Flexible tenures 6 Months-1 Year", "Premature withdrawal option"]

  },
  {
    title: "Child Savings 'Maleda'",
    tagline: "Secure their tomorrow, today",
    color: "from-purple-900 to-purple-950",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    benefits: ["11% interest rate"]

  },
  {
    title: "Women's Savings 'Alem'",
    tagline: "Designed for her financial independence",
    color: "from-rose-900 to-rose-950",
    border: "border-rose-500/30",
    iconColor: "text-rose-400",
    benefits: ["11% Interest Rate"]

  },
  {
    title: "Elderly Savings 'Efoy'",
    tagline: "Retire with dignity and comfort",
    color: "from-amber-900 to-amber-950",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    benefits: ["Highest interest tier at 11%"]
  },
  {
    title: "Disability Savings 'Yichalal'",
    tagline: "Walk with Nisir",
    color: "from-purple-900 to-purple-950",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    benefits: ["11% interest rate"]
  }
];

const reasons = [
  {
    title: "NBE Regulated",
    desc: "All deposits are protected under Ethiopian financial law and supervised by the National Bank of Ethiopia.",
  },
  {
    title: "Competitive Rates",
    desc: "Earn among Ethiopia's highest savings interest rates, with no lock-in required on regular savings.",
  },
  {
    title: "Easy Access",
    desc: "Access through any branch, our network of agents, or our digital banking platform.",
  },
  {
    title: "Loan Priority",
    desc: "Active Nisir savers receive preferred consideration when applying for credit products.",
  },
  {
    title: "No Hidden Fees",
    desc: "Fully transparent fee structure. We will never charge what we have not clearly disclosed.",
  },
  {
    title: "Financial Habit",
    desc: "Our products build lasting financial discipline — not just a one-time deposit.",
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.55, ease: easeOut },
  }),
};

export default function Savings() {
  return (
    <div className="overflow-x-clip ">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[75vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={IMG.hero}
            alt="Savings"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a52] via-[#0d1a52]/65 to-[#22348A]/30" />
        </div>
        <div className="relative max-w-[95%] mx-auto px-5 sm:px-8 lg:px-12 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="block w-8 h-px bg-[#BCBDC1] mb-6" />
            <h1 className="display-text text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-5">
              Savings Services
            </h1>
            <p className="text-white/55 text-lg max-w-xl leading-relaxed mb-8">
              From everyday deposits to fixed-term investments — designed to
              grow your wealth and open doors to the financial future you
              deserve.
            </p>
            <Link href="/contact">
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="inline-flex items-center gap-2 bg-white text-[#22348A] text-sm font-bold px-7 py-3.5 rounded-full cursor-pointer w-fit"
              >
                Open an Account <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      {/*
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-14"
          >
            <span className="divider-accent mb-5 block" />
            <h2 className="display-text text-[#22348A] text-3xl sm:text-4xl">
              Savings Products
            </h2>
          </motion.div>
          <div className="flex flex-col gap-6">
            {products.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: easeOut }}
                className="group grid lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-500"
              >
                <div className="lg:col-span-2 relative min-h-[200px]">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#22348A]/85 to-[#22348A]/50" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="text-[#BCBDC1] text-xs font-semibold tracking-widest uppercase mb-2">
                      {p.tagline}
                    </div>
                    <h3 className="display-text text-white text-2xl mb-2">
                      {p.title}
                    </h3>
                    <div className="inline-flex items-center self-start bg-white/15 border border-white/20 rounded-full px-3 py-1">
                      <span className="text-white text-sm font-bold">
                        {p.rate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-3 bg-white p-8 flex flex-col justify-between gap-6">
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {p.desc}
                  </p>
                  <div className="flex flex-col gap-2">
                    {p.features.map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[#22348A] shrink-0" />
                        <span className="text-gray-600 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/contact">
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="inline-flex items-center gap-2 bg-[#22348A] text-white text-sm font-bold px-5 py-2.5 rounded-full cursor-pointer hover:bg-[#162260] transition-colors w-fit"
                    >
                      Open {p.title} Account <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
       */}

      <SavingsStackSection />

      {/* Why Save With Us */}
      <section className="py-24 bg-[#f0f3fc]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-14"
          >
            <span className="divider-accent mb-5 block" />
            <h2 className="display-text text-[#22348A] text-3xl sm:text-4xl">
              Why save with Nisir MFI?
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                whileHover={{ backgroundColor: "#f8f9fe" }}
                className="bg-white p-8 transition-colors"
              >
                <h3 className="font-bold text-[#22348A] text-sm mb-3">
                  {r.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {r.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0d1a52]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <h2 className="display-text text-white text-2xl sm:text-3xl mb-3">
              Start saving today
            </h2>
            <p className="text-white/50 text-sm">
              Visit a branch or contact us — opening an account takes only a few
              minutes.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link href="/contact">
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="inline-flex items-center gap-2 bg-white text-[#22348A] text-sm font-bold px-7 py-3.5 rounded-full cursor-pointer"
              >
                Contact a Branch <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
