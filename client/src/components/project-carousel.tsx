import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Share, Check, Copy, Play, Plus, ThumbsUp } from "lucide-react";
import { Project } from "@shared/schema";

interface ProjectCarouselProps {
  projects: Project[];
  onProjectClick: (projectId: string) => void;
}

export default function ProjectCarousel({ projects, onProjectClick }: ProjectCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);
  const [copiedProject, setCopiedProject] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const checkScrollability = () => {
    const container = scrollRef.current;
    if (!container) return;
    
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  const scrollLeft = () => {
    const container = scrollRef.current;
    if (!container) return;
    
    const cardWidth = window.innerWidth >= 1280 ? 224 : window.innerWidth >= 1024 ? 204 : window.innerWidth >= 768 ? 184 : window.innerWidth >= 640 ? 164 : 144;
    container.scrollBy({ left: -cardWidth * 5, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = scrollRef.current;
    if (!container) return;
    
    const cardWidth = window.innerWidth >= 1280 ? 224 : window.innerWidth >= 1024 ? 204 : window.innerWidth >= 768 ? 184 : window.innerWidth >= 640 ? 164 : 144;
    container.scrollBy({ left: cardWidth * 5, behavior: 'smooth' });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkScrollability();
    
    const handleScroll = () => checkScrollability();
    const handleResize = () => checkScrollability();
    
    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [projects]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowShareMenu(null);
      setHoveredProject(null);
    };

    if (showShareMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showShareMenu]);

  const handleShare = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const isMenuOpen = showShareMenu === project.id;
    setShowShareMenu(isMenuOpen ? null : project.id);
    
    if (!isMenuOpen) {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setHoveredProject(project.id);
    } else {
      setHoveredProject(null);
    }
  };

  const copyProjectLink = async (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const projectUrl = `${window.location.origin}?project=${project.id}`;
    try {
      await navigator.clipboard.writeText(projectUrl);
      setCopiedProject(project.id);
      setTimeout(() => {
        setCopiedProject(null);
        setShowShareMenu(null);
        setHoveredProject(null);
      }, 2000);
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

  if (projects.length === 0) {
    return (
      <div className="px-4 sm:px-6 md:px-12">
        <div className="text-netflix-light-gray text-sm sm:text-base">No projects available</div>
      </div>
    );
  }

  return (
    <div className="relative group" style={{ overflow: 'visible' }}>
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

      <div
        ref={scrollRef}
        className="flex gap-1 sm:gap-2 md:gap-2 lg:gap-3 xl:gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-12 pb-4"
        style={{ overflowY: 'visible' }}
      >
        {projects.map((project, index) => {
          return (
            <div
              key={project.id}
              className="flex-none cursor-pointer relative w-32 sm:w-36 md:w-40 lg:w-48 xl:w-52"
              onClick={() => onProjectClick(project.id)}
              onMouseEnter={() => {
                if (hoverTimeout) {
                  clearTimeout(hoverTimeout);
                }
                // Reduce delay to 200ms for better responsiveness
                const timeout = setTimeout(() => {
                  console.log('Setting hovered project:', project.id);
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
              }}
            >
              {/* Normal Card State - Always visible as placeholder */}
              <motion.div 
                className={`relative overflow-hidden transition-all duration-300 ease-out ${
                  hoveredProject !== project.id ? 'hover:shadow-lg hover:shadow-black/30' : ''
                }`}
                style={{
                  borderRadius: '6px',
                  visibility: hoveredProject === project.id ? 'hidden' : 'visible'
                }}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-18 sm:h-20 md:h-24 lg:h-28 xl:h-32 object-cover"
                  style={{ borderRadius: '6px' }}
                  draggable={false}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                  style={{ borderRadius: '6px' }}>
                </div>
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-30 p-4">
                  <h3 className="font-bold text-base mb-1 text-white truncate">
                    {project.title}
                  </h3>
                </div>
              </motion.div>

              {/* Expanded Hover Card State - Absolutely positioned */}
              {hoveredProject === project.id && (
                <motion.div 
                  className="absolute top-0 left-0 w-80 overflow-hidden shadow-2xl shadow-black/50 pointer-events-auto bg-gray-900 border-2 border-red-500 z-50"
                  style={{
                    transformOrigin: 'center center',
                    borderRadius: '12px'
                  }}
                  initial={{
                    scale: 1,
                    y: 0,
                  }}
                  animate={{
                    scale: 1.15,
                    y: -15,
                  }}
                  exit={{
                    scale: 1,
                    y: 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Video background for hover state */}
                  {project.video && (
                    <motion.video
                      ref={(el) => { videoRefs.current[project.id] = el; }}
                      src={project.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute top-0 left-0 right-0 w-full h-48 object-cover z-0"
                      style={{ 
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px'
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
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
                  <div className="absolute top-4 right-4 z-40">
                    <button
                      onClick={(e) => handleShare(project, e)}
                      className="bg-black/80 hover:bg-black/90 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-md border border-white/20 shadow-lg opacity-100 scale-100"
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
                            className="flex items-center space-x-3 w-full text-left text-white hover:text-blue-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                          >
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">T</span>
                            </div>
                            <span className="text-sm">Telegram</span>
                          </button>
                          
                          <button
                            onClick={(e) => shareOnSocial('instagram', project, e)}
                            className="flex items-center space-x-3 w-full text-left text-white hover:text-pink-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                          >
                            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-sm flex items-center justify-center">
                              <span className="text-white text-xs font-bold">IG</span>
                            </div>
                            <span className="text-sm">Instagram (Copy)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gray-800"
                    style={{
                      borderBottomLeftRadius: '12px',
                      borderBottomRightRadius: '12px',
                      minHeight: '140px'
                    }}>
                    <h3 className="font-bold text-lg mb-2 text-white">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="space-y-3"
                    >
                      {/* Action buttons */}
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-white text-black px-4 py-2 rounded-md flex items-center space-x-2 text-sm font-semibold hover:bg-gray-200 transition-colors"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>View</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 text-sm font-semibold hover:bg-gray-500 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gray-600 text-white p-2 rounded-full text-sm font-semibold hover:bg-gray-500 transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}