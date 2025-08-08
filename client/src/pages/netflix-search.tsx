import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type Project } from "@shared/schema";
import { Search, X } from "lucide-react";
import NetflixModal from "@/components/netflix-modal";

export default function NetflixSearchPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
              <button onClick={() => setLocation("/projects")} className="hover:text-gray-300 transition-colors">Projects</button>
              <button onClick={() => setLocation("/contact")} className="hover:text-gray-300 transition-colors">Contact</button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <div className="relative">
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
                  className="bg-transparent text-white placeholder-gray-400 outline-none text-sm w-64"
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
            
            {/* Profile Icon */}
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
          </div>
        </div>
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
                    className="group cursor-pointer transition-all duration-200 ease-in-out hover:scale-105"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-800">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-all duration-200 group-hover:opacity-75"
                      />
                      
                      {/* Best Match Badge - only on first card */}
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                          Best Match
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
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