"use client"
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

const SectionHeader = ({ title, subtitle, showViewAll = true, onViewAll }: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
    >
      <div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground text-lg">{subtitle}</p>
        )}
      </div>
      {showViewAll && (
        <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" onClick={onViewAll} className="group text-primary">
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SectionHeader;
