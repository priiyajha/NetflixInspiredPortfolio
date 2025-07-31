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

  const { data: webProjects = [], isLoading: webLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects/category/web"],
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
        <div className="px-4 md:px-12 mb-6">
          <h2 className="text-3xl font-bold transition-all duration-300 hover:text-white hover:drop-shadow-lg cursor-default" 
              style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)' }}>
            Featured Projects
          </h2>
        </div>
        
        {featuredLoading ? (
          <div className="px-4 md:px-12">
            <div className="text-netflix-light-gray">Loading featured projects...</div>
          </div>
        ) : (
          <ProjectCarousel projects={featuredProjects} onProjectClick={onProjectClick} />
        )}
      </motion.div>

      {/* Web Development Projects */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="px-4 md:px-12 mb-6">
          <h2 className="text-3xl font-bold transition-all duration-300 hover:text-white hover:drop-shadow-lg cursor-default" 
              style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)' }}>
            Web Development
          </h2>
        </div>
        
        {webLoading ? (
          <div className="px-4 md:px-12">
            <div className="text-netflix-light-gray">Loading web projects...</div>
          </div>
        ) : (
          <ProjectCarousel projects={webProjects} onProjectClick={onProjectClick} />
        )}
      </motion.div>
    </section>
  );
}