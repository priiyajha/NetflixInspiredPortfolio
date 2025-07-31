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
      <div className="px-4 md:px-12">
        <div className="text-netflix-light-gray">No projects available</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-4 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        {projects.map((project, index) => {
          const isComingSoon = project.title === "Coming Soon";
          
          return (
            <motion.div
              key={project.id}
              className={`flex-none w-80 group ${isComingSoon ? 'cursor-default' : 'cursor-pointer'}`}
              onClick={() => !isComingSoon && onProjectClick(project.id)}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`relative rounded-lg overflow-hidden transition-transform duration-300 ${!isComingSoon && 'group-hover:scale-105'}`}>
                <img
                  src={project.image}
                  alt={project.title}
                  className={`w-full h-48 object-cover ${isComingSoon ? 'opacity-40' : ''}`}
                  draggable={false}
                />
                <div className={`absolute inset-0 ${isComingSoon ? 'bg-gradient-to-t from-black/90 via-black/60 to-black/40' : 'bg-gradient-to-t from-black/80 via-transparent to-transparent'}`}></div>
                
                {isComingSoon && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-red-600 mb-2" style={{ fontFamily: 'Netflix Sans, Arial, sans-serif' }}>
                        COMING SOON
                      </div>
                      <div className="text-sm text-gray-300 px-4">
                        New Project in Development
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4 right-4">
                  {!isComingSoon && (
                    <>
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-netflix-light-gray text-sm">
                        {project.technologies.join(", ")}
                      </p>
                    </>
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