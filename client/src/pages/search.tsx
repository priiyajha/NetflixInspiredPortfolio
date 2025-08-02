import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type Project } from "@shared/schema";
import Header from "@/components/header";
import NetflixModal from "@/components/netflix-modal";

export default function SearchPage() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Extract search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const query = urlParams.get('q') || '';
    setSearchQuery(query);
  }, [location]);

  // Fetch all projects
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Filter and sort projects based on search query
  useEffect(() => {
    if (!searchQuery || !projects.length) {
      setFilteredProjects([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const matches = projects.filter(project => {
      const title = project.title.toLowerCase();
      const director = "priya jha"; // All projects have same director
      const role = "solo builder + marketer"; // All projects have same role
      
      return title.includes(query) || 
             director.includes(query) || 
             role.includes(query) ||
             project.technologies.some(tech => tech.toLowerCase().includes(query));
    });

    // Sort by relevance - exact title matches first, then partial matches
    const sortedMatches = matches.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const aExact = aTitle.includes(query);
      const bExact = bTitle.includes(query);
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // If both or neither are exact matches, sort by title length (shorter first for closer matches)
      return aTitle.length - bTitle.length;
    });

    setFilteredProjects(sortedMatches);
  }, [searchQuery, projects]);

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#141414] text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Search Results Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">
            Search results for "{searchQuery}"
          </h1>
          <p className="text-gray-400">
            {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Results Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-800">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-75"
                  />
                  
                  {/* Best Match Badge for first result */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      Best Match
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    {project.status === "live" ? (
                      <div className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">
                        Live
                      </div>
                    ) : (
                      <div className="bg-gray-600 text-white text-xs font-medium px-2 py-1 rounded">
                        Coming Soon
                      </div>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                        {project.title}
                      </h3>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.technologies.slice(0, 2).map((tech) => (
                          <span 
                            key={tech}
                            className="text-xs bg-white/20 text-white px-2 py-1 rounded"
                          >
                            {tech === "React & Next.js" ? "React" : 
                             tech === "Node.js & Express" ? "Node.js" : tech}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-300 text-xs line-clamp-2">
                        {project.description.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold mb-4">No results found</h2>
            <p className="text-gray-400 mb-6">
              Try searching for a different title, director, or role
            </p>
            <div className="text-sm text-gray-500">
              <p>Search suggestions:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <span className="bg-gray-800 px-3 py-1 rounded">Trip Planner</span>
                <span className="bg-gray-800 px-3 py-1 rounded">AI Interview</span>
                <span className="bg-gray-800 px-3 py-1 rounded">Priya Jha</span>
                <span className="bg-gray-800 px-3 py-1 rounded">React</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold mb-4">Start your search</h2>
            <p className="text-gray-400">
              Enter a title, director name, or role to find projects
            </p>
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