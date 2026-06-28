"use client"
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  icon?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, showViewAll = true, onViewAll, icon = <Sparkles className="w-5 h-5 text-primary" /> }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
    >
      <div>
        <div className="flex items-center gap-3 mb-3">
          {icon}
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-muted-foreground text-lg max-w-2xl">{subtitle}</p>
        )}
      </div>
      {showViewAll && (
        <motion.div whileHover={{ x: 8 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" onClick={onViewAll} className="group text-primary font-semibold">
            View All
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
