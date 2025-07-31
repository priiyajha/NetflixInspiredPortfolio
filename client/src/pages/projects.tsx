import { useState } from "react";
import Header from "../components/header";
import ProjectsSection from "../components/projects-section";
import ProjectModal from "../components/project-modal";

export default function ProjectsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-20">
        <div className="px-4 md:px-12 py-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)' }}>My Projects</h1>
          <p className="text-lg text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
            Explore my portfolio of web applications, automation tools, and creative projects. 
            Each project showcases different aspects of my development skills and problem-solving approach.
          </p>
        </div>
        <ProjectsSection onProjectClick={setSelectedProjectId} />
      </div>
      <ProjectModal 
        projectId={selectedProjectId} 
        onClose={() => setSelectedProjectId(null)} 
      />
    </div>
  );
}