"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const IMG = {
  hero: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=1400&q=80",
  feat: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=600&q=80",
  p1: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=120&q=80",
  p2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  p3: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  p4: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
  p5: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=120&q=80",
  p6: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=120&q=80",
};

const featured = {
  quote:
    "Nisir MFI did not just give me a loan — they gave me a future. I went from a market stall to a real shop with three employees. My children are now in school full-time. That is what financial inclusion truly means.",
  name: "Wubet Ashagre",
  role: "Market trader turned shop owner",
  location: "Bahir Dar",
  img: IMG.feat,
};

const stories = [
  {
    quote:
      "Nisir MFI understood my business when banks wouldn't open the door. The loan changed everything for my family.",
    name: "Tigist Haile",
    role: "Textile business owner",
    location: "Addis Ababa",
    product: "Business Loan",
    amount: "ETB 120,000",
    img: IMG.p1,
  },
  {
    quote:
      "The agriculture loan covered my seeds and a water pump. This season I harvested twice what I expected.",
    name: "Bekele Tesema",
    role: "Smallholder farmer",
    location: "Adama",
    product: "Agriculture Loan",
    amount: "ETB 45,000",
    img: IMG.p2,
  },
  {
    quote:
      "Goal savings gave me the discipline I needed. Within 18 months I had capital to open my restaurant.",
    name: "Meron Alemu",
    role: "Restaurant owner",
    location: "Hawassa",
    product: "Goal Savings",
    amount: "ETB 80,000",
    img: IMG.p3,
  },
  {
    quote:
      "Getting financing was always a dream. With Nisir MFI, it became real — minimal paperwork, honest terms.",
    name: "Yonas Girma",
    role: "Hardware store owner",
    location: "Gondar",
    product: "Business Loan",
    amount: "ETB 200,000",
    img: IMG.p4,
  },
  {
    quote:
      "I joined a group savings with five other women. Together we all accessed loans. Nisir changed how we think about money.",
    name: "Selam Desta",
    role: "Seamstress and entrepreneur",
    location: "Jimma",
    product: "Group Savings",
    amount: "ETB 20,000",
    img: IMG.p5,
  },
  {
    quote:
      "My truck broke down and I had no options. The emergency loan was in my account the same day.",
    name: "Abebe Kebede",
    role: "Transport business owner",
    location: "Dire Dawa",
    product: "Emergency Loan",
    amount: "ETB 30,000",
    img: IMG.p6,
  },
];

const stats = [
  { value: "20,000+", label: "Customers Served" },
  { value: "96%", label: "Customer Satisfaction" },
  { value: "4.8 / 5", label: "Average Rating" },
  { value: "10+", label: "Years of Trust" },
];

const easeOut = [0.22, 1, 0.36, 1] as const;
const stars = [0, 1, 2, 3, 4] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.55, ease: easeOut },
  }),
};

export default function Testimonials() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[55vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={IMG.hero}
            alt="Ethiopian market"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a52] via-[#0d1a52]/65 to-[#22348A]/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="block w-8 h-px bg-[#BCBDC1] mb-6" />
            <h1 className="display-text text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-5">
              Customer Stories
            </h1>
            <p className="text-white/55 text-lg max-w-xl leading-relaxed">
              Real people, real impact. Thousands of Ethiopians have built
              better financial futures with Nisir MFI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white py-8 px-6"
              >
                <div className="text-3xl font-bold text-[#22348A] mb-1">
                  {s.value}
                </div>
                <div className="text-gray-400 text-xs">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-20 bg-[#f0f3fc]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10"
          >
            <span className="divider-accent mb-5 block" />
            <h2 className="display-text text-[#22348A] text-2xl">
              Featured Story
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="grid lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500"
          >
            {/* Image side */}
            <div className="lg:col-span-2 relative min-h-[320px]">
              <img
                src={featured.img}
                alt={featured.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#22348A]/30" />
            </div>
            {/* Content side */}
            <div className="lg:col-span-3 bg-[#22348A] p-10 md:p-14 flex flex-col justify-center">
              <div className="flex gap-0.5 mb-6">
                {stars.map((i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="display-text text-white text-xl md:text-2xl leading-relaxed mb-8 italic">
                "{featured.quote}"
              </p>
              <div>
                <div className="text-white font-semibold">{featured.name}</div>
                <div className="text-[#BCBDC1] text-sm">
                  {featured.role} — {featured.location}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stories grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12"
          >
            <span className="divider-accent mb-5 block" />
            <h2 className="display-text text-[#22348A] text-3xl">
              More stories
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.55,
                  ease: easeOut,
                }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 16px 40px rgba(34,52,138,0.10)",
                }}
                className="border border-gray-100 rounded-2xl p-7 flex flex-col justify-between bg-white transition-all duration-300"
              >
                <div>
                  <div className="flex gap-0.5 mb-3">
                    {stars.map((j) => (
                      <Star
                        key={j}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed italic mb-6">
                    "{s.quote}"
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-5 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={s.img}
                      alt={s.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-[#f0f3fc]"
                    />
                    <div>
                      <div className="font-semibold text-[#22348A] text-sm">
                        {s.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {s.role} — {s.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-gray-400">{s.product}</div>
                    <div className="text-xs font-bold text-[#22348A]">
                      {s.amount}
                    </div>
                  </div>
                </div>
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
              Write your own story
            </h2>
            <p className="text-white/50 text-sm">
              Join thousands of Ethiopians building better financial futures
              with Nisir MFI.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link href="/apply">
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="inline-flex items-center gap-2 bg-white text-[#22348A] text-sm font-bold px-7 py-3.5 rounded-full cursor-pointer"
              >
                Apply for a Loan <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
