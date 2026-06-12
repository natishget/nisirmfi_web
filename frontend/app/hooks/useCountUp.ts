"use client";
import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const raf = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;
    startTime.current = null;

    const ease = (t: number) => 1 - Math.pow(1 - t, 4);

    const tick = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(ease(progress) * target));
      if (progress < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration, start]);

  return count;
}
