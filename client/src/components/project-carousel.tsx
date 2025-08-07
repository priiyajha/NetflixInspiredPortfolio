import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Share, Check, Copy, Play, Plus, ThumbsUp, ChevronDown, Share2 } from "lucide-react";
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

  const getCardWidth = () => {
    // Calculate exact card width to fit 5 cards per row
    const containerPadding = window.innerWidth >= 768 ? 96 : 32; // px-12 on md+ or px-4 on smaller
    const totalGap = 4 * 16; // 4 gaps of 1rem each (16px)
    const availableWidth = window.innerWidth - containerPadding;
    return Math.floor((availableWidth - totalGap) / 5);
  };

  const scrollLeft = () => {
    const container = scrollRef.current;
    if (!container) return;
    
    const cardWidth = getCardWidth();
    const gap = 16; // 1rem gap
    const scrollAmount = cardWidth + gap;
    container.scrollBy({ left: -scrollAmount * 5, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = scrollRef.current;
    if (!container) return;
    
    const cardWidth = getCardWidth();
    const gap = 16; // 1rem gap
    const scrollAmount = cardWidth + gap;
    container.scrollBy({ left: scrollAmount * 5, behavior: 'smooth' });
  };

  const [cardWidth, setCardWidth] = useState(getCardWidth());

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateCardWidth = () => {
      setCardWidth(getCardWidth());
      checkScrollability();
    };

    checkScrollability();
    
    const handleScroll = () => checkScrollability();
    const handleResize = () => updateCardWidth();
    
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
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-4 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {projects.map((project, index) => {
          const hasLiveUrl = project.liveUrl && project.liveUrl.length > 0;
          const isClickable = hasLiveUrl || project.status === "coming-soon" || project.status === "completed";
          
          return (
            <motion.div
              key={project.id}
              className="flex-none cursor-pointer relative group"
              style={{
                width: `${cardWidth}px`,
                minWidth: `${cardWidth}px`
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
                className={`relative overflow-hidden transition-all duration-300 ease-out h-full ${
                  hoveredProject === project.id 
                    ? 'shadow-2xl shadow-black/50 z-20' 
                    : 'hover:shadow-lg hover:shadow-black/30'
                }`}
                style={{
                  transformOrigin: 'center center',
                  borderRadius: '8px',
                  aspectRatio: '16 / 9'
                }}
              >
                {/* Video background for hover state */}
                {hoveredProject === project.id && project.video && (
                  <motion.video
                    ref={(el) => { videoRefs.current[project.id] = el; }}
                    src={project.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 right-0 w-full h-full object-cover z-0 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
                
                {/* Static Image */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-opacity duration-300 rounded-lg"
                  style={{
                    opacity: hoveredProject === project.id && project.video ? 0 : 1
                  }}
                  draggable={false}
                />
                
                {/* Gradient Overlay - only for non-hover state */}
                {hoveredProject !== project.id && (
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-lg">
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
                    <div className="absolute top-16 right-0 bg-black/95 backdrop-blur-md rounded-lg p-4 min-w-[220px] z-50 border border-white/10 shadow-2xl">
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

                
                {/* Content overlay - simple title overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-30 p-3 bg-black/90 rounded-b-lg">
                  <h3 className="font-bold text-white text-sm truncate">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-xs truncate">{project.category}</p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}