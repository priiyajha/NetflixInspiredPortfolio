import { motion } from "framer-motion";
import { Profile } from "@shared/schema";

interface FooterProps {
  profile?: Profile;
}

export default function Footer({ profile }: FooterProps) {
  if (!profile) {
    return (
      <footer id="contact" className="bg-netflix-dark py-16 px-4 md:px-12 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-netflix-light-gray">Contact information not available</div>
        </div>
      </footer>
    );
  }

  return (
    <footer id="contact" className="bg-netflix-dark py-16 px-4 md:px-12 mt-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-xl text-netflix-light-gray">Ready to bring your ideas to life</p>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center space-x-2 text-netflix-light-gray hover:text-white transition-colors"
          >
            <span>📧</span>
            <span>{profile.email}</span>
          </a>
          <a
            href={`tel:${profile.phone}`}
            className="flex items-center space-x-2 text-netflix-light-gray hover:text-white transition-colors"
          >
            <span>📞</span>
            <span>{profile.phone}</span>
          </a>
          <div className="flex items-center space-x-2 text-netflix-light-gray">
            <span>📍</span>
            <span>{profile.location}</span>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex justify-center space-x-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <a
            href={profile.social.linkedin}
            className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-netflix-red transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin-in text-xl"></i>
          </a>
          <a
            href={profile.social.github}
            className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-netflix-red transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-github text-xl"></i>
          </a>
          <a
            href={profile.social.twitter}
            className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-netflix-red transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter text-xl"></i>
          </a>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="text-center text-netflix-light-gray"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p>&copy; 2024 Portfolio. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}