"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Intro() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setVisible(true);

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const fallback = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = original;
    }, 18000);

    return () => {
      window.clearTimeout(fallback);
      document.body.style.overflow = original;
    };
  }, []);

  const dismissIntro = () => {
    setVisible(false);
    document.body.style.overflow = "";
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="ks-intro"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1] },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
          aria-hidden
        >
          <motion.video
            key="ks-intro-video"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="h-full w-full object-cover"
            src="../Nisir Logo Formation v3 compressed.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={dismissIntro}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
