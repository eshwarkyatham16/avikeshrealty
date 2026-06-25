import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { fadeUp, staggerContainer } from "../../utils/animations";
import { useTheme } from "../../context/ThemeContext";

function IconInstagram({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
function IconFacebook({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function IconLinkedin({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function IconYoutube({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

const socialLinks = [
  { icon: IconInstagram, href: "https://instagram.com/avikeshrealty", label: "Instagram" },
  { icon: IconFacebook, href: "https://facebook.com/avikeshrealty", label: "Facebook" },
  { icon: IconLinkedin, href: "https://linkedin.com/company/avikeshrealty", label: "LinkedIn" },
  { icon: IconYoutube, href: "https://youtube.com/@avikeshrealty", label: "YouTube" },
];

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Properties", path: "/properties" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const propertyCategories = [
  { name: "Luxury Villas", path: "/properties?type=villa" },
  { name: "Premium Apartments", path: "/properties?type=apartment" },
  { name: "Commercial Spaces", path: "/properties?type=commercial" },
  { name: "Investment Plots", path: "/properties?type=plot" },
];

export default function Footer() {
  const { ref, controls } = useScrollAnimation({ threshold: 0.1 });
  const { isDark } = useTheme();

  return (
    <footer
      className={`relative ${
        isDark ? "bg-luxury-950" : "bg-luxury-50"
      }`}
    >
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <motion.div variants={fadeUp}>
            <Link to="/" className="inline-block mb-6">
              <span className="font-heading text-2xl tracking-[0.15em] font-bold">
                <span className={isDark ? "text-luxury-100" : "text-luxury-900"}>
                  AVIKESH
                </span>{" "}
                <span className="text-gold-500">REALTY</span>
              </span>
            </Link>
            <p
              className={`text-sm leading-relaxed mb-6 ${
                isDark ? "text-luxury-400" : "text-luxury-500"
              }`}
            >
              Redefining luxury living in Hyderabad. We curate exceptional
              properties for discerning individuals who demand nothing but the
              finest.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isDark
                      ? "bg-luxury-800/50 text-luxury-400 hover:bg-gold-500/20 hover:text-gold-400"
                      : "bg-luxury-100 text-luxury-500 hover:bg-gold-500/20 hover:text-gold-600"
                  }`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4
              className={`font-heading text-lg font-semibold mb-6 ${
                isDark ? "text-luxury-100" : "text-luxury-900"
              }`}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`text-sm transition-colors duration-300 inline-flex items-center gap-1 group ${
                      isDark
                        ? "text-luxury-400 hover:text-gold-400"
                        : "text-luxury-500 hover:text-gold-600"
                    }`}
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4
              className={`font-heading text-lg font-semibold mb-6 ${
                isDark ? "text-luxury-100" : "text-luxury-900"
              }`}
            >
              Property Categories
            </h4>
            <ul className="space-y-3">
              {propertyCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    to={category.path}
                    className={`text-sm transition-colors duration-300 inline-flex items-center gap-1 group ${
                      isDark
                        ? "text-luxury-400 hover:text-gold-400"
                        : "text-luxury-500 hover:text-gold-600"
                    }`}
                  >
                    {category.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4
              className={`font-heading text-lg font-semibold mb-6 ${
                isDark ? "text-luxury-100" : "text-luxury-900"
              }`}
            >
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin
                  className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5"
                />
                <span
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-luxury-400" : "text-luxury-500"
                  }`}
                >
                  Road No. 36, Jubilee Hills,
                  <br />
                  Hyderabad, Telangana 500033,
                  <br />
                  India
                </span>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className={`flex gap-3 text-sm transition-colors duration-300 ${
                    isDark
                      ? "text-luxury-400 hover:text-gold-400"
                      : "text-luxury-500 hover:text-gold-600"
                  }`}
                >
                  <Phone className="w-5 h-5 text-gold-500 flex-shrink-0" />
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@avikeshrealty.com"
                  className={`flex gap-3 text-sm transition-colors duration-300 ${
                    isDark
                      ? "text-luxury-400 hover:text-gold-400"
                      : "text-luxury-500 hover:text-gold-600"
                  }`}
                >
                  <Mail className="w-5 h-5 text-gold-500 flex-shrink-0" />
                  info@avikeshrealty.com
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="mt-16 pt-8 border-t border-luxury-800/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p
              className={`text-xs tracking-wide ${
                isDark ? "text-luxury-500" : "text-luxury-400"
              }`}
            >
              &copy; 2024 Avikesh Realty. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className={`text-xs transition-colors duration-300 ${
                  isDark
                    ? "text-luxury-500 hover:text-luxury-300"
                    : "text-luxury-400 hover:text-luxury-600"
                }`}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className={`text-xs transition-colors duration-300 ${
                  isDark
                    ? "text-luxury-500 hover:text-luxury-300"
                    : "text-luxury-400 hover:text-luxury-600"
                }`}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
