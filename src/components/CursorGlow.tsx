"use client";

import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow({ color }: { color: string }) {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // useSpring adds a tiny bit of trailing smoothness (Linear vibe)
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 40 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 40 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    // Set initial position immediately if we have a mouse
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    mouseX.set(x);
    mouseY.set(y);

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const backgroundTemplate = useMotionTemplate`radial-gradient(500px circle at ${smoothX}px ${smoothY}px, ${color}, transparent 40%)`;

  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
      style={{
        background: backgroundTemplate,
      }}
    />
  );
}
