import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github } from "lucide-react";
import { Project } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface ProjectModalProps {
  projectId: string | null;
  onClose: () => void;
}

export default function ProjectModal({ projectId, onClose }: ProjectModalProps) {
  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  if (!projectId) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className="bg-netflix-dark rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="text-center py-6 sm:py-8">
                <div className="text-white text-lg sm:text-xl">Loading project details...</div>
              </div>
            ) : project ? (
              <>
                <div className="flex justify-between items-start mb-4 sm:mb-6 relative">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold pr-4">{project.title}</h2>
                  
                  {/* Coming Soon tag for top right corner */}
                  {project.status === "coming-soon" && (
                    <div className="absolute top-0 right-12 sm:right-16">
                      <div className="inline-flex items-center text-sm font-medium text-white bg-blue-600 px-3 py-1 rounded-full">
                        Coming Soon
                      </div>
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-netflix-light-gray hover:text-white flex-shrink-0"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                </div>

                {project.video ? (
                  <video
                    src={project.video}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg mb-4 sm:mb-6"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg mb-4 sm:mb-6"
                  />
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Description</h3>
                    <p className="text-netflix-light-gray mb-6">
                      {project.description}
                    </p>

                    <h3 className="text-xl font-semibold mb-4">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-netflix-red rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Features section for Coming Soon projects */}
                    {project.status === "coming-soon" && project.features && project.features.length > 0 && (
                      <>
                        <h3 className="text-xl font-semibold mb-4">Planned Features</h3>
                        <ul className="text-netflix-light-gray space-y-2 mb-6">
                          {project.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-blue-400 mr-2 mt-1">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {/* Features section for Live projects */}
                    {project.status === "live" && project.features && project.features.length > 0 && (
                      <>
                        <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                        <ul className="text-netflix-light-gray space-y-2 mb-6">
                          {project.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-green-400 mr-2 mt-1">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  <div>
                    {project.status === "coming-soon" ? (
                      <>
                        <h3 className="text-xl font-semibold mb-4">Project Status</h3>
                        <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 mb-6">
                          <h4 className="text-blue-400 font-semibold mb-2">In Development</h4>
                          <p className="text-netflix-light-gray text-sm mb-3">
                            This project is currently being built with exciting features planned. Stay tuned for updates!
                          </p>
                          <div className="text-blue-400 text-sm font-medium">
                            Expected launch: Coming Soon
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold mb-4">Project Links</h3>
                        <div className="space-y-3">
                          {project.liveUrl && (
                            <Button
                              asChild
                              className="w-full bg-netflix-red hover:bg-red-700 transition-colors"
                            >
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View Live Project
                              </a>
                            </Button>
                          )}
                          
                          {project.githubUrl && (
                            <Button
                              asChild
                              variant="secondary"
                              className="w-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                              >
                                <Github className="w-4 h-4" />
                                View Source Code
                              </a>
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-netflix-light-gray">Project not found</div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}