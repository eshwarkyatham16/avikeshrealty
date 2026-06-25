import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Properties", path: "/properties" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? isDark
              ? "glass shadow-lg"
              : "glass-light shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex-shrink-0">
              <motion.span
                className="font-heading text-xl md:text-2xl tracking-[0.15em] font-bold"
                whileHover={{ scale: 1.02 }}
              >
                <span className={isDark ? "text-luxury-100" : "text-luxury-900"}>
                  AVIKESH
                </span>{" "}
                <span className="text-gold-500">REALTY</span>
              </motion.span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link key={link.name} to={link.path} className="relative group">
                    <span
                      className={`text-sm tracking-[0.1em] uppercase transition-colors duration-300 ${
                        isActive
                          ? "text-gold-500"
                          : isDark
                          ? "text-luxury-300 hover:text-luxury-100"
                          : "text-luxury-600 hover:text-luxury-900"
                      }`}
                    >
                      {link.name}
                    </span>
                    <motion.span
                      className="absolute -bottom-1 left-0 h-[1px] bg-gold-500"
                      initial={false}
                      animate={{ width: isActive ? "100%" : "0%" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ display: "block" }}
                    />
                  </Link>
                );
              })}

              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`p-2 rounded-full transition-colors duration-300 cursor-pointer ${
                  isDark
                    ? "text-luxury-300 hover:text-gold-400 hover:bg-luxury-800/50"
                    : "text-luxury-600 hover:text-gold-500 hover:bg-luxury-100"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`p-2 rounded-full cursor-pointer ${
                  isDark ? "text-luxury-300" : "text-luxury-600"
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                className={`p-2 rounded-full cursor-pointer ${
                  isDark ? "text-luxury-300" : "text-luxury-600"
                }`}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-[99] flex flex-col items-center justify-center ${
              isDark ? "bg-luxury-950/98" : "bg-white/98"
            } backdrop-blur-xl`}
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.08,
                      ease: [0.25, 0.4, 0.25, 1],
                    }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`font-heading text-3xl tracking-[0.1em] transition-colors duration-300 ${
                        isActive
                          ? "text-gold-500"
                          : isDark
                          ? "text-luxury-200"
                          : "text-luxury-800"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-4" />
              <p className={`text-xs tracking-[0.2em] uppercase ${isDark ? "text-luxury-500" : "text-luxury-400"}`}>
                Luxury Real Estate
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
