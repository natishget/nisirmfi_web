"use client";

import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";

type CareerCard = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  purpose: string;
  postDate: string;
  endDate: string;
};

const values = [
  {
    title: "Purpose-driven work",
    desc: "Every role at Nisir MFI directly contributes to financial inclusion across Ethiopia.",
  },
  {
    title: "Growth & learning",
    desc: "We invest in continuous training, mentorship, and career development for all team members.",
  },
  {
    title: "Inclusive culture",
    desc: "We are committed to an equitable, respectful, and collaborative workplace.",
  },
  {
    title: "Competitive compensation",
    desc: "Fair, transparent salaries benchmarked against the Ethiopian financial sector.",
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function excerpt(text: string, length = 70) {
  return text.length > length ? text.substring(0, length) + "..." : text;
}

export default function CareersPublicClient() {
  const [careers, setCareers] = useState<CareerCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCareers() {
      try {
        const BASE_URL = (process.env.NEXT_PUBLIC_LOCAL_API || "http://localhost:3001/").trim().replace(/\/$/, "");
        const response = await fetch(`${BASE_URL}/career/active`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load careers");
        }

        const payload = (await response.json()) as CareerCard[];

        if (active) {
          setCareers(payload);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load careers",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadCareers();

    return () => {
      active = false;
    };
  }, []);

  const openingCount = useMemo(() => careers.length, [careers]);

  return (
    <div className="overflow-x-hidden">
      <section className="relative hero-gradient noise-overlay overflow-hidden py-28 md:py-36">
        <div className="absolute -right-64 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/8" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="mb-6 block h-px w-8 bg-[#BCBDC1]" />
            <h1 className="display-text mb-6 max-w-2xl text-4xl leading-[1.12] text-white sm:text-5xl lg:text-[3.5rem]">
              Build a Career That Makes a Difference
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-white/55">
              Join our team and help expand financial inclusion across Ethiopia.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: easeOut }}
            className="mb-14"
          >
            <span className="divider-accent mb-5 block" />
            <h2 className="display-text text-3xl text-[#22348A] sm:text-4xl">
              Why join Nisir MFI?
            </h2>
          </motion.div>
          <div className="grid gap-px overflow-hidden rounded border border-gray-100 bg-gray-100 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white p-8 transition-colors hover:bg-[#f8f9fe]"
              >
                <div className="mb-5 h-2 w-2 rounded-full bg-[#22348A]" />
                <h3 className="mb-3 text-sm font-bold text-[#22348A]">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f0f3fc] py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: easeOut }}
            className="mb-12"
          >
            <span className="divider-accent mb-5 block" />
            <h2 className="display-text text-3xl text-[#22348A] sm:text-4xl">
              Open Positions
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              {openingCount} position{openingCount === 1 ? "" : "s"} currently
              open
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid gap-4">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded border border-gray-100 bg-white"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
              {error}
            </div>
          ) : careers.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-slate-500">
              There are no active career openings at the moment.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {careers.map((career, index) => (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.4,
                    ease: easeOut,
                  }}
                  className="group rounded border border-gray-100 bg-white p-7 transition-all duration-300 hover:border-[#22348A]/25 hover:shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3 className="font-bold text-[#22348A] group-hover:underline underline-offset-2 decoration-[#22348A]/30">
                          {career.title}
                        </h3>
                        <span className="rounded border border-[#22348A]/15 bg-[#f0f3fc] px-2.5 py-0.5 text-xs font-medium text-[#22348A]">
                          {career.department}
                        </span>
                      </div>
                      <p className="mb-4 text-sm leading-relaxed text-gray-500 w-[50%]">
                        {excerpt(career.purpose)}
                      </p>
                      <div className="flex flex-wrap items-center gap-5 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#BCBDC1]" />
                          {career.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[#BCBDC1]" />
                          {career.type}
                        </div>
                        <div className="flex items-center gap-1.5">
                          Posted {formatDate(career.postDate)}
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/careers/career-detail/${career.id}`}
                      data-testid={`link-view-job-${index}`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2 rounded border-2 border-[#22348A] px-4 py-2.5 text-xs font-bold text-[#22348A] transition-all duration-200 hover:bg-[#22348A] hover:text-white"
                      >
                        View Position <ArrowRight className="h-3.5 w-3.5" />
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#0d1a52] py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <h2 className="display-text mb-3 text-2xl text-white sm:text-3xl">
              Don&apos;t see the right role?
            </h2>
            <p className="max-w-lg text-sm text-white/50">
              We welcome speculative applications from talented professionals
              who share our mission. Send your CV and a short cover note to{" "}
              <span className="text-white/70">careers@nisirmfi.com</span>.
            </p>
          </div>
          <Link href="/contact" data-testid="link-careers-contact">
            <div className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded bg-white px-6 py-3 text-sm font-semibold text-[#22348A] transition-colors hover:bg-white/92">
              Get in Touch <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
