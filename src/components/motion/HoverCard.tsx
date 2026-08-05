"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

interface HoverCardProps extends HTMLMotionProps<"div"> {
  as?: "div" | "button";
}

export function HoverCard({ children, className, as = "div", ...props }: HoverCardProps) {
  const Component = motion[as];

  return (
    <Component
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`hover:shadow-xl transition-shadow duration-300 ${className ?? ""}`}
      {...props}
    >
      {children}
    </Component>
  );
}
