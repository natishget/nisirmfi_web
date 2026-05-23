"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react";

type CareerDetail = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  purpose: string;
  responsibilities: string[];
  qualification: string[];
  salary: string;
  benefits: string[];
  postDate: string;
  endDate: string;
};

type RelatedCareer = {
  id: string;
  title: string;
  department: string;
  location: string;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, index) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.04, duration: 0.45, ease: easeOut }}
          className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed"
        >
          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#22348A]" />
          {item}
        </motion.li>
      ))}
    </ul>
  );
}

export default function CareerDetailView({
  career,
  relatedCareers,
}: {
  career: CareerDetail;
  relatedCareers: RelatedCareer[];
}) {
  return (
    <div className="overflow-x-hidden">
      <section className="relative hero-gradient noise-overlay overflow-hidden py-24 md:py-32">
        <div className="absolute -right-64 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full border border-white/5 pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Careers
            </Link>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded px-3 py-1 text-xs font-medium text-white border border-white/15 bg-white/10">
                {career.department}
              </span>
              <span className="rounded px-3 py-1 text-xs font-medium text-white border border-white/15 bg-white/10">
                {career.type}
              </span>
              <span className="rounded px-3 py-1 text-xs font-medium text-white border border-white/15 bg-white/10">
                Ends {formatDate(career.endDate)}
              </span>
            </div>
            <h1 className="display-text mt-5 text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">
              {career.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/60">
              {career.purpose}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#BCBDC1]" /> {career.location}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#BCBDC1]" /> Posted{" "}
                {formatDate(career.postDate)}
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#BCBDC1]" /> {career.salary}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-3 lg:px-10">
          <div className="bg-[#f0f3fc] p-5 rounded-2xl lg:col-span-2 flex flex-col gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="divider-accent mb-5 block" />
              <h2 className="display-text mb-4 text-2xl text-[#22348A]">
                About the Role
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">
                {career.purpose}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="display-text mb-6 text-2xl text-[#22348A]">
                Key Responsibilities
              </h2>
              <BulletList items={career.responsibilities} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="display-text mb-6 text-2xl text-[#22348A]">
                Requirements
              </h2>
              <BulletList items={career.qualification} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="display-text mb-6 text-2xl text-[#22348A]">
                Benefits
              </h2>
              <BulletList items={career.benefits} />
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="rounded-2xl bg-[#22348A] p-7"
              >
                <h3 className="display-text mb-3 text-xl text-white">
                  Apply for this role
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-white/55">
                  Send your CV and a cover letter to{" "}
                  <span className="text-white/80">careers@nisirmfi.com</span>.
                </p>
                <a
                  href={`mailto:careers@nisirmfi.com?subject=${encodeURIComponent(career.title)}`}
                >
                  <div className="flex items-center justify-center gap-2 rounded bg-white px-4 py-3 text-sm font-bold text-[#22348A] transition-colors hover:bg-white/92">
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </div>
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="rounded-2xl bg-[#f0f3fc] p-7"
              >
                <h3 className="display-text mb-5 text-xl text-[#22348A]">
                  Posting Details
                </h3>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Location", value: career.location },
                    { label: "Type", value: career.type },
                    { label: "Department", value: career.department },
                    { label: "Salary", value: career.salary },
                    { label: "Post Date", value: formatDate(career.postDate) },
                    { label: "End Date", value: formatDate(career.endDate) },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {item.label}
                      </div>
                      <div className="text-sm font-semibold text-[#22348A]">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {relatedCareers.length > 0 ? (
        <section className="bg-[#f0f3fc] py-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
            <h3 className="display-text mb-8 text-2xl text-[#22348A]">
              Other Open Positions
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {relatedCareers.map((relatedCareer) => (
                <Link
                  key={relatedCareer.id}
                  href={`/careers/career-detail/${relatedCareer.id}`}
                  className="rounded-2xl border border-white/80 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <p className="text-sm font-semibold text-[#22348A]">
                    {relatedCareer.title}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                    {relatedCareer.department}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {relatedCareer.location}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
