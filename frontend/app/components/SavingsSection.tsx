import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PiggyBank, Lock, Baby, Heart, Sunset, TrendingUp, Shield, Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const savings = [
  {
    title: "Regular Savings",
    tagline: "Your daily savings, growing steadily",
    color: "from-emerald-900 to-emerald-950",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    benefits: ["Interest rate of 10%", "500 Minimum Balance", "Instant withdrawals"],
    icon: PiggyBank
  },
  {
    title: "Fixed Time Deposit",
    tagline: "Lock in guaranteed returns",
    color: "from-blue-900 to-blue-950",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    benefits: ["Rate Starting From 12%", "Flexible tenures 6 Months-1 Year", "Premature withdrawal option"],
    icon: Lock
  },
  {
    title: "Child Savings 'Maleda'",
    tagline: "Secure their tomorrow, today",
    color: "from-purple-900 to-purple-950",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    benefits: ["11% interest rate"],
    icon: Baby
  },
  {
    title: "Women's Savings 'Alem'",
    tagline: "Designed for her financial independence",
    color: "from-rose-900 to-rose-950",
    border: "border-rose-500/30",
    iconColor: "text-rose-400",
    benefits: ["11% Interest Rate"],
    icon: Heart
  },
  {
    title: "Elderly Savings 'Efoy'",
    tagline: "Retire with dignity and comfort",
    color: "from-amber-900 to-amber-950",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    benefits: ["Highest interest tier at 11%"],
    icon: Sunset
  },
  {
    title: "Disability Savings 'Yichalal'",
    tagline: "Walk with Nisir",
    color: "from-purple-900 to-purple-950",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    benefits: ["11% interest rate"],
    icon: Baby
  }

];

export default function SavingsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".saving-card");

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${cards.length * 100}%`,
        pin: true,
      });

      cards.forEach((card, i) => {
        if (i === 0) return; // First card is already there

        gsap.fromTo(card,
          { y: "150%", scale: 0.9, opacity: 0 },
          {
            y: `${i * 30}px`,
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: () => `top+=${(i - 0.5) * 100}% top`,
              end: () => `top+=${i * 100}% top`,
              scrub: true,
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="h-screen w-full bg-background py-24 flex items-center justify-center relative">
      <div className="absolute top-10 w-full text-center z-10">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Savings Portfolio</h2>
        <p className="text-muted-foreground mt-4 text-lg">Secure foundations for every stage of life</p>
      </div>

      <div className="relative w-full max-w-4xl h-[600px] mt-20">
        {savings.map((saving, idx) => {
          const Icon = saving.icon;
          return (
            <div
              key={idx}
              className={`saving-card absolute top-0 left-0 w-full bg-gradient-to-br ${saving.color} border ${saving.border} rounded-[2.5rem] p-10 md:p-16 shadow-2xl overflow-hidden will-change-transform`}
              style={{ zIndex: idx + 1 }}
            >
              {/* Abstract decorative shapes */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>

              <div className="relative z-10 h-full flex flex-col md:flex-row gap-10">
                <div className="flex-1 space-y-6">
                  <div className={`w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20`}>
                    <Icon className={`w-8 h-8 ${saving.iconColor}`} />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-white">{saving.title}</h3>
                  <p className="text-lg text-white/70 font-medium">{saving.tagline}</p>

                  <ul className="space-y-4 mt-8">
                    {saving.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-center space-x-3 text-white/90">
                        <Star className={`w-5 h-5 ${saving.iconColor}`} />
                        <span className="text-lg">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full h-full min-h-[250px] border border-white/20 rounded-3xl bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center p-8 space-y-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <TrendingUp className={`w-20 h-20 ${saving.iconColor} relative z-10 opacity-80`} />
                    <p className="text-white/60 font-medium tracking-widest uppercase text-sm relative z-10">Wealth Generation</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
