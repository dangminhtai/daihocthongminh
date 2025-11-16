import React from "react";
import { motion } from "framer-motion";

export const AuthIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (
  props
) => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop
          offset="0%"
          style={{ stopColor: "rgb(129, 140, 248)", stopOpacity: 1 }}
        />
        <stop
          offset="100%"
          style={{ stopColor: "rgb(99, 102, 241)", stopOpacity: 1 }}
        />
      </linearGradient>
      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop
          offset="0%"
          style={{ stopColor: "rgb(59, 130, 246)", stopOpacity: 1 }}
        />
        <stop
          offset="100%"
          style={{ stopColor: "rgb(96, 165, 250)", stopOpacity: 1 }}
        />
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="512" height="512" rx="30" fill="url(#grad1)" />

    {/* Wave path 1 */}
    <motion.path
      d="M100 400 Q256 200 412 400"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="4"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      }}
    />

    {/* Wave path 2 */}
    <motion.path
      d="M100 350 Q256 150 412 350"
      stroke="rgba(255, 255, 255, 0.15)"
      strokeWidth="4"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{
        duration: 1.5,
        ease: "easeInOut",
        delay: 0.2,
        repeat: Infinity,
        repeatType: "loop",
      }}
    />

    {/* Card */}
    <motion.g
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <rect
        x="128"
        y="180"
        width="256"
        height="150"
        rx="15"
        fill="url(#grad2)"
        stroke="white"
        strokeWidth="2"
      />
      <circle cx="150" cy="200" r="6" fill="white" opacity="0.5" />
      <circle cx="170" cy="200" r="6" fill="white" opacity="0.5" />
      <circle cx="190" cy="200" r="6" fill="white" opacity="0.5" />
      <path
        d="M150 220 H 362"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M150 240 H 300"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M150 260 H 340"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M150 280 H 280"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
    </motion.g>

    {/* Play button */}
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1.1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.8,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <circle cx="380" cy="160" r="40" fill="rgba(255,255,255,0.1)" />
      <path d="M370 150 L390 160 L370 170 Z" fill="white" />
    </motion.g>

    {/* Menu icon */}
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1.2, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <circle cx="100" cy="150" r="30" fill="rgba(255,255,255,0.1)" />
      <path
        d="M95 140 L105 140"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M95 150 L105 150"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M95 160 L105 160"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </motion.g>
  </svg>
);
