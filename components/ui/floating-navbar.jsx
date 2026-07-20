"use client";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import React, { useRef, useState } from "react";

export const FloatingNav = ({ navItems, className }) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const lastYRef = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - lastYRef.current;
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
      lastYRef.current = direction;
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex max-w-fit fixed top-6 inset-x-0 mx-auto border border-white/10 rounded-full bg-base-elevated/80 backdrop-blur-xl shadow-[0px_2px_20px_-2px_rgba(176,38,255,0.25)] z-[5000] pr-2 pl-6 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem, idx) => (
          <a
            key={`link-${idx}`}
            href={navItem.link}
            className="relative items-center flex space-x-1 text-ink-muted hover:text-ink transition-colors text-sm"
          >
            <span className="hidden sm:block">{navItem.name}</span>
          </a>
        ))}
        <a
          href="#gabung"
          className="border text-sm font-medium relative border-white/10 text-ink px-4 py-2 rounded-full bg-gradient-to-r from-remix-from to-remix-to"
        >
          <span>Join</span>
        </a>
      </motion.div>
    </AnimatePresence>
  );
};
