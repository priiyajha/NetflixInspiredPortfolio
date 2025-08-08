import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type Project } from "@shared/schema";
import { Search, X, ChevronDown, Download, Briefcase, Mic, Linkedin, Menu } from "lucide-react";
import NetflixModal from "@/components/netflix-modal";
import { motion, AnimatePresence } from "framer-motion";

export default function NetflixSearchPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Get search query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const query = urlParams.get('q') || '';
    setSearchQuery(query);
  }, [location]);

  // Fetch all projects
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Auto-focus search input when page loads
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Filter projects when search query changes or projects load
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects([]);
      return;
    }

    if (!projects || projects.length === 0) {
      return;
    }

    const query = searchQuery.toLowerCase();
    const matches = projects.filter(project => {
      const title = project.title.toLowerCase();
      const director = "priya jha";
      const role = "solo builder + marketer";
      
      return title.includes(query) || 
             director.includes(query) || 
             role.includes(query) ||
             project.technologies.some(tech => tech.toLowerCase().includes(query));
    });

    // Sort by relevance - title matches first
    const sortedMatches = matches.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const aExact = aTitle.includes(query);
      const bExact = bTitle.includes(query);
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return aTitle.length - bTitle.length;
    });

    setFilteredProjects(sortedMatches);
  }, [searchQuery, projects?.length]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredProjects([]);
    setLocation("/");
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

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

  const handleProfileMenuClick = (action: string) => {
    setProfileMenuOpen(false);
    
    switch (action) {
      case 'download-resume':
        // Download the PDF resume directly
        const resumeUrl = "/attached_assets/FAROOQ%20CHISTY%20%20RESUME%202025%20%281%29_1754665051871.pdf";
        const link = document.createElement('a');
        link.href = resumeUrl;
        link.download = "Farooq_Chisty_Resume_2025.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      case 'work-with-me':
        setLocation("/contact");
        break;
      case 'invite-as-speaker':
        setLocation("/contact");
        break;
      case 'connect-linkedin':
        window.open("https://linkedin.com/in/farooqchisty", "_blank");
        break;
      default:
        break;
    }
  };

  const scrollToSection = (sectionId: string) => {
    // Navigate to home page first, then scroll to section
    setLocation("/");
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#141414] px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo and Navigation Links */}
          <div className="flex items-center space-x-8">
            <img 
              src="/attached_assets/farooq-logo.png" 
              alt="Farooq" 
              className="h-8 sm:h-10 md:h-12 w-auto object-contain cursor-pointer"
              style={{ 
                maxHeight: 'clamp(2rem, 4vw, 3rem)',
                filter: 'brightness(1.1) contrast(1.1)'
              }}
              onClick={() => setLocation("/")}
            />

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6 text-sm text-white">
              <button onClick={() => setLocation("/")} className="hover:text-gray-300 transition-colors">Home</button>
              <button onClick={() => scrollToSection("projects")} className="hover:text-gray-300 transition-colors">Projects</button>
              <button onClick={() => scrollToSection("about")} className="hover:text-gray-300 transition-colors">About</button>
              <button onClick={() => scrollToSection("contact")} className="hover:text-gray-300 transition-colors">Contact</button>
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Mobile Search and Menu */}
            <div className="flex items-center space-x-2 md:hidden">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-white/10 rounded transition-all duration-200"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Desktop Search Bar */}
            <div className="relative hidden md:block">
              <div className="flex items-center bg-black border border-white/20 rounded px-3 py-2">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="titles, people, genres"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    // Update URL to reflect current search
                    const newUrl = e.target.value.trim() 
                      ? `/netflix-search?q=${encodeURIComponent(e.target.value.trim())}`
                      : '/netflix-search';
                    window.history.replaceState({}, '', newUrl);
                  }}
                  className="bg-transparent text-white placeholder-gray-400 outline-none text-sm w-32 sm:w-48 md:w-64"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="ml-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded transition-all duration-200"
              >
                <img 
                  src="/attached_assets/farooq-headshot.png" 
                  alt="Farooq Chisty" 
                  loading="lazy"
                  decoding="async"
                  className="w-8 h-8 rounded object-cover"
                />
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-black/95 backdrop-blur-sm border border-gray-700 rounded-md shadow-2xl overflow-hidden z-50"
                  >
                    {/* Profile Section */}
                    <div className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <img 
                          src="/attached_assets/farooq-headshot.png" 
                          alt="Farooq Chisty" 
                          loading="lazy"
                          decoding="async"
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="text-white font-medium text-sm">Farooq Chisty</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => handleProfileMenuClick('download-resume')}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-gray-800/50 transition-colors text-left"
                      >
                        <Download className="w-5 h-5" />
                        <span className="text-sm">Download Resume</span>
                      </button>
                      
                      <button
                        onClick={() => handleProfileMenuClick('work-with-me')}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-gray-800/50 transition-colors text-left"
                      >
                        <Briefcase className="w-5 h-5" />
                        <span className="text-sm">Work with me</span>
                      </button>
                      
                      <button
                        onClick={() => handleProfileMenuClick('invite-as-speaker')}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-gray-800/50 transition-colors text-left"
                      >
                        <Mic className="w-5 h-5" />
                        <span className="text-sm">Invite as a Speaker</span>
                      </button>
                      
                      <button
                        onClick={() => handleProfileMenuClick('connect-linkedin')}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-gray-800/50 transition-colors text-left"
                      >
                        <Linkedin className="w-5 h-5" />
                        <span className="text-sm">Connect on LinkedIn</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-[#141414] border-t border-gray-700"
            >
              <div className="px-4 py-4 space-y-3">
                {/* Mobile Search Bar */}
                <div className="relative">
                  <div className="flex items-center bg-black border border-white/20 rounded px-3 py-2">
                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="titles, people, genres"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        // Update URL to reflect current search
                        const newUrl = e.target.value.trim() 
                          ? `/netflix-search?q=${encodeURIComponent(e.target.value.trim())}`
                          : '/netflix-search';
                        window.history.replaceState({}, '', newUrl);
                      }}
                      className="bg-transparent text-white placeholder-gray-400 outline-none text-sm w-full"
                    />
                    {searchQuery && (
                      <button
                        onClick={handleClearSearch}
                        className="ml-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-3 pt-2">
                  <button 
                    onClick={() => { setLocation("/"); setMobileMenuOpen(false); }}
                    className="block w-full text-left text-white hover:text-gray-300 transition-colors py-2"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => scrollToSection("projects")}
                    className="block w-full text-left text-white hover:text-gray-300 transition-colors py-2"
                  >
                    Projects
                  </button>
                  <button 
                    onClick={() => scrollToSection("about")}
                    className="block w-full text-left text-white hover:text-gray-300 transition-colors py-2"
                  >
                    About
                  </button>
                  <button 
                    onClick={() => scrollToSection("contact")}
                    className="block w-full text-left text-white hover:text-gray-300 transition-colors py-2"
                  >
                    Contact
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <div className="min-h-screen bg-[#141414] text-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Results */}
          {searchQuery.trim() ? (
            filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="group cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 active:scale-105"
                    onClick={() => handleProjectClick(project.id)}
                    onTouchStart={() => {}} // Enable touch interactions
                  >
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-800">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-all duration-200 group-hover:opacity-75 group-active:opacity-75"
                      />
                      

                      
                      {/* Hover/Touch Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <div className="text-center p-3">
                          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{project.title}</h3>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {project.technologies.slice(0, 3).map((tech, i) => (
                              <span key={i} className="bg-gray-700 text-white text-xs px-2 py-1 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Project Title */}
                    <h3 className="text-white font-medium mt-2 text-sm line-clamp-2">
                      {project.title}
                    </h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center mt-20">
                <h2 className="text-white text-xl font-semibold">No results found for "{searchQuery}"</h2>
                <p className="text-gray-400 mt-2">Try searching for a different title, person, or genre</p>
              </div>
            )
          ) : (
            <div className="text-center mt-20">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-white text-xl font-semibold mb-2">Search for projects</h2>
              <p className="text-gray-400">Start typing to find projects by title, director, or technology</p>
            </div>
          )}
        </div>
      </div>

      {/* Netflix Modal */}
      <NetflixModal
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
      />
    </>
  );
}