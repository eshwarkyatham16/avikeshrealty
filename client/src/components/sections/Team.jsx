import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import SectionHeading from "../ui/SectionHeading";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { fadeUp, staggerContainer } from "../../utils/animations";
import team from "../../data/team";

function getTeamPhoto(member) {
  return member.image || member.photo || "";
}

function SocialIcon({ type, className }) {
  const props = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };
  if (type === "linkedin") return <svg {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>;
  if (type === "twitter") return <svg {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>;
  if (type === "instagram") return <svg {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>;
  return null;
}

const socialIcons = { linkedin: "linkedin", twitter: "twitter", instagram: "instagram" };

function TeamCard({ member, index }) {
  const { isDark } = useTheme();
  const photo = getTeamPhoto(member);

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className={`group relative rounded-2xl overflow-hidden ${
        isDark ? "glass" : "glass-light"
      } hover:luxury-shadow transition-all duration-500`}
    >
      {/* Photo container */}
      <div className="relative h-72 sm:h-80 overflow-hidden">
        <img
          src={photo}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient overlay - always visible at bottom */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isDark
              ? "bg-gradient-to-t from-luxury-950 via-luxury-950/20 to-transparent"
              : "bg-gradient-to-t from-luxury-900/80 via-luxury-900/10 to-transparent"
          }`}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-luxury-950/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          {/* Social icons */}
          <div className="flex items-center gap-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            {member.social &&
              Object.entries(member.social).map(([platform, url]) => {
                if (!socialIcons[platform]) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-gold-400 hover:border-gold-400/50 transition-all duration-300"
                    aria-label={`${member.name} on ${platform}`}
                  >
                    <SocialIcon type={platform} className="w-5 h-5" />
                  </a>
                );
              })}
          </div>
        </div>

        {/* Name overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-1">
            {member.name}
          </h3>
          <p className="font-body text-sm text-gold-400 tracking-wide">
            {member.role}
          </p>
        </div>
      </div>

      {/* Bio */}
      <div className="p-5 sm:p-6">
        <p
          className={`font-body text-sm leading-relaxed ${
            isDark ? "text-luxury-400" : "text-luxury-600"
          }`}
        >
          {member.bio}
        </p>
      </div>
    </motion.div>
  );
}

export default function Team() {
  const { isDark } = useTheme();
  const { ref, controls } = useScrollAnimation();

  return (
    <section className={`py-20 md:py-28 relative ${isDark ? "bg-luxury-950" : "bg-white"}`}>
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full blur-3xl ${
            isDark ? "bg-gold-500/5" : "bg-gold-200/20"
          }`}
        />
        <div
          className={`absolute -bottom-32 -left-32 w-[300px] h-[300px] rounded-full blur-3xl ${
            isDark ? "bg-gold-600/5" : "bg-gold-300/15"
          }`}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          title="Meet Our Team"
          subtitle="The People Behind the Promise"
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {team.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
