import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Project } from "@shared/schema";
import ProjectCarousel from "./project-carousel";

interface ProjectsSectionProps {
  onProjectClick: (projectId: string) => void;
}

export default function ProjectsSection({ onProjectClick }: ProjectsSectionProps) {
  const { data: startupProjects = [], isLoading: startupLoading, error: startupError } = useQuery<Project[]>({
    queryKey: ["/api/projects/category/startup"],
  });

  const { data: fulltimeProjects = [], isLoading: fulltimeLoading, error: fulltimeError } = useQuery<Project[]>({
    queryKey: ["/api/projects/category/fulltime"],
  });

  const { data: sidehustleProjects = [], isLoading: sidehustleLoading, error: sidehustleError } = useQuery<Project[]>({
    queryKey: ["/api/projects/category/sidehustle"],
  });

  const { data: consultingProjects = [], isLoading: consultingLoading, error: consultingError } = useQuery<Project[]>({
    queryKey: ["/api/projects/category/consulting"],
  });

  const { data: keynoteProjects = [], isLoading: keynoteLoading, error: keynoteError } = useQuery<Project[]>({
    queryKey: ["/api/projects/category/keynote"],
  });

  return (
    <section id="projects" className="pb-16 relative z-10">
      {/* Founded Startups - Netflix "Your Next Watch" exact positioning */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="px-4 sm:px-6 md:px-12" style={{ marginBottom: '24px', marginTop: '2rem' }}>
          <h2 style={{ 
            fontFamily: 'Netflix Sans, Helvetica Neue, Segoe UI, Roboto, Ubuntu, sans-serif', 
            fontWeight: '500', 
            fontSize: '20px', 
            lineHeight: '1.4', 
            color: '#e5e5e5',
            letterSpacing: '0.15px',
            margin: '0'
          }}>
            Founded Startups
          </h2>
        </div>
        
        {startupLoading ? (
          <div className="px-4 sm:px-6 md:px-12">
            <div className="text-netflix-light-gray text-sm sm:text-base">Loading startup projects...</div>
          </div>
        ) : startupError ? (
          <div className="px-4 sm:px-6 md:px-12">
            <div className="text-red-400 text-sm sm:text-base">Failed to load startup projects</div>
          </div>
        ) : (
          <ProjectCarousel projects={startupProjects} onProjectClick={onProjectClick} />
        )}
      </motion.div>

      {/* Full-time Gigs */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="px-4 sm:px-6 md:px-12" style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            fontFamily: 'Netflix Sans, Helvetica Neue, Segoe UI, Roboto, Ubuntu, sans-serif', 
            fontWeight: '500', 
            fontSize: '20px', 
            lineHeight: '1.4', 
            color: '#e5e5e5',
            letterSpacing: '0.15px',
            margin: '0'
          }}>
            Full-time Gigs
          </h2>
        </div>
        
        {fulltimeLoading ? (
          <div className="px-4 sm:px-6 md:px-12">
            <div className="text-netflix-light-gray text-sm sm:text-base">Loading full-time projects...</div>
          </div>
        ) : fulltimeError ? (
          <div className="px-4 sm:px-6 md:px-12">
            <div className="text-red-400 text-sm sm:text-base">Failed to load full-time projects</div>
          </div>
        ) : (
          <ProjectCarousel projects={fulltimeProjects} onProjectClick={onProjectClick} />
        )}
      </motion.div>

      {/* Side Hustles */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="px-4 sm:px-6 md:px-12" style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            fontFamily: 'Netflix Sans, Helvetica Neue, Segoe UI, Roboto, Ubuntu, sans-serif', 
            fontWeight: '500', 
            fontSize: '20px', 
            lineHeight: '1.4', 
            color: '#e5e5e5',
            letterSpacing: '0.15px',
            margin: '0'
          }}>
            Side Hustles
          </h2>
        </div>
        
        {sidehustleLoading ? (
          <div className="px-4 sm:px-6 md:px-12">
            <div className="text-netflix-light-gray text-sm sm:text-base">Loading side hustles...</div>
          </div>
        ) : sidehustleError ? (
          <div className="px-4 sm:px-6 md:px-12">
            <div className="text-red-400 text-sm sm:text-base">Failed to load side hustles</div>
          </div>
        ) : (
          <ProjectCarousel projects={sidehustleProjects} onProjectClick={onProjectClick} />
        )}
      </motion.div>

      {/* Consulting/Fractional CMO */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="px-4 sm:px-6 md:px-12" style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            fontFamily: 'Netflix Sans, Helvetica Neue, Segoe UI, Roboto, Ubuntu, sans-serif', 
            fontWeight: '500', 
            fontSize: '20px', 
            lineHeight: '1.4', 
            color: '#e5e5e5',
            letterSpacing: '0.15px',
            margin: '0'
          }}>
            Consulting/Fractional CMO
          </h2>
        </div>
        
        {consultingLoading ? (
          <div className="px-4 sm:px-6 md:px-12">
            <div className="text-netflix-light-gray text-sm sm:text-base">Loading consulting projects...</div>
          </div>
        ) : consultingError ? (
          <div className="px-4 sm:px-6 md:px-12">
            <div className="text-red-400 text-sm sm:text-base">Failed to load consulting projects</div>
          </div>
        ) : (
          <ProjectCarousel projects={consultingProjects} onProjectClick={onProjectClick} />
        )}
      </motion.div>

      {/* Keynotes */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="px-4 sm:px-6 md:px-12" style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            fontFamily: 'Netflix Sans, Helvetica Neue, Segoe UI, Roboto, Ubuntu, sans-serif', 
            fontWeight: '500', 
            fontSize: '20px', 
            lineHeight: '1.4', 
            color: '#e5e5e5',
            letterSpacing: '0.15px',
            margin: '0'
          }}>
            Keynotes
          </h2>
        </div>
        
        {keynoteLoading ? (
          <div className="px-4 sm:px-6 md:px-12">
            <div className="text-netflix-light-gray text-sm sm:text-base">Loading keynotes...</div>
          </div>
        ) : keynoteError ? (
          <div className="px-4 sm:px-6 md:px-12">
            <div className="text-red-400 text-sm sm:text-base">Failed to load keynotes</div>
          </div>
        ) : (
          <ProjectCarousel projects={keynoteProjects} onProjectClick={onProjectClick} />
        )}
      </motion.div>
    </section>
  );
}