import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Share, Copy, Check } from 'lucide-react';
import type { Project } from '@shared/schema';

interface ProjectCarouselProps {
  projects: Project[];
  title: string;
  onProjectClick: (projectId: string) => void;
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  projects,
  title,
  onProjectClick,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);
  const [copiedProject, setCopiedProject] = useState<string | null>(null);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    checkScrollability();
    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [projects]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollability);
      return () => scrollElement.removeEventListener('scroll', checkScrollability);
    }
  }, []);

  // Handle video playback for hover states
  useEffect(() => {
    if (hoveredProject) {
      const video = videoRefs.current[hoveredProject];
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {}); // Ignore autoplay errors
      }
    }
  }, [hoveredProject]);

  const handleShare = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareMenu(showShareMenu === project.id ? null : project.id);
  };

  const copyProjectLink = async (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const projectUrl = `${window.location.origin}?project=${project.id}`;
      await navigator.clipboard.writeText(projectUrl);
      setCopiedProject(project.id);
      setTimeout(() => setCopiedProject(null), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const shareOnSocial = async (platform: string, project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const projectUrl = `${window.location.origin}?project=${project.id}`;
    const shareText = `Check out ${project.title} by Farooq Chisty`;
    let shareUrl = '';

    switch (platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(projectUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${projectUrl}`)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(projectUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'instagram':
        await copyProjectLink(project, e);
        setHoveredProject(null);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareMenu(null);
    setHoveredProject(null);
  };

  const getProjectSubtitle = (project: Project) => {
    if (project.category === 'startup') return 'Co-Founder';
    if (project.category === 'fulltime') return 'Full-time Role';
    if (project.category === 'consulting') return 'Consulting/Fractional CMO';
    if (project.category === 'keynote') return 'Keynote Speaking';
    return 'Side Project';
  };

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowShareMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (projects.length === 0) {
    return (
      <div className="px-4 sm:px-6 md:px-12">
        <div className="text-netflix-light-gray text-sm sm:text-base">No projects available</div>
      </div>
    );
  }

  return (
    <div className="relative group mb-8">
      {/* Section Title */}
      <h2 className="text-white text-xl sm:text-2xl font-semibold mb-4 px-4 sm:px-6 md:px-12">
        {title}
      </h2>

      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Project Cards Container */}
      <div
        ref={scrollRef}
        className="flex gap-1 sm:gap-2 md:gap-2 lg:gap-3 xl:gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-12 pb-4 relative"
        onScroll={checkScrollability}
      >
        {projects.map((project, index) => {
          const isHovered = hoveredProject === project.id;
          
          return (
            <div
              key={project.id}
              className="flex-none cursor-pointer relative w-32 sm:w-36 md:w-40 lg:w-48 xl:w-52"
              onClick={() => onProjectClick(project.id)}
              onMouseEnter={() => {
                if (hoverTimeout) clearTimeout(hoverTimeout);
                const timeout = setTimeout(() => {
                  setHoveredProject(project.id);
                }, 200);
                setHoverTimeout(timeout);
              }}
              onMouseLeave={() => {
                if (hoverTimeout) {
                  clearTimeout(hoverTimeout);
                  setHoverTimeout(null);
                }
                setHoveredProject(null);
                setShowShareMenu(null);
              }}
            >
              {/* Normal Card State - Always visible as placeholder */}
              <motion.div 
                className={`relative overflow-hidden transition-all duration-300 ease-out ${
                  !isHovered ? 'hover:shadow-lg hover:shadow-black/30' : 'opacity-0'
                }`}
                style={{
                  borderRadius: '6px',
                  height: '120px'
                }}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: '6px' }}
                  draggable={false}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                  style={{ borderRadius: '6px' }}>
                </div>
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <h3 className="font-bold text-sm text-white truncate">
                    {project.title}
                  </h3>
                </div>
              </motion.div>

              {/* Modal Portal for Hover Card */}
              <AnimatePresence>
                {isHovered && (
                  <div className="fixed inset-0 z-[100] pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                    
                    {/* Card Modal - Centered */}
                    <div className="flex items-center justify-center min-h-screen p-4 pointer-events-none">
                      <motion.div 
                        className="w-full max-w-md bg-gray-900 rounded-xl shadow-2xl shadow-black/50 pointer-events-auto overflow-hidden"
                        initial={{
                          scale: 0.8,
                          opacity: 0,
                          y: 20
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                          y: 0
                        }}
                        exit={{
                          scale: 0.8,
                          opacity: 0,
                          y: 20
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                    {/* Video background for hover state */}
                    {project.video && (
                      <video
                        ref={(el) => { videoRefs.current[project.id] = el; }}
                        src={project.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-48 object-cover"
                        style={{ 
                          borderTopLeftRadius: '12px',
                          borderTopRightRadius: '12px'
                        }}
                      />
                    )}
                    
                    {/* Static Image - fallback when no video */}
                    {!project.video && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                        style={{
                          borderTopLeftRadius: '12px',
                          borderTopRightRadius: '12px'
                        }}
                        draggable={false}
                      />
                    )}
                    
                    {/* Share Button */}
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={(e) => handleShare(project, e)}
                        className="bg-black/80 hover:bg-black/90 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-md border border-white/20 shadow-lg"
                        aria-label="Share project"
                      >
                        <Share className="w-5 h-5" />
                      </button>
                      
                      {/* Share Menu */}
                      {showShareMenu === project.id && (
                        <div className="absolute top-16 right-0 bg-black/95 backdrop-blur-md rounded-lg p-4 min-w-[220px] z-[60] border border-white/10 shadow-2xl">
                          <div className="space-y-2">
                            <button
                              onClick={(e) => copyProjectLink(project, e)}
                              className="flex items-center space-x-3 w-full text-left text-white hover:text-red-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                            >
                              {copiedProject === project.id ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                              <span className="text-sm">
                                {copiedProject === project.id ? 'Copied!' : 'Copy Link'}
                              </span>
                            </button>
                            
                            <hr className="border-gray-600 my-2" />
                            
                            <button
                              onClick={(e) => shareOnSocial('linkedin', project, e)}
                              className="flex items-center space-x-3 w-full text-left text-white hover:text-blue-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                            >
                              <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                                <span className="text-white text-xs font-bold">in</span>
                              </div>
                              <span className="text-sm">LinkedIn</span>
                            </button>
                            
                            <button
                              onClick={(e) => shareOnSocial('twitter', project, e)}
                              className="flex items-center space-x-3 w-full text-left text-white hover:text-blue-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                            >
                              <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center border border-white">
                                <span className="text-white text-xs font-bold">𝕏</span>
                              </div>
                              <span className="text-sm">Twitter</span>
                            </button>
                            
                            <button
                              onClick={(e) => shareOnSocial('whatsapp', project, e)}
                              className="flex items-center space-x-3 w-full text-left text-white hover:text-green-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                            >
                              <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                                <span className="text-white text-xs font-bold">W</span>
                              </div>
                              <span className="text-sm">WhatsApp</span>
                            </button>
                            
                            <button
                              onClick={(e) => shareOnSocial('telegram', project, e)}
                              className="flex items-center space-x-3 w-full text-left text-white hover:text-blue-300 transition-colors py-2 px-2 rounded hover:bg-white/10"
                            >
                              <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                                <span className="text-white text-xs font-bold">T</span>
                              </div>
                              <span className="text-sm">Telegram</span>
                            </button>
                            
                            <button
                              onClick={(e) => shareOnSocial('instagram', project, e)}
                              className="flex items-center space-x-3 w-full text-left text-white hover:text-pink-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                            >
                              <div className="w-4 h-4 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-sm flex items-center justify-center">
                                <span className="text-white text-xs font-bold">IG</span>
                              </div>
                              <span className="text-sm">Instagram</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-4 bg-gray-800" style={{ 
                      borderBottomLeftRadius: '12px',
                      borderBottomRightRadius: '12px'
                    }}>
                      <div className="flex flex-col space-y-2">
                        <h3 className="text-white font-bold text-lg leading-tight">
                          {project.title}
                        </h3>
                        <p className="text-netflix-light-gray text-sm">
                          {getProjectSubtitle(project)}
                        </p>
                        <p className="text-white text-sm line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-2 pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onProjectClick(project.id);
                            }}
                            className="flex-1 bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-200 transition-colors text-sm"
                          >
                            View Details
                          </button>
                          
                          {project.liveUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.liveUrl!, '_blank');
                              }}
                              className="flex-1 bg-gray-600 text-white font-semibold py-2 px-4 rounded hover:bg-gray-500 transition-colors text-sm"
                            >
                              Visit Live
                            </button>
                          )}
                          
                          {project.githubUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.githubUrl!, '_blank');
                              }}
                              className="flex-1 bg-gray-600 text-white font-semibold py-2 px-4 rounded hover:bg-gray-500 transition-colors text-sm"
                            >
                              GitHub
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectCarousel;