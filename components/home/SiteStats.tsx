"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { BookOpen, Users, PenLine, CalendarDays } from "lucide-react";

const stats = [
  { icon: BookOpen, value: 25000, suffix: "+", label: "Titles in Stock" },
  { icon: Users, value: 120000, suffix: "+", label: "Happy Readers" },
  { icon: PenLine, value: 3500, suffix: "+", label: "Featured Authors" },
  { icon: CalendarDays, value: 8, suffix: " yrs", label: "Of Storytelling" },
];

const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const duration = 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
};

const SiteStats = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-secondary to-forest-light py-20 lg:py-24">
      {/* Decorative glows */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-20 -top-20 w-72 h-72 bg-gold/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-16 bottom-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary-foreground">
            Trusted by a Community of Readers
          </h2>
          <p className="text-secondary-foreground/80 mt-3 text-lg max-w-xl mx-auto">
            Numbers that reflect a decade of putting great books into the right
            hands.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 text-secondary-foreground mb-4 backdrop-blur-sm">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="font-display text-4xl lg:text-5xl font-bold text-secondary-foreground tabular-nums">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-secondary-foreground/80 mt-2 text-sm font-medium tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SiteStats;
