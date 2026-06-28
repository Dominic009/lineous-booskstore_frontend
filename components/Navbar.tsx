/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  Heart,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Types for menu items
export interface MenuItemProps {
  name: string;
  children?: MenuItemProps[] | string[];
}

// Recursive component for rendering nested menus
interface MenuItemComponentProps {
  item: MenuItemProps;
  level?: number;
  isMobile?: boolean;
  toggleMobile?: (key: string) => void;
  mobileOpen?: Record<string, boolean>;
}

const MenuItem = ({
  item,
  level = 0,
  isMobile,
  toggleMobile,
  mobileOpen,
}: MenuItemComponentProps) => {
  const [hovered, setHovered] = useState(false);
  const [subMenuHovered, setSubMenuHovered] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const isOpen = isMobile
    ? mobileOpen && mobileOpen[item.name]
    : hovered || subMenuHovered;

  return (
    <div
      className={`relative`}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
    >
      <div
        className={`flex justify-between items-center cursor-pointer py-1 w-full px-2 rounded-md transition-colors duration-200 ${
          hasChildren
            ? isOpen
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50 hover:text-accent-foreground"
            : "hover:bg-primary/10 hover:text-primary"
        }`}
        onClick={() => isMobile && hasChildren && toggleMobile?.(item.name)}
      >
        <span
          className={`font-medium text-sm ${!hasChildren ? "text-xs" : ""}`}
        >
          {item.name}
        </span>
        {hasChildren && (
          <ChevronDown
            className={`w-4 h-4 ml-2 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {hasChildren && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`border border-border border-l-4 border-l-primary shadow-lg absolute left-20 top-full bg-card z-50 rounded-md p-3 min-w-48`}
              onMouseEnter={() => setSubMenuHovered(true)}
              onMouseLeave={() => setSubMenuHovered(false)}
            >
              {item.children!.map(
                (child: MenuItemProps | string, idx: number) => (
                  <MenuItem
                    key={idx}
                    item={
                      typeof child === "string"
                        ? { name: child, children: [] }
                        : child
                    }
                    level={level + 1}
                    isMobile={isMobile}
                    toggleMobile={toggleMobile}
                    mobileOpen={mobileOpen}
                  />
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<Record<string, boolean>>({});
  const { totalItems, setIsCartOpen } = useCartContext();
  const { isAuthenticated } = useAuth();
  const navigate = useRouter();

  const navLinks = [
    { name: "HOME", children: [] },
    {
      name: "TOPICAL PAST PAPER",
      children: [
        {
          name: "CAMBRIDGE",
          children: [
            {
              name: "IGCSE",
              children: [
                "Add Math (0606)",
                "General Math (0580)",
                "Physics (0625)",
                "Chemistry (0620)",
                "Biology (0610)",
                "Economics (0455)",
                "Accounting (0452)",
              ],
            },
            { name: "GCE", children: [] },
            { name: "AS LEVEL", children: [] },
            { name: "A LEVEL", children: [] },
          ],
        },
        { name: "IB", children: ["MYP", "DP"] },
        { name: "EDEXCEL", children: ["IGCSE", "IAL"] },
      ],
    },
    { name: "YEARWISE", children: [] },
    { name: "COURSEBOOK", children: [] },
    { name: "TEACHERS", children: [] },
  ];

  const toggleMobile = (key: string) => {
    setMobileOpen((prev) => ({
      ...prev,
      [key]: prev[key] ? false : true,
    }));
  };

  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2">
              <img src="/logo.png" className="w-16 h-16 hidden md:block" />
              <img src="/logowtext.png" className="w-16 h-16 block md:hidden" />
              <span className="font-display text-2xl font-bold hidden md:inline">
                Core <span className="text-primary">Learning</span> Center
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 relative">
            {navLinks.map((link, idx) => (
              <MenuItem key={idx} item={link} isMobile={false} />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Search className="w-5 h-5 cursor-pointer" />
                <Heart className="w-5 h-5 cursor-pointer hidden sm:block" />
                <User
                  className="w-5 h-5 cursor-pointer hidden sm:block"
                  onClick={() => navigate.push("/profile")}
                />
                <div
                  className="relative cursor-pointer"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs bg-primary text-white w-5 h-5 flex items-center justify-center rounded-full">
                      {totalItems}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <Button onClick={() => navigate.push("/login")}>
                Sign In
              </Button>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="lg:hidden border-t overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link, idx) => (
                <MenuItem
                  key={idx}
                  item={link}
                  isMobile={true}
                  toggleMobile={toggleMobile}
                  mobileOpen={mobileOpen}
                />
              ))}

              <div className="pt-4 flex gap-2">
                {isAuthenticated ? (
                  <Button
                    className="flex-1"
                    onClick={() => navigate.push("/profile")}
                  >
                    My Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      className="flex-1"
                      onClick={() => navigate.push("/login")}
                    >
                      Sign In
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Join
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
