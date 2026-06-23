import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, Leaf, Car, User, GraduationCap, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    title: "Business Loan",
    tagline: "Fuel your enterprise growth",
    icon: Briefcase,
    stat: "Up to ₹50 Lakhs",
    desc: "Scale your operations, purchase inventory, or expand your team with our flexible business financing."
  },
  {
    title: "Agricultural Loan",
    tagline: "Invest in your harvest",
    icon: Leaf,
    stat: "Up to ₹10 Lakhs",
    desc: "Empowering farmers with timely credit for seeds, equipment, and modern farming techniques."
  },
  {
    title: "Vehicle Loan",
    tagline: "Drive your ambitions forward",
    icon: Car,
    stat: "Up to ₹15 Lakhs",
    desc: "Get on the road faster with competitive rates for personal and commercial vehicles."
  },
  {
    title: "Personal Loan",
    tagline: "Life's moments, financed",
    icon: User,
    stat: "Up to ₹5 Lakhs",
    desc: "Quick, hassle-free funds for medical emergencies, weddings, or personal goals."
  },
  {
    title: "Education Loan",
    tagline: "Invest in your future",
    icon: GraduationCap,
    stat: "Up to ₹20 Lakhs",
    desc: "Don't let finances hold you back. Fund your higher education with ease."
  }
];

export default function LoanSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const monitorRef = useRef<HTMLDivElement>(null);
  const productsContainerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=4000",
          scrub: 1,
          pin: true,
        }
      });

      // Stage A: Monitor Reveal
      tl.fromTo(monitorRef.current, 
        { scale: 0.3, opacity: 0, y: 100 },
        { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );

      // Stage B: Zoom into monitor screen
      tl.to(monitorRef.current, {
        scale: 8,
        opacity: 0,
        duration: 2,
        ease: "power2.inOut"
      });

      // Reveal products container instantly as monitor fades out
      tl.fromTo(productsContainerRef.current, 
        { opacity: 0, display: "none" },
        { opacity: 1, display: "flex", duration: 0.5 },
        "-=0.5"
      );

      // Stage C: Horizontal Product Journey
      const numProducts = products.length;
      tl.to(stripRef.current, {
        xPercent: -100 * (numProducts - 1) / numProducts,
        ease: "none",
        duration: numProducts * 1.5
      });

      // Stage D: Transition out last card
      tl.to(stripRef.current, {
        opacity: 0,
        y: -100,
        duration: 1,
        ease: "power2.inOut"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="h-screen w-full relative bg-background overflow-hidden flex items-center justify-center">
      
      {/* Monitor CSS Object */}
      <div ref={monitorRef} className="relative z-10 w-[800px] h-[500px] flex flex-col items-center justify-end will-change-transform">
        <div className="w-full h-[450px] bg-card border-[12px] border-[#1a1c23] rounded-2xl shadow-2xl relative overflow-hidden flex items-center justify-center p-8">
          {/* Inner Screen UI Mockup */}
          <div className="w-full h-full bg-background/80 rounded-sm flex flex-col p-6 border border-white/5 relative">
             <div className="h-10 w-full border-b border-white/10 flex items-center px-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
             </div>
             <div className="flex-1 mt-6 grid grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-white/5 rounded-lg border border-white/10 animate-pulse"></div>
                ))}
             </div>
          </div>
        </div>
        <div className="w-[150px] h-[40px] bg-gradient-to-b from-[#2a2c33] to-[#1a1c23] clip-path-stand"></div>
        <div className="w-[250px] h-[10px] bg-[#1a1c23] rounded-t-lg"></div>
      </div>

      {/* Horizontal Strip */}
      <div ref={productsContainerRef} className="absolute inset-0 z-20 hidden items-center w-[500vw] h-full overflow-hidden will-change-transform">
        <div ref={stripRef} className="flex h-full w-full">
          {products.map((product, idx) => {
            const Icon = product.icon;
            return (
              <div key={idx} className="w-[100vw] h-full flex items-center justify-center px-12 md:px-24">
                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  
                  <div className="space-y-6">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">{product.title}</h2>
                    <h3 className="text-xl md:text-2xl text-accent">{product.tagline}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">{product.desc}</p>
                    
                    <button className="mt-8 flex items-center space-x-3 text-primary font-medium group text-lg" data-testid={`button-loan-${idx}`}>
                      <span>Explore this loan</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>

                  <div className="relative">
                    <div className="glass-card rounded-3xl p-10 relative overflow-hidden flex flex-col justify-center min-h-[400px]">
                      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
                      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/10 rounded-full blur-[80px]"></div>
                      
                      <div className="relative z-10 space-y-4 text-center">
                        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Loan Limit</p>
                        <p className="text-5xl font-serif font-bold text-white">{product.stat}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
