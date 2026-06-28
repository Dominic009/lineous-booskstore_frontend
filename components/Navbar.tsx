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

export interface MenuItemProps {
  name: string;
  children?: MenuItemProps[] | string[];
}

interface MenuItemComponentProps {
  item: MenuItemProps;
  isMobile?: boolean;
  toggleMobile?: (key: string) => void;
  mobileOpen?: Record<string, boolean>;
  isTopLevel?: boolean;
}

const MenuItem = ({
  item,
  isMobile,
  toggleMobile,
  mobileOpen,
  isTopLevel = false,
}: MenuItemComponentProps) => {
  const [hovered, setHovered] = useState(false);
  const [subMenuHovered, setSubMenuHovered] = useState(false);
  const [activeChildIndex, setActiveChildIndex] = useState<number | null>(null);
  const [activeGrandchildIndex, setActiveGrandchildIndex] = useState<number | null>(null);
  const hasChildren = item.children && item.children.length > 0;

  const isOpen = isMobile
    ? mobileOpen && mobileOpen[item.name]
    : hovered || subMenuHovered;

  const activeChild = activeChildIndex !== null && hasChildren
    ? (() => {
        const child = item.children![activeChildIndex];
        return typeof child === "string" ? null : child;
      })()
    : null;

  const activeGrandchild = activeGrandchildIndex !== null && activeChild && activeChild.children && activeChild.children.length > 0
    ? (() => {
        const child = activeChild.children![activeGrandchildIndex];
        return typeof child === "string" ? null : child;
      })()
    : null;

  if (isMobile) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setSubMenuHovered(false);
          setActiveChildIndex(null);
          setActiveGrandchildIndex(null);
        }}
      >
        <div
          className={`
            flex justify-between items-center cursor-pointer py-2 px-3 rounded-lg transition-all duration-200 w-full text-left
            ${hasChildren
              ? isOpen
                ? "bg-primary/10 text-primary"
                : "text-foreground/80 hover:text-primary hover:bg-muted/60"
              : "text-foreground/80 hover:text-primary hover:bg-muted/60"
            }
          `}
          onClick={() => hasChildren && toggleMobile?.(item.name)}
        >
          <span className="text-[13px] font-medium tracking-wide">
            {item.name}
          </span>
          {hasChildren && (
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
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
                className="relative left-0 top-0 mt-1 w-full overflow-hidden"
              >
                <div className="p-2 space-y-1">
                  {item.children!.map(
                    (child: MenuItemProps | string, idx: number) => (
                      <MobileSubItem
                        key={idx}
                        item={
                          typeof child === "string"
                            ? { name: child, children: [] }
                            : child
                        }
                        toggleMobile={toggleMobile}
                        mobileOpen={mobileOpen}
                      />
                    )
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setSubMenuHovered(false);
        setActiveChildIndex(null);
        setActiveGrandchildIndex(null);
      }}
    >
      <div
        className={`
          flex justify-between items-center cursor-pointer py-2 px-3 rounded-lg transition-all duration-200
          ${hasChildren
            ? isOpen
              ? "bg-primary/10 text-primary"
              : "text-foreground/80 hover:text-primary hover:bg-muted/60"
            : "text-foreground/80 hover:text-primary hover:bg-muted/60"
          }
        `}
      >
        <span className="text-[13px] font-medium tracking-wide">
          {item.name}
        </span>
        {hasChildren && (
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {hasChildren && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-xl shadow-xl border border-border/60 bg-card/95 backdrop-blur-md z-50 p-6 min-w-[520px]"
              onMouseEnter={() => setSubMenuHovered(true)}
              onMouseLeave={() => {
                setSubMenuHovered(false);
                setActiveChildIndex(null);
                setActiveGrandchildIndex(null);
              }}
            >
              <div className="flex">
                <div className="flex flex-col min-w-[160px]">
                  {item.children!.map(
                    (child: MenuItemProps | string, idx: number) => {
                      const childItem =
                        typeof child === "string"
                          ? { name: child, children: [] }
                          : child;
                      const childHasChildren = childItem.children && childItem.children.length > 0;
                      const isActive = activeChildIndex === idx;

                      return (
                        <div
                          key={idx}
                          className={`
                            flex items-center justify-between cursor-pointer py-2.5 px-3 rounded-lg transition-colors duration-150
                            ${isActive
                              ? "bg-primary/10 text-primary"
                              : "text-foreground/80 hover:text-primary hover:bg-muted/60"
                            }
                          `}
                          onMouseEnter={() => {
                            setActiveChildIndex(idx);
                            setActiveGrandchildIndex(null);
                          }}
                          onClick={() => {
                            if (isMobile && childHasChildren) {
                              toggleMobile?.(childItem.name);
                            }
                          }}
                        >
                          <span className="text-[13px] font-medium tracking-wide">
                            {childItem.name}
                          </span>
                          {childHasChildren && (
                            <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-foreground/50" />
                          )}
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="relative w-[280px] border-l border-border/40">
                  <AnimatePresence initial={false}>
                    {activeChild && activeChild.children && activeChild.children.length > 0 ? (
                      <motion.div
                        key={activeChild.name + "-children"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="pl-3 pr-1 py-1 bg-card rounded-lg"
                      >
                        <h3 className="text-[11px] font-semibold text-foreground/50 uppercase tracking-wider mb-2 px-3 pt-1">
                          {activeChild.name}
                        </h3>
                        <div className="space-y-0.5">
                          {activeChild.children!.map(
                            (child: MenuItemProps | string, idx: number) => {
                              const childItem =
                                typeof child === "string"
                                  ? { name: child, children: [] }
                                  : child;
                              const childHasChildren = childItem.children && childItem.children.length > 0;
                              const isActive = activeGrandchildIndex === idx;

                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between cursor-pointer py-2 px-3 rounded-lg transition-colors duration-150"
                                  onMouseEnter={() => {
                                    setActiveGrandchildIndex(idx);
                                  }}
                                  onClick={() => {
                                    if (childHasChildren && childItem.children) {
                                      const nextChild = childItem.children[0];
                                      if (typeof nextChild === "string") {
                                        return;
                                      }
                                      const name = nextChild.name || "";
                                      setActiveGrandchildIndex(idx);
                                    }
                                  }}
                                >
                                  <span
                                    className={`text-[13px] font-medium ${
                                      isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-foreground/80 hover:text-primary hover:bg-muted/60"
                                    } rounded-md px-2 py-0.5`}
                                  >
                                    {childItem.name}
                                  </span>
                                  {childHasChildren && (
                                    <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-foreground/50" />
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span className="text-xs text-foreground/30">Select a category</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence initial={false}>
                    {activeGrandchild && activeGrandchild.children && activeGrandchild.children.length > 0 ? (
                      <motion.div
                        key={activeChild?.name + "-" + activeGrandchild.name}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.12 }}
                        className="absolute inset-0 border-l border-border/40 pl-3 pr-1 py-1 bg-card rounded-r-lg"
                      >
                        <h3 className="text-[11px] font-semibold text-foreground/50 uppercase tracking-wider mb-2 px-3 pt-1">
                          {activeChild?.name}
                          <span className="normal-case tracking-normal text-foreground/30 ml-1">/ {activeGrandchild.name}</span>
                        </h3>
                        <div className="space-y-0.5 max-h-[240px] overflow-y-auto">
                          {activeGrandchild.children!.map(
                            (child: MenuItemProps | string, idx: number) => {
                              const childItem =
                                typeof child === "string"
                                  ? { name: child, children: [] }
                                  : child;

                              return (
                                <div
                                  key={idx}
                                  className="cursor-pointer py-2 px-3 rounded-lg text-foreground/80 hover:text-primary hover:bg-muted/60 transition-colors duration-150"
                                  onClick={() => {
                                    if (childItem.children && childItem.children.length > 0) {
                                    }
                                  }}
                                >
                                  <span className="text-[13px] font-medium">
                                    {childItem.name}
                                  </span>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const MobileSubItem = ({
  item,
  toggleMobile,
  mobileOpen,
}: {
  item: MenuItemProps;
  toggleMobile?: (key: string) => void;
  mobileOpen?: Record<string, boolean>;
}) => {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div>
        <div
          className="flex justify-between items-center cursor-pointer py-2 px-3 rounded-lg text-foreground/80 hover:text-primary hover:bg-muted/60 transition-colors duration-200"
          onClick={() => setOpen(!open)}
        >
          <span className="text-[13px] font-medium">{item.name}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
        {open && (
          <div className="ml-4 mt-1 space-y-1 border-l border-border/40 pl-3">
            {item.children!.map((child: MenuItemProps | string, idx: number) => (
              <div
                key={idx}
                className="py-2 px-3 rounded-lg text-foreground/70 hover:text-primary hover:bg-muted/60 transition-colors duration-200 cursor-pointer text-[13px]"
              >
                {typeof child === "string" ? child : child.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="py-2 px-3 rounded-lg text-foreground/80 hover:text-primary hover:bg-muted/60 transition-colors duration-200 cursor-pointer text-[13px]">
      {item.name}
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
    { name: "Home", children: [] },
    {
      name: "Past Papers",
      children: [
        {
          name: "Cambridge",
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
            { name: "AS Level", children: [] },
            { name: "A Level", children: [] },
          ],
        },
        { name: "IB", children: ["MYP", "DP"] },
        { name: "Edexcel", children: ["IGCSE", "IAL"] },
      ],
    },
    { name: "Yearwise", children: [] },
    { name: "Coursebooks", children: [] },
    { name: "Teachers", children: [] },
  ];

  const toggleMobile = (key: string) => {
    setMobileOpen((prev) => ({
      ...prev,
      [key]: prev[key] ? false : true,
    }));
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 bg-cream/80 backdrop-blur-2xl border-b border-border/40"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/logo.png"
                className="w-9 h-9 object-contain hidden md:block transition-transform duration-300 group-hover:scale-105"
              />
              <img
                src="/logowtext.png"
                className="w-9 h-9 object-contain block md:hidden transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="hidden md:block">
              <span className="font-display text-xl font-semibold tracking-tight text-foreground">
                Core
              </span>
              <span className="font-display text-xl font-semibold tracking-tight text-primary ml-1">
                Learning
              </span>
              <span className="font-display text-xl font-semibold tracking-tight text-foreground ml-1">
                Center
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 relative">
            {navLinks.map((link, idx) => (
              <MenuItem
                key={idx}
                item={link}
                isMobile={false}
                isTopLevel={link.children && link.children.length > 0}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {isAuthenticated ? (
              <>
                <IconButton
                  icon={<Search className="w-[18px] h-[18px]" />}
                  onClick={() => {}}
                />
                <IconButton
                  icon={<Heart className="w-[18px] h-[18px]" />}
                  onClick={() => {}}
                  className="hidden sm:flex"
                />
                <IconButton
                  icon={<User className="w-[18px] h-[18px]" />}
                  onClick={() => navigate.push("/profile")}
                  className="hidden sm:flex"
                />
                <IconButton
                  icon={<ShoppingCart className="w-[18px] h-[18px]" />}
                  onClick={() => setIsCartOpen(true)}
                  badge={totalItems}
                />
              </>
            ) : (
              <Button
                size="sm"
                className="h-9 px-5 text-[13px] font-medium rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20"
                onClick={() => navigate.push("/login")}
              >
                Sign In
              </Button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden ml-1 h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted/60 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden border-t border-border/40 overflow-hidden bg-cream/95 backdrop-blur-2xl"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link, idx) => (
                <MenuItem
                  key={idx}
                  item={link}
                  isMobile={true}
                  toggleMobile={toggleMobile}
                  mobileOpen={mobileOpen}
                />
              ))}

              <div className="pt-4 flex gap-2 border-t border-border/40 mt-4">
                {isAuthenticated ? (
                  <Button
                    className="flex-1 h-10 rounded-full text-[13px] font-medium"
                    onClick={() => navigate.push("/profile")}
                  >
                    My Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      className="flex-1 h-10 rounded-full text-[13px] font-medium bg-primary hover:bg-primary/90"
                      onClick={() => navigate.push("/login")}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-10 rounded-full text-[13px] font-medium border-border hover:bg-muted/60"
                    >
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

const IconButton = ({
  icon,
  onClick,
  badge,
  className = "",
}: {
  icon: React.ReactNode;
  onClick: () => void;
  badge?: number;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`
      relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted/60 text-foreground/70 hover:text-primary transition-all duration-200
      ${className}
    `}
  >
    {icon}
    {badge !== undefined && badge > 0 && (
      <span className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] px-1 text-[10px] font-semibold bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-sm shadow-primary/30">
        {badge}
      </span>
    )}
  </button>
);

export default Navbar;
