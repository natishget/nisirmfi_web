import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const col1 = [
  { label: "About Us", href: "/about" },
  { label: "Our Leadership", href: "/about" },
  { label: "News & Insights", href: "/news" },
  { label: "Careers", href: "/careers" },
];

const col2 = [
  { label: "Credit Services", href: "/credit" },
  { label: "Savings Services", href: "/savings" },
  { label: "Loan Application", href: "/apply" },
  { label: "Branch Network", href: "/branches" },
];

const col3 = [
  { label: "FAQ", href: "/faq" },
  { label: "Customer Stories", href: "/testimonials" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0d1a52] text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6  flex items-center justify-center ">
                <img src="/Logo white only.png" alt="Nisir MFI logo" />
              </div>
              <div>
                <div className="font-bold text-white text-base leading-tight">
                  Nisir MFI
                </div>
                <div className="text-white/40 text-[10px] tracking-wider uppercase">
                  Microfinance Institution S.C.
                </div>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-xs">
              Empowering Ethiopian entrepreneurs and families since 2014 through
              trusted, need-based financial solutions. Licensed by the National
              Bank of Ethiopia.
            </p>

            <div className="flex flex-col gap-3 text-sm text-white/50">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-[#BCBDC1] shrink-0" />
                <span>Bole Sub-city, Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#BCBDC1] shrink-0" />
                <span>+251 116 39 13 38</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#BCBDC1] shrink-0" />
                <span>info@nisirmfi.com</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-[#BCBDC1] shrink-0" />
                <span>Mon–Fri 8:30–17:30 &nbsp;|&nbsp; Sat 9:00–13:00</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-5">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {col1.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-5">
              Services
            </h4>
            <ul className="flex flex-col gap-3">
              {col2.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-5">
              Support
            </h4>
            <ul className="flex flex-col gap-3">
              {col3.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Nisir Microfinance Institution
            S.C. All rights reserved. &nbsp;|&nbsp; Regulated by the National
            Bank of Ethiopia.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-colors text-xs font-semibold"
            >
              in
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-colors text-xs font-semibold"
            >
              f
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="w-8 h-8 rounded flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-colors text-xs font-semibold"
            >
              t
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
