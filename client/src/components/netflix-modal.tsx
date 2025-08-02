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
                          const video = document.querySelector('video');
                          if (video) {
                            video.currentTime = 0;
                            video.play();
                          }
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
                {/* Status Tags and Title */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-green-600 text-white text-xs font-medium px-3 py-1 rounded">
                    {project.status === "live" ? "Live in production" : "Coming Soon"}
                  </span>
                  <span className="text-gray-300 text-sm">2024</span>
                  <span className="border border-gray-400 text-gray-300 text-xs px-2 py-1 rounded">
                    Web Application
                  </span>
                </div>

                {/* Main Description */}
                <h2 className="text-white text-2xl font-bold mb-6">
                  {project.title === "Trip Planner" 
                    ? "What used to take hours now happens in minutes."
                    : project.title === "AI Interview Platform"
                    ? "What used to take days now completes in hours."
                    : project.title === "AI StayWise"
                    ? "What used to be guesswork now runs on intelligence."
                    : "What used to be complex now runs seamlessly."
                  }
                </h2>

                {/* Two Column Layout with Blue Neon Line Separator */}
                <div className="flex flex-col lg:flex-row gap-0">
                  {/* Left Column - Detailed Description */}
                  <div className="flex-[2] pr-8">
                    <p className="text-gray-300 text-base leading-relaxed">
                      {project.title === "Trip Planner" 
                        ? "Travel planning was chaos: scattered research, broken booking flows, and buried recommendations that had to be cleaned and restructured just to process a single trip. Multiple team members were manually coordinating bookings every day to meet tight deadlines. I built a comprehensive solution using React and PostgreSQL that parses unstructured travel data and generates clean, system-ready itineraries in minutes. Today, one person processes dozens of bookings in under 20 minutes with complete accuracy and zero planning stress. What used to be a daily bottleneck is now a seamless flow."
                        : project.title === "AI Interview Platform"
                        ? "Interview processes were chaos: scattered evaluations, broken assessment flows, and buried candidate insights that had to be cleaned and restructured just to process a single hire. Multiple team members were manually reviewing interviews every day to meet tight hiring deadlines. I built a comprehensive solution using AI and React that parses unstructured interview data and generates clean, system-ready assessments in minutes. Today, one person processes dozens of interviews in under 20 minutes with complete accuracy and zero evaluation stress. What used to be a daily bottleneck is now a seamless flow."
                        : project.title === "AI StayWise"
                        ? "Accommodation booking was chaos: scattered listings, broken recommendation flows, and buried pricing insights that had to be cleaned and restructured just to process a single stay. Multiple team members were manually comparing options every day to meet tight travel deadlines. I built a comprehensive solution using AI and React that parses unstructured accommodation data and generates clean, system-ready recommendations in minutes. Today, one person processes dozens of bookings in under 20 minutes with complete accuracy and zero search stress. What used to be a daily bottleneck is now a seamless flow."
                        : project.description
                      }
                    </p>
                  </div>

                  {/* Blue Neon Line Separator */}
                  <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-60 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>

                  {/* Right Column - Project Details */}
                  <div className="flex-[1] pl-8 lg:pl-8 mt-8 lg:mt-0 space-y-6">
                    {/* Cast */}
                    <div>
                      <h4 className="text-gray-400 text-sm font-medium mb-2">Cast:</h4>
                      <p className="text-white text-sm">Priya Jha</p>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="text-gray-400 text-sm font-medium mb-3">Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 2).map((tech) => (
                          <span 
                            key={tech}
                            className="border border-gray-500 text-gray-300 text-xs px-3 py-1 rounded-full"
                          >
                            {tech === "React & Next.js" ? "React" : 
                             tech === "Node.js & Express" ? "Node.js" :
                             tech === "PostgreSQL" ? "PostgreSQL" :
                             tech === "MongoDB" ? "MongoDB" : tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* The Challenge */}
                    <div>
                      <h4 className="text-gray-400 text-sm font-medium mb-2">The Challenge:</h4>
                      <p className="text-white text-sm">
                        {project.title === "Trip Planner"
                          ? "Manual travel planning to create comprehensive itineraries under tight deadlines. Every. Single. Trip."
                          : project.title === "AI Interview Platform"
                          ? "Manual interview evaluation to create comprehensive assessments under tight hiring deadlines. Every. Single. Candidate."
                          : project.title === "AI StayWise"
                          ? "Manual accommodation research to create personalized recommendations under tight booking deadlines. Every. Single. Stay."
                          : "Manual data processing to create system-ready outputs under tight deadlines. Every. Single. Day."
                        }
                      </p>
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