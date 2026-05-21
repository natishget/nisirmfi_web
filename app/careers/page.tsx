"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Clock } from "lucide-react";

const openings = [
  {
    slug: "credit-officer",
    title: "Credit Officer",
    department: "Credit",
    location: "Addis Ababa",
    type: "Full-time",
    desc: "Assess loan applications, manage client relationships, and support borrowers throughout the credit lifecycle.",
  },
  {
    slug: "branch-manager",
    title: "Branch Manager",
    department: "Operations",
    location: "Hawassa",
    type: "Full-time",
    desc: "Lead the day-to-day operations of a regional branch, manage staff, and achieve branch growth targets.",
  },
  {
    slug: "customer-service-representative",
    title: "Customer Service Representative",
    department: "Customer Experience",
    location: "Addis Ababa",
    type: "Full-time",
    desc: "Serve as the first point of contact for customers, handling inquiries, account opening, and transaction support.",
  },
  {
    slug: "risk-compliance-analyst",
    title: "Risk & Compliance Analyst",
    department: "Risk",
    location: "Addis Ababa",
    type: "Full-time",
    desc: "Monitor credit risk, ensure regulatory compliance, and support the development of risk management frameworks.",
  },
  {
    slug: "digital-banking-specialist",
    title: "Digital Banking Specialist",
    department: "Technology",
    location: "Addis Ababa",
    type: "Full-time",
    desc: "Support the development and rollout of our digital banking products and mobile-first customer services.",
  },
  {
    slug: "field-loan-officer",
    title: "Field Loan Officer",
    department: "Credit",
    location: "Multiple Regions",
    type: "Full-time",
    desc: "Conduct on-site assessments of agricultural and rural loan applicants, supporting disbursement and monitoring.",
  },
];

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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.55, ease: easeOut },
  }),
};

export default function Careers() {
  return (
    <div className="overflow-x-hidden ">
      {/* Hero */}
      <section className="relative hero-gradient noise-overlay overflow-hidden py-28 md:py-36">
        <div className="absolute -right-64 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/8" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="block w-8 h-px bg-[#BCBDC1] mb-6" />
            <h1 className="display-text text-white text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.12] mb-6 max-w-2xl">
              Build a Career That Makes a Difference
            </h1>
            <p className="text-white/55 text-lg max-w-xl leading-relaxed">
              Join 200+ professionals working to expand financial inclusion
              across Ethiopia. At Nisir MFI, your work has real, measurable
              impact on communities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why work here */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-14"
          >
            <span className="divider-accent mb-5 block" />
            <h2 className="display-text text-[#22348A] text-3xl sm:text-4xl">
              Why join Nisir MFI?
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 border border-gray-100 rounded overflow-hidden">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="bg-white p-8 hover:bg-[#f8f9fe] transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-[#22348A] mb-5" />
                <h3 className="font-bold text-[#22348A] text-sm mb-3">
                  {v.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section className="py-24 bg-[#f0f3fc]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12"
          >
            <span className="divider-accent mb-5 block" />
            <h2 className="display-text text-[#22348A] text-3xl sm:text-4xl">
              Open Positions
            </h2>
            <p className="text-gray-500 text-sm mt-3">
              {openings.length} positions currently open
            </p>
          </motion.div>

          <div className="flex flex-col gap-4">
            {openings.map((job, i) => (
              <motion.div
                key={job.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                data-testid={`job-${i}`}
                className="bg-white border border-gray-100 rounded p-7 hover:border-[#22348A]/25 hover:shadow-sm transition-all duration-300 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-[#22348A] group-hover:underline underline-offset-2 decoration-[#22348A]/30">
                        {job.title}
                      </h3>
                      <span className="text-xs bg-[#f0f3fc] text-[#22348A] border border-[#22348A]/15 rounded px-2.5 py-0.5 font-medium">
                        {job.department}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      {job.desc}
                    </p>
                    <div className="flex items-center gap-5 text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#BCBDC1]" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#BCBDC1]" />
                        {job.type}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/careers/career-detail/?${job.slug}`}
                    data-testid={`link-view-job-${i}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 border-2 border-[#22348A] text-[#22348A] text-xs font-bold px-4 py-2.5 rounded cursor-pointer hover:bg-[#22348A] hover:text-white transition-all duration-200 shrink-0"
                    >
                      View Position <ArrowRight className="w-3.5 h-3.5" />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Speculative applications */}
      <section className="py-20 bg-[#0d1a52]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <h2 className="display-text text-white text-2xl sm:text-3xl mb-3">
              Don't see the right role?
            </h2>
            <p className="text-white/50 text-sm max-w-lg">
              We welcome speculative applications from talented professionals
              who share our mission. Send your CV and a short cover note to{" "}
              <span className="text-white/70">careers@nisirmfi.com</span>.
            </p>
          </div>
          <Link href="/contact" data-testid="link-careers-contact">
            <div className="inline-flex items-center gap-2 bg-white text-[#22348A] text-sm font-semibold px-6 py-3 rounded cursor-pointer hover:bg-white/92 transition-colors shrink-0">
              Get in Touch <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
