"use client";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

const heroImg = "../teams/Together.jpg";

/* ── Team data ── */
const ceo = {
  name: " Mulugeta Embiale",
  role: "Chief Executive Officer",
  bio: "A transformative leader with 18 years in Ethiopian microfinance and banking. Under his leadership, Nisir MFI has grown from a startup to a 20-branch institution serving 20,000+ customers nationwide. Dr. Abrham is a recognized voice in African financial inclusion.",
  photo: "../teams/Mulugeta Embiale.JPG",
};

const executiveOfficer = {
  name: "Kalewold Tegegn",
  role: "Executive Officer",
  bio: "A strategic operator and systems thinker who bridges vision and execution across all departments. With a background in development finance and operational excellence, Rahel ensures every initiative delivers measurable impact for customers and communities.",
  photo: "../teams/Kalewold Tegegn.JPG",
};

const seniorDirectors = [
  {
    name: "Tefera Dereje",
    role: "Executive Director, Information Technology (IT)",
    photo: "../teams/Tefera Dereje.JPG",
  },
  {
    name: "Orthodox Tewahedo",
    role: "Director, Customer Experience and Resource",
    photo: "../teams/Orthodox 1.JPG",
  },
  {
    name: "Hilina Tesfaye",
    role: "Director, Channel & Partnership",
    photo: "../teams/Helina Tesfaye.JPG",
  },
  {
    name: "Moti Abelti",
    role: "Director, Strategy & Brand",
    photo: "../teams/Moti Abelti.JPG",
  },
  {
    name: "Mesefin Beyene",
    role: "Director, Finance & Investment",
    photo: "../teams/Mesfin Beyene.JPG",
  },
  {
    name: "Bethelehem Mekonen",
    role: "Director, Human Resource(HR)",
    photo: "../teams/Betelhem Mekonen.JPG",
  },
  {
    name: "Andualem Amare",
    role: "Director, Credit Management",
    photo: "../teams/Andualem Amare.JPG",
  },
  {
    name: "Esayas G/Medihen",
    role: "Director, Risk & Compliance",
    photo: "../teams/Esayas G.Medihen.JPG",
  },
  {
    name: "Tadele Tsegaw",
    role: "Director, Legal",
    photo: "../teams/Tadele Tsegaw.jpg",
  },
  {
    name: "Tamiru Tsegaw",
    role: "Director, Internal Audit",
    photo: "../teams/Tamiru Tsegaye.JPG",
  },
];

const directors = [
  {
    name: "Ato Henok Bekele",
    role: "Credit Director, Addis Ababa",
    photo:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Ato Eyob Tesfaye",
    role: "Regional Director, Central Ethiopia",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "W/ro Liya Girma",
    role: "Regional Director, Northern Ethiopia",
    photo:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Ato Binyam Mulugeta",
    role: "Regional Director, Southern Ethiopia",
    photo:
      "https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "W/ro Meron Haile",
    role: "Regional Director, Western Ethiopia",
    photo:
      "https://images.unsplash.com/photo-1474176857210-7287d38d27c6?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Ato Haben Abreha",
    role: "Treasury Director",
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "W/ro Selam Alemu",
    role: "Marketing & Communications Director",
    photo:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Ato Natnael Kidane",
    role: "Procurement Director",
    photo:
      "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "W/ro Yeshi Fikre",
    role: "Training & Development Director",
    photo:
      "https://images.unsplash.com/photo-1481214110143-ed630356e1bb?auto=format&fit=crop&w=300&q=80",
  },
];

const managers = [
  {
    name: "Bereket Shiferaw",
    role: "Manager, Finance",
    photo: "../teams/Bereket Shiferaw.JPG",
  },
  {
    name: "Asdesach Birhane",
    role: "Manager, Brand & Product",
    photo: "../teams/Asedesach.jpg",
  },
  {
    name: "Yeshewafire Adela",
    role: "Manager, HR Operations",
    photo: "../teams/yeshewafire 2.jpg",
  },
  {
    name: "W/ro Tigist Mulugeta",
    role: "Risk Assessment Manager",
    photo:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Ato Ermias Girma",
    role: "Customer Service Manager",
    photo:
      "https://images.unsplash.com/photo-1548532928-b34e3be62e91?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "W/ro Biruk Alemu",
    role: "IT Systems Manager",
    photo:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Ato Mikiyas Dawit",
    role: "HR & Culture Manager",
    photo:
      "https://images.unsplash.com/photo-1542178243-bc20204b769f?auto=format&fit=crop&w=300&q=80",
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.55, ease: easeOut },
  }),
};

