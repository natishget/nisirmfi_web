"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface JobPosting {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  preferred: string[];
  benefits: string[];
}

const jobs: JobPosting[] = [
  {
    slug: "credit-officer",
    title: "Credit Officer",
    department: "Credit & Loans",
    location: "Addis Ababa",
    type: "Full-time",
    summary:
      "Drive responsible lending and client success at the front line of Nisir MFI's credit operations.",
    about:
      "As a Credit Officer at Nisir MFI, you will be the primary relationship holder for our borrowing customers. You will assess loan applications, evaluate creditworthiness, disburse approved loans, and actively monitor repayment performance. This is a high-impact role that directly determines how many lives we improve.",
    responsibilities: [
      "Evaluate loan applications from individuals and small businesses using Nisir's credit assessment framework",
      "Conduct field visits to verify applicant information and assess business viability",
      "Build and maintain long-term relationships with borrowers throughout the loan lifecycle",
      "Monitor portfolio health, follow up on overdue accounts, and support restructuring where appropriate",
      "Identify cross-selling opportunities for savings and additional financial products",
      "Prepare accurate loan documentation and maintain complete customer records",
      "Contribute to branch performance targets and portfolio quality goals",
    ],
    requirements: [
      "Bachelor's degree in Economics, Business Administration, Finance, or a related field",
      "Minimum 2 years of experience in a financial institution, microfinance, or credit role",
      "Strong understanding of credit analysis and loan portfolio management",
      "Excellent interpersonal skills and customer relationship management",
      "Fluency in Amharic; proficiency in English is an advantage",
      "Ability to work in a fast-paced, target-driven environment",
    ],
    preferred: [
      "Prior experience in microfinance or MSME lending",
      "Knowledge of additional Ethiopian regional languages",
      "Proficiency in banking software or CRM tools",
    ],
    benefits: [
      "Competitive salary benchmarked to the Ethiopian financial sector",
      "Performance bonuses tied to portfolio quality and growth",
      "Comprehensive health insurance",
      "Continuous learning and professional development program",
      "Opportunity for fast-track advancement in a growing institution",
    ],
  },
  {
    slug: "branch-manager",
    title: "Branch Manager",
    department: "Operations",
    location: "Hawassa",
    type: "Full-time",
    summary:
      "Lead a regional branch team to deliver exceptional service and drive sustainable growth.",
    about:
      "The Branch Manager is the face of Nisir MFI in their community. You will oversee all aspects of branch operations — from team leadership and business development to compliance and customer satisfaction. This is a strategic, people-first role for a proven leader who wants to make a measurable difference.",
    responsibilities: [
      "Lead, motivate, and manage a branch team of 8–15 staff members",
      "Achieve branch growth targets for loan disbursement, deposit mobilization, and customer acquisition",
      "Ensure full regulatory compliance and adherence to Nisir's operational standards",
      "Build relationships with local business communities, associations, and key stakeholders",
      "Oversee credit appraisal quality and maintain portfolio health",
      "Handle escalated customer complaints and ensure service excellence",
      "Report on branch performance to regional management and head office",
    ],
    requirements: [
      "Bachelor's degree in Business, Finance, Economics, or related field (MBA preferred)",
      "Minimum 5 years of experience in financial services, with at least 2 years in a leadership role",
      "Proven track record of achieving targets and managing teams",
      "Strong credit and financial analysis skills",
      "Excellent communication, leadership, and problem-solving skills",
      "Fluency in Amharic and relevant local language; English proficiency required",
    ],
    preferred: [
      "Experience in microfinance or development banking",
      "Prior branch management experience",
      "Familiarity with the Southern Ethiopia regional market",
    ],
    benefits: [
      "Senior-level compensation package",
      "Management bonus scheme",
      "Comprehensive health and family benefits",
      "Leadership development and mentorship program",
      "Company vehicle or transport allowance",
    ],
  },
  {
    slug: "customer-service-representative",
    title: "Customer Service Representative",
    department: "Customer Experience",
    location: "Addis Ababa",
    type: "Full-time",
    summary:
      "Be the welcoming first contact that defines every customer's experience with Nisir MFI.",
    about:
      "Our Customer Service Representatives are the heart of Nisir's customer experience. You will interact with hundreds of customers daily, helping them open accounts, process transactions, answer inquiries, and navigate our full range of financial products. Your warmth, accuracy, and professionalism directly shape trust in our institution.",
    responsibilities: [
      "Welcome customers and manage the customer queue efficiently and professionally",
      "Process deposits, withdrawals, loan repayments, and account updates",
      "Open new savings and current accounts following KYC and compliance procedures",
      "Answer product inquiries and refer customers to appropriate services",
      "Resolve customer complaints promptly or escalate as needed",
      "Maintain accurate transaction records in the banking system",
      "Support cross-selling of savings and credit products to walk-in customers",
    ],
    requirements: [
      "Diploma or Bachelor's degree in Business, Finance, or related field",
      "Minimum 1 year of experience in customer service, banking, or retail",
      "Proficiency with computers and data entry",
      "Exceptional interpersonal and communication skills",
      "High level of accuracy and attention to detail",
      "Fluency in Amharic; working English proficiency required",
    ],
    preferred: [
      "Banking software experience (Temenos, Oracle FLEXCUBE, or similar)",
      "Multilingual ability",
    ],
    benefits: [
      "Competitive entry-level salary",
      "Health insurance",
      "Training and certification support",
      "Clear career path to senior roles",
    ],
  },
  {
    slug: "risk-compliance-analyst",
    title: "Risk & Compliance Analyst",
    department: "Risk",
    location: "Addis Ababa",
    type: "Full-time",
    summary:
      "Safeguard the institution by monitoring risk, ensuring compliance, and strengthening governance frameworks.",
    about:
      "Nisir MFI operates in a regulated environment where trust and compliance are non-negotiable. As a Risk & Compliance Analyst, you will monitor credit and operational risk exposures, support regulatory reporting, and help develop frameworks that keep Nisir ahead of emerging risks. This role requires analytical rigor and a proactive mindset.",
    responsibilities: [
      "Monitor the institution's loan portfolio for credit risk concentrations and early warning signals",
      "Support preparation of monthly and quarterly regulatory reports for the National Bank of Ethiopia",
      "Review and update internal compliance policies to reflect regulatory changes",
      "Conduct periodic compliance audits of branch operations and head office departments",
      "Assist in designing and rolling out risk awareness training for staff",
      "Maintain the institution's risk register and coordinate mitigation actions",
      "Support the Audit Committee and board risk committee with data and analysis",
    ],
    requirements: [
      "Bachelor's degree in Finance, Accounting, Economics, or related field",
      "2+ years of experience in risk management, compliance, or internal audit in a financial institution",
      "Strong analytical and data interpretation skills",
      "Familiarity with Ethiopian banking regulations and NBE directives",
      "Advanced Excel; experience with risk software is a plus",
      "High ethical standards and professional integrity",
    ],
    preferred: [
      "Professional certification (e.g., CRMA, CIA, CAMS)",
      "Experience with Basel principles or IFRS 9 provisioning",
    ],
    benefits: [
      "Competitive professional salary",
      "Health insurance",
      "Professional certification sponsorship",
      "Attendance at industry conferences",
    ],
  },
  {
    slug: "digital-banking-specialist",
    title: "Digital Banking Specialist",
    department: "Technology",
    location: "Addis Ababa",
    type: "Full-time",
    summary:
      "Shape the future of Nisir's digital products and help more Ethiopians access finance on their terms.",
    about:
      "Ethiopia's digital financial landscape is evolving rapidly, and Nisir MFI is at the forefront of that change. As our Digital Banking Specialist, you will support the design, deployment, and optimization of our mobile and digital financial products. You will work at the intersection of technology, operations, and customer experience to bring accessible finance to all.",
    responsibilities: [
      "Support the development, testing, and rollout of mobile banking and digital financial products",
      "Manage day-to-day operations of digital channels — mobile app, USSD, and internet banking",
      "Identify and troubleshoot customer-facing technical issues with digital platforms",
      "Work with product and operations teams to gather requirements and improve user journeys",
      "Monitor digital channel transaction data and generate performance reports",
      "Train branch staff on digital product features and customer onboarding",
      "Support integration with payment processors, mobile money services, and core banking systems",
    ],
    requirements: [
      "Bachelor's degree in Computer Science, IT, Business Informatics, or related field",
      "2+ years of experience in digital banking, fintech, or IT in a financial institution",
      "Understanding of mobile banking platforms, APIs, and digital payment ecosystems",
      "Analytical mindset with the ability to interpret usage data and drive improvements",
      "Strong communication skills to bridge technical and non-technical teams",
    ],
    preferred: [
      "Experience with Telebirr, M-Pesa, or similar African mobile money platforms",
      "Background in product management or UX research",
      "Knowledge of cybersecurity principles relevant to digital finance",
    ],
    benefits: [
      "Competitive tech salary",
      "Remote/hybrid flexibility",
      "Health insurance",
      "Training budget for certifications and courses",
      "Exposure to cutting-edge fintech initiatives",
    ],
  },
  {
    slug: "field-loan-officer",
    title: "Field Loan Officer",
    department: "Credit",
    location: "Multiple Regions",
    type: "Full-time",
    summary:
      "Take Nisir's financial products to Ethiopia's farming communities — where impact is most needed.",
    about:
      "Our Field Loan Officers are the bridge between Nisir MFI and Ethiopia's agricultural and rural communities. Based across multiple regions, you will travel to villages, cooperatives, and farming households to assess loan applications, disburse funds, and support repayment. This is hands-on, community-facing work with visible, lasting impact.",
    responsibilities: [
      "Identify potential borrowers in agricultural and rural communities through field outreach",
      "Conduct on-site assessments of farmers' land, crops, livestock, and income streams",
      "Process loan applications and prepare documentation for approval",
      "Support loan disbursement logistics in coordination with the branch",
      "Monitor ongoing loans, visit clients during crop and harvest cycles, and manage collections",
      "Build relationships with local cooperatives, agricultural associations, and community leaders",
      "Provide financial literacy education to clients in target communities",
    ],
    requirements: [
      "Diploma or Bachelor's degree in Agriculture, Rural Development, Finance, or related field",
      "1+ years of experience in agricultural lending, field extension work, or rural microfinance",
      "Willingness and ability to travel extensively in rural areas",
      "Strong communication and community engagement skills",
      "Fluency in at least one regional language of the posted region",
      "Valid motorcycle/vehicle driving license is an advantage",
    ],
    preferred: [
      "Experience working with smallholder farmers or agricultural cooperatives",
      "Knowledge of crop cycles, farming practices, and rural livelihoods in Ethiopia",
    ],
    benefits: [
      "Field allowance on top of base salary",
      "Transport and logistics support",
      "Health insurance",
      "Annual performance bonus",
      "Housing support in remote postings",
    ],
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: easeOut },
  }),
};

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04, duration: 0.45, ease: easeOut }}
          className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed"
        >
          <CheckCircle className="w-4 h-4 text-[#22348A] shrink-0 mt-0.5" />
          {item}
        </motion.li>
      ))}
    </ul>
  );
}

