import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import SectionHeading from "../ui/SectionHeading";
import MagneticButton from "../ui/MagneticButton";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { fadeUp, staggerContainer, slideInLeft, slideInRight } from "../../utils/animations";

const BUDGET_OPTIONS = [
  { value: "", label: "Select Budget Range" },
  { value: "under-50l", label: "Under ₹50L" },
  { value: "50l-1cr", label: "₹50L - 1Cr" },
  { value: "1cr-2cr", label: "₹1Cr - 2Cr" },
  { value: "2cr-5cr", label: "₹2Cr - 5Cr" },
  { value: "5cr-plus", label: "₹5Cr+" },
];

const PROPERTY_TYPE_OPTIONS = [
  { value: "", label: "Select Property Type" },
  { value: "villa", label: "Villa" },
  { value: "apartment", label: "Apartment" },
  { value: "commercial", label: "Commercial" },
  { value: "plot", label: "Plot" },
];

const contactInfo = [
  {
    icon: MapPin,
    label: "Visit Us",
    value: "8-2-293/82/A, Road No. 36,\nJubilee Hills, Hyderabad 500033",
    href: null,
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@avikeshrealty.com",
    href: "mailto:hello@avikeshrealty.com",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon - Sat: 10:00 AM - 7:00 PM\nSunday: By Appointment",
    href: null,
  },
];

function FormInput({ label, id, type = "text", register, error, placeholder, isDark }) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`block font-body text-sm font-medium mb-2 ${
          isDark ? "text-luxury-300" : "text-luxury-700"
        }`}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register}
        className={`w-full px-4 py-3 rounded-xl font-body text-sm transition-all duration-300 outline-none ${
          isDark
            ? "bg-white/5 border border-white/10 text-luxury-100 placeholder-luxury-600 focus:border-gold-500/50 focus:bg-white/8"
            : "bg-luxury-50 border border-luxury-200 text-luxury-900 placeholder-luxury-400 focus:border-gold-500 focus:bg-white"
        } ${error ? "border-red-400/50" : ""}`}
      />
      {error && (
        <p className="mt-1.5 text-xs font-body text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error.message}
        </p>
      )}
    </div>
  );
}

function FormSelect({ label, id, options, register, error, isDark }) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`block font-body text-sm font-medium mb-2 ${
          isDark ? "text-luxury-300" : "text-luxury-700"
        }`}
      >
        {label}
      </label>
      <select
        id={id}
        {...register}
        className={`w-full px-4 py-3 rounded-xl font-body text-sm transition-all duration-300 outline-none cursor-pointer ${
          isDark
            ? "bg-white/5 border border-white/10 text-luxury-100 focus:border-gold-500/50 focus:bg-white/8"
            : "bg-luxury-50 border border-luxury-200 text-luxury-900 focus:border-gold-500 focus:bg-white"
        } ${error ? "border-red-400/50" : ""}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-luxury-900 text-luxury-100">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-xs font-body text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error.message}
        </p>
      )}
    </div>
  );
}

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
        className={`block p-5 rounded-2xl transition-all duration-300 ${
          isDark
            ? "hover:bg-white/5"
            : "hover:bg-luxury-50"
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
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ref: formRef, controls: formControls } = useScrollAnimation();
  const { ref: infoRef, controls: infoControls } = useScrollAnimation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, event) => {
    const submitType = event?.nativeEvent?.submitter?.value || "consultation";
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: submitType }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        reset();
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <SectionHeading
          title="Get In Touch"
          subtitle="Start Your Journey"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Form - left side */}
          <motion.div
            ref={formRef}
            variants={slideInLeft}
            initial="hidden"
            animate={formControls}
            className="lg:col-span-3"
          >
            <div
              className={`p-8 sm:p-10 rounded-3xl ${
                isDark ? "glass" : "glass-light luxury-shadow"
              }`}
            >
              <h3
                className={`font-heading text-2xl font-bold mb-2 ${
                  isDark ? "text-luxury-100" : "text-luxury-900"
                }`}
              >
                Book a Consultation
              </h3>
              <p
                className={`font-body text-sm mb-8 ${
                  isDark ? "text-luxury-400" : "text-luxury-600"
                }`}
              >
                Fill in the details below and our team will reach out within 24 hours.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormInput
                    label="Full Name"
                    id="name"
                    placeholder="Your full name"
                    isDark={isDark}
                    register={register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    error={errors.name}
                  />
                  <FormInput
                    label="Phone Number"
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    isDark={isDark}
                    register={register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[+]?[\d\s()-]{10,15}$/,
                        message: "Enter a valid phone number",
                      },
                    })}
                    error={errors.phone}
                  />
                </div>

                <FormInput
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  isDark={isDark}
                  register={register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Enter a valid email address",
                    },
                  })}
                  error={errors.email}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormSelect
                    label="Budget Range"
                    id="budget"
                    options={BUDGET_OPTIONS}
                    isDark={isDark}
                    register={register("budget", {
                      required: "Please select a budget range",
                    })}
                    error={errors.budget}
                  />
                  <FormSelect
                    label="Property Type"
                    id="propertyType"
                    options={PROPERTY_TYPE_OPTIONS}
                    isDark={isDark}
                    register={register("propertyType", {
                      required: "Please select a property type",
                    })}
                    error={errors.propertyType}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className={`block font-body text-sm font-medium mb-2 ${
                      isDark ? "text-luxury-300" : "text-luxury-700"
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Tell us about your requirements..."
                    {...register("message")}
                    className={`w-full px-4 py-3 rounded-xl font-body text-sm transition-all duration-300 outline-none resize-none ${
                      isDark
                        ? "bg-white/5 border border-white/10 text-luxury-100 placeholder-luxury-600 focus:border-gold-500/50 focus:bg-white/8"
                        : "bg-luxury-50 border border-luxury-200 text-luxury-900 placeholder-luxury-400 focus:border-gold-500 focus:bg-white"
                    }`}
                  />
                </div>

                {/* Submit status */}
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <p className="font-body text-sm text-green-400">
                      Thank you! Our team will contact you shortly.
                    </p>
                  </motion.div>
                )}
                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="font-body text-sm text-red-400">
                      Something went wrong. Please try again or call us directly.
                    </p>
                  </motion.div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    type="submit"
                    name="submitType"
                    value="consultation"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-body font-semibold text-sm sm:text-base rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all duration-300 luxury-shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? "Sending..." : "Book Consultation"}
                  </button>
                  <button
                    type="submit"
                    name="submitType"
                    value="site-visit"
                    disabled={isSubmitting}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-body font-semibold text-sm sm:text-base rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark
                        ? "glass border border-white/20 text-white hover:bg-white/10"
                        : "border-2 border-gold-500 text-gold-600 hover:bg-gold-50"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule Site Visit
                  </button>
                </div>
              </form>
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
