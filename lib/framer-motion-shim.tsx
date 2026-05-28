"use client";

import React from "react";

type MotionStyle = React.CSSProperties & {
  x?: React.CSSProperties["left"];
  y?: React.CSSProperties["top"];
  scale?: number;
  rotate?: number | string;
};

type MotionProps = Record<string, unknown> & {
  style?: MotionStyle;
  children?: React.ReactNode;
};

const motionPropKeys = new Set([
  "animate",
  "initial",
  "exit",
  "variants",
  "transition",
  "viewport",
  "whileHover",
  "whileTap",
  "whileInView",
  "custom",
  "layout",
  "layoutId",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "dragTransition",
  "dragControls",
  "onViewportEnter",
  "onViewportLeave",
  "onAnimationStart",
  "onAnimationComplete",
]);

function resolveStyle(style?: MotionStyle): React.CSSProperties | undefined {
  if (!style) {
    return undefined;
  }

  const { x, y, scale, rotate, transform, ...rest } = style;
  const transforms: string[] = [];

  if (x !== undefined) {
    transforms.push(`translateX(${String(x)})`);
  }

  if (y !== undefined) {
    transforms.push(`translateY(${String(y)})`);
  }

  if (scale !== undefined) {
    transforms.push(`scale(${scale})`);
  }

  if (rotate !== undefined) {
    transforms.push(
      `rotate(${typeof rotate === "number" ? `${rotate}deg` : rotate})`,
    );
  }

  if (transform) {
    transforms.push(transform);
  }

  return {
    ...rest,
    transform: transforms.length > 0 ? transforms.join(" ") : transform,
  };
}

function createMotionComponent<Tag extends keyof React.JSX.IntrinsicElements>(
  tag: Tag,
) {
  return React.forwardRef<HTMLElement, MotionProps>(
    function MotionComponent(props, ref) {
      const filteredProps: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(props)) {
        if (key === "style") {
          continue;
        }

        if (!motionPropKeys.has(key)) {
          filteredProps[key] = value;
        }
      }

      const style = resolveStyle(props.style as MotionStyle | undefined);

      return React.createElement(
        tag as React.ElementType,
        { ...filteredProps, ref, style },
        props.children as React.ReactNode,
      );
    },
  );
}

export const motion = new Proxy(
  {},
  {
    get: (_target, tag: string | symbol) =>
      createMotionComponent(String(tag) as keyof React.JSX.IntrinsicElements),
  },
) as Record<string, ReturnType<typeof createMotionComponent>>;

export const m = motion;

export function AnimatePresence({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function LazyMotion({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function MotionConfig({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function LayoutGroup({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function useScroll() {
  return { scrollYProgress: 0 };
}

export function useTransform(
  _value: unknown,
  _input?: unknown[],
  output?: unknown[],
) {
  return Array.isArray(output) && output.length > 0 ? output[0] : 0;
}

export function useReducedMotion() {
  return true;
}

export function useMotionValue<T>(initial: T) {
  return {
    get: () => initial,
    set: () => undefined,
    on: () => () => undefined,
  };
}

export function useMotionValueEvent() {
  return undefined;
}

export function usePresence() {
  return [true, () => undefined] as const;
}

export function useIsPresent() {
  return true;
}

export function useAnimation() {
  return {
    start: async () => undefined,
    set: () => undefined,
    stop: () => undefined,
  };
}

export const useAnimationControls = useAnimation;

export function useInView() {
  return true;
}
