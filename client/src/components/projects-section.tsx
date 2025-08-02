import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Project } from "@shared/schema";
import ProjectCarousel from "./project-carousel";

interface ProjectsSectionProps {
  onProjectClick: (projectId: string) => void;
}

export default function ProjectsSection({ onProjectClick }: ProjectsSectionProps) {
  const { data: featuredProjects = [], isLoading: featuredLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects/featured"],
  });

  return (
    <section id="projects" className="py-16">
      {/* Featured Projects */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="px-4 sm:px-6 md:px-12 mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Founded Startups
          </h2>
        </div>
        
        {featuredLoading ? (
          <div className="px-4 sm:px-6 md:px-12">
            <div className="text-netflix-light-gray text-sm sm:text-base">Loading featured projects...</div>
          </div>
        ) : (
          <ProjectCarousel projects={featuredProjects} onProjectClick={onProjectClick} />
        )}
      </motion.div>
    </section>
  );
}