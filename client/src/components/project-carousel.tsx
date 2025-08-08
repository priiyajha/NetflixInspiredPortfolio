import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Plus, Share, Check, Copy, ThumbsUp, ChevronDown } from "lucide-react";
import { Project } from "@shared/schema";

interface ProjectCarouselProps {
  projects: Project[];
  onProjectClick: (projectId: string) => void;
}

export default function ProjectCarousel({ projects, onProjectClick }: ProjectCarouselProps) {
  
  const getProjectTitleDescription = (project: Project) => {
    // Return empty string for all projects to remove hover descriptions
    return "";
  };

  const getProjectSubtitle = (project: Project): string => {
    // Return empty string for all projects to remove subtitles when hovered
    return "";
  };

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
    
    // Responsive card scrolling - mobile: 2 cards, tablet: 3 cards, desktop: 5 cards
    const cardWidth = window.innerWidth >= 1280 ? 276 : window.innerWidth >= 1024 ? 252 : window.innerWidth >= 768 ? 236 : 240;
    const scrollCount = window.innerWidth >= 1024 ? 5 : window.innerWidth >= 768 ? 3 : 2;
    container.scrollBy({ left: -cardWidth * scrollCount, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = scrollRef.current;
    if (!container) return;
    
    // Responsive card scrolling - mobile: 2 cards, tablet: 3 cards, desktop: 5 cards
    const cardWidth = window.innerWidth >= 1280 ? 276 : window.innerWidth >= 1024 ? 252 : window.innerWidth >= 768 ? 236 : 240;
    const scrollCount = window.innerWidth >= 1024 ? 5 : window.innerWidth >= 768 ? 3 : 2;
    container.scrollBy({ left: cardWidth * scrollCount, behavior: 'smooth' });
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
      // Also clear hover state when closing share menu by clicking outside
      setHoveredProject(null);
    };

    if (showShareMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showShareMenu]);

  const handleShare = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Toggle share menu
    const isMenuOpen = showShareMenu === project.id;
    setShowShareMenu(isMenuOpen ? null : project.id);
    
    // Apply hover effects when share button is clicked (similar to card hover)
    if (!isMenuOpen) {
      // Clear any existing hover timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      // Set hovered state to trigger all hover effects
      setHoveredProject(project.id);
    } else {
      // Remove hover effects when closing share menu
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
        // Reset hover state after showing copied feedback
        setShowShareMenu(null);
        setHoveredProject(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers or failed clipboard access
      try {
        const textArea = document.createElement('textarea');
        textArea.value = projectUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedProject(project.id);
        setTimeout(() => {
          setCopiedProject(null);
          // Reset hover state after showing copied feedback
          setShowShareMenu(null);
          setHoveredProject(null);
        }, 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
    }
  };

  const shareOnSocial = (platform: string, project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const projectUrl = encodeURIComponent(`${window.location.origin}?project=${project.id}`);
    const text = encodeURIComponent(`Check out this project: ${project.title}`);
    const projectTitle = encodeURIComponent(project.title);
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${projectUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${projectUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${projectUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${projectUrl}&text=${text}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        navigator.clipboard.writeText(`${decodeURIComponent(text)} ${decodeURIComponent(projectUrl)}`);
        setCopiedProject(project.id);
        setTimeout(() => setCopiedProject(null), 2000);
        setShowShareMenu(null);
        // Reset hover state when sharing
        setHoveredProject(null);
        return;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${projectUrl}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareMenu(null);
    // Reset hover state when sharing
    setHoveredProject(null);
  };

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
    <div className="relative group">
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
        className="flex gap-1 sm:gap-2 md:gap-2 lg:gap-3 xl:gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-12 pb-4 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        {projects.map((project, index) => {
          const hasLiveUrl = project.liveUrl && project.liveUrl.length > 0;
          const isClickable = hasLiveUrl || project.status === "coming-soon" || project.status === "completed";
          
          return (
            <motion.div
              key={project.id}
              className={`flex-none cursor-pointer relative group ${
                hoveredProject === project.id 
                  ? 'w-72 sm:w-76 md:w-80 lg:w-80 xl:w-80' 
                  : 'w-44 sm:w-56 md:w-52 lg:w-60 xl:w-64'
              }`}
              style={{
                transition: 'width 0.3s ease-in-out'
              }}
              onClick={() => onProjectClick(project.id)}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => {
                // Clear any existing timeout
                if (hoverTimeout) {
                  clearTimeout(hoverTimeout);
                }
                // Set a 0.5 second delay before showing hover state
                const timeout = setTimeout(() => {
                  setHoveredProject(project.id);
                }, 500);
                setHoverTimeout(timeout);
              }}
              onMouseLeave={() => {
                // Clear timeout and hover state
                if (hoverTimeout) {
                  clearTimeout(hoverTimeout);
                  setHoverTimeout(null);
                }
                setHoveredProject(null);
              }}
            >
              {/* Normal Card State */}
              <motion.div 
                className={`relative overflow-hidden transition-all duration-300 ease-out ${
                  hoveredProject === project.id 
                    ? 'shadow-2xl shadow-black/50 z-20' 
                    : 'hover:shadow-lg hover:shadow-black/30'
                }`}
                style={{
                  transformOrigin: 'center center',
                  borderRadius: hoveredProject === project.id ? '12px' : '6px',
                  // Ensure cards stay centered horizontally on small screens
                  ...(window.innerWidth < 768 && hoveredProject === project.id ? {
                    position: 'relative',
                    left: '50%',
                    transform: 'translateX(-50%) scale(1.15) translateY(-15px)',
                    zIndex: 20
                  } : {})
                }}
                animate={{
                  scale: window.innerWidth >= 768 && hoveredProject === project.id ? 1.15 : 1,
                  y: window.innerWidth >= 768 && hoveredProject === project.id ? -15 : 0,
                  x: window.innerWidth < 768 && hoveredProject === project.id ? '-50%' : 0,
                }}
                transition={{ duration: 1.0, ease: "easeInOut" }}
              >
                {/* Video background for hover state - lazy load */}
                {hoveredProject === project.id && project.video && (
                  <motion.video
                    ref={(el) => { videoRefs.current[project.id] = el; }}
                    src={project.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute top-0 left-0 right-0 w-full object-cover z-0"
                    style={{ 
                      height: '65%',
                      borderTopLeftRadius: '12px',
                      borderTopRightRadius: '12px'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
                
                {/* Static Image - optimized loading */}
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className={`w-full object-cover transition-all duration-300 relative z-10 ${
                    hoveredProject === project.id 
                      ? 'opacity-0 h-72 sm:h-76 md:h-80' 
                      : 'opacity-100 h-24 sm:h-32 md:h-24 lg:h-28 xl:h-32'
                  }`}
                  style={{
                    borderRadius: hoveredProject === project.id ? '12px' : '6px'
                  }}
                  draggable={false}
                />
                
                {/* Gradient Overlay - only for non-hover state */}
                {hoveredProject !== project.id && (
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                    style={{ borderRadius: '6px' }}>
                  </div>
                )}
                
                {/* Share Button */}
                <div className="absolute top-4 right-4 z-40">
                  <button
                    onClick={(e) => handleShare(project, e)}
                    className={`bg-black/80 hover:bg-black/90 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-md border border-white/20 shadow-lg ${
                      hoveredProject === project.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                    aria-label="Share project"
                  >
                    <Share className="w-5 h-5" />
                  </button>
                  
                  {/* Share Menu */}
                  {showShareMenu === project.id && (
                    <div className="absolute top-12 sm:top-16 left-1/2 sm:left-auto sm:right-0 bg-black/95 backdrop-blur-md rounded-lg p-3 sm:p-4 w-[240px] sm:min-w-[220px] z-50 border border-white/10 shadow-2xl transform -translate-x-1/2 sm:translate-x-0"
                      style={{
                        top: window.innerWidth < 640 ? '48px' : '64px',
                        left: window.innerWidth < 640 ? '50%' : 'auto',
                        right: window.innerWidth >= 640 ? '0' : 'auto',
                        transform: window.innerWidth < 640 ? 'translateX(-50%)' : 'none'
                      }}>
                      <div className="space-y-1 sm:space-y-2">
                        <button
                          onClick={(e) => copyProjectLink(project, e)}
                          className="flex items-center space-x-3 w-full text-left text-white hover:text-red-400 transition-colors py-1.5 sm:py-2 px-2 rounded hover:bg-white/10"
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
                          className="flex items-center space-x-3 w-full text-left text-white hover:text-blue-400 transition-colors py-1.5 sm:py-2 px-2 rounded hover:bg-white/10"
                        >
                          <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                            <span className="text-white text-xs font-bold">in</span>
                          </div>
                          <span className="text-sm">LinkedIn</span>
                        </button>
                        
                        <button
                          onClick={(e) => shareOnSocial('twitter', project, e)}
                          className="flex items-center space-x-3 w-full text-left text-white hover:text-blue-400 transition-colors py-1.5 sm:py-2 px-2 rounded hover:bg-white/10"
                        >
                          <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center border border-white">
                            <span className="text-white text-xs font-bold">𝕏</span>
                          </div>
                          <span className="text-sm">Twitter</span>
                        </button>
                        
                        <button
                          onClick={(e) => shareOnSocial('whatsapp', project, e)}
                          className="flex items-center space-x-3 w-full text-left text-white hover:text-green-400 transition-colors py-1.5 sm:py-2 px-2 rounded hover:bg-white/10"
                        >
                          <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                            <span className="text-white text-xs font-bold">W</span>
                          </div>
                          <span className="text-sm">WhatsApp</span>
                        </button>
                        
                        <button
                          onClick={(e) => shareOnSocial('telegram', project, e)}
                          className="flex items-center space-x-3 w-full text-left text-white hover:text-blue-400 transition-colors py-1.5 sm:py-2 px-2 rounded hover:bg-white/10"
                        >
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">T</span>
                          </div>
                          <span className="text-sm">Telegram</span>
                        </button>
                        
                        <button
                          onClick={(e) => shareOnSocial('instagram', project, e)}
                          className="flex items-center space-x-3 w-full text-left text-white hover:text-pink-400 transition-colors py-1.5 sm:py-2 px-2 rounded hover:bg-white/10"
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

                
                {/* Content overlay - adapts to hover state */}
                <div className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-300 ${
                  hoveredProject === project.id 
                    ? 'p-3'
                    : 'p-4'
                }`}
                style={{
                  background: hoveredProject === project.id 
                    ? '#2a2a2a'
                    : '',
                  borderBottomLeftRadius: hoveredProject === project.id ? '12px' : '6px',
                  borderBottomRightRadius: hoveredProject === project.id ? '12px' : '6px',
                  minHeight: hoveredProject === project.id ? '160px' : 'auto',
                  maxHeight: hoveredProject === project.id ? '160px' : 'auto',
                  overflow: 'hidden'
                }}>
                  {hoveredProject === project.id && (
                    <div className="transition-all duration-300 mb-1">
                      <h3 className="font-bold text-white text-sm mb-1">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 text-xs leading-tight line-clamp-2 mb-2">
                        {project.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Project Subtitle - Only visible on hover */}
                  {hoveredProject === project.id && (
                    <p className="text-gray-400 text-sm mb-2 transition-all duration-300">
                      {getProjectSubtitle(project)}
                    </p>
                  )}
                  
                  {/* Show description only on hover */}
                  {hoveredProject === project.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >

                      
                      {/* Netflix-style Action buttons */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {/* Play Button - Opens Project Modal */}
                          <button 
                            className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              onProjectClick(project.id);
                            }}
                            title="View project details"
                            style={{ width: '36px', height: '36px' }}
                          >
                            <Play className="w-4 h-4 fill-current ml-1" />
                          </button>
                          
                          {/* Add Button - Opens Project Modal */}
                          <button 
                            className="border-2 border-gray-500 text-white p-2 rounded-full hover:border-white hover:bg-white/10 transition-colors flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              onProjectClick(project.id);
                            }}
                            title="View project details"
                            style={{ width: '32px', height: '32px' }}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* Like Button - Dummy for now */}
                          <button 
                            className="border-2 border-gray-500 text-white p-2 rounded-full hover:border-white hover:bg-white/10 transition-colors flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                            title="Like"
                            style={{ width: '32px', height: '32px' }}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        {/* Downward Arrow - Opens Card Details */}
                        <button 
                          className="border-2 border-gray-500 text-white p-2 rounded-full hover:border-white hover:bg-white/10 transition-colors flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            onProjectClick(project.id);
                          }}
                          title="More info"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {/* Movie info tags - matching Netflix style */}
                      <div className="flex items-center space-x-3 text-xs text-gray-300">
                        <span className="border border-gray-500 px-2 py-0.5 rounded">HD</span>
                        {project.period && (
                          <span className="text-gray-400">{project.period}</span>
                        )}
                        {project.engagementType && (
                          <span className="text-gray-400">{project.engagementType}</span>
                        )}
                      </div>
                      
                      {/* Share Menu Dropdown */}
                      {showShareMenu === project.id && (
                        <motion.div 
                          className="absolute bottom-14 right-0 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl z-50 min-w-[200px]"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="space-y-2">
                            <button
                              onClick={(e) => copyProjectLink(project, e)}
                              className="flex items-center w-full text-left px-3 py-2 text-white hover:bg-gray-700/50 rounded-md transition-colors"
                            >
                              {copiedProject === project.id ? (
                                <>
                                  <Check className="w-4 h-4 mr-3 text-green-400" />
                                  <span className="text-green-400">Link copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-3" />
                                  <span>Copy link</span>
                                </>
                              )}
                            </button>
                            
                            <div className="border-t border-gray-700 pt-2">
                              <p className="text-gray-400 text-xs mb-2 px-3">Share on social</p>
                              <button
                                onClick={(e) => shareOnSocial('twitter', project, e)}
                                className="flex items-center w-full text-left px-3 py-2 text-white hover:bg-gray-700/50 rounded-md transition-colors"
                              >
                                <Share className="w-4 h-4 mr-3" />
                                <span>Twitter</span>
                              </button>
                              <button
                                onClick={(e) => shareOnSocial('linkedin', project, e)}
                                className="flex items-center w-full text-left px-3 py-2 text-white hover:bg-gray-700/50 rounded-md transition-colors"
                              >
                                <Share className="w-4 h-4 mr-3" />
                                <span>LinkedIn</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}