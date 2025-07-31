import { useQuery } from "@tanstack/react-query";
import Header from "../components/header";
import HeroSection from "../components/hero-section";
import ProjectsSection from "../components/projects-section";
import ProjectModal from "../components/project-modal";
import { Profile } from "../../../shared/schema";
import { useState } from "react";

export default function Home() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const { data: profile, isLoading: profileLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <HeroSection profile={profile} />
      <ProjectsSection onProjectClick={setSelectedProjectId} />
      <ProjectModal 
        projectId={selectedProjectId} 
        onClose={() => setSelectedProjectId(null)} 
      />
    </div>
  );
}