export default function CareerDetail() {
  const params = useParams() as { slug?: string };
  const job = jobs.find((j) => j.slug === params.slug);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <h2 className="display-text text-[#22348A] text-3xl mb-4">
            Position Not Found
          </h2>
          <Link href="/careers">
            <div className="inline-flex items-center gap-2 bg-[#22348A] text-white text-sm font-semibold px-6 py-3 rounded cursor-pointer hover:bg-[#162260] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Careers
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden ">
      {/* ── Hero ── */}
      <section className="relative hero-gradient noise-overlay overflow-hidden py-24 md:py-32">
        <div className="absolute -right-64 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link href="/careers">
              <motion.div
                whileHover={{ x: -3 }}
                className="inline-flex items-center gap-2 text-white/50 text-sm mb-8 cursor-pointer hover:text-white/80 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Careers
              </motion.div>
            </Link>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="text-xs bg-white/10 text-white border border-white/15 rounded px-3 py-1 font-medium">
                {job.department}
              </span>
              <span className="text-xs bg-white/10 text-white border border-white/15 rounded px-3 py-1 font-medium">
                {job.type}
              </span>
            </div>
            <h1 className="display-text text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-5">
              {job.title}
            </h1>
            <p className="text-white/55 text-lg max-w-xl leading-relaxed mb-8">
              {job.summary}
            </p>
            <div className="flex flex-wrap items-center gap-5 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#BCBDC1]" /> {job.location}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#BCBDC1]" /> {job.type}
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#BCBDC1]" />{" "}
                {job.department}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 flex flex-col gap-12">
              {/* About the role */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <span className="divider-accent mb-5 block" />
                <h2 className="display-text text-[#22348A] text-2xl mb-4">
                  About the Role
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {job.about}
                </p>
              </motion.div>

              {/* Responsibilities */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <h2 className="display-text text-[#22348A] text-2xl mb-6">
                  Key Responsibilities
                </h2>
                <BulletList items={job.responsibilities} />
              </motion.div>

              {/* Requirements */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <h2 className="display-text text-[#22348A] text-2xl mb-6">
                  Requirements
                </h2>
                <BulletList items={job.requirements} />
              </motion.div>

              {/* Preferred */}
              {job.preferred.length > 0 && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <h2 className="display-text text-[#22348A] text-2xl mb-6">
                    Nice to Have
                  </h2>
                  <BulletList items={job.preferred} />
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 flex flex-col gap-6">
                {/* Apply CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="bg-[#22348A] rounded-2xl p-7"
                >
                  <h3 className="display-text text-white text-xl mb-3">
                    Apply for this role
                  </h3>
                  <p className="text-white/55 text-sm mb-6 leading-relaxed">
                    Send your CV and a cover letter to{" "}
                    <span className="text-white/80">careers@nisirmfi.com</span>{" "}
                    with the subject line{" "}
                    <span className="text-white/80">"{job.title}"</span>.
                  </p>
                  <a
                    href={`mailto:careers@nisirmfi.com?subject=${encodeURIComponent(job.title)}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 bg-white text-[#22348A] text-sm font-bold py-3 rounded cursor-pointer hover:bg-white/92 transition-colors"
                    >
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </a>
                </motion.div>

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="bg-[#f0f3fc] rounded-2xl p-7"
                >
                  <h3 className="display-text text-[#22348A] text-xl mb-5">
                    What We Offer
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {job.benefits.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-gray-600 text-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22348A] shrink-0 mt-1.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Job info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="bg-white border border-gray-100 rounded-2xl p-7 flex flex-col gap-4"
                >
                  {[
                    { label: "Location", value: job.location },
                    { label: "Type", value: job.type },
                    { label: "Department", value: job.department },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">
                        {label}
                      </div>
                      <div className="text-[#22348A] text-sm font-semibold">
                        {value}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Other openings ── */}
      <section className="py-16 bg-[#f0f3fc]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <h3 className="display-text text-[#22348A] text-2xl mb-8">
            Other Open Positions
          </h3>
          <div className="flex flex-col gap-3">
            {jobs
              .filter((j) => j.slug !== job.slug)
              .slice(0, 3)
              .map((j, i) => (
                <motion.div
                  key={j.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  className="bg-white border border-gray-100 rounded-xl p-5 hover:border-[#22348A]/25 hover:shadow-sm transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-[#22348A] text-sm mb-1 group-hover:underline underline-offset-2">
                        {j.title}
                      </h4>
                      <p className="text-gray-400 text-xs">
                        {j.location} · {j.type}
                      </p>
                    </div>
                    <Link href={`/careers/${j.slug}`}>
                      <motion.div
                        whileHover={{ x: 3 }}
                        className="inline-flex items-center gap-1.5 text-[#22348A] text-xs font-semibold cursor-pointer shrink-0"
                      >
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              ))}
          </div>
          <div className="mt-8">
            <Link href="/careers">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center gap-2 bg-[#22348A] text-white text-sm font-semibold px-6 py-3 rounded cursor-pointer hover:bg-[#162260] transition-colors"
              >
                View All Positions <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
