import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, PiggyBank, Lock, Baby, Heart, Sunset } from "lucide-react";
import { savingsProducts, type SavingsProduct } from "./data/savingsProducts";

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  regular: PiggyBank,
  fixed: Lock,
  children: Baby,
  women: Heart,
  retirement: Sunset,
};

function SavingsCard({
  saving,
  index,
}: {
  saving: SavingsProduct;
  index: number;
}) {
  const isDark = saving.bgClass.includes("[#22348A]");
  const Icon = ICON_MAP[saving.id] ?? PiggyBank;

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${isDark ? "bg-[#22348A]" : "bg-white"}`}
    >
      <div
        className={`w-full max-w-[920px] mx-auto rounded-[2.5rem] p-12 flex flex-col md:flex-row gap-12 ${
          isDark
            ? "bg-[#22348A]"
            : "bg-white border border-[#BCBDC1] shadow-[0_20px_60px_rgba(34,52,138,0.10)]"
        }`}
        style={{ minHeight: "78vh" }}
      >
        {/* Left: Content */}
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              isDark ? "bg-white/15" : "bg-[#f0f2fa]"
            }`}
          >
            <Icon
              className={`w-7 h-7 ${isDark ? "text-white" : "text-[#22348A]"}`}
            />
          </div>
          <h3
            className={`text-4xl font-serif font-bold leading-tight ${
              isDark ? "text-white" : "text-[#22348A]"
            }`}
          >
            {saving.title}
          </h3>
          <p
            className={`text-lg ${isDark ? "text-white/75" : "text-[#22348A]/70"}`}
          >
            {saving.tagline}
          </p>
          <ul className="space-y-4 pt-2">
            {saving.benefits.map((benefit, bIdx) => (
              <li key={bIdx} className="flex items-center space-x-3">
                <span
                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                    isDark ? "bg-white/20" : "bg-[#22348A]/10"
                  }`}
                >
                  <Check
                    className={`w-3 h-3 ${isDark ? "text-white" : "text-[#22348A]"}`}
                  />
                </span>
                <span
                  className={`text-base ${isDark ? "text-white/90" : "text-[#22348A]/85"}`}
                >
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Rate illustration */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className={`relative w-full rounded-3xl flex flex-col items-center justify-center overflow-hidden ${
              isDark ? "bg-white/10" : "bg-[#f0f2fa]"
            }`}
            style={{ minHeight: "300px" }}
          >
            <div
              className={`absolute w-72 h-72 rounded-full border-[32px] ${
                isDark ? "border-white/10" : "border-[#22348A]/08"
              }`}
            />
            <div
              className={`absolute w-52 h-52 rounded-full border-[20px] ${
                isDark ? "border-white/15" : "border-[#22348A]/12"
              }`}
            />
            <div
              className={`absolute w-32 h-32 rounded-full border-[12px] ${
                isDark ? "border-white/25" : "border-[#22348A]/18"
              }`}
            />
            <div className="relative z-10 text-center px-8 py-10">
              <p
                className={`text-xs uppercase tracking-widest font-semibold mb-3 ${
                  isDark ? "text-white/55" : "text-[#22348A]/55"
                }`}
              >
                Interest Rate
              </p>
              <p
                className={`text-7xl font-serif font-bold leading-none ${
                  isDark ? "text-white" : "text-[#22348A]"
                }`}
              >
                {saving.rate}
              </p>
              <p
                className={`text-sm mt-2 ${isDark ? "text-white/50" : "text-[#22348A]/50"}`}
              >
                per annum
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SavingsStackSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const wrappers = gsap.utils.toArray<HTMLElement>(".sticky-card-wrapper");

      wrappers.forEach((wrapper, i) => {
        // Animate the current card scaling down as the NEXT card covers it
        if (i === wrappers.length - 1) return;

        const inner = wrapper.querySelector<HTMLElement>(".stack-card-inner");
        if (!inner) return;

        const nextWrapper = wrappers[i + 1];

        // Scale down and fade slightly as the next card slides over
        gsap.to(inner, {
          scale: 0.9,
          opacity: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: nextWrapper,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="savings"
      className="relative bg-white"
      style={{ isolation: "isolate" }}
    >
      {savingsProducts.map((saving, i) => (
        <div
          key={saving.id}
          className="sticky-card-wrapper"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            zIndex: i + 1,
            overflow: "hidden",
          }}
        >
          {/* Section label — only on first card */}
          {i === 0 && (
            <div className="absolute top-6 left-0 right-0 text-center z-20 pointer-events-none pb-8">
              <p className="text-xs uppercase tracking-widest text-[#BCBDC1] font-semibold">
                Savings Services
              </p>
              <h2 className="text-3xl font-serif font-bold text-[#22348A] mt-1">
                Build Wealth Your Way
              </h2>
            </div>
          )}

          <div
            className="stack-card-inner w-full h-full will-change-transform"
            data-testid={`savings-card-${saving.id}`}
          >
            <SavingsCard saving={saving} index={i} />
          </div>
        </div>
      ))}
    </section>
  );
}
