import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useSettings } from "../../hooks/useSettings";
import { getWhatsAppLink } from "../../utils/whatsapp";
import SectionHeading from "../ui/SectionHeading";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { fadeUp, staggerContainer, slideInLeft, slideInRight } from "../../utils/animations";

function ContactInfoCard({ item, index }) {
  const { isDark } = useTheme();
  const Icon = item.icon;

  const content = (
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-gold-500" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-body text-xs tracking-[0.15em] uppercase text-gold-500 mb-1">
          {item.label}
        </p>
        <p
          className={`font-body text-sm leading-relaxed whitespace-pre-line ${
            isDark ? "text-luxury-200" : "text-luxury-700"
          }`}
        >
          {item.value}
        </p>
      </div>
    </div>
  );

  if (item.href) {
    return (
      <motion.a
        variants={fadeUp}
        custom={index}
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        className={`block p-5 rounded-2xl transition-all duration-300 ${
          isDark ? "hover:bg-white/5" : "hover:bg-luxury-50"
        }`}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div variants={fadeUp} custom={index} className="p-5">
      {content}
    </motion.div>
  );
}

export default function Contact() {
  const { isDark } = useTheme();
  const { settings } = useSettings();
  const { ref: ctaRef, controls: ctaControls } = useScrollAnimation();
  const { ref: infoRef, controls: infoControls } = useScrollAnimation();

  const contactInfo = [
    {
      icon: MapPin,
      label: "Visit Us",
      value: settings.contact.address,
      href: null,
    },
    {
      icon: Phone,
      label: "Call Us",
      value: settings.contact.phone,
      href: `tel:${settings.contact.phone.replace(/[^0-9+]/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email Us",
      value: settings.contact.email,
      href: `mailto:${settings.contact.email}`,
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: settings.contact.workingHours,
      href: null,
    },
  ];

  const consultationLink = getWhatsAppLink(
    settings.whatsappNumber,
    "Hi, I'd like to book a consultation with Avikesh Realty."
  );
  const siteVisitLink = getWhatsAppLink(
    settings.whatsappNumber,
    "Hi, I'd like to schedule a site visit for one of your properties."
  );

  return (
    <section
      id="contact"
      className={`py-20 md:py-28 relative overflow-hidden ${
        isDark ? "bg-luxury-950" : "bg-white"
      }`}
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-3xl ${
            isDark ? "bg-gold-500/3" : "bg-gold-200/10"
          }`}
          style={{ transform: "translateY(-40%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading title="Get In Touch" subtitle="Start Your Journey" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* CTA panel - left side */}
          <motion.div
            ref={ctaRef}
            variants={slideInLeft}
            initial="hidden"
            animate={ctaControls}
            className="lg:col-span-3"
          >
            <div
              className={`flex flex-col justify-center h-full p-8 sm:p-10 rounded-3xl ${
                isDark ? "glass" : "glass-light luxury-shadow"
              }`}
            >
              <h3
                className={`font-heading text-2xl sm:text-3xl font-bold mb-4 ${
                  isDark ? "text-luxury-100" : "text-luxury-900"
                }`}
              >
                Ready to Find Your{" "}
                <span className="text-gradient">Dream Property?</span>
              </h3>
              <p
                className={`font-body text-sm sm:text-base mb-10 leading-relaxed ${
                  isDark ? "text-luxury-400" : "text-luxury-600"
                }`}
              >
                Chat with our advisory team directly on WhatsApp — no forms,
                no waiting. We typically respond within minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={consultationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-body font-semibold text-sm sm:text-base rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all duration-300 luxury-shadow cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Book Consultation
                </a>
                <a
                  href={siteVisitLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-body font-semibold text-sm sm:text-base rounded-xl transition-all duration-300 cursor-pointer ${
                    isDark
                      ? "glass border border-white/20 text-white hover:bg-white/10"
                      : "border-2 border-gold-500 text-gold-600 hover:bg-gold-50"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Site Visit
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact info - right side */}
          <motion.div
            ref={infoRef}
            variants={slideInRight}
            initial="hidden"
            animate={infoControls}
            className="lg:col-span-2"
          >
            <div
              className={`p-6 sm:p-8 rounded-3xl mb-6 ${
                isDark ? "glass" : "glass-light luxury-shadow"
              }`}
            >
              <h3
                className={`font-heading text-xl font-bold mb-6 ${
                  isDark ? "text-luxury-100" : "text-luxury-900"
                }`}
              >
                Contact Information
              </h3>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate={infoControls}
                className="space-y-1"
              >
                {contactInfo.map((item, index) => (
                  <ContactInfoCard key={item.label} item={item} index={index} />
                ))}
              </motion.div>
            </div>

            {/* Map placeholder */}
            <div
              className={`relative h-56 sm:h-64 rounded-3xl overflow-hidden ${
                isDark ? "glass" : "glass-light luxury-shadow"
              }`}
            >
              <div
                className={`w-full h-full flex items-center justify-center ${
                  isDark ? "bg-luxury-900/50" : "bg-luxury-100"
                }`}
              >
                <div className="text-center">
                  <MapPin
                    className={`w-10 h-10 mx-auto mb-3 ${
                      isDark ? "text-gold-500/40" : "text-gold-400"
                    }`}
                  />
                  <p
                    className={`font-body text-sm ${
                      isDark ? "text-luxury-500" : "text-luxury-500"
                    }`}
                  >
                    Jubilee Hills, Hyderabad
                  </p>
                  <a
                    href="https://maps.google.com/?q=Jubilee+Hills+Hyderabad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 font-body text-sm text-gold-500 hover:text-gold-400 transition-colors underline underline-offset-4"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>

              {/* Decorative grid pattern */}
              <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle, ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"} 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
