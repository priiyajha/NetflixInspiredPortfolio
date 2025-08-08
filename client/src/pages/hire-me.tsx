import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Home as HomeIcon, Folder, Download, Briefcase, Mic, Linkedin, Search, Mail, Phone, Globe, Calendar, Award, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { type Profile } from "@shared/schema";
import { FaTwitter } from "react-icons/fa";

export default function HireMe() {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

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

  const handleProfileAction = (action: string) => {
    setProfileMenuOpen(false);
    
    switch (action) {
      case 'download-resume':
        const link = document.createElement('a');
        link.href = '/attached_assets/FAROOQ CHISTY  RESUME 2025 (1)_1754665051871.pdf';
        link.download = 'Farooq_Chisty_Resume_2025.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      case 'work-with-me':
        // Already on hire me page, just scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'invite-speaker':
        // Already on hire me page, just scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'connect-linkedin':
        window.open("https://linkedin.com/in/farooqchisty", "_blank");
        break;
      default:
        break;
    }
  };

  const handleContactAction = (type: string) => {
    switch (type) {
      case 'email':
        window.open("mailto:farooqsheik52543@gmail.com", "_blank");
        break;
      case 'phone':
        window.open("tel:+91-9878167456", "_blank");
        break;
      case 'linkedin':
        window.open("https://linkedin.com/in/farooqchisty", "_blank");
        break;
      case 'twitter':
        window.open("https://x.com/farooqsheik", "_blank");
        break;
      case 'schedule':
        window.open("https://linkedin.com/in/farooqchisty", "_blank");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#141414]/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => setLocation("/")}
              className="text-[#E50914] font-bold text-xl sm:text-2xl tracking-tight hover:text-red-400 transition-colors"
              style={{ fontFamily: 'Bebas Neue', fontWeight: 900 }}
            >
              FAROOQ CHISTY
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setLocation("/")}
                className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
              >
                Home
              </button>
              <button
                onClick={() => setLocation("/projects")}
                className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
              >
                Projects
              </button>
              <button
                onClick={() => setLocation("/search")}
                className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
              >
                Search
              </button>
              <span className="text-red-400 text-sm font-medium">Hire Me</span>
            </div>

            {/* Search and Profile */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLocation("/search")}
                className="text-white hover:text-gray-300 transition-colors md:hidden"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <div className="relative hidden md:block" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <img 
                    src="/attached_assets/farooq-headshot.png" 
                    alt="Farooq Chisty" 
                    className="w-8 h-8 rounded object-cover"
                  />
                </button>

                {/* Desktop Profile Dropdown */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 right-0 w-64 bg-black/95 backdrop-blur-sm border border-gray-700 rounded-md shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-4">
                        <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-700">
                          <img 
                            src="/attached_assets/farooq-headshot.png" 
                            alt="Farooq Chisty" 
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
        </div>
      </nav>

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
            onClick={() => setLocation("/projects")}
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

      {/* Main Content */}
      <div className="pt-20 pb-14 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <img 
                src="/attached_assets/farooq-headshot.png" 
                alt="Farooq Chisty" 
                className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-red-500/20"
              />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">Let's Work Together</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Ready to scale your business? I help startups and established companies achieve explosive growth through data-driven marketing strategies and innovative growth hacking techniques.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => handleContactAction('email')}
                className="bg-[#E50914] hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Start a Project
              </button>
              <button
                onClick={() => handleContactAction('schedule')}
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Schedule a Call
              </button>
            </div>
          </div>

          {/* Services Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">What I Can Do For You</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center mb-4">
                  <Briefcase className="w-6 h-6 text-red-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Full-Time Position</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Looking for a dedicated marketing leader? I bring 8+ years of experience in scaling startups and driving growth for established companies.
                </p>
                <ul className="text-gray-400 space-y-2">
                  <li>• Growth strategy & execution</li>
                  <li>• Team leadership & mentoring</li>
                  <li>• Data-driven decision making</li>
                  <li>• Cross-functional collaboration</li>
                </ul>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-red-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Fractional CMO</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Get C-level marketing expertise without the full-time commitment. Perfect for startups and growing businesses.
                </p>
                <ul className="text-gray-400 space-y-2">
                  <li>• Strategic marketing planning</li>
                  <li>• Growth channel optimization</li>
                  <li>• Marketing team building</li>
                  <li>• Performance tracking & KPIs</li>
                </ul>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center mb-4">
                  <Mic className="w-6 h-6 text-red-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Speaking Engagements</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Inspire your audience with insights on growth marketing, startup scaling, and building high-performing teams.
                </p>
                <ul className="text-gray-400 space-y-2">
                  <li>• Conference keynotes</li>
                  <li>• Workshop facilitation</li>
                  <li>• Panel discussions</li>
                  <li>• Corporate training</li>
                </ul>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center mb-4">
                  <Award className="w-6 h-6 text-red-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Consulting Projects</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Short-term engagements to solve specific marketing challenges and accelerate your growth trajectory.
                </p>
                <ul className="text-gray-400 space-y-2">
                  <li>• Growth audit & strategy</li>
                  <li>• Product-market fit validation</li>
                  <li>• Go-to-market planning</li>
                  <li>• Marketing automation setup</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Get In Touch</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => handleContactAction('email')}
                className="flex flex-col items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
              >
                <Mail className="w-8 h-8 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Email</span>
                <span className="text-gray-400 text-sm">farooqsheik52543@gmail.com</span>
              </button>

              <button
                onClick={() => handleContactAction('phone')}
                className="flex flex-col items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
              >
                <Phone className="w-8 h-8 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Phone</span>
                <span className="text-gray-400 text-sm">+91-9878167456</span>
              </button>

              <button
                onClick={() => handleContactAction('linkedin')}
                className="flex flex-col items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
              >
                <Linkedin className="w-8 h-8 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">LinkedIn</span>
                <span className="text-gray-400 text-sm">Connect with me</span>
              </button>

              <button
                onClick={() => handleContactAction('twitter')}
                className="flex flex-col items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
              >
                <FaTwitter className="w-8 h-8 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Twitter</span>
                <span className="text-gray-400 text-sm">@farooqsheik</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}