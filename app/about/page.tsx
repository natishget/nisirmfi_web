"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const IMG = {
  hero: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80",
  mission: "../Nisir Building 1.png",
  community: "../other/coin tree.jpg",
  team: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
};

const values = [
  {
    title: "Integrity",
    desc: "We operate with transparency and ethical conduct in everything we do, earning trust through consistent, honest action.",
  },
  {
    title: "Ambition",
    desc: "We set bold goals for our institution and for the customers we serve, pursuing excellence without compromise.",
  },
  {
    title: "Collaboration",
    desc: "We build partnerships with customers, communities, and each other — believing shared effort creates lasting impact.",
  },
  {
    title: "Customer-centricity",
    desc: "Every decision begins and ends with our customer's wellbeing. Their success is our only measure of success.",
  },
  {
    title: "Continuous Improvement",
    desc: "We embrace learning and innovation, constantly evolving our products and processes to better serve Ethiopia.",
  },
  {
    title: "Equity",
    desc: "Financial services should be accessible to all. We actively work to include those overlooked by conventional finance.",
  },
];

const milestones = [
  {
    year: "2014",
    event: "Founded and licensed by the National Bank of Ethiopia.",
  },
  { year: "2015", event: "Opened first five branches across Addis Ababa." },
  {
    year: "2017",
    event: "Expanded to regional cities — Adama, Bahir Dar, Hawassa, Gondar.",
  },
  {
    year: "2019",
    event: "Surpassed 5,000 active customers; launched group savings products.",
  },
  {
    year: "2021",
    event:
      "Introduced digital-first customer onboarding and mobile account access.",
  },
  {
    year: "2023",
    event: "20,000+ customers served across 20+ branches nationwide.",
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

export default function About() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div className="overflow-x-hidden ">
      {/* Hero with parallax bg */}
      <section
        ref={heroRef}
        className="relative overflow-hidden min-h-[60vh] flex items-end"
      >
        <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
          <img
            src={IMG.hero}
            alt="Addis Ababa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a52] via-[#0d1a52]/70 to-[#22348A]/40" />
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="block w-8 h-px bg-[#BCBDC1] mb-6" />
            <h1 className="display-text text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-5 max-w-2xl">
              About Nisir MFI
            </h1>
            <p className="text-white/55 text-lg max-w-lg leading-relaxed">
              Established in 2014 with a single purpose: to make financial
              services genuinely accessible to every Ethiopian who needs them.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision with image */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              <div className="grid sm:grid-cols-2 gap-8">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <span className="divider-accent mb-5 block" />
                  <h2 className="display-text text-[#22348A] text-2xl mb-4">
                    Our Mission
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    To provide trusted, win-win and need-based financial
                    solutions for the underserved by delivering innovative,
                    digital-led and customer-centric services, contributing to
                    the inclusive economic development of Ethiopia.
                  </p>
                </motion.div>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={1}
                  variants={fadeUp}
                >
                  <span className="divider-accent mb-5 block" />
                  <h2 className="display-text text-[#22348A] text-2xl mb-4">
                    Our Vision
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    To become the financial services partner of choice for MSMEs
                    and individuals through innovative, accessible and
                    customer-centric services — Ethiopia's most trusted
                    microfinance institution.
                  </p>
                </motion.div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: easeOut }}
              className="lg:col-span-2"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={IMG.mission}
                  alt="Team meeting"
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#22348A]/40 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-24 bg-[#f0f3fc]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-16 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="lg:col-span-2"
            >
              <span className="divider-accent mb-6 block" />
              <h2 className="display-text text-[#22348A] text-3xl sm:text-4xl mb-5">
                Serving "the missing middle"
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Nisir MFI occupies the vital space between informal money
                lenders and conventional commercial banks.
              </p>
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img
                  src={IMG.community}
                  alt="Ethiopian community"
                  className="w-full h-65 object-cover"
                />
                <div className="absolute inset-0 bg-[#22348A]/30" />
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              variants={fadeUp}
              className="lg:col-span-3"
            >
              <div className="flex flex-col gap-3">
                {[
                  "Micro, small and medium enterprises (MSMEs)",
                  "Smallholder farmers and agricultural cooperatives",
                  "Women entrepreneurs and youth-led businesses",
                  "Salaried workers and civil servants",
                  "Savings groups, cooperatives and associations",
                  "First-time borrowers with no credit history",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl px-5 py-4 hover:border-[#22348A]/20 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 text-[#22348A] mt-0.5 shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
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
              Our Core Values
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                whileHover={{ backgroundColor: "#f8f9fe" }}
                className="bg-white p-8 transition-colors"
              >
                <div className="text-[#22348A] font-bold text-sm mb-3">
                  {v.title}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-[#22348A]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-14"
          >
            <span className="block w-8 h-px bg-[#BCBDC1] mb-6" />
            <h2 className="display-text text-white text-3xl sm:text-4xl">
              Our journey
            </h2>
          </motion.div>
          <div className="flex flex-col gap-0">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex gap-8 items-start pb-10 last:pb-0 relative"
              >
                {i < milestones.length - 1 && (
                  <div className="absolute left-[2.15rem] top-8 bottom-0 w-px bg-white/10" />
                )}
                <div className="shrink-0 w-16 text-right">
                  <span className="text-[#BCBDC1] font-bold text-sm">
                    {m.year}
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#BCBDC1] mt-1 shrink-0" />
                  <p className="text-white/65 text-sm leading-relaxed">
                    {m.event}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {[
              { label: "Years of service", value: "10+" },
              { label: "Active customers", value: "20,000+" },
              { label: "Branch offices", value: "20+" },
              { label: "Team members", value: "200+" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ backgroundColor: "#f8f9fe" }}
                className="bg-white p-10 transition-colors"
              >
                <div className="text-4xl font-bold text-[#22348A] mb-2">
                  {s.value}
                </div>
                <div className="text-gray-400 text-xs">{s.label}</div>
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
              Join 20,000+ customers
            </h2>
            <p className="text-white/50 text-sm">
              Start your financial journey with Nisir MFI today.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link href="/apply">
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="inline-flex items-center gap-2 bg-white text-[#22348A] text-sm font-bold px-7 py-3.5 rounded-full cursor-pointer"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
            <Link href="/contact">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="inline-flex items-center gap-2 border border-white/25 text-white text-sm font-medium px-7 py-3.5 rounded-full cursor-pointer hover:bg-white/8 transition-colors"
              >
                Contact Us
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
