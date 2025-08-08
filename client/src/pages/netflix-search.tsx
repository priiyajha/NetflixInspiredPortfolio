import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type Project } from "@shared/schema";
import { Search, X, ChevronDown, Download, Briefcase, Mic, Linkedin, Menu, Home, Folder, Share2, Play, Info } from "lucide-react";
import NetflixModal from "@/components/netflix-modal";
import { motion, AnimatePresence } from "framer-motion";

export default function NetflixSearchPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [touchTimeout, setTouchTimeout] = useState<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

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
    window.history.replaceState({}, '', '/netflix-search');
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  // Handle profile menu clicks
  const handleProfileMenuClick = (action: string) => {
    setProfileMenuOpen(false);
    
    switch (action) {
      case 'download-resume':
        const resumeUrl = "/attached_assets/FAROOQ CHISTY  RESUME 2025 (1)_1754665051871.pdf";
        const link = document.createElement('a');
        link.href = resumeUrl;
        link.download = "Farooq_Chisty_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      case 'work-with-me':
        setLocation("/hire-me");
        break;
      case 'invite-as-speaker':
        setLocation("/hire-me");
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
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#141414]">
        {/* Main Navigation */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Logo */}
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
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              
              {/* Mobile Menu Button */}
              <div className="md:hidden">
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

              {/* Profile Dropdown - Desktop Only */}
              <div className="relative hidden md:block" ref={profileMenuRef}>
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
        </div>
        
        {/* Mobile Search Bar - Always visible on search page */}
        <div className="md:hidden px-4 pb-3 border-t border-gray-700/50">
          <div className="flex items-center bg-black border border-white/20 rounded px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search titles, people, genres..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Update URL to reflect current search
                const newUrl = e.target.value.trim() 
                  ? `/netflix-search?q=${encodeURIComponent(e.target.value.trim())}`
                  : '/netflix-search';
                window.history.replaceState({}, '', newUrl);
              }}
              className="bg-transparent text-white placeholder-gray-400 outline-none text-sm flex-1"
              autoFocus
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
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed top-16 right-0 z-50"
          >
            <div className="bg-[#141414] border border-gray-700 rounded-l-lg shadow-2xl">
              <div className="px-6 py-6 space-y-4">
                {/* Mobile Navigation Links */}
                <button 
                  onClick={() => { setLocation("/"); setMobileMenuOpen(false); }}
                  className="block w-full text-right text-white hover:text-gray-300 transition-colors py-3 text-base font-medium"
                >
                  Home
                </button>
                <button 
                  onClick={() => { scrollToSection("projects"); setMobileMenuOpen(false); }}
                  className="block w-full text-right text-white hover:text-gray-300 transition-colors py-3 text-base font-medium"
                >
                  Projects
                </button>
                <button 
                  onClick={() => { scrollToSection("contact"); setMobileMenuOpen(false); }}
                  className="block w-full text-right text-white hover:text-gray-300 transition-colors py-3 text-base font-medium"
                >
                  Let's Chat
                </button>
                <button 
                  onClick={() => { window.open("https://linkedin.com/in/farooqchisty", "_blank"); setMobileMenuOpen(false); }}
                  className="block w-full text-right text-white hover:text-gray-300 transition-colors py-3 text-base font-medium"
                >
                  Hire Me
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#141414] border-t border-gray-700">
        <div className="flex items-center justify-around py-1">
          {/* Home Button */}
          <button
            onClick={() => setLocation("/")}
            className="flex flex-col items-center py-1 px-2 hover:bg-white/10 rounded transition-all duration-200"
          >
            <Home className="w-5 h-5 text-white mb-0.5" />
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
                        onClick={() => handleProfileMenuClick('download-resume')}
                        className="flex items-center space-x-3 w-full text-left text-white hover:text-red-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Download Resume</span>
                      </button>
                      
                      <button
                        onClick={() => handleProfileMenuClick('work-with-me')}
                        className="flex items-center space-x-3 w-full text-left text-white hover:text-red-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                      >
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm">Work with me</span>
                      </button>
                      
                      <button
                        onClick={() => handleProfileMenuClick('invite-as-speaker')}
                        className="flex items-center space-x-3 w-full text-left text-white hover:text-red-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                      >
                        <Mic className="w-4 h-4" />
                        <span className="text-sm">Invite as Speaker</span>
                      </button>
                      
                      <button
                        onClick={() => handleProfileMenuClick('connect-linkedin')}
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
      <div className="min-h-screen bg-[#141414] text-white pt-24 sm:pt-28 md:pt-24 pb-14 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Results */}
          {searchQuery.trim() ? (
            filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-3 lg:gap-4">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className={`relative cursor-pointer ${
                      hoveredProject === project.id ? 'z-50' : 'z-10'
                    }`}
                    onClick={() => handleProjectClick(project.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    onMouseEnter={() => {
                      // Clear any existing timeout
                      if (hoverTimeout) {
                        clearTimeout(hoverTimeout);
                      }
                      // Set a 0.3 second delay before showing hover state
                      const timeout = setTimeout(() => {
                        setHoveredProject(project.id);
                      }, 300);
                      setHoverTimeout(timeout);
                    }}
                    onMouseLeave={() => {
                      // Clear timeout and hover state
                      if (hoverTimeout) {
                        clearTimeout(hoverTimeout);
                        setHoverTimeout(null);
                      }
                      setHoveredProject(null);
                    }}
                    onTouchStart={() => {
                      // Clear any existing touch timeout
                      if (touchTimeout) {
                        clearTimeout(touchTimeout);
                      }
                      // Set a 500ms long press for touch devices
                      const timeout = setTimeout(() => {
                        setHoveredProject(project.id);
                      }, 500);
                      setTouchTimeout(timeout);
                    }}
                    onTouchEnd={() => {
                      // Clear touch timeout
                      if (touchTimeout) {
                        clearTimeout(touchTimeout);
                        setTouchTimeout(null);
                      }
                    }}
                    onTouchMove={() => {
                      // Cancel touch timeout if user moves finger (scrolling)
                      if (touchTimeout) {
                        clearTimeout(touchTimeout);
                        setTouchTimeout(null);
                      }
                    }}
                    style={{
                      // Ensure proper positioning for hover effects
                      position: hoveredProject === project.id ? 'relative' : 'relative',
                    }}
                  >
                    {/* Netflix-style Card */}
                    <motion.div 
                      className={`relative overflow-hidden transition-all duration-300 ease-out ${
                        hoveredProject === project.id 
                          ? 'shadow-2xl shadow-black/50' 
                          : 'hover:shadow-lg hover:shadow-black/30'
                      }`}
                      style={{
                        transformOrigin: 'center top',
                        borderRadius: hoveredProject === project.id ? '12px' : '6px',
                        // Add margin for hover expansion
                        margin: hoveredProject === project.id ? '0 10px 20px 10px' : '0',
                      }}
                      animate={{
                        scale: hoveredProject === project.id ? 1.25 : 1,
                        y: hoveredProject === project.id ? -20 : 0,
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      {/* Video background for hover state */}
                      {hoveredProject === project.id && project.video && (
                        <motion.video
                          ref={(el) => { videoRefs.current[project.id] = el; }}
                          src={project.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className="absolute top-0 left-0 right-0 w-full object-cover z-0"
                          style={{ 
                            height: '70%',
                            borderTopLeftRadius: '12px',
                            borderTopRightRadius: '12px'
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      
                      {/* Static Image */}
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className={`w-full object-cover transition-all duration-300 relative z-10 ${
                          hoveredProject === project.id 
                            ? 'opacity-0 h-64 sm:h-72 md:h-64 lg:h-72' 
                            : 'opacity-100 aspect-[16/9]'
                        }`}
                        style={{
                          borderRadius: hoveredProject === project.id ? '12px' : '6px'
                        }}
                        draggable={false}
                      />
                      
                      {/* Gradient Overlay - only for non-hover state */}
                      {hoveredProject !== project.id && (
                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                          style={{ borderRadius: '6px' }}>
                        </div>
                      )}
                      
                      {/* Hover Content Overlay */}
                      {hoveredProject === project.id && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent"
                          style={{ 
                            borderBottomLeftRadius: '12px',
                            borderBottomRightRadius: '12px'
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 mb-3">
                            <button 
                              className="bg-white hover:bg-gray-200 text-black p-2 rounded-full transition-colors duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProjectClick(project.id);
                              }}
                            >
                              <Play className="w-4 h-4 fill-current" />
                            </button>
                            <button className="bg-gray-700/80 hover:bg-gray-600/80 text-white p-2 rounded-full transition-colors duration-200">
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button className="bg-gray-700/80 hover:bg-gray-600/80 text-white p-2 rounded-full transition-colors duration-200">
                              <Info className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Project Info */}
                          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                            {project.title}
                          </h3>
                          
                          {/* Technologies */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {project.technologies.slice(0, 3).map((tech, i) => (
                              <span key={i} className="bg-gray-700 text-white text-xs px-2 py-1 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                          
                          {/* Description */}
                          <p className="text-gray-300 text-xs line-clamp-2">
                            {project.description}
                          </p>
                        </motion.div>
                      )}
                      
                      {/* Title for non-hover state */}
                      {hoveredProject !== project.id && (
                        <div className="absolute bottom-0 left-0 right-0 z-30 p-3">
                          <h3 className="text-white font-medium text-sm line-clamp-2">
                            {project.title}
                          </h3>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
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