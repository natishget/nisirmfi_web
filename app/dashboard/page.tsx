"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  LayoutGrid,
  Megaphone,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

const managementCards = [
  {
    title: "News Management",
    description:
      "Create, publish, and refine company updates, announcements, and featured stories.",
    href: "/news-management",
    icon: Megaphone,
    accent: "from-[#22348A] to-[#3e5bdb]",
    glow: "shadow-[0_25px_60px_rgba(34,52,138,0.22)]",
  },
  {
    title: "Career Management",
    description:
      "Handle open roles, update application windows, and keep hiring content fresh.",
    href: "/career-management",
    icon: BriefcaseBusiness,
    accent: "from-[#0f766e] to-[#14b8a6]",
    glow: "shadow-[0_25px_60px_rgba(15,118,110,0.2)]",
  },
  {
    title: "User Management",
    description:
      "Add new users, adjust account details, and remove access when it is no longer needed.",
    href: "/user-management",
    icon: UsersRound,
    accent: "from-[#8b5cf6] to-[#ec4899]",
    glow: "shadow-[0_25px_60px_rgba(139,92,246,0.2)]",
  },
];

const cardVariants: any = {
  hidden: { opacity: 0, y: 28 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.12,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,52,138,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.14),_transparent_28%),linear-gradient(180deg,_#f4f7ff_0%,_#edf3ff_48%,_#ffffff_100%)]">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#22348A]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] right-[-4rem] h-80 w-80 rounded-full bg-[#14b8a6]/10 blur-3xl" />

      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 lg:px-10 lg:pt-32">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-[#22348A] shadow-[0_10px_40px_rgba(34,52,138,0.08)] backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Admin command center
          </div>

          <h1 className="display-text text-4xl leading-tight text-[#1f2b63] sm:text-5xl lg:text-6xl">
            A polished dashboard for every management task.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Jump straight into the areas that matter most. Each card below opens
            a focused management workspace with a clean, confident visual style.
          </p>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          className="mt-12 grid gap-6 lg:grid-cols-3"
        >
          {managementCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.href}
                custom={index}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                className={`group relative overflow-hidden rounded-[28px] border border-white/80 bg-white/90 p-7 shadow-[0_24px_80px_rgba(34,52,138,0.08)] backdrop-blur ${card.glow}`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.accent}`}
                />
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-100/80 blur-2xl transition-opacity duration-300 group-hover:opacity-70" />

                <div className="relative flex h-full flex-col">
                  <div
                    className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-white shadow-lg`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h2 className="text-2xl font-semibold tracking-tight text-[#1f2b63]">
                    {card.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                    {card.description}
                  </p>

                  <Link href={card.href} className="mt-8">
                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#22348A] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#162260]">
                      Open workspace
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Secure access",
              value: "Protected by session login",
              icon: ShieldCheck,
            },
            {
              label: "Quick navigation",
              value: "One click to every admin area",
              icon: LayoutGrid,
            },
            {
              label: "Modern workflow",
              value: "Simple, focused, and fast",
              icon: Sparkles,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-3xl border border-white/80 bg-white/70 px-5 py-4 shadow-[0_18px_50px_rgba(34,52,138,0.06)] backdrop-blur"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-2xl bg-[#f0f3fc] p-2 text-[#22348A]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
