import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Button } from "./ui/button";
import { X, Play, Plus, Volume2, VolumeX, ThumbsUp } from "lucide-react";

interface NetflixModalProps {
  projectId: string | null;
  onClose: () => void;
}

export default function NetflixModal({ projectId, onClose }: NetflixModalProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  const { data: featuredProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects/featured"],
  });

  // Filter out current project from "More Like This" and limit to 6
  const moreLikeThisProjects = featuredProjects
    .filter(p => p.id !== projectId)
    .slice(0, 6);

  const handleProjectClick = (newProjectId: string) => {
    setSelectedProject(newProjectId);
    // This will cause the modal to show the new project
    // You might want to call onClose and reopen with new ID from parent
  };

  if (!projectId) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-[#141414] rounded-lg max-w-5xl w-full max-h-[95vh] overflow-y-auto relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-white text-xl">Loading project details...</div>
            </div>
          ) : project ? (
            <>
              {/* Video/Image Header Section */}
              <div className="relative h-[60vh] overflow-hidden rounded-t-lg">
                {project.video ? (
                  <video
                    src={project.video}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </Button>

                  {/* Volume Control */}
                  {project.video && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                      className="absolute bottom-4 right-4 text-white hover:bg-white/20 rounded-full"
                    >
                      {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </Button>
                  )}

                  {/* Project Title and Buttons - Bottom Left */}
                  <div className="absolute bottom-8 left-8 right-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                      {project.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 mb-6">
                      {/* Restart Video Button */}
                      <Button
                        className="bg-white text-black hover:bg-white/90 font-semibold px-6 py-2"
                        onClick={() => {
                          // Restart video logic if needed
                          const video = document.querySelector('video');
                          if (video) video.currentTime = 0;
                        }}
                      >
                        <Play className="w-5 h-5 mr-2 fill-current" />
                        Restart Video
                      </Button>

                      {/* Add to List Button */}
                      <Button
                        variant="outline"
                        className="border-2 border-white/70 text-white bg-white/10 hover:bg-white/20 font-semibold px-6 py-2"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add to List
                      </Button>

                      {/* Like Icon */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 rounded-full border-2 border-white/70"
                      >
                        <ThumbsUp className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8">
                {/* Description */}
                <div className="mb-8">
                  <p className="text-white text-lg leading-relaxed max-w-4xl">
                    {project.description}
                  </p>
                </div>

                {/* About Section */}
                <div className="mb-8">
                  <h3 className="text-white text-xl font-semibold mb-4">
                    About {project.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400 font-semibold">Director: </span>
                      <span className="text-gray-300">Priya Jha</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-semibold">Cast: </span>
                      <span className="text-gray-300">Priya Jha, Open Source Community</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-semibold">Challenge: </span>
                      <span className="text-gray-300">
                        {project.title === "Trip Planner" 
                          ? "Building a comprehensive travel platform with real-time data integration"
                          : "Creating an intelligent AI-powered solution for modern problems"
                        }
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-semibold">Role: </span>
                      <span className="text-gray-300">Solo Full-Stack Developer</span>
                    </div>
                  </div>
                </div>

                {/* More Like This Section */}
                <div className="mb-8">
                  <h3 className="text-white text-xl font-semibold mb-6">
                    More Like This
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {moreLikeThisProjects.map((similarProject) => (
                      <div
                        key={similarProject.id}
                        className="bg-[#2F2F2F] rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 group"
                        onClick={() => handleProjectClick(similarProject.id)}
                      >
                        <img
                          src={similarProject.image}
                          alt={similarProject.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-white font-semibold text-sm line-clamp-1">
                              {similarProject.title}
                            </h4>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Plus className="w-5 h-5 text-white border border-white rounded-full p-1" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                            <span>2024</span>
                            <span className="border border-gray-400 px-1 rounded text-xs">
                              Professional
                            </span>
                          </div>
                          <p className="text-gray-300 text-xs line-clamp-2">
                            {similarProject.description.substring(0, 100)}...
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-white">Project not found</div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}