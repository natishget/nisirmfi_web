"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const heroImg = "../boards/Together.jpg";

const board = [
  {
    name: "Michael Addisu",
    role: "Board Chairperson",
    expertise: "CEO of Fisrt Addis Investment Bank",
    bio: "A visionary finance leader with 20+ years shaping Ethiopia's financial sector. Formerly Senior Director at the National Bank of Ethiopia, Dr. Solomon drives Nisir's strategic growth and governance excellence.",
    photo: "../boards/Michael Addisu.jpg",
    bg: "#f0f3fc",
  },
  {
    name: "Yodit Kassa",
    role: "D/Board Chairperson",
    expertise: "Chief Operations Officer, ESX",
    bio: "Serial entrepreneur and co-founder of three high-impact Ethiopian enterprises. Yared brings deep commercial insight and a relentless drive to expand inclusive finance to underserved communities.",
    photo: "../boards/Yodit Kassa.jpg",
    bg: "#fff",
  },
  {
    name: "Netsanet Tsegaw",
    role: "Board Member",
    expertise: "Chartered Valuation Surveyor",
    bio: "Economist and policy advisor with deep expertise in agricultural development and rural finance. Dr. Bethlehem advises government bodies on financial inclusion strategy across sub-Saharan Africa.",
    photo: "../boards/Netsanet Tsegaw.jpg",
    bg: "#f0f3fc",
  },
  {
    name: "Menna Selamu",
    role: "Board Member",
    expertise: "CEO, Prime Integrated services",
    bio: "A leading voice in Ethiopian fintech, Natnael has built and scaled digital financial products serving millions. He champions Nisir's technology roadmap and digital transformation agenda.",
    photo: "../boards/Menna Selamu.jpg",
    bg: "#fff",
  },
  {
    name: "Fitsum Zewdu",
    role: "Board Member",
    expertise: "Economist at World Bank",
    bio: "Renowned people strategist and leadership coach who has shaped some of Ethiopia's fastest-growing organizations. Mekdes leads Nisir's board governance and talent development committees.",
    photo: "../boards/Fitsum Zewdu.jpg",
    bg: "#f0f3fc",
  },
  {
    name: "Birhanu Molla",
    role: "Board Member",
    expertise: "Director - Buna Bank",
    bio: "Prominent legal practitioner and regulatory specialist with extensive experience in Ethiopian financial law. Dawit ensures Nisir's operations align with the highest standards of governance and compliance.",
    photo: "../boards/Birhanu Molla.jpg",
    bg: "#fff",
  },
  {
    name: "Bisrat Teshome",
    role: "Board Member",
    expertise: "Senior Private Sector Development Specialist at World Bank",
    bio: "Investment specialist and passionate advocate for women's financial inclusion in Ethiopia. Hiwot has advised international development institutions and brings a global perspective to Nisir's mission.",
    photo: "../boards/Bisrate Teshome.jpg",
    bg: "#f0f3fc",
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: easeOut },
  }),
};

export default function OurBoards() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  return (
    <div className="overflow-x-hidden ">
      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden min-h-[85vh] flex items-end"
      >
        <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
          <img
            src={heroImg}
            alt="Board of Directors"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a52] via-[#0d1a52]/65 to-[#22348A]/35" />
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <span className="block w-8 h-px bg-[#BCBDC1] mb-6" />
            <h1 className="display-text text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-5 max-w-2xl">
              Board of Directors
            </h1>
            <p className="text-white/55 text-lg max-w-xl leading-relaxed">
              Seven accomplished leaders guiding Nisir MFI's mission, strategy,
              and long-term growth with integrity and vision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Intro strip ── */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-3 gap-px bg-gray-100 rounded overflow-hidden">
            {[
              { value: "7", label: "Board Members" },
              { value: "100+", label: "Combined Years Experience" },
              { value: "Est. 2014", label: "Institution Founded" },
            ].map((s) => (
              <div key={s.label} className="bg-white py-6 px-6">
                <div className="text-2xl font-bold text-[#22348A] mb-1">
                  {s.value}
                </div>
                <div className="text-gray-400 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Board grid ── */}
      <section className="py-24 bg-[#f0f3fc]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16"
          >
            <span className="divider-accent mb-5 block" />
            <h2 className="display-text text-[#22348A] text-3xl sm:text-4xl mb-3">
              Meet the Board
            </h2>
            <p className="text-gray-500 text-sm max-w-lg">
              A collective of young, experienced, and influential Ethiopian
              professionals who share a single commitment — making Nisir MFI a
              model of ethical, impactful microfinance.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {board.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.07,
                  duration: 0.6,
                  ease: easeOut,
                }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-500"
              >
                {/* Photo */}
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.6, ease: easeOut }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a52]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <span className="inline-block bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                      {member.expertise}
                    </span>
                  </div>
                </div>
                {/* Content */}
                <div className="p-7">
                  <div className="mb-4">
                    <h3 className="display-text text-[#22348A] text-xl leading-tight mb-1">
                      {member.name}
                    </h3>
                    <p className="text-[#BCBDC1] text-xs font-semibold uppercase tracking-widest">
                      {member.role}
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#0d1a52]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <h2 className="display-text text-white text-2xl sm:text-3xl mb-3">
              Explore Our Institution
            </h2>
            <p className="text-white/50 text-sm max-w-lg">
              Our board's vision is reflected in every service we offer. Learn
              about the people who execute that vision every day.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/about/team">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="inline-flex items-center gap-2 bg-white text-[#22348A] text-sm font-semibold px-6 py-3 rounded cursor-pointer hover:bg-white/92 transition-colors shrink-0"
              >
                Meet the Team <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
            <Link href="/about">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="inline-flex items-center gap-2 border border-white/25 text-white text-sm font-medium px-6 py-3 rounded cursor-pointer hover:bg-white/8 transition-colors shrink-0"
              >
                About Nisir MFI
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
