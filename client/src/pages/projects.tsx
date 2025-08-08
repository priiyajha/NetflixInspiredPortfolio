import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Home as HomeIcon, Folder, Download, Briefcase, Mic, Linkedin, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { type Project, type Profile } from "@shared/schema";
import NetflixModal from "@/components/netflix-modal";

export default function Projects() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Fetch all projects
  const { data: startupProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects/category/startup"],
  });

  const { data: fulltimeProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects/category/fulltime"],
  });

  const { data: sidehustleProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects/category/sidehustle"],
  });

  const { data: consultingProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects/category/consulting"],
  });

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

  const allProjects = [
    ...startupProjects,
    ...fulltimeProjects,
    ...sidehustleProjects,
    ...consultingProjects
  ];

  const ProjectCard = ({ project }: { project: Project }) => (
    <div
      className="group cursor-pointer transition-all duration-300 hover:scale-105"
      onClick={() => setSelectedProjectId(project.id)}
    >
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-800">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-75"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center p-4">
            <h3 className="text-white font-semibold text-lg mb-2">{project.title}</h3>
            <div className="flex flex-wrap gap-2 justify-center">
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
      <div className="mt-3">
        <h3 className="text-white font-medium text-sm group-hover:text-red-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{project.description}</p>
      </div>
    </div>
  );

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
              <span className="text-red-400 text-sm font-medium">Projects</span>
              <button
                onClick={() => setLocation("/search")}
                className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
              >
                Search
              </button>
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
            <Folder className="w-5 h-5 text-red-400 mb-0.5" />
            <span className="text-xs text-red-400">Projects</span>
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">All Projects</h1>
            <p className="text-gray-400">Explore my complete portfolio of work across different categories</p>
          </div>

          {/* Projects Grid */}
          {allProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {allProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">Loading projects...</div>
            </div>
          )}
        </div>
      </div>

      {/* Netflix Modal */}
      {selectedProjectId && (
        <NetflixModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
}