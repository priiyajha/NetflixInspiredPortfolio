import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { X, Play, Plus, Volume2, VolumeX, ThumbsUp, ChevronLeft, ChevronRight, Share, Copy, Check } from "lucide-react";

interface NetflixModalProps {
  projectId: string | null;
  onClose: () => void;
  onProjectSwitch?: (projectId: string) => void;
}

export default function NetflixModal({ projectId, onClose, onProjectSwitch }: NetflixModalProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedProject, setCopiedProject] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [cacheBreaker, setCacheBreaker] = useState(Date.now() + 99999);
  const imageScrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // Reset image index and selected image when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setSelectedImage(null);
    setModalKey(prev => prev + 1); // Force thumbnail refresh
    setCacheBreaker(Date.now()); // Force cache refresh
  }, [projectId]);

  const { data: featuredProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects/featured"],
  });

  // Static thumbnail mapping for "More Like This" section
  const getThumbnailPath = (projectId: string, title: string): string => {
    const thumbnailMap: Record<string, string> = {
      "1": "/attached_assets/Cazpro 2_1755112735827.jpeg", // Cazpro
      "2": "/attached_assets/MMM_1755110463225.jpeg", // Millionth Mile Marketing
      "3": "/attached_assets/dp_1755111654957.jpeg", // DigiPe
      "4": "/attached_assets/Inventrax_1754916342697.jpeg", // Inventrax
      "8": "/attached_assets/FD_1754915223801.jpeg", // FDX Sports
      "11": "/attached_assets/Zo-Labs_1754915521507.jpeg", // Zo Labs
      "12": "/attached_assets/Codiste_1755112942332.jpeg", // Codiste
      "13": "/attached_assets/Zentrades_1755107805039.jpeg", // Zentrades
      "15": "/attached_assets/Inboxbites_1755104402481.png", // InboxBites
      "16": "/attached_assets/Solgames_1755105321545.jpeg", // Solgames
      "17": "/attached_assets/MW_1755105374146.jpeg", // Martian Wallet
      "18": "/attached_assets/GEOptimer_1754915993193.jpeg", // GEOptimer
      "19": "/attached_assets/GOA_1755107653390.jpeg", // Growth Opportunity Agent
      "20": "/attached_assets/ra (1)_1755114425581.jpeg", // Reply Agent (Auto-Commenter)
      "21": "/attached_assets/InternalLA_1755108242866.jpeg", // Internal Linking Agent
      "22": "/attached_assets/Ca_1755112260596.jpeg", // Content Automation (Reddit → LinkedIn)
      "23": "/attached_assets/ba (1)_1755114571891.jpeg", // Blog Automation (Perplexity MCP)
      "24": "/attached_assets/LeadGenAg_1754916199494.jpeg", // Lead Generator Agent
      "25": "/attached_assets/Agentsy_1754916226315.jpeg" // AGENTSY
    };
    
    const basePath = thumbnailMap[projectId] || "/default-thumbnail.jpg";
    return basePath + "?cb=" + cacheBreaker;
  };

  // Custom "More Like This" selection - replace specific projects
  const getMoreLikeThisProjects = () => {
    // Define replacement mapping
    const replacements: Record<string, string> = {
      "1": "21", // Cazpro -> Internal Linking Agent
      "3": "24", // DigiPe -> Lead Generator Agent
      "12": "25", // Codiste -> AGENTSY
      "17": "4"  // Martian Wallet -> Inventrax
    };
    
    return featuredProjects
      .map(project => {
        // If this project should be replaced, find the replacement
        if (replacements[project.id]) {
          const replacementProject = featuredProjects.find(p => p.id === replacements[project.id]);
          return replacementProject || project;
        }
        return project;
      })
      .filter(p => p.id !== projectId) // Filter out current project
      .slice(0, 6);
  };
  
  const moreLikeThisProjects = getMoreLikeThisProjects();

  const handleProjectClick = (newProjectId: string) => {
    if (onProjectSwitch) {
      onProjectSwitch(newProjectId);
    }
  };

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showShareMenu && !target.closest('[data-share-menu]')) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showShareMenu]);

  const copyProjectLink = async () => {
    if (!project) return;
    
    const projectUrl = `${window.location.origin}?project=${project.id}`;
    try {
      await navigator.clipboard.writeText(projectUrl);
      setCopiedProject(true);
      setTimeout(() => {
        setCopiedProject(false);
        setShowShareMenu(false);
      }, 2000);
      toast({
        title: "Link copied!",
        description: "Project link has been copied to clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers or failed clipboard access
      try {
        const textArea = document.createElement('textarea');
        textArea.value = projectUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedProject(true);
        setTimeout(() => {
          setCopiedProject(false);
          setShowShareMenu(false);
        }, 2000);
        toast({
          title: "Link copied!",
          description: "Project link has been copied to clipboard.",
        });
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
    }
  };

  const shareOnSocial = (platform: string) => {
    if (!project) return;
    
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
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${projectUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${projectUrl}&text=${text}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        navigator.clipboard.writeText(`${decodeURIComponent(text)} ${decodeURIComponent(projectUrl)}`);
        setCopiedProject(true);
        setTimeout(() => {
          setCopiedProject(false);
          setShowShareMenu(false);
        }, 2000);
        toast({
          title: "Link copied for Instagram!",
          description: "Project link has been copied to clipboard for Instagram sharing.",
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  // Use actual gallery images from project data, fallback to main image if no gallery
  const projectImages = project?.gallery && project.gallery.length > 0 
    ? project.gallery 
    : [project?.image || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"];

  const scrollImages = (direction: 'left' | 'right') => {
    const totalImages = projectImages.length;
    const maxIndex = Math.max(0, totalImages - 2); // Maximum starting index for pairs

    if (direction === 'right') {
      setCurrentImageIndex(prev => Math.min(prev + 2, maxIndex));
    } else {
      setCurrentImageIndex(prev => Math.max(prev - 2, 0));
    }
  };

  if (!projectId) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={`netflix-modal-${projectId}`}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-[#141414] rounded-lg max-w-5xl w-full max-h-[95vh] overflow-y-auto relative mx-2 sm:mx-4"
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
              <div className="video-header-section relative h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden rounded-t-lg">
                {project.video ? (
                  <video
                    src={project.video}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                    onError={(e) => {
                      console.warn('Failed to load project video:', project.video);
                    }}
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.warn('Failed to load project image:', project.image);
                      e.currentTarget.src = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450";
                    }}
                  />
                )}
                
                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white bg-black/70 hover:bg-black/90 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm"
                  >
                    <X className="w-5 h-5" />
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
                  <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-6">
                      {project.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
                      {/* Restart Video Button */}
                      <Button
                        className="bg-white text-black hover:bg-white/90 font-semibold px-3 sm:px-6 py-2 text-sm sm:text-base"
                        onClick={() => {
                          const video = document.querySelector('video');
                          if (video) {
                            video.currentTime = 0;
                            video.play();
                          }
                        }}
                      >
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 fill-current" />
                        <span className="hidden sm:inline">Restart Video</span>
                        <span className="sm:hidden">Play</span>
                      </Button>

                      {/* Add to List Button */}
                      <Button
                        variant="outline"
                        className="border-2 border-white/70 text-white bg-white/10 hover:bg-white/20 font-semibold px-3 sm:px-6 py-2 text-sm sm:text-base"
                      >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Add to List</span>
                        <span className="sm:hidden">List</span>
                      </Button>

                      {/* Like Icon */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 rounded-full border-2 border-white/70"
                      >
                        <ThumbsUp className="w-5 h-5" />
                      </Button>

                      {/* Share Button */}
                      <div className="relative" data-share-menu>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20 rounded-full border-2 border-white/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowShareMenu(!showShareMenu);
                          }}
                        >
                          <Share className="w-5 h-5" />
                        </Button>
                        
                        {/* Share Dropdown Menu */}
                        {showShareMenu && (
                          <motion.div 
                            className="fixed bg-black/95 backdrop-blur-md rounded-lg p-1 w-[120px] xs:w-[130px] sm:w-[140px] md:w-[150px] border border-white/10 shadow-2xl"
                            style={{
                              top: '60px',
                              right: '10px',
                              zIndex: 999999
                            }}
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="space-y-0">
                              <button
                                onClick={copyProjectLink}
                                className="flex items-center space-x-1 w-full text-left text-white hover:text-red-400 transition-colors py-0.5 px-1 rounded hover:bg-white/10"
                              >
                                {copiedProject ? (
                                  <Check className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-green-400" />
                                ) : (
                                  <Copy className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                                )}
                                <span className="text-[8px] xs:text-[9px] sm:text-xs font-medium">
                                  {copiedProject ? 'Copied!' : 'Copy Link'}
                                </span>
                              </button>
                              
                              <hr className="border-gray-600 my-0" />
                              
                              <button
                                onClick={() => shareOnSocial('linkedin')}
                                className="flex items-center space-x-1 w-full text-left text-white hover:text-blue-400 transition-colors py-0.5 px-1 rounded hover:bg-white/10"
                              >
                                <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 bg-blue-600 rounded-sm flex items-center justify-center">
                                  <span className="text-white text-[6px] xs:text-[7px] sm:text-[8px] font-bold">in</span>
                                </div>
                                <span className="text-[8px] xs:text-[9px] sm:text-xs font-medium">LinkedIn</span>
                              </button>
                              
                              <button
                                onClick={() => shareOnSocial('twitter')}
                                className="flex items-center space-x-1 w-full text-left text-white hover:text-blue-400 transition-colors py-0.5 px-1 rounded hover:bg-white/10"
                              >
                                <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 bg-black rounded-sm flex items-center justify-center border border-white">
                                  <span className="text-white text-[6px] xs:text-[7px] sm:text-[8px] font-bold">𝕏</span>
                                </div>
                                <span className="text-[8px] xs:text-[9px] sm:text-xs font-medium">Twitter</span>
                              </button>
                              
                              <button
                                onClick={() => shareOnSocial('whatsapp')}
                                className="flex items-center space-x-1 w-full text-left text-white hover:text-green-400 transition-colors py-0.5 px-1 rounded hover:bg-white/10"
                              >
                                <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 bg-green-500 rounded-sm flex items-center justify-center">
                                  <span className="text-white text-[6px] xs:text-[7px] sm:text-[8px] font-bold">W</span>
                                </div>
                                <span className="text-[8px] xs:text-[9px] sm:text-xs font-medium">WhatsApp</span>
                              </button>
                              
                              <button
                                onClick={() => shareOnSocial('telegram')}
                                className="flex items-center space-x-1 w-full text-left text-white hover:text-blue-400 transition-colors py-0.5 px-1 rounded hover:bg-white/10"
                              >
                                <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-[6px] xs:text-[7px] sm:text-[8px] font-bold">T</span>
                                </div>
                                <span className="text-[8px] xs:text-[9px] sm:text-xs font-medium">Telegram</span>
                              </button>
                              
                              <button
                                onClick={() => shareOnSocial('instagram')}
                                className="flex items-center space-x-1 w-full text-left text-white hover:text-pink-400 transition-colors py-0.5 px-1 rounded hover:bg-white/10"
                              >
                                <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-sm flex items-center justify-center">
                                  <span className="text-white text-[6px] xs:text-[7px] sm:text-[8px] font-bold">IG</span>
                                </div>
                                <span className="text-[8px] xs:text-[9px] sm:text-xs font-medium">Instagram</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 bg-[#141414]">
                {/* Container with max width and centering */}
                <div className="w-full max-w-[1280px] mx-auto">
                  {/* Two Column Layout with Blue Neon Line Separator */}
                  <div className="flex flex-col lg:flex-row">
                    {/* Left Column - All Content (2/3 width) */}
                    <div className="w-full lg:w-2/3 pr-0 lg:pr-6 flex flex-col">
                      {/* Status Tags */}
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-green-400 font-medium text-sm">
                          {project.status === "live" ? "Live in production" : 
                           project.status === "completed" ? "Successfully Exited" : "In Development"}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {project.title === "Cazpro" 
                            ? "2014-2015" 
                            : project.title === "Millionth Mile Marketing"
                            ? "2017-2019"
                            : project.title === "DigiPay"
                            ? "2019-2021"
                            : project.title === "Inventrax"
                            ? "2022"
                            : project.title === "FDX Sports"
                            ? "2023"
                            : project.title === "Codiste"
                            ? "2024"
                            : project.title === "ZO Labs"
                            ? "2024-2025"
                            : project.title === "Zentrades"
                            ? "2023"
                            : project.title === "InboxBites"
                            ? "2024"
                            : project.title === "Solgames"
                            ? "2022-2023"
                            : project.title === "Martian Wallet"
                            ? "2023-2024"
                            : "2025"}
                        </span>
                        <span className="px-3 py-1 rounded-full border border-white text-white text-sm">
                          {project.title === "Cazpro" 
                            ? "D2C Business"
                            : project.title === "Millionth Mile Marketing" 
                            ? "Growth Agency"
                            : project.title === "DigiPay"
                            ? "Fintech Startup"
                            : project.title === "Inventrax"
                            ? "SEO Platform"
                            : project.title === "FDX Sports"
                            ? "E-commerce Brand"
                            : project.title === "Codiste"
                            ? "Marketing Agency"
                            : project.title === "ZO Labs"
                            ? "AI Startup"
                            : project.title === "Zentrades"
                            ? "B2B Marketing"
                            : project.title === "InboxBites"
                            ? "MicroSaaS/AI"
                            : project.title === "Solgames"
                            ? "GameFi/Web3"
                            : project.title === "Martian Wallet"
                            ? "Web3/DApp"
                            : project.title === "GEOptimer"
                            ? "AI SEO/SaaS"
                            : "Web Application"}
                        </span>
                      </div>

                      {/* Main Title */}
                      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 leading-tight">
                        {project.title === "Cazpro" 
                          ? "Built and scaled a leading college merch brand from zero to 2.5M INR in 15 months."
                          : project.title === "Millionth Mile Marketing"
                          ? "Co-founded a top 5 Andhra Pradesh growth agency with 40+ global clients and $180K revenue in 2 years."
                          : project.title === "DigiPay"
                          ? "Scaled from first marketing hire to $80M revenue and 28-person team in 19 months."
                          : project.title === "Inventrax"
                          ? "Drove 600% organic traffic growth for warehouse automation SaaS in 4 months through strategic SEO."
                          : project.title === "FDX Sports"
                          ? "Turbocharged FDX into million-dollar D2C brand, scaling from $10K to $120K/month in 6 months."
                          : project.title === "Codiste"
                          ? "Fractional CMO who 4x'd marketing output and 2.5x'd sales response rates through team building and automation."
                          : project.title === "ZO Labs"
                          ? "Head of Growth who scaled ZO Labs from stealth to 180K installs and built 100K+ community with 10K+ AI agents."
                          : project.title === "Zentrades"
                          ? "Dropped into Zentrades as a marketing consultant, rewired their inbound engine, and took MQLs from single digits to 60 a month in 4 months."
                          : project.title === "InboxBites"
                          ? "Solo-built InboxBites, a microSaaS AI agent for Gmail, transforming newsletter chaos into snackable, swipeable, 50-word knowledge bites."
                          : project.title === "Solgames"
                          ? "Co-built Solgames, a GameFi dev toolkit, into a Solana hackathon winner and landed $150K in seed with 3K-strong dev/gamer community."
                          : project.title === "Martian Wallet"
                          ? "Headed marketing at Martian Wallet, scaling installs by 50%, landing 400K+ new users, and doubling DApp transaction volumes from $1.2B to $2B."
                          : project.title === "GEOptimer"
                          ? "Built AI-powered micro-SaaS for generative engine SEO with live MVP."
                          : project.title === "Growth Opportunity Agent"
                          ? "AI-powered growth agent identifying untapped opportunities with precision analytics."
                          : project.title === "Internal Linking Agent"
                          ? "Launching a plug-and-play internal linking agent for founders strapped on SEO budgets."
                          : project.title === "Content Automation (Reddit → LinkedIn)"
                          ? "Automated my LinkedIn content pipeline by scraping Reddit for trending AI/agent pain points."
                          : project.title === "Blog Automation (Perplexity MCP)"
                          ? "Built a flow to auto-repurpose trending articles via Perplexity MCP and RSS."
                          : project.title === "Lead Generator Agent (LinkedIn, Twitter, Reddit)"
                          ? "Created an agent to scrape, filter, and funnel target profiles talking about specific pain points."
                          : project.title === "AGENTSY"
                          ? "Sold over $2M in digital products via AGENTSY—performance marketing funnels at scale."
                          : project.title === "Reply Agent (Auto-Commenter)"
                          ? "Engineering a Reply Agent that auto-generates and posts targeted replies across LinkedIn, Twitter, and Reddit."
                          : "Complex processes now run seamlessly."
                        }
                      </h2>

                      {/* Detailed Description */}
                      <p className="text-gray-300 text-base leading-relaxed">
                        {project.title === "Cazpro" 
                          ? "Built and scaled Cazpro, a D2C college merch brand, from a dorm room idea at 17 to a 2.5M INR sales machine in 15 months. Survived near shutdowns, sold to a local industrialist, and handled everything from code to partnerships. Hustled hard, shipped harder."
                          : project.title === "Millionth Mile Marketing"
                          ? "Co-founded a growth agency that became an Andhra Pradesh top 5, racking up 40+ global clients, 2 years, $180K revenue, and 25 teammates. Built teams, scaled campaigns, won awards, and hustled for brands from Vizag to Europe. Brought a bold attitude to every pitch."
                          : project.title === "DigiPay"
                          ? "Joined as first marketing hire, scaled the team to 28, and helped take revenue from $4M to $80M in 19 months. Drove growth with everything from guerrilla tactics to field ops. Orchestrated viral B2B installs and led the brand through major funding rounds."
                          : project.title === "Inventrax"
                          ? "Drove a 600% organic traffic jump for a warehouse automation SaaS in 4 months as a marketing consultant. Cracked the top 2 spots for three high-value keywords and turned traffic into leads with CRO and smart automation. Growth hacking, done right."
                          : project.title === "FDX Sports"
                          ? "Turbocharged FDX into a million-dollar D2C brand in Europe. Drove sales from $10K to $120K/month in 6 months, spent half a million on ads, reworked CRO and email automation, and 2.5x'd average cart value. Did not just play the game, rewrote the playbook."
                          : project.title === "Codiste"
                          ? "Fractional CMO who built, trained, and turbocharged the marketing and outbound sales teams. 4x'd marketing output, 2.5x'd sales response rates, and baked AI and programmatic SEO into their DNA. Set up every process from social to cold DMs, always optimizing for impact."
                          : project.title === "ZO Labs"
                          ? "As Head of Growth, took ZO Labs from stealth to 180K installs, built a 100K+ community, and shipped 10,000+ AI agent landing pages. Ran AI-led marketing sprints, bagged 120+ partnerships, and put ZO on the global stage. All hustle, zero fluff."
                          : project.title === "Zentrades"
                          ? "Dropped into Zentrades as a marketing consultant, rewired their inbound engine, and took MQLs from single digits to 60 a month in 4 months. Engineered a 125% traffic spike, built 5000+ SEO-rich landing pages, and turned a good CRM into a qualified lead machine."
                          : project.title === "InboxBites"
                          ? "Solo-built InboxBites, a microSaaS AI agent for Gmail, transforming newsletter chaos into snackable, swipeable, 50-word knowledge bites. Architected 60%+ of the code, GTM, UI/UX, and product strategy in 6 weeks. Already has 200+ waitlisters—built for hustlers who hate inbox overload."
                          : project.title === "Solgames"
                          ? "Co-built Solgames, a GameFi dev toolkit, into a Solana hackathon winner and landed $150K in seed. Rallied a 3K-strong dev/gamer community, ran hackathons with 1K+ participants, and delivered a live MVP in 3 months. Paused by market chaos, but left a mark."
                          : project.title === "Martian Wallet"
                          ? "Headed marketing at Martian Wallet, scaling installs by 50%, landing 400K+ new users, and doubling DApp transaction volumes from $1.2B to $2B. Launched a DApp that hit $1M daily volume in a month, forged 50+ partnerships, and kept the Web3 world buzzing."
                          : project.title === "GEOptimer"
                          ? "Founder and builder of GEOptimer, a micro-SaaS that scores and audits website content for LLM/AI engine visibility—think SEO for AI, not just search. Enter a URL, get a GEO Score, action-packed report, and clear next steps in seconds. Built for growth-obsessed marketers."
                          : project.description
                        }
                      </p>

                      {/* Project Gallery Section - Only show if gallery has images */}
                      {projectImages && projectImages.length > 0 && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold text-white mb-4">Project Gallery</h3>
                          <div className="relative">
                            {/* Left Arrow - Only show if there are more than 2 images and we can scroll left */}
                            {projectImages.length > 2 && currentImageIndex > 0 && (
                              <button
                                onClick={() => scrollImages('left')}
                                className="absolute top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm shadow-lg"
                                aria-label="Scroll left"
                                style={{ left: '8px' }}
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                            )}

                            {/* Right Arrow - Only show if there are more than 2 images and we can scroll right */}  
                            {projectImages.length > 2 && currentImageIndex < projectImages.length - 2 && (
                              <button
                                onClick={() => scrollImages('right')}
                                className="absolute top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm shadow-lg"
                                aria-label="Scroll right"
                                style={{ right: '8px' }}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            )}

                            {/* Images Container - Show up to 2 images */}
                            <div
                              ref={imageScrollRef}
                              className="flex gap-3 pr-12"
                            >
                              {projectImages.slice(currentImageIndex, currentImageIndex + 2).map((image, index) => {
                                const isSingleVisibleImage = projectImages.slice(currentImageIndex, currentImageIndex + 2).length === 1;
                                
                                return (
                                  <div 
                                    key={currentImageIndex + index} 
                                    className="flex-shrink-0" 
                                    style={{ 
                                      width: isSingleVisibleImage ? '100%' : 'calc(50% - 6px)' 
                                    }}
                                  >
                                    <div className="w-full aspect-[16/9] overflow-hidden rounded-md">
                                      <img
                                        src={image}
                                        alt={`${project?.title} gallery image ${currentImageIndex + index + 1}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                                        draggable={false}
                                        onClick={() => setSelectedImage(image)}
                                        onError={(e) => {
                                          console.warn('Failed to load gallery image:', image);
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Vertical Navy Blue Separator */}
                    <div className="hidden lg:block w-px bg-navy-700 mx-6 opacity-50" style={{backgroundColor: '#1e3a8a'}}></div>

                    {/* Right Column - Project Details (1/3 width) */}
                    <div className="w-full lg:w-1/3 pl-0 lg:pl-0 mt-8 lg:mt-0 space-y-6">
                      {/* Tech Stack - Using dynamic project data */}
                      {project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0 && (
                        <div>
                          <h4 className="font-medium text-white mb-3">Tech Stack:</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                              <span 
                                key={tech}
                                className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}


                      {/* Skills - Using dynamic project data */}
                      {project.skills && Array.isArray(project.skills) && project.skills.length > 0 && (
                        <div>
                          <h4 className="font-medium text-white mb-2">Skills:</h4>
                          <p className="text-gray-400">
                            {project.skills.join(", ")}
                          </p>
                        </div>
                      )}

                      {/* Goal - Using dynamic project data */}
                      {project.goal && (
                        <div>
                          <h4 className="font-medium text-white mb-2">Goal:</h4>
                          <p className="text-gray-400">
                            {project.goal}
                          </p>
                        </div>
                      )}





                      {/* KPIs - Using dynamic project data */}
                      {project.kpis && Array.isArray(project.kpis) && project.kpis.length > 0 && (
                        <div>
                          <h4 className="font-medium text-white mb-2">KPIs:</h4>
                          <p className="text-gray-400">
                            {project.kpis.join(", ")}
                          </p>
                        </div>
                      )}

                      {/* Results - Using dynamic project data */}
                      {project.results && (
                        <div>
                          <h4 className="font-medium text-white mb-2">Results:</h4>
                          <p className="text-gray-400">
                            {project.results}
                          </p>
                        </div>
                      )}

                      {/* Engagement Type - Using dynamic project data */}
                      {project.engagementType && (
                        <div>
                          <h4 className="font-medium text-white mb-2">Engagement Type:</h4>
                          <p className="text-gray-400">
                            {project.engagementType}
                          </p>
                        </div>
                      )}

                      {/* Period - Using dynamic project data */}
                      {project.period && (
                        <div>
                          <h4 className="font-medium text-white mb-2">Period:</h4>
                          <p className="text-gray-400">
                            {project.period}
                          </p>
                        </div>
                      )}




                    </div>
                  </div>

                  {/* More Like This Section */}
                  <div className="mt-12">
                    <h3 className="text-white text-xl font-semibold mb-6">
                      More Like This
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {moreLikeThisProjects.map((similarProject) => (
                        <div
                          key={`${similarProject.id}-${modalKey}`}
                          className="bg-[#2F2F2F] rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 group relative"
                          onClick={() => {
                            // First scroll to the video section to highlight the background video
                            const videoSection = document.querySelector('.video-header-section');
                            if (videoSection) {
                              videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                            // Then switch to the new project after a brief delay
                            setTimeout(() => {
                              handleProjectClick(similarProject.id);
                            }, 500);
                          }}
                        >
                          {/* Video hover preview */}
                          {similarProject.video && (
                            <video
                              src={similarProject.video}
                              className="absolute inset-0 w-full h-32 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="none"

                              style={{
                                aspectRatio: '16/9',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                console.warn('Failed to load similar project video:', similarProject.video);
                              }}
                            />
                          )}
                          <img
                            src={getThumbnailPath(similarProject.id, similarProject.title)}
                            alt={similarProject.title}
                            loading="lazy"
                            decoding="async"
                            fetchPriority="low"
                            className="w-full h-32 object-cover group-hover:opacity-0 transition-opacity duration-300"
                            style={{
                              aspectRatio: '16/9',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              console.warn('Failed to load similar project thumbnail:', getThumbnailPath(similarProject.id, similarProject.title));
                              e.currentTarget.src = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450";
                            }}
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
                              <span>{similarProject.period || "2025"}</span>
                              <span className="border border-gray-400 px-1 rounded text-xs">
                                {similarProject.engagementType || "Professional"}
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
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-white">Project not found</div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          key="image-modal-backdrop"
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[60] flex items-center justify-center p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            key="image-modal-content"
            className="relative flex items-center justify-center"
            style={{
              maxWidth: 'calc(100vw - 80px)',
              maxHeight: 'calc(100vh - 120px)',
              width: 'fit-content',
              height: 'fit-content'
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
              aria-label="Close image"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Full Size Image */}
            <img
              src={selectedImage}
              alt="Project screenshot"
              className="block rounded-lg shadow-2xl"
              style={{ 
                maxWidth: 'calc(100vw - 80px)',
                maxHeight: 'calc(100vh - 120px)',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
              draggable={false}
              onLoad={(e) => {
                // Ensure image maintains aspect ratio and fits viewport
                const img = e.target as HTMLImageElement;
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                const maxWidth = window.innerWidth - 80;
                const maxHeight = window.innerHeight - 120;
                
                if (aspectRatio > maxWidth / maxHeight) {
                  // Image is wider - constrain by width
                  img.style.width = `${Math.min(maxWidth, img.naturalWidth)}px`;
                  img.style.height = 'auto';
                } else {
                  // Image is taller - constrain by height
                  img.style.height = `${Math.min(maxHeight, img.naturalHeight)}px`;
                  img.style.width = 'auto';
                }
              }}
              onError={(e) => {
                console.warn('Failed to load selected image:', selectedImage);
                setSelectedImage(null);
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}