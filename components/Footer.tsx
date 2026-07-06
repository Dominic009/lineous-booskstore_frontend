"use client"
import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const footerLinks = {
    "Quick Links": ["Home", "New Releases", "Bestsellers", "Coming Soon", "Deals"],
    "Categories": ["Fiction", "Non-Fiction", "Children", "Biography", "Self-Help"],
    "Help": ["FAQ", "Shipping", "Returns", "Track Order", "Contact Us"],
  };

  // const socialLinks = [
  //   { icon: Facebook, href: "#" },
  //   { icon: Twitter, href: "#" },
  //   { icon: Instagram, href: "#" },
  //   { icon: Youtube, href: "#" },
  // ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Newsletter */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="border-b border-white/10"
      >
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="font-display text-2xl lg:text-3xl font-bold mb-2 text-white">
                Join Our Reading Community
              </h3>
              <p className="text-white/70">
                Subscribe for exclusive deals, new releases, and reading recommendations.
              </p>
            </div>
            <div className="flex flex-col md:flex-row w-full max-w-md gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-violet-400 transition-colors"
              />
              <Button variant="default" size="lg" className="shrink-0 bg-violet-600 hover:bg-violet-500 text-white">
                <Send className="w-4 h-4" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <motion.a
              href="#"
              className="inline-block mb-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img src="/logowtext.png" alt="" className="w-24 h-24 lg:w-32 lg:h-32 invert" />
            </motion.a>
            <p className="text-white/70 mb-4 lg:mb-6 max-w-sm text-sm lg:text-base">
              Your destination for exceptional books. Discover stories that inspire,
              educate, and transform. Premium reading experiences since 2020.
            </p>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">123 Book Street, Literary Lane, NY 10001</span>
                <span className="sm:hidden">123 Book Street, NY 10001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@bookhaven.com</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="font-semibold text-lg mb-4 text-white">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/60">
              © 2026 Core Learning Centre. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
