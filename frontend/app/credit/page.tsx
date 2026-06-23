"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import LoanMonitorSection from "../components/LoanMonitorSection";

const IMG = {
  hero: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80",
  biz: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=600&q=80",
  agri: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80",
  micro:
    "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=600&q=80",
  emergency:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
};

const products = [
  {
    title: "Small and Medium Enterprise (SME)",
    tagline: "For established and growing enterprises",
    img: IMG.biz,
    amount: "12,000,000 ETB",
    term: "5 Years",
    desc: "Scale your operations, purchase inventory, or expand your team with flexible business financing.",
    features: [
      "Competitive interest rates",
      "Flexible collateral options",
      "Dedicated relationship officer",
      "No hidden fees",
    ],
  },
  {
    title: "Micro Business Loan",
    tagline: "Seasonal financing for Ethiopian farmers",
    img: IMG.agri,
    amount: "ETB 5,000 – 500,000",
    term: "3 – 18 months",
    desc: "Harvest-aligned loan structures for seeds, fertilizers, irrigation equipment, and post-harvest processing.",
    features: [
      "Seasonal repayment schedule",
      "Group lending accepted",
      "Field officer support",
      "Subsidised interest rate",
    ],
  },
  {
    title: "Car Loan",
    tagline: "Quick capital for small traders",
    img: IMG.micro,
    amount: "ETB 2,000 – 150,000",
    term: "3 – 24 months",
    desc: "Fast-access financing for market traders, micro-businesses, and vendors to grow their daily operations.",
    features: [
      "Minimal documentation",
      "24-hour processing",
      "Group guarantee accepted",
      "Repeat-borrower incentives",
    ],
  },
  {
    title: "Bridge Loan",
    tagline: "When time is critical",
    img: IMG.emergency,
    amount: "ETB 1,000 – 50,000",
    term: "1 – 6 months",
    desc: "Rapid-access credit for existing customers facing urgent personal or business needs.",
    features: [
      "Same-day decision",
      "Priority for existing customers",
      "Minimal requirements",
      "Fast disbursement",
    ],
  },
  {
    title: "Enterpreneurship Loan",
    tagline: "When time is critical",
    img: IMG.emergency,
    amount: "ETB 1,000 – 50,000",
    term: "1 – 6 months",
    desc: "Rapid-access credit for existing customers facing urgent personal or business needs.",
    features: [
      "Same-day decision",
      "Priority for existing customers",
      "Minimal requirements",
      "Fast disbursement",
    ],
  },
  {
    title: "Housing Loan",
    tagline: "When time is critical",
    img: IMG.emergency,
    amount: "ETB 1,000 – 50,000",
    term: "1 – 6 months",
    desc: "Rapid-access credit for existing customers facing urgent personal or business needs.",
    features: [
      "Same-day decision",
      "Priority for existing customers",
      "Minimal requirements",
      "Fast disbursement",
    ],
  },
  {
    title: "Consumption Loan",
    tagline: "When time is critical",
    img: IMG.emergency,
    amount: "ETB 1,000 – 50,000",
    term: "1 – 6 months",
    desc: "Rapid-access credit for existing customers facing urgent personal or business needs.",
    features: [
      "Same-day decision",
      "Priority for existing customers",
      "Minimal requirements",
      "Fast disbursement",
    ],
  },
];

const steps = [
  {
    n: "01",
    title: "Submit Application",
    desc: "Complete our form online or at any branch. Bring your ID and supporting documents.",
  },
  {
    n: "02",
    title: "Application Review",
    desc: "Our credit team reviews your application within 24–48 business hours.",
  },
  {
    n: "03",
    title: "Loan Agreement",
    desc: "Receive your decision, review the terms, and sign your loan agreement.",
  },
  {
    n: "04",
    title: "Funds Disbursed",
    desc: "Approved funds are transferred to your account — ready to use for your goals.",
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const eligibility = [
  "Ethiopian citizen aged 18 or above",
  "Valid national ID or passport",
  "Verifiable income or business activity",
  "Recent utility bill or proof of residence",
  "Business registration certificate (for business loans)",
  "No active default on previous loans",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.55, ease: easeOut },
  }),
};

