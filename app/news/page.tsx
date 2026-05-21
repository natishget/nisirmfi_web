"use client";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Tag } from "lucide-react";

const IMG = {
  hero: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80",
  feat: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80",
  a1: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80",
  a2: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80",
  a3: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80",
  a4: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=600&q=80",
  a5: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80",
  a6: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
};

const featured = {
  title: "Nisir MFI Crosses 20,000 Active Customer Milestone",
  date: "March 14, 2024",
  category: "Institutional",
  excerpt:
    "Nisir Microfinance Institution S.C. has reached a landmark — 20,000 active customers — marking a decade of steady growth in financial inclusion across Ethiopia. The achievement reflects our commitment to reaching the underserved and providing trusted credit and savings services.",
  readTime: "4 min read",
  img: IMG.feat,
};

const articles = [
  {
    title: "Expanding Our Agricultural Loan Portfolio in Regional Ethiopia",
    date: "February 5, 2024",
    category: "Products",
    excerpt:
      "We are expanding our agricultural programme to serve smallholder farmers in Oromia, SNNPR, and Amhara regions — with increased loan ceilings.",
    readTime: "3 min read",
    img: IMG.a1,
  },
  {
    title: "New Branch Opening in Wolaita Sodo",
    date: "January 22, 2024",
    category: "Expansion",
    excerpt:
      "Nisir MFI is pleased to announce the opening of our latest branch in Wolaita Sodo, extending our reach to Southern Ethiopia.",
    readTime: "2 min read",
    img: IMG.a2,
  },
  {
    title: "Digital Account Opening Now Available at Selected Branches",
    date: "December 10, 2023",
    category: "Digital",
    excerpt:
      "Customers at our Bole and Adama branches can now complete account opening digitally — reducing processing time from days to hours.",
    readTime: "3 min read",
    img: IMG.a3,
  },
  {
    title: "Nisir MFI Supports Women Entrepreneurs Through Group Lending",
    date: "November 3, 2023",
    category: "Community",
    excerpt:
      "Our group lending programme has disbursed over ETB 12 million to women-led businesses this year, supporting 1,400 female entrepreneurs.",
    readTime: "4 min read",
    img: IMG.a4,
  },
  {
    title: "Understanding the Micro-Enterprise Loan: A Borrower's Guide",
    date: "October 18, 2023",
    category: "Financial Education",
    excerpt:
      "A practical overview of who qualifies for our Micro-Enterprise Loan, what documents are required, and how to make the most of your credit.",
    readTime: "5 min read",
    img: IMG.a5,
  },
  {
    title:
      "Q3 2023 Performance: Continued Growth in Deposits and Disbursements",
    date: "September 28, 2023",
    category: "Institutional",
    excerpt:
      "Nisir MFI's Q3 results reflect strong growth in loan disbursements and savings deposits, with repayment performance above 92%.",
    readTime: "3 min read",
    img: IMG.a6,
  },
];

const catColors: Record<string, string> = {
  Institutional: "bg-[#f0f3fc] text-[#22348A]",
  Products: "bg-amber-50 text-amber-700",
  Expansion: "bg-teal-50 text-teal-700",
  Digital: "bg-violet-50 text-violet-700",
  Community: "bg-rose-50 text-rose-700",
  "Financial Education": "bg-emerald-50 text-emerald-700",
};

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.55, ease: easeOut },
  }),
};

export default function News() {
  return (
    <div className="overflow-x-hidden ">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[55vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={IMG.hero}
            alt="News"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a52] via-[#0d1a52]/65 to-[#22348A]/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="block w-8 h-px bg-[#BCBDC1] mb-6" />
            <h1 className="display-text text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-5">
              News & Insights
            </h1>
            <p className="text-white/55 text-lg max-w-lg leading-relaxed">
              Institutional announcements, new products, community impact, and
              financial education.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10"
          >
            <span className="divider-accent mb-5 block" />
            <h2 className="display-text text-[#22348A] text-2xl">
              Featured Story
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="group grid lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer"
          >
            <div className="lg:col-span-2 relative min-h-[280px]">
              <img
                src={featured.img}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[#22348A]/30" />
            </div>
            <div className="lg:col-span-3 bg-[#22348A] p-10 md:p-12 flex flex-col justify-between">
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-5 ${catColors[featured.category]}`}
                >
                  <Tag className="w-3 h-3" /> {featured.category}
                </span>
                <h3 className="display-text text-white text-2xl md:text-3xl leading-tight mb-5">
                  {featured.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {featured.excerpt}
                </p>
              </div>
              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center gap-4 text-[#BCBDC1] text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {featured.date}
                  </div>
                  <span>{featured.readTime}</span>
                </div>
                <div className="inline-flex items-center gap-2 text-white text-sm font-semibold group-hover:gap-3 transition-all">
                  Read <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-20 bg-[#f0f3fc]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10"
          >
            <span className="divider-accent mb-5 block" />
            <h2 className="display-text text-[#22348A] text-2xl">
              Recent News
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: easeOut }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 16px 40px rgba(34,52,138,0.10)",
                }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer group transition-all duration-300"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={a.img}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#22348A]/50 to-transparent" />
                  <span
                    className={`absolute top-3 left-3 inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${catColors[a.category] || "bg-gray-100 text-gray-600"}`}
                  >
                    {a.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-[#22348A] text-sm mb-2.5 leading-snug group-hover:underline underline-offset-2">
                    {a.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">
                    {a.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#BCBDC1]" />
                      {a.date}
                    </div>
                    <div className="flex items-center gap-1 text-[#22348A] font-semibold group-hover:gap-2 transition-all">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-[#0d1a52]">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="display-text text-white text-2xl sm:text-3xl mb-4">
              Stay informed
            </h2>
            <p className="text-white/50 text-sm mb-8 max-w-sm mx-auto">
              Receive Nisir MFI announcements, financial tips, and product
              updates directly.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/8 border border-white/15 text-white placeholder:text-white/30 text-sm px-4 py-3 rounded-full focus:outline-none focus:border-white/40"
              />
              <button className="bg-white text-[#22348A] text-sm font-bold px-6 py-3 rounded-full hover:bg-white/92 transition-colors shrink-0">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
