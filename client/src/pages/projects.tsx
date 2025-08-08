import { useState, useEffect } from "react";
import Header from "../components/header";
import ProjectsSection from "../components/projects-section";
import NetflixModal from "../components/netflix-modal";

export default function ProjectsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-16 sm:pt-18 md:pt-20">
        <div className="px-4 sm:px-6 md:px-12 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 text-center" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)' }}>My Projects</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 text-center max-w-3xl mx-auto px-4">
            Explore my portfolio of web applications, automation tools, and creative projects. 
            Each project showcases different aspects of my development skills and problem-solving approach.
          </p>
          
          {/* Horizontal Divider Line */}
          <div className="w-full h-px bg-navy-700 opacity-50 mb-6 sm:mb-8" style={{backgroundColor: '#1e3a8a'}}></div>
        </div>
        <ProjectsSection onProjectClick={setSelectedProjectId} />
      </div>
      <NetflixModal 
        projectId={selectedProjectId} 
        onClose={() => setSelectedProjectId(null)} 
        onProjectSwitch={setSelectedProjectId}
      />
    </div>
  );
}