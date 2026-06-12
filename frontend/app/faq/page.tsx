"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";

const categories = [
  {
    label: "General",
    items: [
      {
        q: "What is Nisir Microfinance Institution?",
        a: "Nisir MFI is an Ethiopian microfinance institution established in 2014 and licensed by the National Bank of Ethiopia. We provide accessible credit and savings services to MSMEs, entrepreneurs, farmers, and individuals across Ethiopia.",
      },
      {
        q: "Where are your branches located?",
        a: "We operate 20+ branches across Ethiopia, including five locations in Addis Ababa (Head Office, Piassa, Merkato, CMC, Kolfe) and branches in Adama, Bahir Dar, Gondar, Mekelle, Hawassa, Jimma, Dire Dawa, and more regional cities.",
      },
      {
        q: "Are my deposits protected?",
        a: "Yes. Nisir MFI is fully licensed and supervised by the National Bank of Ethiopia. All customer deposits are protected under Ethiopian financial law and our regulatory framework.",
      },
      {
        q: "How do I reach Nisir MFI?",
        a: "By phone: +251 116 39 13 38. By email: info@nisirmfi.com. Or by visiting any branch Monday to Friday 8:30 AM–5:30 PM, Saturday 9:00 AM–1:00 PM.",
      },
    ],
  },
  {
    label: "Loans",
    items: [
      {
        q: "What loan products do you offer?",
        a: "We offer four main credit products: Business Loans (ETB 10,000–2,000,000), Agriculture Loans (ETB 5,000–500,000), Micro-Enterprise Loans (ETB 2,000–150,000), and Emergency Loans (ETB 1,000–50,000).",
      },
      {
        q: "How long does approval take?",
        a: "Most applications are reviewed within 24–48 business hours once all required documentation is submitted. Emergency loans may receive a same-day decision for existing customers.",
      },
      {
        q: "What documents are required?",
        a: "Typically: a valid national ID or passport, proof of residence, business registration certificate (for business loans), recent bank statements, and a completed application form. Additional documents may be required based on the loan type.",
      },
      {
        q: "Is collateral required?",
        a: "Not always. Group guarantee loans and micro-enterprise loans may not require traditional collateral. Business loans typically require assets such as property or equipment, or a qualified guarantor.",
      },
      {
        q: "Can I repay early?",
        a: "Yes — we actively encourage early repayment. It may also qualify you for preferential rates on subsequent loans. Contact your branch for the early repayment procedure.",
      },
    ],
  },
  {
    label: "Savings",
    items: [
      {
        q: "What savings products do you offer?",
        a: "We offer Regular Savings (up to 7% p.a.), Fixed Deposit (up to 11% p.a., locked terms of 3–36 months), Goal-Based Savings (up to 9% p.a.), and Group Savings (up to 8% p.a.).",
      },
      {
        q: "Is there a minimum deposit to open an account?",
        a: "Regular Savings has no minimum balance requirement. Fixed Deposit and Goal-Based Savings accounts have modest minimum initial deposits starting from ETB 500.",
      },
      {
        q: "Can I withdraw from my savings anytime?",
        a: "Regular savings accounts allow free withdrawals at any time. Fixed deposits are committed for the agreed term, though early access may be available with a penalty under specific conditions.",
      },
    ],
  },
  {
    label: "Eligibility",
    items: [
      {
        q: "Who can apply for a loan or savings account?",
        a: "Any Ethiopian citizen aged 18 or above may open a savings account. Loan eligibility depends on the product but generally includes residents with a valid ID and verifiable income or business activity.",
      },
      {
        q: "Can I apply without a credit history?",
        a: "Yes. Nisir MFI specialises in serving first-time borrowers and the underserved. We assess each application individually, and having an active savings account with us is a meaningful positive factor.",
      },
      {
        q: "Can groups or cooperatives apply?",
        a: "Yes. We offer group lending and group savings products specifically designed for savings groups, cooperatives, and community associations.",
      },
    ],
  },
];

function FAQItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05 }}
      data-testid={`faq-item-${i}`}
      className="border-b border-gray-100 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        data-testid={`faq-toggle-${i}`}
        className="w-full flex items-center justify-between gap-6 py-5 text-left hover:text-[#22348A] transition-colors group"
      >
        <span
          className={`text-sm font-medium transition-colors ${open ? "text-[#22348A]" : "text-gray-800"}`}
        >
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-[#BCBDC1] group-hover:text-[#22348A] transition-all ${open ? "rotate-180 text-[#22348A]" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-500 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [active, setActive] = useState("General");
  const current = categories.find((c) => c.label === active)!;

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
            <h1 className="display-text text-white text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.12] mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-white/55 text-lg max-w-lg leading-relaxed">
              Everything you need to know about our services, eligibility, and
              how we work.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((c) => (
              <button
                key={c.label}
                data-testid={`faq-category-${c.label.toLowerCase()}`}
                onClick={() => setActive(c.label)}
                className={`px-5 py-2 rounded text-sm font-medium transition-all ${
                  active === c.label
                    ? "bg-[#22348A] text-white"
                    : "bg-[#f0f3fc] text-gray-600 hover:text-[#22348A]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* FAQ list */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="border border-gray-100 rounded divide-y divide-gray-100 px-6"
            >
              {current.items.map((item, i) => (
                <FAQItem key={item.q} q={item.q} a={item.a} i={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Still have questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 border border-[#22348A]/15 rounded p-8 bg-[#f0f3fc] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
          >
            <div>
              <h3 className="font-bold text-[#22348A] mb-1">
                Still have questions?
              </h3>
              <p className="text-gray-500 text-sm">
                Our team is always ready to help — reach out or visit a branch.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/contact" data-testid="link-faq-contact">
                <div className="inline-flex items-center gap-2 bg-[#22348A] text-white text-sm font-semibold px-5 py-2.5 rounded cursor-pointer hover:bg-[#162260] transition-colors">
                  Contact Us <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
              <Link href="/branches" data-testid="link-faq-branches">
                <div className="inline-flex items-center gap-2 border border-[#22348A]/25 text-[#22348A] text-sm font-medium px-5 py-2.5 rounded cursor-pointer hover:bg-white transition-colors">
                  Find a Branch
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
