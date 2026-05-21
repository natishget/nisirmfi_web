"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Search } from "lucide-react";

const branches = [
  {
    name: "Head Office",
    city: "Addis Ababa",
    area: "Bole Sub-city",
    phone: "+251 116 39 13 38",
    hours: "Mon–Fri 8:30–17:30",
    type: "Head Office",
  },
  {
    name: "Piassa Branch",
    city: "Addis Ababa",
    area: "Piassa",
    phone: "+251 111 23 45 67",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Merkato Branch",
    city: "Addis Ababa",
    area: "Merkato",
    phone: "+251 111 34 56 78",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "CMC Branch",
    city: "Addis Ababa",
    area: "CMC Road",
    phone: "+251 111 45 67 89",
    hours: "Mon–Fri 8:30–17:30",
    type: "Branch",
  },
  {
    name: "Kolfe Branch",
    city: "Addis Ababa",
    area: "Kolfe Keranio",
    phone: "+251 111 56 78 90",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Adama Branch",
    city: "Adama",
    area: "City Centre",
    phone: "+251 222 11 22 33",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Bahir Dar Branch",
    city: "Bahir Dar",
    area: "Main Street",
    phone: "+251 582 11 22 33",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Gondar Branch",
    city: "Gondar",
    area: "Piazza",
    phone: "+251 581 11 22 33",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Mekelle Branch",
    city: "Mekelle",
    area: "City Centre",
    phone: "+251 344 11 22 33",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Hawassa Branch",
    city: "Hawassa",
    area: "Tabor Ketema",
    phone: "+251 462 11 22 33",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Jimma Branch",
    city: "Jimma",
    area: "Main Market",
    phone: "+251 471 11 22 33",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Dire Dawa Branch",
    city: "Dire Dawa",
    area: "Sabian Area",
    phone: "+251 251 11 22 33",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Dessie Branch",
    city: "Dessie",
    area: "Kombolcha Road",
    phone: "+251 331 11 22 33",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Debre Birhan Branch",
    city: "Debre Birhan",
    area: "City Centre",
    phone: "+251 111 22 33 44",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Shashemene Branch",
    city: "Shashemene",
    area: "Main Road",
    phone: "+251 463 11 22 33",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Debre Markos Branch",
    city: "Debre Markos",
    area: "Town Centre",
    phone: "+251 582 22 33 44",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Arba Minch Branch",
    city: "Arba Minch",
    area: "Secha Area",
    phone: "+251 468 11 22 33",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Wolaita Sodo Branch",
    city: "Wolaita Sodo",
    area: "Main Market",
    phone: "+251 465 11 22 33",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Nekemte Branch",
    city: "Nekemte",
    area: "City Centre",
    phone: "+251 572 11 22 33",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Harar Branch",
    city: "Harar",
    area: "Jugol Area",
    phone: "+251 256 11 22 33",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Axum Branch",
    city: "Axum",
    area: "Town Centre",
    phone: "+251 347 11 22 33",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Assosa Branch",
    city: "Assosa",
    area: "Main Street",
    phone: "+251 571 11 22 33",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.035, duration: 0.45, ease: easeOut },
  }),
};

export default function Branches() {
  const [search, setSearch] = useState("");

  const filtered = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.city.toLowerCase().includes(search.toLowerCase()) ||
      b.area.toLowerCase().includes(search.toLowerCase()),
  );

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
              Branch Network
            </h1>
            <p className="text-white/55 text-lg max-w-xl leading-relaxed mb-10">
              20+ branches spanning Addis Ababa and major cities across Ethiopia
              — we are present where our customers need us.
            </p>
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                data-testid="input-branch-search"
                type="search"
                placeholder="Search by city or branch name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white rounded text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22348A]/30 shadow-md"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Summary strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-3 gap-px bg-gray-100">
            {[
              { value: "22", label: "Total Branches" },
              { value: "10+", label: "Cities Covered" },
              { value: "6 days / week", label: "Open Hours" },
            ].map((s) => (
              <div key={s.label} className="bg-white py-6 px-5">
                <div className="text-2xl font-bold text-[#22348A] mb-1">
                  {s.value}
                </div>
                <div className="text-gray-400 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branch list */}
      <section className="py-16 bg-[#f0f3fc]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <MapPin className="w-10 h-10 mx-auto mb-4 opacity-20" />
              <p>No branches found for "{search}"</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-6 tracking-wide">
                {filtered.length} branch{filtered.length !== 1 ? "es" : ""}{" "}
                found
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((b, i) => (
                  <motion.div
                    key={b.name}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={fadeUp}
                    data-testid={`branch-card-${i}`}
                    className="bg-white border border-gray-100 rounded p-6 hover:border-[#22348A]/25 hover:shadow-sm transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#f0f3fc] flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-[#22348A]" />
                        </div>
                        <div>
                          <div className="font-bold text-[#22348A] text-sm">
                            {b.name}
                          </div>
                          <div className="text-gray-400 text-xs mt-0.5">
                            {b.area}, {b.city}
                          </div>
                        </div>
                      </div>
                      {b.type === "Head Office" && (
                        <span className="text-[10px] font-bold text-[#22348A] bg-[#f0f3fc] border border-[#22348A]/15 rounded px-2 py-0.5 shrink-0">
                          HQ
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 text-xs text-gray-500 border-t border-gray-50 pt-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#BCBDC1] shrink-0" />
                        <a
                          href={`tel:${b.phone}`}
                          className="hover:text-[#22348A] transition-colors"
                        >
                          {b.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#BCBDC1] shrink-0" />
                        <span>{b.hours}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
