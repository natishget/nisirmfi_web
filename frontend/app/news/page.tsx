"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Tag, Loader2, BookOpen } from "lucide-react";

const IMG = {
  hero: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80",
};

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

function formatDisplayDate(dateValue: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateValue));
  } catch (e) {
    return dateValue;
  }
}

export default function News() {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const BASE_URL = (process.env.NEXT_PUBLIC_LOCAL_API || "http://localhost:3001/").trim().replace(/\/$/, "");
        const response = await fetch(`${BASE_URL}/news?status=PUBLISHED&limit=100`);
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const json = await response.json();
        setNewsItems(json.data || []);
      } catch (err) {
        console.error("Failed to load news articles:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  const featuredStory = newsItems.find((item) => item.isFeatured) || newsItems[0];
  const regularArticles = newsItems.filter((item) => item.id !== featuredStory?.id);

  return (
    <div className="overflow-x-hidden">
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

      {loading ? (
        <section className="py-32 bg-white flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-[#22348A] animate-spin" />
          <p className="text-slate-500 font-medium text-sm">Loading articles...</p>
        </section>
      ) : newsItems.length === 0 ? (
        <section className="py-32 bg-white flex flex-col items-center justify-center text-center px-5">
          <div className="rounded-full bg-[#f0f3fc] p-6 text-[#22348A] mb-5">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-[#22348A] font-semibold text-2xl mb-2">No news items found</h2>
          <p className="text-slate-500 text-sm max-w-md">
            Stay tuned! We are preparing exciting news and announcements for you. Please check back later.
          </p>
        </section>
      ) : (
        <>
          {/* Featured */}
          {featuredStory && (
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
                      src={featuredStory.imageUrl}
                      alt={featuredStory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-[#22348A]/30" />
                  </div>
                  <div className="lg:col-span-3 bg-[#22348A] p-10 md:p-12 flex flex-col justify-between">
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-5 ${
                          catColors[featuredStory.category] || "bg-white/10 text-white"
                        }`}
                      >
                        <Tag className="w-3 h-3" /> {featuredStory.category}
                      </span>
                      <h3 className="display-text text-white text-2xl md:text-3xl leading-tight mb-5">
                        {featuredStory.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {featuredStory.summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-8">
                      <div className="flex items-center gap-4 text-[#BCBDC1] text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDisplayDate(featuredStory.publishedDate)}
                        </div>
                        <span>{featuredStory.readTime} min read</span>
                      </div>
                      <div className="inline-flex items-center gap-2 text-white text-sm font-semibold group-hover:gap-3 transition-all">
                        Read <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          {/* Articles grid */}
          {regularArticles.length > 0 && (
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
                  {regularArticles.map((a, i) => (
                    <motion.div
                      key={a.id}
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
                          src={a.imageUrl}
                          alt={a.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#22348A]/50 to-transparent" />
                        <span
                          className={`absolute top-3 left-3 inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                            catColors[a.category] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {a.category}
                        </span>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-[#22348A] text-sm mb-2.5 leading-snug group-hover:underline underline-offset-2">
                          {a.title}
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">
                          {a.summary}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#BCBDC1]" />
                            {formatDisplayDate(a.publishedDate)}
                          </div>
                          <div className="flex items-center gap-1 text-[#22348A] font-semibold group-hover:gap-2 transition-all">
                            {a.readTime} min read <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

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
            <p className="text-white/55 text-sm mb-8 max-w-sm mx-auto">
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
