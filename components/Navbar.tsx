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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useBookTree } from "@/hooks/use-book-tree";

export interface MenuItemProps {
  name: string;
  children?: MenuItemProps[] | string[];
  isLoading?: boolean;
  error?: string | null;
  href?: string;
}

interface MenuItemComponentProps {
  item: MenuItemProps;
  isMobile?: boolean;
  toggleMobile?: (key: string) => void;
  mobileOpen?: Record<string, boolean>;
  isTopLevel?: boolean;
  isLoading?: boolean;
  error?: string | null;
}

const MenuItem = ({
  item,
  isMobile,
  toggleMobile,
  mobileOpen,
  isTopLevel = false,
  isLoading,
  error,
}: MenuItemComponentProps) => {
  const [hovered, setHovered] = useState(false);
  const [subMenuHovered, setSubMenuHovered] = useState(false);
  const [activeChildIndex, setActiveChildIndex] = useState<number | null>(null);
  const [activeGrandchildIndex, setActiveGrandchildIndex] = useState<
    number | null
  >(null);
  const router = useRouter();
  const hasChildren =
    (item.children && item.children.length > 0) || isLoading || !!error;

  const isOpen = isMobile
    ? mobileOpen && mobileOpen[item.name]
    : hovered || subMenuHovered;

  const activeChild =
    activeChildIndex !== null && hasChildren
      ? (() => {
          const child = item.children![activeChildIndex];
          return typeof child === "string" ? null : child;
        })()
      : null;

  const activeGrandchild =
    activeGrandchildIndex !== null &&
    activeChild &&
    activeChild.children &&
    activeChild.children.length > 0
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
            ${
              hasChildren
                ? isOpen
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-700 hover:text-violet-600 hover:bg-slate-50"
                : "text-slate-700 hover:text-violet-600 hover:bg-slate-50"
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
                  {isLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                    </div>
                  ) : error ? (
                    <div className="text-center py-4">
                      <p className="text-xs text-red-500">{error}</p>
                    </div>
                  ) : (
                    item.children!.map(
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
          ${
            hasChildren
              ? isOpen
                ? "bg-violet-50 text-violet-700"
                : "text-slate-700 hover:text-violet-600 hover:bg-slate-50"
              : "text-slate-700 hover:text-violet-600 hover:bg-slate-50"
          }
        `}
      >
        <Link
          href={item?.href || ""}
          className="text-[13px] font-medium tracking-wide"
        >
          {item.name}
        </Link>
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
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-xl shadow-xl border border-slate-200 bg-white/95 backdrop-blur-md z-50 p-6 min-w-[640px] min-h-[300px] overflow-hidden"
              onMouseEnter={() => setSubMenuHovered(true)}
              onMouseLeave={() => {
                setSubMenuHovered(false);
                setActiveChildIndex(null);
                setActiveGrandchildIndex(null);
              }}
            >
              <div className="flex">
                {isLoading ? (
                  <div className="flex items-center justify-center w-full p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-foreground/40" />
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center w-full p-8">
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                ) : (
                  <>
                    {/* Level 1: Publications */}
                    <div className="flex flex-col min-w-[160px]">
                      {item.children!.map(
                        (child: MenuItemProps | string, idx: number) => {
                          const childItem =
                            typeof child === "string"
                              ? { name: child, children: [] }
                              : child;
                          const childHasChildren =
                            childItem.children && childItem.children.length > 0;
                          const isActive = activeChildIndex === idx;

                          return (
                            <div
                              key={idx}
                              className={`
                                  flex items-center justify-between cursor-pointer py-2.5 px-3 rounded-lg transition-colors duration-150
                                  ${
                                    isActive
                                      ? "bg-violet-50 text-violet-700"
                                      : "text-slate-700 hover:text-violet-600 hover:bg-slate-50"
                                  }
                                `}
                              onMouseEnter={() => {
                                setActiveChildIndex(idx);
                                setActiveGrandchildIndex(null);
                              }}
                            >
                              <span className="text-[13px] font-medium tracking-wide">
                                {childItem.name}
                              </span>
                              {childHasChildren && (
                                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>

                    {/* Level 2: Subjects */}
                    <div className="relative w-[200px] border-l border-slate-200">
                      <AnimatePresence initial={false}>
                        {activeChild &&
                        activeChild.children &&
                        activeChild.children.length > 0 ? (
                          <motion.div
                            key={activeChild.name + "-children"}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="pl-3 pr-1 py-1 rounded-lg"
                          >
                            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 pt-1">
                              {/* {activeChild.name} */}
                            </h3>
                            <div className="space-y-0.5 max-h-[300px] overflow-y-auto">
                              {activeChild.children!.map(
                                (
                                  child: MenuItemProps | string,
                                  idx: number
                                ) => {
                                  const childItem =
                                    typeof child === "string"
                                      ? { name: child, children: [] }
                                      : child;
                                  const childHasChildren =
                                    childItem.children &&
                                    childItem.children.length > 0;
                                  const isActive =
                                    activeGrandchildIndex === idx;

                                  return (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between cursor-pointer py-2 px-3 rounded-lg transition-colors duration-150"
                                      onMouseEnter={() => {
                                        setActiveGrandchildIndex(idx);
                                      }}
                                      onClick={() => {
                                        if (childItem.href) {
                                          router.push(childItem.href);
                                        }
                                      }}
                                    >
                                      <span
                                        className={`text-[13px] font-medium ${
                                          isActive
                                            ? "bg-violet-50 text-violet-700"
                                            : "text-slate-700 hover:text-violet-600 hover:bg-slate-50"
                                        } rounded-md px-2 py-0.5`}
                                      >
                                        {childItem.name}
                                      </span>
                                      {childHasChildren && (
                                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
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
                            <span className="text-xs text-slate-300">
                              Select a category
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Level 3: Books */}
                    <div className="relative w-[240px] border-l border-slate-200">
                      <AnimatePresence initial={false}>
                        {activeGrandchild &&
                        activeGrandchild.children &&
                        activeGrandchild.children.length > 0 ? (
                          <motion.div
                            key={
                              activeChild?.name + "-" + activeGrandchild.name
                            }
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.12 }}
                            className="pl-3 pr-1 py-1 rounded-r-lg"
                          >
                            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 pt-1">
                              {/* {activeGrandchild.name} */}
                            </h3>
                            <div className="space-y-0.5 max-h-[300px] overflow-y-auto">
                              {activeGrandchild.children!.map(
                                (
                                  child: MenuItemProps | string,
                                  idx: number
                                ) => {
                                  const childItem =
                                    typeof child === "string"
                                      ? { name: child, children: [] }
                                      : child;

                                  return (
                                    <div
                                      key={idx}
                                      className="cursor-pointer py-2 px-3 rounded-lg text-slate-700 hover:text-violet-600 hover:bg-slate-50 transition-colors duration-150"
                                      onClick={() => {
                                        if (childItem.href) {
                                          router.push(childItem.href);
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
                  </>
                )}
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
  const router = useRouter();

  if (hasChildren) {
    return (
      <div>
        <div
          className="flex justify-between items-center cursor-pointer py-2 px-3 rounded-lg text-slate-700 hover:text-violet-600 hover:bg-slate-50 transition-colors duration-200"
          onClick={() => {
            if (item.href) {
              router.push(item.href);
            } else {
              setOpen(!open);
            }
          }}
        >
          <span className="text-[13px] font-medium">{item.name}</span>
          {!item.href && (
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
        {open && (
          <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 pl-3">
            {item.children!.map(
              (child: MenuItemProps | string, idx: number) => {
                const childItem =
                  typeof child === "string"
                    ? { name: child, children: [] }
                    : child;
                const hasGrandchildren =
                  childItem.children && childItem.children.length > 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div
                      className="py-2 px-3 rounded-lg text-slate-700 hover:text-violet-600 hover:bg-slate-50 transition-colors duration-200 cursor-pointer text-[13px] font-medium"
                      onClick={() => {
                        if (childItem.href) {
                          router.push(childItem.href);
                        }
                      }}
                    >
                      {childItem.name}
                    </div>
                    {hasGrandchildren && (
                      <div className="ml-2 space-y-1 border-l border-border/40 pl-3">
                        {childItem.children!.map(
                          (
                            grandchild: MenuItemProps | string,
                            gIdx: number
                          ) => {
                            const grandchildItem =
                              typeof grandchild === "string"
                                ? { name: grandchild, children: [] }
                                : grandchild;
                            return (
                              <div
                                key={gIdx}
                                className="py-1.5 px-2 rounded-lg text-slate-600 hover:text-violet-600 hover:bg-slate-50 transition-colors duration-200 cursor-pointer text-[12px]"
                                onClick={() => {
                                  if (grandchildItem.href) {
                                    router.push(grandchildItem.href);
                                  }
                                }}
                              >
                                {grandchildItem.name}
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex justify-between items-center cursor-pointer py-2 px-3 rounded-lg text-slate-700 hover:text-violet-600 hover:bg-slate-50 transition-colors duration-200"
      onClick={() => {
        if (item.href) {
          router.push(item.href);
        }
      }}
    >
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
  const pathname = usePathname();
  const { data: bookTree = [], isLoading, error } = useBookTree();

  // Build 3-layer menu: Publication > Subject > Book
  const pastPapersChildren = bookTree.map((pub) => ({
    name: pub.publication.name,
    children: pub.subjects.map((sub) => ({
      name: sub.subject.name,
      href: `/books?subjectId=${sub.subject.id}`,
      children: sub.books.map((book) => ({
        name: book.title,
        href: `/book/${book.id}`,
      })),
    })),
  }));

  const navLinks = [
    { name: "Home", children: [], href: "/" },
    {
      name: "Past Papers",
      href: "/books",
      children: isLoading || error ? [] : pastPapersChildren,
      isLoading,
      error: error?.message || null,
    },
    { name: "Yearwise", children: [] },
    { name: "Coursebooks", children: [] },
    { name: "Teachers", children: [] },
  ] as MenuItemProps[];

  const toggleMobile = (key: string) => {
    setMobileOpen((prev) => ({
      ...prev,
      [key]: prev[key] ? false : true,
    }));
  };

  if (pathname === "/login") return null;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-slate-200"
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
                className="h-9 px-5 text-[13px] font-medium rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-200 transition-colors"
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
                <X className="w-5 h-5 text-slate-700" />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" />
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
            className="lg:hidden border-t border-slate-200 overflow-hidden bg-white/95 backdrop-blur-2xl"
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

              <div className="pt-4 flex gap-2 border-t border-slate-200 mt-4">
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
                      className="flex-1 h-10 rounded-full text-[13px] font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors"
                      onClick={() => navigate.push("/login")}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-10 rounded-full text-[13px] font-medium border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
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
      relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 hover:text-violet-600 transition-all duration-200
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
