import { useRef } from "react";
import { motion } from "framer-motion";
import { Project } from "@shared/schema";

interface ProjectCarouselProps {
  projects: Project[];
  onProjectClick: (projectId: string) => void;
}

export default function ProjectCarousel({ projects, onProjectClick }: ProjectCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = scrollRef.current;
    if (!slider) return;

    const startX = e.pageX - slider.offsetLeft;
    const scrollLeft = slider.scrollLeft;
    let isDown = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      isDown = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (projects.length === 0) {
    return (
      <div className="px-4 sm:px-6 md:px-12">
        <div className="text-netflix-light-gray text-sm sm:text-base">No projects available</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex space-x-3 sm:space-x-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-12 pb-4 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        {projects.map((project, index) => {
          const hasLiveUrl = project.liveUrl && project.liveUrl.length > 0;
          const isClickable = hasLiveUrl || project.status === "coming-soon";
          
          return (
            <motion.div
              key={project.id}
              className={`flex-none w-64 sm:w-72 md:w-80 lg:w-96 group ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
              onClick={() => isClickable && onProjectClick(project.id)}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={isClickable ? { 
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeOut" }
              } : {}}
            >
              <div className={`relative rounded-lg overflow-hidden transition-all duration-300 ease-out ${
                isClickable 
                  ? 'group-hover:shadow-2xl group-hover:shadow-white/20 group-hover:-translate-y-2' 
                  : ''
              }`}>
                <img
                  src={project.image}
                  alt={project.title}
                  className={`w-full h-40 sm:h-44 md:h-48 lg:h-52 object-cover transition-all duration-300 ${
                    isClickable 
                      ? 'group-hover:brightness-110 group-hover:scale-110'
                      : 'opacity-80'
                  }`}
                  draggable={false}
                />
                <div className={`absolute inset-0 transition-all duration-300 bg-gradient-to-t from-black/80 via-transparent to-transparent ${
                  isClickable ? 'group-hover:from-black/60' : ''
                }`}></div>
                
                {/* Hover overlay for interactive cards */}
                {isClickable && (
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300"></div>
                )}
                

                
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 transition-all duration-300 group-hover:bottom-4 sm:group-hover:bottom-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 transition-all duration-300 group-hover:text-white group-hover:drop-shadow-lg">
                    {project.title}
                  </h3>
                  <p className="text-netflix-light-gray text-xs sm:text-sm transition-all duration-300 group-hover:text-gray-200">
                    {project.technologies.join(", ")}
                  </p>
                  
                  {/* Hover indicator for clickable projects */}
                  {hasLiveUrl && (
                    <div className="mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="inline-flex items-center text-xs text-white bg-red-600/80 px-2 py-1 rounded backdrop-blur-sm">
                        Click to view details
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}