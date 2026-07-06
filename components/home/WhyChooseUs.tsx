"use client";

import { motion } from "framer-motion";
import { Truck, BadgeCheck, ShieldCheck, Headphones, Sparkles } from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "Hand-Curated Shelves",
    description:
      "Every title is chosen by our in-house literary editors — no algorithmic noise, just books worth your time.",
    color: "text-terracotta bg-terracotta/10",
  },
  {
    icon: Truck,
    title: "Free Fast Delivery",
    description:
      "Doorstep delivery across the country, free on every order above the minimum — carefully packed to arrive pristine.",
    color: "text-forest bg-forest/10",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    description:
      "Encrypted checkout and a privacy-first account. Your reading habits stay yours, always.",
    color: "text-gold bg-gold/10",
  },
  {
    icon: Headphones,
    title: "Human Support",
    description:
      "Real book lovers on the other end, ready to help with recommendations, orders, and returns.",
    color: "text-primary bg-primary/10",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-background to-muted/40">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 text-gold mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold tracking-widest uppercase">
              Why Chroma Bookshelf
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            A Bookstore Built for Readers, Not Algorithms
          </h2>
          <p className="text-muted-foreground text-lg mt-4">
            We obsess over the details so you can focus on the story. Here&apos;s
            what makes shopping with us feel different.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-3xl bg-card border border-border p-7 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${feature.color} mb-5 transition-transform duration-300 group-hover:scale-110`}
              >
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
