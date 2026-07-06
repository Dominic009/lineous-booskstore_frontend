"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowLeft,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import GoogleButton from "@/components/social-login/GoogleButton";
import FacebookButton from "@/components/social-login/FacebookButton";
import AppleButton from "@/components/social-login/AppleButton";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success("Welcome back!", {
          description: "You've successfully logged in.",
        });
        router.push("/");
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.warning("Passwords don't match", {
            description: "Please make sure your passwords match.",
          });
          setIsLoading(false);
          return;
        }

        await register(formData.email, formData.password, formData.name);
        toast.success("Account created!", {
          description: "Welcome to BookHaven.",
        });
        router.push("/");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Floating particles for ambient background
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0f] flex flex-col lg:flex-row">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[100px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-indigo-500/8 blur-[80px] animate-pulse"
          style={{ animationDelay: "4s" }}
        />

        {/* Floating particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/[0.03]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12"
      >
        <div className="w-full max-w-[420px]">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-all duration-300 mb-10"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800/50 border border-zinc-700/50 group-hover:border-zinc-600 group-hover:bg-zinc-700/50 transition-all duration-300">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-10"
          >
            {/* <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20">
                <BookOpen className="w-5 h-5 text-violet-400" />
              </div>
              <div className="h-6 w-px bg-zinc-700/50" />
              <span className="text-sm font-medium text-zinc-500 tracking-wide uppercase">
                BookHaven
              </span>
            </div> */}

            <h1 className="text-4xl lg:text-[2.75rem] font-bold text-white tracking-tight leading-[1.1] mb-3">
              {isLogin ? (
                <>
                  Welcome{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-amber-400">
                    back
                  </span>
                </>
              ) : (
                <>
                  Start your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-amber-400">
                    journey
                  </span>
                </>
              )}
            </h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              {isLogin
                ? "Sign in to access your curated library and continue exploring worlds within pages."
                : "Join thousands of readers. Your next favorite story is waiting to be discovered."}
            </p>
          </motion.div>

          {/* Social Login Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 mb-8"
          >
            <GoogleButton onSuccess={() => router.push("/")} />
            <FacebookButton onSuccess={() => router.push("/")} />
            <AppleButton onSuccess={() => router.push("/")} />
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0a0a0f] px-4 text-xs font-medium text-zinc-500 tracking-widest uppercase">
                Or continue with email
              </span>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-zinc-300 ml-1"
                  >
                    Full Name
                  </Label>
                  <div className="relative group">
                    <div
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${focusedField === "name" ? "opacity-100" : ""}`}
                    />
                    <div className="relative flex items-center">
                      <User
                        className={`absolute left-4 w-[18px] h-[18px] transition-colors duration-300 ${focusedField === "name" ? "text-violet-400" : "text-zinc-500"}`}
                      />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        className="pl-11 pr-4 h-12 bg-zinc-900/60 border-zinc-700/50 text-white placeholder:text-zinc-600 rounded-xl focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-zinc-300 ml-1"
              >
                Email Address
              </Label>
              <div className="relative group">
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${focusedField === "email" ? "opacity-100" : ""}`}
                />
                <div className="relative flex items-center">
                  <Mail
                    className={`absolute left-4 w-[18px] h-[18px] transition-colors duration-300 ${focusedField === "email" ? "text-violet-400" : "text-zinc-500"}`}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="pl-11 pr-4 h-12 bg-zinc-900/60 border-zinc-700/50 text-white placeholder:text-zinc-600 rounded-xl focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-zinc-300 ml-1"
              >
                Password
              </Label>
              <div className="relative group">
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${focusedField === "password" ? "opacity-100" : ""}`}
                />
                <div className="relative flex items-center">
                  <Lock
                    className={`absolute left-4 w-[18px] h-[18px] transition-colors duration-300 ${focusedField === "password" ? "text-violet-400" : "text-zinc-500"}`}
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="pl-11 pr-12 h-12 bg-zinc-900/60 border-zinc-700/50 text-white placeholder:text-zinc-600 rounded-xl focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors duration-200 p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-[18px] h-[18px]" />
                    ) : (
                      <Eye className="w-[18px] h-[18px]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-zinc-300 ml-1"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative group">
                    <div
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${focusedField === "confirmPassword" ? "opacity-100" : ""}`}
                    />
                    <div className="relative flex items-center">
                      <Lock
                        className={`absolute left-4 w-[18px] h-[18px] transition-colors duration-300 ${focusedField === "confirmPassword" ? "text-violet-400" : "text-zinc-500"}`}
                      />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        onFocus={() => setFocusedField("confirmPassword")}
                        onBlur={() => setFocusedField(null)}
                        className="pl-11 pr-4 h-12 bg-zinc-900/60 border-zinc-700/50 text-white placeholder:text-zinc-600 rounded-xl focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isLogin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-end"
              >
                <button
                  type="button"
                  className="text-sm text-zinc-400 hover:text-violet-400 transition-colors duration-300 font-medium"
                >
                  Forgot password?
                </button>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="relative w-full h-12 bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500 hover:from-violet-400 hover:via-indigo-400 hover:to-violet-400 text-white font-semibold rounded-xl transition-all duration-500 border border-violet-400/20 shadow-xl shadow-violet-900/40 hover:shadow-violet-900/60 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Please wait...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {isLogin ? "Sign In" : "Create Account"}
                    </>
                  )}
                </span>
              </Button>
            </motion.div>
          </motion.form>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-zinc-500 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-violet-400 hover:text-violet-300 font-semibold transition-colors duration-300 relative group"
              >
                {isLogin ? "Sign up" : "Sign in"}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-violet-400 group-hover:w-full transition-all duration-300" />
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Image with Glassmorphism Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"
      >
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=1600&fit=crop"
          alt="Library"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-[#0a0a0f]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-transparent to-transparent" />

        {/* Glassmorphism Quote Card */}
        <div className="absolute bottom-12 left-12 right-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="relative"
          >
            {/* Glass card */}
            <div className="relative p-8 rounded-2xl overflow-hidden">
              {/* Glass effect layers */}
              <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.05] to-transparent rounded-2xl" />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      className="text-violet-400/60"
                    >
                      <path
                        d="M10 18c-2.2 0-4-1.8-4-4s1.8-4 4-4c.6 0 1.2.1 1.7.4C11.2 7.6 9.2 6 7 6v-2c4.4 0 8 3.6 8 8v6h-5zm14 0c-2.2 0-4-1.8-4-4s1.8-4 4-4c.6 0 1.2.1 1.7.4C25.2 7.6 23.2 6 21 6v-2c4.4 0 8 3.6 8 8v6h-5z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg lg:text-xl text-zinc-200 font-light leading-relaxed italic mb-4">
                      A reader lives a thousand lives before he dies. The man
                      who never reads lives only one.
                    </p>
                    <footer className="flex items-center gap-3">
                      <div className="h-px w-8 bg-gradient-to-r from-violet-400/60 to-transparent" />
                      <span className="text-sm font-medium text-violet-300/80 tracking-wide">
                        George R.R. Martin
                      </span>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-8 right-8 w-20 h-20 border-t border-r border-white/[0.06] rounded-tr-2xl" />
        <div className="absolute bottom-8 left-8 w-20 h-20 border-b border-l border-white/[0.06] rounded-bl-2xl" />
      </motion.div>
    </div>
  );
};

export default LoginPage;
