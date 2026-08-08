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
            ? { y: -6, transition: { type: "spring", stiffness: 320, damping: 22 } }
            : { scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 20 } }
      }
      className={`transition-shadow duration-300 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${className ?? ""}`}
      {...props}
    >
      {children}
    </Component>
  );
}
