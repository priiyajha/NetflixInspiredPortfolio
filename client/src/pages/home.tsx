import { useQuery } from "@tanstack/react-query";
import Header from "../components/header";
import HeroSection from "../components/hero-section";
import ProjectsSection from "../components/projects-section";
import NetflixModal from "../components/netflix-modal";
import { Profile } from "../../../shared/schema";
import { useState, useEffect, useRef } from "react";
import { Linkedin, Mail, Phone, Home as HomeIcon, Folder, Download, Briefcase, Mic, ChevronDown } from "lucide-react";
import { FaTwitter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

export default function Home() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  // Check for project parameter in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectParam = urlParams.get('project');
    if (projectParam) {
      setSelectedProjectId(projectParam);
      // Remove the parameter from URL without causing a page reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleProfileAction = (action: string) => {
    setProfileMenuOpen(false);
    
    switch (action) {
      case 'download-resume':
        // Create a temporary link to download the resume
        const link = document.createElement('a');
        link.href = '/attached_assets/FAROOQ CHISTY  RESUME 2025 (1)_1754665051871.pdf';
        link.download = 'Farooq_Chisty_Resume_2025.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      case 'work-with-me':
        window.open("https://linkedin.com/in/farooqchisty", "_blank");
        break;
      case 'invite-speaker':
        window.open("mailto:farooqsheik52543@gmail.com?subject=Speaking Opportunity&body=Hi Farooq, I'd like to invite you as a speaker for our event.", "_blank");
        break;
      case 'connect-linkedin':
        window.open("https://linkedin.com/in/farooqchisty", "_blank");
        break;
      default:
        break;
    }
  };

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg sm:text-xl">Loading...</div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-lg sm:text-xl">Failed to load profile. Please refresh the page.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      
      {/* Bottom Navigation Bar - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#141414] border-t border-gray-700">
        <div className="flex items-center justify-around py-1">
          {/* Home Button */}
          <button
            onClick={() => setLocation("/")}
            className="flex flex-col items-center py-1 px-2 hover:bg-white/10 rounded transition-all duration-200"
          >
            <HomeIcon className="w-5 h-5 text-white mb-0.5" />
            <span className="text-xs text-white">Home</span>
          </button>

          {/* Projects Button */}
          <button
            onClick={() => scrollToSection("projects")}
            className="flex flex-col items-center py-1 px-2 hover:bg-white/10 rounded transition-all duration-200"
          >
            <Folder className="w-5 h-5 text-white mb-0.5" />
            <span className="text-xs text-white">Projects</span>
          </button>

          {/* Profile Button */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex flex-col items-center py-1 px-2 hover:bg-white/10 rounded transition-all duration-200"
            >
              <img 
                src="/attached_assets/farooq-headshot.png" 
                alt="Farooq Chisty" 
                loading="lazy"
                decoding="async"
                className="w-5 h-5 rounded object-cover mb-0.5"
              />
              <span className="text-xs text-white">Profile</span>
            </button>

            {/* Mobile Profile Dropdown Menu */}
            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full mb-2 right-0 w-64 bg-black/95 backdrop-blur-sm border border-gray-700 rounded-md shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-700">
                      <img 
                        src="/attached_assets/farooq-headshot.png" 
                        alt="Farooq Chisty" 
                        loading="lazy"
                        decoding="async"
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <h3 className="text-white font-medium text-sm">Farooq Chisty</h3>
                        <p className="text-gray-400 text-xs">Marketing & Growth Expert</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <button
                        onClick={() => handleProfileAction('download-resume')}
                        className="flex items-center space-x-3 w-full text-left text-white hover:text-red-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Download Resume</span>
                      </button>
                      
                      <button
                        onClick={() => handleProfileAction('work-with-me')}
                        className="flex items-center space-x-3 w-full text-left text-white hover:text-red-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                      >
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm">Work with me</span>
                      </button>
                      
                      <button
                        onClick={() => handleProfileAction('invite-speaker')}
                        className="flex items-center space-x-3 w-full text-left text-white hover:text-red-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                      >
                        <Mic className="w-4 h-4" />
                        <span className="text-sm">Invite as Speaker</span>
                      </button>
                      
                      <button
                        onClick={() => handleProfileAction('connect-linkedin')}
                        className="flex items-center space-x-3 w-full text-left text-white hover:text-red-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span className="text-sm">Connect on LinkedIn</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="relative pb-14 md:pb-0">
        <HeroSection profile={profile} />
        <div className="relative z-10" style={{ marginTop: '0rem' }}>
          <ProjectsSection onProjectClick={setSelectedProjectId} />
        </div>
      </div>
      
      {/* Footer Section */}
      <footer id="footer" className="bg-black/95 border-t border-gray-800 mt-4 sm:mt-5 md:mt-6 w-screen">
        <div className="w-screen px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 py-12 sm:py-14 md:py-16">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
            
            {/* Contact Column */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a href="mailto:farooqsheik52543@gmail.com" className="text-xs sm:text-sm break-all">
                    farooqsheik52543@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a href="tel:+919878167456" className="text-xs sm:text-sm">
                    +91-9878167456
                  </a>
                </div>
              </div>
            </div>

            {/* Key Highlights Column */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Key Highlights</h3>
              <div className="space-y-3">
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• $80M+ revenue generated across 5 companies</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Managed $2M+ in paid ad spend</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Acquired more than 2 Million users across three apps</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Raised $150K Pre-seed</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Founded 3 startups. 1 exit</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• 30+ Keynotes in AI, Blockchain</div>
              </div>
            </div>

            {/* Core Skills Column */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Core Skills</h3>
              <div className="space-y-3">
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• AI Marketing</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Product Marketing</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Growth Strategy</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• D2C Marketing</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Marketing Automation</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Marketing Measurement</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Performance Marketing</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• GTM & Funnel Building</div>
              </div>
            </div>

            {/* Social Column */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Social</h3>
              <div className="space-y-3">
                <a 
                  href="https://x.com/farooqsheik" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                >
                  <FaTwitter className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Twitter</span>
                </a>
                <a 
                  href="https://linkedin.com/in/farooqchisty" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Border */}
          <div className="border-t border-gray-800 mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 w-full">
            <div className="text-center text-gray-400 text-xs sm:text-sm">
              © 2024 Farooq Chisty. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <NetflixModal 
        projectId={selectedProjectId} 
        onClose={() => setSelectedProjectId(null)}
        onProjectSwitch={(projectId) => setSelectedProjectId(projectId)}
      />
    </div>
  );
}