/* ── Mini team card ── */
function TeamCard({
  member,
  index,
}: {
  member: { name: string; role: string; photo: string };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: easeOut }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-400"
    >
      <div className="relative h-44 overflow-hidden bg-[#f0f3fc]">
        <motion.img
          src={member.photo}
          alt={member.name}
          className="w-full h-full object-cover object-top"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5, ease: easeOut }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#22348A]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4">
        <h4 className="font-bold text-[#22348A] text-sm leading-tight mb-0.5">
          {member.name}
        </h4>
        <p className="text-gray-400 text-xs leading-relaxed">{member.role}</p>
      </div>
    </motion.div>
  );
}

/* ── Collapsible section ── */
function TeamSection({
  title,
  count,
  color,
  children,
}: {
  title: string;
  count: number;
  color: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-14">
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-4 mb-8 w-full text-left"
      >
        <span
          className="flex items-center justify-center w-9 h-9 rounded-lg text-white text-sm font-bold shrink-0"
          style={{ background: color }}
        >
          {count}
        </span>
        <div>
          <h3 className="display-text text-[#22348A] text-xl sm:text-2xl">
            {title}
          </h3>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="ml-auto text-gray-300"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OurTeam() {
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
        className="relative overflow-hidden min-h-[80vh] flex items-end"
      >
        <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
          <img
            src={heroImg}
            alt="Our Team"
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
              Our Leadership Team
            </h1>
            <p className="text-white/55 text-lg max-w-xl leading-relaxed">
              29 talented professionals — young, driven, and deeply committed to
              Nisir's mission of expanding financial access across Ethiopia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-4 gap-px bg-gray-100 rounded overflow-hidden">
            {[
              { value: "1", label: "Chief Executive Officer" },
              { value: "1", label: "Executive Officer" },
              { value: "20", label: "Directors" },
              { value: "7", label: "Managers" },
            ].map((s) => (
              <div key={s.label} className="bg-white py-6 px-4 text-center">
                <div className="text-2xl font-bold text-[#22348A] mb-1">
                  {s.value}
                </div>
                <div className="text-gray-400 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Executive leadership ── */}
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
              Executive Leadership
            </h2>
            <p className="text-gray-500 text-sm max-w-lg">
              Nisir's top executives who translate the board's vision into daily
              operations and institutional impact.
            </p>
          </motion.div>

          {/* CEO + Executive Officer — large cards */}
          <div className="grid sm:grid-cols-2 gap-6 mb-20">
            {[ceo, executiveOfficer].map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.65,
                  ease: easeOut,
                }}
                whileHover={{ y: -4 }}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-52 h-64 sm:h-auto shrink-0 overflow-hidden">
                    <motion.img
                      src={person.photo}
                      alt={person.name}
                      className="w-full h-full object-cover object-top"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5" />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="inline-block bg-[#f0f3fc] text-[#22348A] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 w-fit">
                      {i === 0
                        ? "Chief Executive Officer"
                        : "Executive Officer"}
                    </div>
                    <h3 className="display-text text-[#22348A] text-2xl leading-tight mb-3">
                      {person.name}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {person.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Hierarchy visual connector */}
          <div className="flex justify-center mb-16">
            <div className="flex flex-col items-center gap-1 text-gray-300">
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-xs text-gray-300 tracking-widest uppercase">
                Reports to CEO
              </div>
              <div className="w-px h-8 bg-gray-200" />
            </div>
          </div>

          {/* Senior Directors */}
          <TeamSection title="Senior Directors" count={11} color="#22348A">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {seniorDirectors.map((m, i) => (
                <TeamCard key={m.name} member={m} index={i} />
              ))}
            </div>
          </TeamSection>

          {/* Directors */}
          {/* <TeamSection title="Directors" count={9} color="#3a55c0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {directors.map((m, i) => (
                <TeamCard key={m.name} member={m} index={i} />
              ))}
            </div>
          </TeamSection> */}

          {/* Managers */}
          <TeamSection title="Managers" count={7} color="#5a72cc">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {managers.map((m, i) => (
                <TeamCard key={m.name} member={m} index={i} />
              ))}
            </div>
          </TeamSection>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#0d1a52]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <h2 className="display-text text-white text-2xl sm:text-3xl mb-3">
              Join Our Team
            </h2>
            <p className="text-white/50 text-sm max-w-lg">
              We are always looking for talented people who share our mission.
              See what opportunities are available.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/careers">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="inline-flex items-center gap-2 bg-white text-[#22348A] text-sm font-semibold px-6 py-3 rounded cursor-pointer hover:bg-white/92 transition-colors shrink-0"
              >
                View Open Positions <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
            <Link href="/about/boards">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="inline-flex items-center gap-2 border border-white/25 text-white text-sm font-medium px-6 py-3 rounded cursor-pointer hover:bg-white/8 transition-colors shrink-0"
              >
                Meet the Board
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
