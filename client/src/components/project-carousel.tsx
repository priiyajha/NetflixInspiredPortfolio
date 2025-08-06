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
    switch (project.title) {
      case "Cazpro":
        return "Built and scaled Cazpro, a D2C college merch brand, from a dorm room idea at 17 to a 2.5M INR sales machine in 15 months. Survived near shutdowns, sold to a local industrialist, and handled everything from code to partnerships. Hustled hard, shipped harder.";
      case "Millionth Mile Marketing":
        return "Co-founded a growth agency that became an Andhra Pradesh top 5, racking up 40+ global clients, 2 years, $180K revenue, and 25 teammates. Built teams, scaled campaigns, won awards, and hustled for brands from Vizag to Europe. Brought a bold attitude to every pitch.";
      case "DigiPay":
        return "Joined as first marketing hire, scaled the team to 28, and helped take revenue from $4M to $80M in 19 months. Drove growth with everything from guerrilla tactics to field ops. Orchestrated viral B2B installs and led the brand through major funding rounds.";
      case "Inventrax":
        return "Drove a 600% organic traffic jump for a warehouse automation SaaS in 4 months as a marketing consultant. Cracked the top 2 spots for three high-value keywords and turned traffic into leads with CRO and smart automation. Growth hacking, done right.";
      case "FDX Sports":
        return "Turbocharged FDX into a million-dollar D2C brand in Europe. Drove sales from $10K to $120K/month in 6 months, spent half a million on ads, reworked CRO and email automation, and 2.5x'd average cart value. Did not just play the game, rewrote the playbook.";
      case "Codiste":
        return "Fractional CMO who built, trained, and turbocharged the marketing and outbound sales teams. 4x'd marketing output, 2.5x'd sales response rates, and baked AI and programmatic SEO into their DNA. Set up every process from social to cold DMs, always optimizing for impact.";
      case "ZO Labs":
        return "As Head of Growth, took ZO Labs from stealth to 180K installs, built a 100K+ community, and shipped 10,000+ AI agent landing pages. Ran AI-led marketing sprints, bagged 120+ partnerships, and put ZO on the global stage. All hustle, zero fluff.";
      case "Zentrades":
        return "Dropped into Zentrades as a marketing consultant, rewired their inbound engine, and took MQLs from single digits to 60 a month in 4 months. Engineered a 125% traffic spike, built 5000+ SEO-rich landing pages, and turned a good CRM into a qualified lead machine.";
      case "InboxBites":
        return "Solo-built InboxBites, a microSaaS AI agent for Gmail, transforming newsletter chaos into snackable, swipeable, 50-word knowledge bites. Architected 60%+ of the code, GTM, UI/UX, and product strategy in 6 weeks. Already has 200+ waitlisters—built for hustlers who hate inbox overload.";
      case "Solgames":
        return "Co-built Soulgames, a GameFi dev toolkit, into a Solana hackathon winner and landed $150K in seed. Rallied a 3K-strong dev/gamer community, ran hackathons with 1K+ participants, and delivered a live MVP in 3 months. Paused by market chaos, but left a mark.";
      case "Martian Wallet":
        return "Headed marketing at Martian Wallet, scaling installs by 50%, landing 400K+ new users, and doubling DApp transaction volumes from $1.2B to $2B. Launched a DApp that hit $1M daily volume in a month, forged 50+ partnerships, and kept the Web3 world buzzing.";
      case "GEOptimer":
        return "Founder and builder of GEOptimer, a micro-SaaS that scores and audits website content for LLM/AI engine visibility—think SEO for AI, not just search. Enter a URL, get a GEO Score, action-packed report, and clear next steps in seconds. Built for growth-obsessed marketers.";
      case "Growth Opportunity Agent":
        return "Built a micro-SaaS agent that surfaces untapped digital growth opportunities for startups—automating what founders and marketers miss. Scans all digital touchpoints and delivers actionable insights, making \"where do I grow next?\" a one-click answer.";
      case "Reply Agent (Auto-Commenter)":
        return "Engineering a Reply Agent that auto-generates and posts targeted replies across LinkedIn, Twitter, and Reddit. Comment up to 150x a day, all automated and prompt-driven—think hustle in a headless browser. Launching with a waitlist on Product Hunt, August 25.";
      case "Internal Linking Agent":
        return "Launching a plug-and-play internal linking agent for founders strapped on SEO budgets—instantly optimize content for search and LLMs. Built on Node.js, React, and custom logic, delivers fast actionable traffic/visibility gains. Shipping first week of September.";
      case "Content Automation (Reddit → LinkedIn)":
        return "Automated my LinkedIn content pipeline by scraping Reddit for trending AI/agent pain points, converting topics into hooks, and posting on LinkedIn with a human-in-the-loop review. All my posts now flow from this. Soon to be productized for other creators.";
      case "Blog Automation (Purple City MCP)":
        return "Built a flow to auto-repurpose trending articles via Purple City MCP and RSS, turning them into original blog posts with a human-in-the-loop review. All powered by n8n and will soon power InboxBites' blog at scale.";
      case "Lead Generator Agent (LinkedIn, Twitter, Reddit)":
        return "Created an agent to scrape, filter, and funnel target profiles talking about specific pain points on LinkedIn, Twitter, and Reddit—automates profile discovery and dashboarding, saving 60% of lead gen time. Frees founders and marketers to focus on closing, not scraping.";
      case "AGENTSY":
        return "Sold over $2M in digital products via AGENTSY—performance marketing funnels at scale. Ran campaigns on Facebook/Google, moved 20L+ INR in 6 months, sold e-books, templates, and downloadables. Built funnels, ran the stack, shipped results.";
      default:
        return project.description;
    }
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
    
    const cardWidth = 320; // Approximate card width + gap
    container.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = scrollRef.current;
    if (!container) return;
    
    const cardWidth = 320; // Approximate card width + gap
    container.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
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
    };

    if (showShareMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showShareMenu]);

  const handleShare = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareMenu(showShareMenu === project.id ? null : project.id);
  };

  const copyProjectLink = async (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const projectUrl = `${window.location.origin}?project=${project.id}`;
    try {
      await navigator.clipboard.writeText(projectUrl);
      setCopiedProject(project.id);
      setTimeout(() => setCopiedProject(null), 2000);
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
        setTimeout(() => setCopiedProject(null), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
    }
  };

  const shareOnSocial = (platform: string, project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const projectUrl = encodeURIComponent(`${window.location.origin}?project=${project.id}`);
    const text = encodeURIComponent(`Check out this project: ${project.title}`);
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${projectUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${projectUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${projectUrl}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareMenu(null);
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
        className="flex space-x-3 sm:space-x-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-12 pb-4 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        {projects.map((project, index) => {
          const hasLiveUrl = project.liveUrl && project.liveUrl.length > 0;
          const isClickable = hasLiveUrl || project.status === "coming-soon" || project.status === "completed";
          
          return (
            <motion.div
              key={project.id}
              className={`flex-none ${isClickable ? 'cursor-pointer' : 'cursor-default'} relative ${
                hoveredProject === project.id 
                  ? 'w-80 sm:w-80 md:w-80 lg:w-80' 
                  : 'w-64 sm:w-72 md:w-80 lg:w-96'
              }`}
              style={{
                transition: 'width 0.3s ease-in-out'
              }}
              onClick={() => isClickable && onProjectClick(project.id)}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => {
                if (isClickable) {
                  // Clear any existing timeout
                  if (hoverTimeout) {
                    clearTimeout(hoverTimeout);
                  }
                  // Set a delay before showing hover state (like Netflix)
                  const timeout = setTimeout(() => {
                    setHoveredProject(project.id);
                  }, 150);
                  setHoverTimeout(timeout);
                }
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
                className={`relative rounded-lg overflow-hidden transition-all duration-300 ease-out ${
                  isClickable 
                    ? hoveredProject === project.id 
                      ? 'shadow-2xl shadow-black/50 z-20' 
                      : 'hover:shadow-lg hover:shadow-black/30'
                    : ''
                }`}
                style={{
                  transformOrigin: 'center center'
                }}
                animate={{
                  scale: hoveredProject === project.id ? 1.15 : 1,
                  y: hoveredProject === project.id ? -15 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
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
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
                
                {/* Static Image */}
                <img
                  src={project.image}
                  alt={project.title}
                  className={`w-full object-cover transition-all duration-300 relative z-10 ${
                    hoveredProject === project.id 
                      ? 'opacity-0 h-80 sm:h-80 md:h-80' 
                      : 'opacity-100 h-40 sm:h-44 md:h-48 lg:h-52'
                  }`}
                  draggable={false}
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 z-20 transition-all duration-300 ${
                  hoveredProject === project.id 
                    ? 'bg-gradient-to-t from-black/90 via-black/20 to-transparent'
                    : 'bg-gradient-to-t from-black/80 via-transparent to-transparent'
                }`}></div>
                
                {/* Share Button */}
                <div className="absolute top-6 right-3 z-20">
                  <button
                    onClick={(e) => handleShare(project, e)}
                    className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                    aria-label="Share project"
                  >
                    <Share className="w-4 h-4" />
                  </button>
                  
                  {/* Share Menu */}
                  {showShareMenu === project.id && (
                    <div className="absolute top-12 right-0 bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-[200px] z-30">
                      <div className="space-y-2">
                        <button
                          onClick={(e) => copyProjectLink(project, e)}
                          className="flex items-center space-x-2 w-full text-left text-white hover:text-red-400 transition-colors"
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
                        
                        <hr className="border-gray-600" />
                        
                        <button
                          onClick={(e) => shareOnSocial('twitter', project, e)}
                          className="flex items-center space-x-2 w-full text-left text-white hover:text-red-400 transition-colors"
                        >
                          <span className="text-sm">Share on Twitter</span>
                        </button>
                        
                        <button
                          onClick={(e) => shareOnSocial('linkedin', project, e)}
                          className="flex items-center space-x-2 w-full text-left text-white hover:text-red-400 transition-colors"
                        >
                          <span className="text-sm">Share on LinkedIn</span>
                        </button>
                        
                        <button
                          onClick={(e) => shareOnSocial('facebook', project, e)}
                          className="flex items-center space-x-2 w-full text-left text-white hover:text-red-400 transition-colors"
                        >
                          <span className="text-sm">Share on Facebook</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                
                {/* Content overlay - adapts to hover state */}
                <div className={`absolute bottom-0 left-0 right-0 p-4 z-30 transition-all duration-300 ${
                  hoveredProject === project.id 
                    ? 'bg-gradient-to-t from-black/90 to-transparent pt-16'
                    : ''
                }`}>
                  <h3 className={`font-bold transition-all duration-300 text-white ${
                    hoveredProject === project.id ? 'text-xl mb-1' : 'text-base mb-1'
                  }`}>
                    {project.title}
                  </h3>
                  
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
                      <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                        {getProjectTitleDescription(project)}
                      </p>
                      
                      {/* Netflix-style Action buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {/* Play Button - Opens Project Modal */}
                          <button 
                            className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onProjectClick(project.id);
                            }}
                            title="View project details"
                          >
                            <Play className="w-4 h-4 fill-current" />
                          </button>
                          
                          {/* Add Button - Dummy for now */}
                          <button 
                            className="border-2 border-gray-400 text-white p-2 rounded-full hover:border-white hover:bg-white/10 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            title="Add to list"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          
                          {/* Like Button - Dummy for now */}
                          <button 
                            className="border-2 border-gray-400 text-white p-2 rounded-full hover:border-white hover:bg-white/10 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            title="Like"
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          

                        </div>
                        
                        {/* Downward Arrow - Opens Card Details */}
                        <button 
                          className="border-2 border-gray-400 text-white p-2 rounded-full hover:border-white hover:bg-white/10 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onProjectClick(project.id);
                          }}
                          title="More info"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
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