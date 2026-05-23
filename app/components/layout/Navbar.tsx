"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Building2,
  Users,
  LayoutGrid,
  MapPin,
} from "lucide-react";
// Logo served from public/

interface NavChild {
  label: string;
  href: string;
  desc?: string;
  icon?: React.ComponentType<{ className?: string }>;
}
interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

const baseNavLinks: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      {
        label: "About Us",
        href: "/about",
        desc: "Our mission, values & story",
        icon: Building2,
      },
      {
        label: "Branches",
        href: "/branches",
        desc: "20+ locations across Ethiopia",
        icon: MapPin,
      },
      {
        label: "Our Boards",
        href: "/boards",
        desc: "Board of directors",
        icon: LayoutGrid,
      },
      {
        label: "Our Team",
        href: "/team",
        desc: "Leadership & management",
        icon: Users,
      },
    ],
  },
  {
    label: "Services",
    href: "#",
    children: [
      { label: "Credit Services", href: "/credit" },
      { label: "Savings Services", href: "/savings" },
    ],
  },
  { label: "News", href: "/news" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "same-origin",
        });

        if (cancelled) {
          return;
        }

        setIsAuthenticated(response.ok);
      } catch {
        if (!cancelled) {
          setIsAuthenticated(false);
        }
      }
    };

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const navLinks = useMemo(() => {
    if (isAuthenticated !== true) {
      return baseNavLinks;
    }

    const links = [...baseNavLinks];
    links.splice(5, 0, { label: "Dashboard", href: "/dashboard" });

    return links;
  }, [isAuthenticated]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));
  const isDropdownActive = (item: NavItem) =>
    item.children?.some(
      (c) => pathname === c.href || pathname?.startsWith(c.href),
    ) ?? false;

  const toggleDropdown = (label: string) =>
    setOpenDropdown((prev) => (prev === label ? null : label));

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-50 bg-white border-b border-gray-100 ${
        scrolled ? " shadow-sm top-0" : " w-[80%] mx-auto rounded-full top-1"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/">
            <div
              className="flex items-center gap-3 cursor-pointer"
              data-testid="link-logo"
            >
              <div
                className={`w-7  flex items-center justify-center transition-colors bg-white `}
              >
                <img src="../Logo only.png" alt="Nisir MFI logo" />
              </div>
              <div>
                <div
                  className={`font-bold text-base leading-tight tracking-tight transition-colors text-[#22348A] `}
                >
                  Nisir MFI
                </div>
                <div
                  className={`text-[10px] leading-tight tracking-wider uppercase transition-colors text-gray-400 `}
                >
                  Microfinance Institution S.C.
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 px-4 py-2 rounded text-sm font-medium transition-colors ${
                      isDropdownActive(link) || openDropdown === link.label
                        ? scrolled
                          ? "text-[#22348A] bg-[#f0f3fc]"
                          : "text-[#22348A] bg-[#f0f3fc]"
                        : scrolled
                          ? "text-gray-700 hover:text-[#22348A] hover:bg-[#f0f3fc]"
                          : "text-gray-700 hover:text-[#22348A] hover:bg-[#f0f3fc]"
                    }`}
                  >
                    {link.label}
                    <motion.span
                      animate={{
                        rotate: openDropdown === link.label ? 180 : 0,
                      }}
                      transition={{ duration: 0.18 }}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden"
                        style={{
                          minWidth: link.label === "About" ? "260px" : "200px",
                        }}
                      >
                        {link.children!.map((child) => (
                          <Link key={child.href} href={child.href}>
                            <div
                              className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[#f0f3fc] group ${isActive(child.href) ? "bg-[#f0f3fc]" : ""}`}
                            >
                              {child.icon && (
                                <div className="w-7 h-7 rounded-lg bg-[#f0f3fc] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#22348A]/10 transition-colors">
                                  <child.icon className="w-3.5 h-3.5 text-[#22348A]" />
                                </div>
                              )}
                              <div>
                                <div
                                  className={`text-sm font-medium transition-colors ${isActive(child.href) ? "text-[#22348A]" : "text-gray-700 group-hover:text-[#22348A]"}`}
                                >
                                  {child.label}
                                </div>
                                {child.desc && (
                                  <div className="text-xs text-gray-400 mt-0.5">
                                    {child.desc}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={link.href} href={link.href}>
                  <div
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer ${
                      isActive(link.href)
                        ? scrolled
                          ? "text-[#22348A] bg-[#f0f3fc]"
                          : "text-[#22348A] bg-[#f0f3fc"
                        : scrolled
                          ? "text-gray-700 hover:text-[#22348A] hover:bg-[#f0f3fc]"
                          : "text-gray-700 hover:text-[#22348A] hover:bg-[#f0f3fc]"
                    }`}
                  >
                    {link.label}
                  </div>
                </Link>
              ),
            )}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex">
            <Link href="/apply">
              <div
                data-testid="link-apply-nav"
                className={`text-sm font-semibold px-5 py-2.5 rounded transition-all cursor-pointer ${
                  scrolled
                    ? "bg-[#22348A] text-white hover:bg-[#162260]"
                    : "bg-[#22348A] text-white hover:bg-[#162260]"
                }`}
              >
                Apply for a Loan
              </div>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            data-testid="button-mobile-menu"
            className={`lg:hidden p-2 rounded transition-colors ${
              scrolled
                ? "text-gray-700 hover:bg-gray-100"
                : "text-white hover:bg-white/10"
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-0.5">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <button
                      onClick={() => toggleDropdown(link.label)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#22348A] hover:bg-[#f0f3fc] rounded transition-colors"
                    >
                      {link.label}
                      <motion.span
                        animate={{
                          rotate: openDropdown === link.label ? 180 : 0,
                        }}
                        transition={{ duration: 0.18 }}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden"
                        >
                          {link.children.map((child) => (
                            <Link key={child.href} href={child.href}>
                              <div
                                className={`pl-6 pr-3 py-2.5 text-sm cursor-pointer transition-colors flex items-center gap-2 rounded ${isActive(child.href) ? "text-[#22348A] bg-[#f0f3fc]" : "text-gray-600 hover:text-[#22348A] hover:bg-[#f0f3fc]"}`}
                              >
                                {child.icon && (
                                  <child.icon className="w-3.5 h-3.5 text-[#BCBDC1] shrink-0" />
                                )}
                                {child.label}
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link key={link.href} href={link.href}>
                    <div
                      className={`px-3 py-2.5 rounded text-sm font-medium cursor-pointer transition-colors ${
                        isActive(link.href)
                          ? "text-[#22348A] bg-[#f0f3fc]"
                          : "text-gray-700 hover:text-[#22348A] hover:bg-[#f0f3fc]"
                      }`}
                    >
                      {link.label}
                    </div>
                  </Link>
                ),
              )}
              <div className="pt-3 border-t border-gray-100 mt-1">
                <Link href="/apply">
                  <div className="block w-full bg-[#22348A] text-white text-sm font-semibold text-center py-3 rounded cursor-pointer hover:bg-[#162260] transition-colors">
                    Apply for a Loan
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
