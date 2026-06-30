import { createContext, useEffect, useState } from "react";

const SettingsContext = createContext(undefined);

const DEFAULT_SETTINGS = {
  siteName: "Avikesh Realty",
  logo: { primaryText: "AVIKESH", accentText: "REALTY", imageUrl: "" },
  whatsappNumber: "919876543210",
  contact: {
    phone: "+91 98765 43210",
    email: "info@avikeshrealty.com",
    address: "Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033, India",
    workingHours: "Mon - Sat: 10:00 AM - 7:00 PM",
  },
  social: {
    instagram: "https://instagram.com/avikeshrealty",
    facebook: "https://facebook.com/avikeshrealty",
    linkedin: "https://linkedin.com/company/avikeshrealty",
    youtube: "https://youtube.com/@avikeshrealty",
  },
  hero: {
    headlineLine1: "Where Luxury Meets",
    headlineLine2: "Opportunity",
    subtitle:
      "Discover premium villas, apartments and investment properties across Hyderabad.",
    backgroundImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
  },
  about: {
    storyHeading: "Our Story",
    storyParagraph:
      "For over 15 years, Avikesh Realty has been redefining luxury living in Hyderabad. We don't just sell properties — we craft lifestyles, build legacies, and create investment opportunities that stand the test of time. Our commitment to excellence, transparency, and client satisfaction has made us one of the most trusted names in premium real estate.",
    legacyHeading: "A Legacy of Excellence",
    legacyParagraphs: [
      "Founded with a vision to transform the real estate landscape in Hyderabad, Avikesh Realty has grown from a small consultancy to a premium real estate powerhouse.",
      "Our portfolio spans luxury villas, premium apartments, strategic commercial spaces, and high-value investment plots — each handpicked for quality, location, and appreciation potential.",
      "With over ₹2000 Crores in successful transactions and 1000+ satisfied clients, our track record speaks for itself.",
    ],
  },
  stats: {
    yearsExperience: 15,
    propertiesSold: 500,
    happyClients: 1000,
    investmentPortfolioCr: 2000,
  },
  footer: {
    description:
      "Redefining luxury living in Hyderabad. We curate exceptional properties for discerning individuals who demand nothing but the finest.",
  },
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch settings");
        return res.json();
      })
      .then((data) => {
        if (!cancelled && data && typeof data === "object") {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {
        // Keep defaults on failure
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsContext;
