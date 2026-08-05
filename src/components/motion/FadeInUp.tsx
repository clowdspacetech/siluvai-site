"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

interface FadeInUpProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export function FadeInUp({ children, className, delay = 0, ...props }: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
