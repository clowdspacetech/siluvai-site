"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type HoverCardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "button";
  lift?: boolean;
} & Omit<HTMLMotionProps<"div">, "children" | "className"> &
  Omit<HTMLMotionProps<"button">, "children" | "className">;

export function HoverCard({
  children,
  className,
  as = "div",
  lift = false,
  ...props
}: HoverCardProps) {
  const reduceMotion = useReducedMotion();
  const Component = as === "button" ? motion.button : motion.div;

  return (
    <Component
      whileHover={
        reduceMotion
          ? undefined
          : lift
            ? { y: -4, scale: 1.015, transition: { type: "spring", stiffness: 320, damping: 22 } }
            : { scale: 1.015, transition: { type: "spring", stiffness: 300, damping: 20 } }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      className={`transition-[box-shadow,border-color] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${className ?? ""}`}
      {...props}
    >
      {children}
    </Component>
  );
}
