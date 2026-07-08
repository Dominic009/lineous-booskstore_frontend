"use client";

import { motion } from "framer-motion";

const LogoutLoader = ({
  message = "Logging you out...",
}: {
  message?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center">
        {/* Soft pulsing halo */}
        <motion.span
          className="absolute h-20 w-20 rounded-full bg-primary/15"
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Gradient spinning ring */}
        <motion.span
          className="h-14 w-14 rounded-full border-[3px] border-transparent border-t-primary border-r-accent"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
        {/* Center dot */}
        <span className="absolute h-2.5 w-2.5 rounded-full bg-primary" />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6 text-sm font-medium tracking-wide text-slate-600"
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default LogoutLoader;
