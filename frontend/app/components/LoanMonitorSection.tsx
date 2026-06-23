import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Bell, Briefcase, User as UserIcon } from "lucide-react";
import * as icons from "lucide-react";
import { loanProducts } from "./data/loanProducts";
import Logo from "/Logo.png";

gsap.registerPlugin(ScrollTrigger);

export default function LoanMonitorSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const monitorRef = useRef<HTMLDivElement>(null);
  const horizontalStripRef = useRef<HTMLDivElement>(null);
  const innerStripRef = useRef<HTMLDivElement>(null);
  const zoomTargetRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=5000",
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
        },
      });

      mainTl.fromTo(
        monitorRef.current,
        { scale: 0.3, opacity: 0, y: 80 },
        { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        0,
      );

      mainTl.to(
        monitorRef.current,
        {
          scale: 5,
          y: -120,
          duration: 2,
          ease: "power2.inOut",
        },
        1,
      );

      mainTl.to(
        monitorRef.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: "power1.in",
        },
        2.7,
      );

      mainTl.fromTo(
        horizontalStripRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
        2.8,
      );

      mainTl.to(
        innerStripRef.current,
        {
          xPercent: -80,
          ease: "none",
          duration: 5,
        },
        3,
      );

      mainTl.to(
        horizontalStripRef.current,
        {
          opacity: 0,
          y: -60,
          duration: 0.5,
        },
        8,
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="loans"
      className="relative overflow-hidden bg-white"
      style={{ height: "100vh", isolation: "isolate" }}
    >
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-center">
        <p className="uppercase tracking-widest text-xs text-[#BCBDC1] font-semibold">
          Loan Services
        </p>
        <h2 className="text-3xl font-serif font-bold text-[#22348A] mt-1">
          Our Loan Products
        </h2>
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          ref={monitorRef}
          className="monitor-wrapper"
          style={{ transformOrigin: "center center" }}
        >
          <div className="monitor-lid">
            <div className="monitor-bezel">
              <div className="monitor-screen">
                <div
                  style={{
                    transform: "scale(0.48)",
                    transformOrigin: "top left",
                    width: "1458px",
                  }}
                  className="absolute top-0 left-0 bg-white h-[911px] flex flex-col p-8 font-sans text-[#22348A]"
                >
                  {/* navigation  */}
                  <div className="w-full flex justify-between items-center border-b border-[#BCBDC1] pb-4 mb-6">
                    <div className="flex items-center text-xl font-bold">
                      <span className="flex space-x-1">
                        <img
                          src="../Logo only.png"
                          alt="logo"
                          className="w-5"
                        />
                      </span>
                      <span className="ml-4">
                        Nisir Microfinance — Loan Dashboard
                      </span>
                    </div>
                    <div className="flex ">
                      <Bell className="w-6 h-6" />
                      <UserIcon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* <div className="flex space-x-4 mb-8">
                    <span className="bg-[#f0f2fa] text-[#22348A] px-4 py-2 rounded-full font-semibold border border-[#BCBDC1]">
                      Total Portfolio ₹2.4Cr
                    </span>
                    <span className="bg-[#f0f2fa] text-[#22348A] px-4 py-2 rounded-full font-semibold border border-[#BCBDC1]">
                      Active 1,284
                    </span>
                    <span className="bg-[#f0f2fa] text-[#22348A] px-4 py-2 rounded-full font-semibold border border-[#BCBDC1]">
                      Avg Rate 11.2%
                    </span>
                    <span className="bg-[#f0f2fa] text-[#22348A] px-4 py-2 rounded-full font-semibold border border-[#BCBDC1]">
                      NPA 0.8%
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-4">
                    Available Loan Products:
                  </h3>
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {loanProducts.map((p, i) => {
                      const Icon = (icons as any)[p.iconName] || icons.Circle;
                      return (
                        <div
                          key={p.id}
                          ref={i === 0 ? zoomTargetRef : null}
                          className="bg-[#f0f2fa] border border-[#BCBDC1] rounded-lg p-6 flex flex-col"
                        >
                          <div className="flex items-center space-x-2 font-bold text-xl mb-2">
                            <Icon className="w-6 h-6" /> <span>{p.title}</span>
                          </div>
                          <div className="text-lg text-[#22348A]/80">
                            {p.stat}
                          </div>
                          <div className="text-lg font-semibold">{p.rate}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-auto h-32 flex items-end space-x-2 border-b border-l border-[#BCBDC1] p-4">
                    <div className="w-12 bg-[#22348A] h-[40%]"></div>
                    <div className="w-12 bg-[#22348A] h-[60%]"></div>
                    <div className="w-12 bg-[#22348A] h-[30%]"></div>
                    <div className="w-12 bg-[#22348A] h-[80%]"></div>
                    <div className="w-12 bg-[#22348A] h-[100%]"></div>
                  </div> */}
                  <div className="w-full h-full flex items-center justify-center">
                    <div
                      key={loanProducts[0].id}
                      className={`w-[32%]  h-[30%] flex items-center justify-center px-3 md:px-3 bg-white pointer-events-auto`}
                    >
                      <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-1">
                          <Briefcase />
                          <h2 className="text-lg font-serif font-bold text-[#22348A]">
                            {loanProducts[0].title}
                          </h2>
                          <h3 className="text-[8px] text-[#22348A]/80 font-medium">
                            {loanProducts[0].tagline}
                          </h3>
                          <p className="text-[6px] text-[#BCBDC1] leading-relaxed max-w-md">
                            {loanProducts[0].description}
                          </p>
                          <div className="flex gap-1 pt-1">
                            {/* <span className="text-[5px] px-1 py-1 rounded-full border border-[#22348A] text-[#22348A] font-medium">
                              {loanProducts[0].rate}
                            </span> */}
                            <span className="text-[5px] px-1 py-1 rounded-full border border-[#22348A] text-[#22348A] font-medium">
                              {loanProducts[0].tenure}
                            </span>
                          </div>
                          <button className="mt-2 flex items-center space-x-1 text-[#22348A] font-bold group text-[8px]">
                            <span>Explore loan</span>
                            <ArrowRight className="w-2 h-2 group-hover:translate-x-2 transition-transform" />
                          </button>
                        </div>
                        <div className="relative h-[150px] bg-white rounded-3xl border border-[#BCBDC1] shadow-[0_20px_60px_rgba(34,52,138,0.12)] p-6 flex flex-col justify-center overflow-hidden items-center">
                          <div className="absolute top-0 right-0 w-28 h-28 border-[12px] border-[#f0f2fa] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                          <div className="absolute bottom-0 left-0 w-28 h-28 border-[8px] border-[#22348A]/10 rounded-full -translate-x-1/4 translate-y-1/4"></div>
                          <div className="relative z-10 text-center">
                            <p className="text-[6px] font-semibold uppercase tracking-widest text-[#BCBDC1] mb-1">
                              Loan Limit
                            </p>
                            <p className="text-sm font-serif font-bold text-[#22348A]">
                              {loanProducts[0].stat}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="monitor-base">
            <div className="monitor-hinge" />
            <div className="monitor-keyboard" />
            <div className="monitor-trackpad" />
          </div>
        </div>
      </div>

      <div
        ref={horizontalStripRef}
        className="absolute inset-0 z-20 overflow-hidden opacity-0 pointer-events-none"
      >
        <div
          ref={innerStripRef}
          className="flex h-full will-change-transform"
          style={{ width: "500vw" }}
        >
          {loanProducts.map((product, idx) => {
            const Icon = (icons as any)[product.iconName] || icons.Circle;
            return (
              <div
                key={product.id}
                className={`w-[100vw] h-full flex items-center justify-center px-12 md:px-24 ${idx % 2 === 0 ? "bg-white" : "bg-[#f0f2fa]"} pointer-events-auto`}
              >
                <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <div className="space-y-6">
                    <Icon className="w-16 h-16 text-[#22348A]" />
                    <h2 className="text-4xl font-serif font-semibold text-[#22348A]">
                      {product.title}
                    </h2>
                    <h3 className="text-xl text-[#22348A]/80 font-medium font-serif">
                      {product.tagline}
                    </h3>
                    <p className="text-sm text-[#9c9da1] leading-relaxed max-w-md">
                      {product.description}
                    </p>
                    <div className="flex gap-4 pt-4">
                      {/* <span className="px-4 py-2 rounded-full border border-[#22348A] text-[#22348A] font-medium">
                        {product.rate}
                      </span> */}
                      <span className="px-4 py-2 rounded-full border border-[#22348A] text-[#22348A] font-medium">
                        {product.tenure}
                      </span>
                    </div>
                    <button
                      className="mt-8 flex items-center space-x-3 text-[#22348A] font-bold group text-lg"
                      data-testid={`button-loan-${idx}`}
                    >
                      <span>Apply</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                  <div className="relative h-[500px] bg-white rounded-3xl border border-[#BCBDC1] shadow-[0_20px_60px_rgba(34,52,138,0.12)] p-12 flex flex-col justify-center overflow-hidden items-center">
                    <div className="absolute top-0 right-0 w-64 h-64 border-[40px] border-[#f0f2fa] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 border-[20px] border-[#22348A]/10 rounded-full -translate-x-1/4 translate-y-1/4"></div>
                    <div className="relative z-10 text-center">
                      <p className="text-sm font-semibold uppercase tracking-widest text-[#BCBDC1] mb-2">
                        Loan Limit
                      </p>
                      <p className="text-5xl font-serif font-bold text-[#22348A]">
                        {product.stat}
                      </p>
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
