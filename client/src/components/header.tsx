import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-black transition-all duration-300"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="px-4 md:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* Left Navigation */}
          <nav className="flex items-center space-x-8">
            <div className="text-red-600 font-black text-2xl">InBetaByPriya</div>
            <ul className="hidden md:flex space-x-6">
              <li>
                <Link href="/">
                  <button className="hover:text-netflix-light-gray transition-colors duration-200">
                    Home
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/projects">
                  <button className="hover:text-netflix-light-gray transition-colors duration-200">
                    Projects
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <button className="hover:text-netflix-light-gray transition-colors duration-200">
                    Contact
                  </button>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-white/10 rounded transition-all duration-200">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded transition-all duration-200 text-lg">
              🔔
            </button>
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}