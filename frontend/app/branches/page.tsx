"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Search } from "lucide-react";

const branches = [
  {
    name: "Premium Branch",
    city: "Addis Ababa",
    area: "Bole Rwanda to Atlas Nisir Bldg., European Union Street",
    phone: "+251 116 663 492",
    hours: "Mon–Sat 8:30–17:30",
    type: "Head Office",
  },
  {
    name: "Main Branch",
    city: "Addis Ababa",
    area: "Dembel City Center",
    phone: "+251 115 500 700",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Piassa Branch",
    city: "Addis Ababa",
    area: "Dejach Wube Sefer, In front of Addis Ababa restaurant; 1st floor",
    phone: "+251 111 23 45 67",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },

  {
    name: "Megenagna Branch",
    city: "Addis Ababa",
    area: "CMC Road",
    phone: "+251 116 674 666",
    hours: "Mon–Fri 8:30–17:30",
    type: "Branch",
  },
  {
    name: "Bekelobet Branch",
    city: "Addis Ababa",
    area: "Lancha Mikwor Plaza Bdg. Ground Flr.",
    phone: "+251 114 705 473",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Sengatera Branch",
    city: "Addis Ababa",
    area: "Sagatera 40/60 Condominium Block 1; 2nd Floor",
    phone: "+251 112 732 759",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Lebu Branch",
    city: "Addis Ababa",
    area: "Lebu mebrat; infont of Zemen Gas Station; 1st floor of Tigust and Aikel Building",
    phone: "+251 114 625 989",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Gerar Branch",
    city: "Addis Ababa",
    area: "Ayer Tena Deblo building , 2nd Floor",
    phone: "+251 113 694 173",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Summit Branch",
    city: "Addis Ababa",
    area: "Around Fiyel bet GN Building 1st floor",
    phone: "+251 116 701 693",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Ayat Branch",
    city: "Addis Ababa",
    area: "Ayat infront of All Mart Supermarket",
    phone: "+251 116 700 576",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Pastor Branch",
    city: "Addis Ababa",
    area: "Tsehai Bridge, next to Adarge School; Ayelech Building, 1st floor",
    phone: "+251 112 740 298",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Karl Branch",
    city: "Addis Ababa",
    area: "Sarbet; Bisrat Gabriel Road; Next to Queens Supermarket ; Boren Building 2nd Floor",
    phone: "+251 113 837 039",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Bulbula Branch",
    city: "Addis Ababa",
    area: "Red soil;Before Jamboro Real Estate,",
    phone: "+251 114 432 225",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Kality Branch",
    city: "Addis Ababa",
    area: "Next to Kality Total Gas Station 1st Flr.",
    phone: "+251 114 552 490",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Kotebe Branch",
    city: "Addis Ababa",
    area: "Kotebe 02 Next to Yerer Building 1st Flr.",
    phone: "+251 116 734 513",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Gerji Branch",
    city: "Addis Ababa",
    area: "Gerji Roba infront of Sunshine Bld",
    phone: "+251 116 394 694",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Jemo Branch",
    city: "Addis Ababa",
    area: "Jamo 1, 67 Mazoriya Densher Bld. 1st Flr.",
    phone: "+251 114 379 196",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Tafo Branch",
    city: "Addis Ababa",
    area: "Next to EthioTelecom CCD Homes.",
    phone: "+251 116 702 240",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Butajira Branch",
    city: "Butajira",
    area: "Butajira; Infront of Ethio telecom; Admas Bogale Building",
    phone: "",
    hours: "Mon–Sat 8:30–17:00",
    type: "Branch",
  },
  {
    name: "Hosana Branch",
    city: "Hosana",
    area: "Hosanna Main Street, Ambcho Road, in front of Saleme Café",
    phone: "+251 461 780 717",
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