export default function Credit() {
  return (
    <div className="overflow-x-clip">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={IMG.hero}
            alt="Business meeting"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a52] via-[#0d1a52]/65 to-[#22348A]/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 w-full">
          <div>
            <span className="block w-8 h-px bg-[#BCBDC1] mb-6" />
            <h1 className="display-text text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-5">
              Credit Services
            </h1>
            <p className="text-white/55 text-lg max-w-xl leading-relaxed mb-8">
              Flexible credit built around the realities of Ethiopian business —
              fair terms, fast decisions, and a team that understands your
              world.
            </p>
            <Link href="/apply">
              <div className="inline-flex items-center gap-2 bg-white text-[#22348A] text-sm font-bold px-7 py-3.5 rounded-full cursor-pointer w-fit">
                Apply for a Loan <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Loan Products */}
      {/* <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="mb-14">
            <span className="divider-accent mb-5 block" />
            <h2 className="display-text text-[#22348A] text-3xl sm:text-4xl">
              Loan Products
            </h2>
          </div>
          <div className="flex flex-col gap-6">
            {products.map((p, i) => (
              <div
                key={p.title}
                className="group grid lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-500"
              >
                Left image + text
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
                    <h3 className="display-text text-white text-2xl">
                      {p.title}
                    </h3>
                  </div>
                </div>
                Right
                <div className="lg:col-span-3 bg-white p-8 flex flex-col justify-between gap-6">
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {p.desc}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="bg-[#f0f3fc] rounded-xl p-4">
                      <div className="text-xs text-gray-400 mb-1">
                        Loan Amount
                      </div>
                      <div className="text-sm font-bold text-[#22348A]">
                        {p.amount}
                      </div>
                    </div>
                    <div className="bg-[#f0f3fc] rounded-xl p-4">
                      <div className="text-xs text-gray-400 mb-1">
                        Loan Term
                      </div>
                      <div className="text-sm font-bold text-[#22348A]">
                        {p.term}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {p.features.map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[#22348A] shrink-0" />
                        <span className="text-gray-600 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/apply">
                    <div className="inline-flex items-center gap-2 bg-[#22348A] text-white text-sm font-bold px-5 py-2.5 rounded-full cursor-pointer hover:bg-[#162260] transition-colors w-fit">
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <LoanMonitorSection />

      {/* How It Works */}
      <section className="py-24 bg-[#f0f3fc]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="mb-14">
            <span className="divider-accent mb-5 block" />
            <h2 className="display-text text-[#22348A] text-3xl sm:text-4xl">
              How it works
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
            {steps.map((s, i) => (
              <div key={s.n} className="bg-white p-8 transition-colors">
                <div className="text-3xl font-bold text-[#22348A]/15 mb-5">
                  {s.n}
                </div>
                <h3 className="font-bold text-[#22348A] mb-3 text-sm">
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="divider-accent mb-5 block" />
              <h2 className="display-text text-[#22348A] text-3xl sm:text-4xl mb-5">
                Eligibility requirements
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our requirements are designed to be inclusive. Most Ethiopians
                with a verifiable income source or business activity will
                qualify.
              </p>
            </div>
            <div>
              <div className="flex flex-col gap-3">
                {eligibility.map((req, i) => (
                  <div
                    key={req}
                    className="flex items-start gap-3 border border-gray-100 rounded-xl px-5 py-4 hover:border-[#22348A]/20 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 text-[#22348A] mt-0.5 shrink-0" />
                    <span className="text-gray-700 text-sm">{req}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/apply">
                  <div className="inline-flex items-center gap-2 bg-[#22348A] text-white text-sm font-bold px-7 py-3.5 rounded-full cursor-pointer">
                    Start Your Application <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
