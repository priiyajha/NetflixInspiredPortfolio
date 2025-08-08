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
  }, [projectId]);

  const { data: featuredProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects/featured"],
  });

  // Filter out current project from "More Like This" and limit to 6
  const moreLikeThisProjects = featuredProjects
    .filter(p => p.id !== projectId)
    .slice(0, 6);

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
                            className="absolute bottom-16 bg-black backdrop-blur-md rounded-lg p-2 w-[180px] sm:w-[200px] z-[9999] border border-white/30 shadow-2xl"
                            style={{
                              left: window.innerWidth < 640 ? '-60px' : '-20px'
                            }}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="space-y-1">
                              <button
                                onClick={copyProjectLink}
                                className="flex items-center space-x-2 w-full text-left text-white hover:text-red-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                              >
                                {copiedProject ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                                <span className="text-xs sm:text-sm">
                                  {copiedProject ? 'Link Copied!' : 'Copy Link'}
                                </span>
                              </button>
                              
                              <hr className="border-gray-600 my-1.5" />
                              
                              <button
                                onClick={() => shareOnSocial('linkedin')}
                                className="flex items-center space-x-2 w-full text-left text-white hover:text-blue-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                              >
                                <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">in</span>
                                </div>
                                <span className="text-xs sm:text-sm">LinkedIn</span>
                              </button>
                              
                              <button
                                onClick={() => shareOnSocial('twitter')}
                                className="flex items-center space-x-2 w-full text-left text-white hover:text-blue-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                              >
                                <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center border border-white">
                                  <span className="text-white text-xs font-bold">𝕏</span>
                                </div>
                                <span className="text-xs sm:text-sm">Twitter</span>
                              </button>
                              
                              <button
                                onClick={() => shareOnSocial('whatsapp')}
                                className="flex items-center space-x-2 w-full text-left text-white hover:text-green-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                              >
                                <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">W</span>
                                </div>
                                <span className="text-xs sm:text-sm">WhatsApp</span>
                              </button>
                              
                              <button
                                onClick={() => shareOnSocial('telegram')}
                                className="flex items-center space-x-2 w-full text-left text-white hover:text-blue-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                              >
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">T</span>
                                </div>
                                <span className="text-xs sm:text-sm">Telegram</span>
                              </button>
                              
                              <button
                                onClick={() => shareOnSocial('instagram')}
                                className="flex items-center space-x-2 w-full text-left text-white hover:text-pink-400 transition-colors py-2 px-2 rounded hover:bg-white/10"
                              >
                                <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-sm flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">IG</span>
                                </div>
                                <span className="text-xs sm:text-sm">Instagram</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Copy Success Popup for "Copy Link" option */}
                        {copiedProject && (
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-full z-[10000] whitespace-nowrap">
                            Link Copied!
                          </div>
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
                          : project.title === "Blog Automation (Purple City MCP)"
                          ? "Built a flow to auto-repurpose trending articles via Purple City MCP and RSS."
                          : project.title === "Lead Generator Agent (LinkedIn, Twitter, Reddit)"
                          ? "Created an agent to scrape, filter, and funnel target profiles talking about specific pain points."
                          : project.title === "AGENTSY"
                          ? "Sold over $2M in digital products via AGENTSY—performance marketing funnels at scale."
                          : project.title === "Reply Agent (Auto-Commenter)"
                          ? "Complex processes now run seamlessly."
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
                      {/* Tech Stacks - For Cazpro, Millionth Mile Marketing, DigiPay, Inventrax, FDX Sports, Codiste, ZO Labs, Zentrades, InboxBites, Solgames, Martian Wallet, GEOptimer, Growth Opportunity Agent, Reply Agent, Internal Linking Agent, Content Automation, Blog Automation, Lead Generator Agent, and AGENTSY */}
                      {(project.title === "Cazpro" || project.title === "Millionth Mile Marketing" || project.title === "DigiPay" || project.title === "Inventrax" || project.title === "FDX Sports" || project.title === "Codiste" || project.title === "ZO Labs" || project.title === "Zentrades" || project.title === "InboxBites" || project.title === "Solgames" || project.title === "Martian Wallet" || project.title === "GEOptimer" || project.title === "Growth Opportunity Agent" || project.title === "Reply Agent (Auto-Commenter)" || project.title === "Internal Linking Agent" || project.title === "Content Automation (Reddit → LinkedIn)" || project.title === "Blog Automation (Purple City MCP)" || project.title === "Lead Generator Agent (LinkedIn, Twitter, Reddit)" || project.title === "AGENTSY") && (
                        <div>
                          <h4 className="font-medium text-white mb-3">
                            {project.title === "Cazpro" ? "Tech Stacks:" : "Tech Stack:"}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {project.title === "Cazpro" ? (
                              ["Shopify", "PHP", "HTML", "SEMrush", "Google Ads", "Meta Ads", "Klaviyo", "MailChimp"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "Millionth Mile Marketing" ? (
                              ["Google Ads", "Meta Ads", "SEMrush", "Ahrefs", "Mailchimp", "HubSpot", "WordPress"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "DigiPay" ? (
                              ["CleverTap", "AppsFlyer", "Amplitude", "Google Firebase", "Google Analytics", "SEMrush", "Branch.io"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "Inventrax" ? (
                              ["SEMrush", "Backlinko.io", "Ahrefs", "Google Analytics", "Google Search Console"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "FDX Sports" ? (
                              ["Shopify", "Google Ads", "Meta Ads", "Klaviyo", "SMSBump"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "Codiste" ? (
                              ["Apollo", "LeadDino", "Phantom Buster", "Ahrefs", "Google Analytics", "Notion"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "ZO Labs" ? (
                              ["HubSpot", "ActiveCampaign", "Firebase Studio", "AppsFlyer", "AppRadar", "WebEngage", "Discord", "Twitter", "Telegram", "Instagram"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "Zentrades" ? (
                              ["Programmatic SEO", "Google Analytics", "CRM", "Marketing Attribution"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "InboxBites" ? (
                              ["Repl.it Cloud Code", "Gmail API", "PWA", "JavaScript"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "Solgames" ? (
                              ["Solana", "Web3 Tools", "Discord", "Telegram"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "GEOptimer" ? (
                              ["Replit", "Supabase", "Node.js", "Cursor", "Cloud Code", "custom scripts"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "Growth Opportunity Agent" ? (
                              ["Replit", "Node.js", "Cloud Code", "Cursor", "custom logic"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "Reply Agent (Auto-Commenter)" ? (
                              ["Replit", "Cursor", "Cloud Code", "custom scripts"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "Internal Linking Agent" ? (
                              ["Replicate", "Node.js", "React.js", "Cloud Code", "custom logic"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "Content Automation (Reddit → LinkedIn)" ? (
                              ["N8n", "RapidAPI", "CMS", "Reddit API", "LinkedIn API"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "Blog Automation (Purple City MCP)" ? (
                              ["n8n", "Purple City MCP", "RSS feeds", "CMS"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "Lead Generator Agent (LinkedIn, Twitter, Reddit)" ? (
                              ["N8n", "platform APIs", "dashboard (custom)"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : project.title === "AGENTSY" ? (
                              ["ClickFunnels", "Hotcart", "Shopify", "WordPress", "Facebook Ads", "Google Ads", "GTM"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : (
                              ["Aptos/Sui Ecosystem", "DApp Platform", "Chrome Extension", "Discord", "Google Analytics"].map((tech) => (
                                <span 
                                  key={tech}
                                  className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                >
                                  {tech}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      {/* Skills - For all projects with custom structure */}
                      {(project.title === "Cazpro" || project.title === "Millionth Mile Marketing" || project.title === "DigiPay" || project.title === "Inventrax" || project.title === "FDX Sports" || project.title === "Codiste" || project.title === "ZO Labs" || project.title === "Zentrades" || project.title === "InboxBites" || project.title === "Solgames" || project.title === "Martian Wallet" || project.title === "GEOptimer" || project.title === "Growth Opportunity Agent" || project.title === "Reply Agent (Auto-Commenter)" || project.title === "Internal Linking Agent" || project.title === "Content Automation (Reddit → LinkedIn)" || project.title === "Blog Automation (Purple City MCP)" || project.title === "Lead Generator Agent (LinkedIn, Twitter, Reddit)" || project.title === "AGENTSY") && (
                        <div>
                          <h4 className="font-medium text-white mb-2">Skills:</h4>
                          <p className="text-gray-400">
                            {project.title === "Cazpro"
                              ? "D2C marketing, social media, performance marketing, B2C, SEO, email marketing, analytics"
                              : project.title === "Millionth Mile Marketing"
                              ? "Growth marketing, B2B sales, team building, media buying, analytics, design thinking"
                              : project.title === "DigiPay"
                              ? "B2B marketing, field ops, performance marketing, attribution, mobile marketing, onboarding, analytics"
                              : project.title === "Inventrax"
                              ? "Programmatic SEO, CRO, lead magnets, email automation, blog marketing"
                              : project.title === "FDX Sports"
                              ? "Performance marketing, CRO, funnel building, D2C marketing, UGC, email/SMS automation"
                              : project.title === "Codiste"
                              ? "Social, organic, B2B, programmatic SEO, copywriting, analytics, process optimization"
                              : project.title === "ZO Labs"
                              ? "Growth marketing, product management, AI automation, community building, partnerships"
                              : project.title === "Zentrades"
                              ? "Technical SEO, inbound marketing, funnel building, marketing analytics, team leadership"
                              : project.title === "InboxBites"
                              ? "Product management, coding, AI/ML logic, UI/UX, GTM, content processing"
                              : project.title === "Solgames"
                              ? "Growth marketing, community building, Web3 strategy, hackathon ops, program management"
                              : project.title === "GEOptimer"
                              ? "AI SEO, product management, SaaS engineering, growth analytics, reporting"
                              : project.title === "Growth Opportunity Agent"
                              ? "Growth analysis, automation, product design, digital strategy"
                              : project.title === "Reply Agent (Auto-Commenter)"
                              ? "Automation, headless browser ops, prompt engineering, multi-channel growth"
                              : project.title === "Internal Linking Agent"
                              ? "SEO automation, React development, SaaS engineering, content strategy"
                              : project.title === "Content Automation (Reddit → LinkedIn)"
                              ? "Automation, scraping, prompt engineering, workflow design"
                              : project.title === "Blog Automation (Purple City MCP)"
                              ? "Content automation, API integration, workflow building"
                              : project.title === "Lead Generator Agent (LinkedIn, Twitter, Reddit)"
                              ? "Lead scraping, automation, enrichment, workflow engineering"
                              : project.title === "AGENTSY"
                              ? "Performance marketing, funnel building, digital sales, analytics"
                              : "Web3 marketing, community ops, DApp growth, partnerships, content, BD"
                            }
                          </p>
                        </div>
                      )}

                      {/* Goal - For all projects with custom structure */}
                      {(project.title === "Cazpro" || project.title === "Millionth Mile Marketing" || project.title === "DigiPay" || project.title === "Inventrax" || project.title === "FDX Sports" || project.title === "Codiste" || project.title === "ZO Labs" || project.title === "Zentrades" || project.title === "InboxBites" || project.title === "Solgames" || project.title === "Martian Wallet" || project.title === "GEOptimer" || project.title === "Growth Opportunity Agent" || project.title === "Reply Agent (Auto-Commenter)" || project.title === "Internal Linking Agent" || project.title === "Content Automation (Reddit → LinkedIn)" || project.title === "Blog Automation (Purple City MCP)" || project.title === "Lead Generator Agent (LinkedIn, Twitter, Reddit)" || project.title === "AGENTSY") && (
                        <div>
                          <h4 className="font-medium text-white mb-2">Goal:</h4>
                          <p className="text-gray-400">
                            {project.title === "Cazpro"
                              ? "Build and scale a leading college-focused merch brand, drive high-velocity sales, achieve profitable exit"
                              : project.title === "Millionth Mile Marketing"
                              ? "Land marquee clients, drive high revenue growth, build a leading regional agency"
                              : project.title === "DigiPay"
                              ? "Drive B2B installs, scale revenue, build top-tier marketing org"
                              : project.title === "Inventrax"
                              ? "Boost organic traffic, rank for Northstar keywords, generate high-quality B2B leads"
                              : project.title === "FDX Sports"
                              ? "10x sales, optimize for scale, automate funnel, drive international growth"
                              : project.title === "Codiste"
                              ? "Build a high-output marketing org, automate lead gen, optimize funnel"
                              : project.title === "ZO Labs"
                              ? "Scale installs, community, and organic traffic, land strategic partnerships"
                              : project.title === "Zentrades" 
                              ? "Scale high-quality B2B leads, boost organic traffic, optimize funnel stages"
                              : project.title === "InboxBites"
                              ? "Turn newsletters into actionable micro-insights, deliver value via PWA"
                              : project.title === "Solgames"
                              ? "Enable Web2-to-Web3 game transition, build dev/gamer ecosystem, MVP + community"
                              : project.title === "Martian Wallet"
                              ? "Grow user base, launch DApp, increase transaction volume, build global partnerships"
                              : project.title === "GEOptimer"
                              ? "Optimize websites for generative engine visibility and citations"
                              : project.title === "Growth Opportunity Agent"
                              ? "Unlock growth channels for startups instantly"
                              : project.title === "Reply Agent (Auto-Commenter)"
                              ? "Automate replies for inbound, outreach, and community engagement at scale"
                              : project.title === "Internal Linking Agent"
                              ? "Drive internal linking + AI visibility for resource-constrained sites"
                              : project.title === "Content Automation (Reddit → LinkedIn)"
                              ? "Turn Reddit trends into LinkedIn-ready content, automate ideation"
                              : project.title === "Blog Automation (Purple City MCP)"
                              ? "Automate discovery and repurposing of trending content for blogs"
                              : project.title === "Lead Generator Agent (LinkedIn, Twitter, Reddit)"
                              ? "Automate discovery + outreach for B2B leads"
                              : project.title === "AGENTSY"
                              ? "Scale digital product sales via paid channels"
                              : "Grow user base, launch DApp, increase transaction volume, build global partnerships"
                            }
                          </p>
                        </div>
                      )}

                      {/* Director - For non-custom structured projects */}
                      {(project.title !== "Cazpro" && project.title !== "Millionth Mile Marketing" && project.title !== "DigiPay" && project.title !== "Inventrax" && project.title !== "FDX Sports" && project.title !== "Codiste" && project.title !== "ZO Labs" && project.title !== "Zentrades" && project.title !== "InboxBites" && project.title !== "Solgames" && project.title !== "Martian Wallet" && project.title !== "GEOptimer" && project.title !== "Growth Opportunity Agent" && project.title !== "Reply Agent (Auto-Commenter)" && project.title !== "Internal Linking Agent" && project.title !== "Content Automation (Reddit → LinkedIn)" && project.title !== "Blog Automation (Purple City MCP)" && project.title !== "Lead Generator Agent (LinkedIn, Twitter, Reddit)" && project.title !== "AGENTSY") && (
                        <div>
                          <h4 className="font-medium text-white mb-2">Director:</h4>
                          <p className="text-gray-400">Farooq Chisty</p>
                        </div>
                      )}

                      {/* Cast - For non-custom structured projects */}
                      {(project.title !== "Cazpro" && project.title !== "Millionth Mile Marketing" && project.title !== "DigiPay" && project.title !== "Inventrax" && project.title !== "FDX Sports" && project.title !== "Codiste" && project.title !== "ZO Labs" && project.title !== "Zentrades" && project.title !== "InboxBites" && project.title !== "Solgames" && project.title !== "Martian Wallet" && project.title !== "GEOptimer" && project.title !== "Growth Opportunity Agent" && project.title !== "Reply Agent (Auto-Commenter)" && project.title !== "Internal Linking Agent" && project.title !== "Content Automation (Reddit → LinkedIn)" && project.title !== "Blog Automation (Purple City MCP)" && project.title !== "Lead Generator Agent (LinkedIn, Twitter, Reddit)" && project.title !== "AGENTSY") && (
                        <div>
                          <h4 className="font-medium text-white mb-2">Cast:</h4>
                          <p className="text-gray-400">Solo Builder Team</p>
                        </div>
                      )}



                      {/* KPIs - For custom structured projects */}
                      {(project.title === "Cazpro" || project.title === "Millionth Mile Marketing" || project.title === "DigiPay" || project.title === "Inventrax" || project.title === "FDX Sports" || project.title === "Codiste" || project.title === "ZO Labs" || project.title === "Zentrades" || project.title === "InboxBites" || project.title === "Solgames" || project.title === "Martian Wallet" || project.title === "GEOptimer" || project.title === "Growth Opportunity Agent" || project.title === "Reply Agent (Auto-Commenter)" || project.title === "Internal Linking Agent" || project.title === "Content Automation (Reddit → LinkedIn)" || project.title === "Blog Automation (Purple City MCP)" || project.title === "Lead Generator Agent (LinkedIn, Twitter, Reddit)" || project.title === "AGENTSY") && (
                        <div>
                          <h4 className="font-medium text-white mb-2">KPIs:</h4>
                          <p className="text-gray-400">
                            {project.title === "Cazpro"
                              ? "Monthly sales, order volume, organic growth rate, website traffic, campaign ROI"
                              : project.title === "Millionth Mile Marketing"
                              ? "Client acquisition, revenue, ad spend managed, team size, media features"
                              : project.title === "DigiPay"
                              ? "App downloads, revenue growth, team size, lead volume, merchant activation"
                              : project.title === "Inventrax"
                              ? "Organic traffic growth, keyword ranking, lead volume, conversion rates"
                              : project.title === "FDX Sports"
                              ? "Monthly sales, ROAS, AOV, cart conversion rate, organic growth"
                              : project.title === "Codiste"
                              ? "Team output, sales response rate, lead volume, organic traffic"
                              : project.title === "ZO Labs"
                              ? "App installs, community growth, landing pages shipped, partnerships closed"
                              : project.title === "Zentrades"
                              ? "MQLs/month, traffic growth, MQL-to-demo ratio, landing pages shipped"
                              : project.title === "InboxBites"
                              ? "Waitlist signups, engagement rate, feature completion, MVP timeline"
                              : project.title === "Solgames"
                              ? "Community size, hackathon apps, MVP delivery, funding raised"
                              : project.title === "Martian Wallet"
                              ? "Installs, active users, partnerships, transaction volume, community growth"
                              : project.title === "GEOptimer"
                              ? "GEO Score, report depth, user activation, actionable insights delivered"
                              : project.title === "Growth Opportunity Agent"
                              ? "Growth opps surfaced, activation rate, time-to-value"
                              : project.title === "Reply Agent (Auto-Commenter)"
                              ? "Replies/day, engagement, conversion rate, waitlist signups"
                              : project.title === "Internal Linking Agent"
                              ? "Pages optimized, time-to-optimize, user retention"
                              : project.title === "Content Automation (Reddit → LinkedIn)"
                              ? "Posts generated, engagement rate, review-to-post time"
                              : project.title === "Blog Automation (Purple City MCP)"
                              ? "Articles sourced, posts published, time saved per post"
                              : project.title === "Lead Generator Agent (LinkedIn, Twitter, Reddit)"
                              ? "Profiles scraped, leads enriched, time saved"
                              : project.title === "AGENTSY"
                              ? "Revenue, funnel conversion, ad spend ROI"
                              : "User acquisition, transaction volume, partnership deals, DApp engagement"
                            }
                          </p>
                        </div>
                      )}

                      {/* Results - For custom structured projects */}
                      {(project.title === "Cazpro" || project.title === "Millionth Mile Marketing" || project.title === "DigiPay" || project.title === "Inventrax" || project.title === "FDX Sports" || project.title === "Codiste" || project.title === "ZO Labs" || project.title === "Zentrades" || project.title === "InboxBites" || project.title === "Solgames" || project.title === "Martian Wallet" || project.title === "GEOptimer" || project.title === "Growth Opportunity Agent" || project.title === "Reply Agent (Auto-Commenter)" || project.title === "Internal Linking Agent" || project.title === "Content Automation (Reddit → LinkedIn)" || project.title === "Blog Automation (Purple City MCP)" || project.title === "Lead Generator Agent (LinkedIn, Twitter, Reddit)" || project.title === "AGENTSY") && (
                        <div>
                          <h4 className="font-medium text-white mb-2">Results:</h4>
                          <p className="text-gray-400">
                            {project.title === "Cazpro"
                              ? "2.5M INR sales in 15 months, 200+ daily orders in 3 months, successful exit"
                              : project.title === "Millionth Mile Marketing"
                              ? "$180K revenue in 2 years, 40+ clients (60% overseas), 10+ media features, top 5 agency recognition"
                              : project.title === "DigiPay"
                              ? "$4M to $80M revenue, 30K B2B app installs, 500K merchant downloads, built team from 1 to 28"
                              : project.title === "Inventrax"
                              ? "600% traffic growth, ranked top 1-2 for 3 keywords, lead volume surge"
                              : project.title === "FDX Sports"
                              ? "$10K to $120K/month sales, $500K+ ad spend, AOV up 2.5x"
                              : project.title === "Codiste"
                              ? "4x team output, 2.5x sales response, full-stack process automation"
                              : project.title === "ZO Labs"
                              ? "180K installs, 100K+ community, 10K+ agents, 120+ partnerships, 50+ IRL events"
                              : project.title === "Zentrades"
                              ? "MQLs 9→60/month, 125% traffic growth, 3x demo conversion, 5000+ landing pages"
                              : project.title === "InboxBites"
                              ? "MVP built in 6 weeks, 200+ waitlisters, 60% solo-coded, live waitlist"
                              : project.title === "Solgames"
                              ? "3K devs/gamers, $150K seed, Solana hackathon top 10, 1K+ hackathon apps"
                              : project.title === "Martian Wallet"
                              ? "1M+ installs, $2B+ volume, 400K new users, 50+ partnerships, $1M DApp daily"
                              : project.title === "GEOptimer"
                              ? "Comprehensive reports in seconds, instant action items, live MVP"
                              : project.title === "Growth Opportunity Agent"
                              ? "Opportunities delivered in real time, MVP ready, beta users onboard"
                              : project.title === "Reply Agent (Auto-Commenter)"
                              ? "150 auto-comments/day, Product Hunt launch scheduled, early demand"
                              : project.title === "Internal Linking Agent"
                              ? "Live in September, beta user waitlist, agent workflow ready"
                              : project.title === "Content Automation (Reddit → LinkedIn)"
                              ? "Automated 100% of LinkedIn pipeline, human QA in loop, next step: SaaS"
                              : project.title === "Blog Automation (Purple City MCP)"
                              ? "Deployed flow, InboxBites blog launch pending"
                              : project.title === "Lead Generator Agent (LinkedIn, Twitter, Reddit)"
                              ? "60% lead gen time saved, dashboarded leads, live beta"
                              : project.title === "AGENTSY"
                              ? "$2M+ sales, 20L+ INR in 6 months, high-volume funnel ops"
                              : "50K+ users, 10K+ transactions, 20+ partnerships, global adoption across 30+ countries"
                            }
                          </p>
                        </div>
                      )}

                      {/* Engagement Type for custom structured projects, Role for others */}
                      <div>
                        <h4 className="font-medium text-white mb-2">
                          {(project.title === "Cazpro" || project.title === "Millionth Mile Marketing" || project.title === "DigiPay" || project.title === "Inventrax" || project.title === "FDX Sports" || project.title === "Codiste" || project.title === "ZO Labs" || project.title === "Zentrades" || project.title === "InboxBites" || project.title === "Solgames" || project.title === "Martian Wallet" || project.title === "GEOptimer" || project.title === "Growth Opportunity Agent" || project.title === "Reply Agent (Auto-Commenter)" || project.title === "Internal Linking Agent" || project.title === "Content Automation (Reddit → LinkedIn)" || project.title === "Blog Automation (Purple City MCP)" || project.title === "Lead Generator Agent (LinkedIn, Twitter, Reddit)" || project.title === "AGENTSY") ? "Engagement Type:" : "Role:"}
                        </h4>
                        <p className="text-gray-400">
                          {project.title === "Cazpro" 
                            ? "Founder (Full Time)" 
                            : project.title === "Millionth Mile Marketing"
                            ? "Co-founder, Head of Growth (Full Time)"
                            : project.title === "DigiPay"
                            ? "Head of Marketing (Full Time)"
                            : project.title === "Inventrax"
                            ? "Consultant (Freelance)"
                            : project.title === "FDX Sports"
                            ? "Consultant (Freelance)"
                            : project.title === "Codiste"
                            ? "Fractional CMO (Consulting)"
                            : project.title === "ZO Labs"
                            ? "Head of Growth (Full Time)"
                            : project.title === "Zentrades"
                            ? "Consultant (Freelance)"
                            : project.title === "InboxBites"
                            ? "Founder (Side Hustle/MicroSaaS)"
                            : project.title === "Solgames"
                            ? "Head of Growth, Co-founder"
                            : project.title === "Martian Wallet"
                            ? "Head of Marketing (Full Time)"
                            : project.title === "GEOptimer"
                            ? "Founder (Solo Builder)"
                            : project.title === "Growth Opportunity Agent"
                            ? "Founder (Micro-SaaS)"
                            : project.title === "Reply Agent (Auto-Commenter)"
                            ? "Founder (Micro-SaaS)"
                            : project.title === "Internal Linking Agent"
                            ? "Founder (Micro-SaaS)"
                            : project.title === "Content Automation (Reddit → LinkedIn)"
                            ? "Founder/Operator"
                            : project.title === "Blog Automation (Purple City MCP)"
                            ? "Founder/Builder"
                            : project.title === "Lead Generator Agent (LinkedIn, Twitter, Reddit)"
                            ? "Founder (Micro-SaaS)"
                            : project.title === "AGENTSY"
                            ? "Founder (Solo)"
                            : "Solo Builder + Marketer"}
                        </p>
                      </div>

                      {/* Period - For custom structured projects */}
                      {(project.title === "Cazpro" || project.title === "Millionth Mile Marketing" || project.title === "DigiPay" || project.title === "Inventrax" || project.title === "FDX Sports" || project.title === "Codiste" || project.title === "ZO Labs" || project.title === "Zentrades" || project.title === "InboxBites" || project.title === "Solgames" || project.title === "Martian Wallet" || project.title === "GEOptimer" || project.title === "Growth Opportunity Agent" || project.title === "Reply Agent (Auto-Commenter)" || project.title === "Internal Linking Agent" || project.title === "Content Automation (Reddit → LinkedIn)" || project.title === "Blog Automation (Purple City MCP)" || project.title === "Lead Generator Agent (LinkedIn, Twitter, Reddit)" || project.title === "AGENTSY") && (
                        <div>
                          <h4 className="font-medium text-white mb-2">Period:</h4>
                          <p className="text-gray-400">
                            {project.title === "Cazpro"
                              ? "May 2014 – Dec 2015"
                              : project.title === "Millionth Mile Marketing"
                              ? "2017 – Dec 2019"
                              : project.title === "DigiPay"
                              ? "Dec 2019 – Sep 2021"
                              : project.title === "Inventrax"
                              ? "2022"
                              : project.title === "FDX Sports"
                              ? "2023"
                              : project.title === "Codiste"
                              ? "2024"
                              : project.title === "ZO Labs"
                              ? "Jan 2024 – Aug 2025"
                              : project.title === "Zentrades"
                              ? "2023"
                              : project.title === "InboxBites"
                              ? "2024"
                              : project.title === "Solgames"
                              ? "Nov 2022 – May 2023"
                              : project.title === "Martian Wallet"
                              ? "May 2023 – Jan 2024"
                              : project.title === "GEOptimer"
                              ? "2025 – ongoing"
                              : project.title === "Growth Opportunity Agent"
                              ? "2025 – ongoing"
                              : project.title === "Reply Agent (Auto-Commenter)"
                              ? "2025 – ongoing"
                              : project.title === "Internal Linking Agent"
                              ? "2025 – ongoing"
                              : project.title === "Content Automation (Reddit → LinkedIn)"
                              ? "2025 – ongoing"
                              : project.title === "Blog Automation (Purple City MCP)"
                              ? "2025 – ongoing"
                              : project.title === "Lead Generator Agent (LinkedIn, Twitter, Reddit)"
                              ? "2025 – ongoing"
                              : project.title === "AGENTSY"
                              ? "2025 – ongoing"
                              : "2024"
                            }
                          </p>
                        </div>
                      )}

                      {/* Results - For non-custom structured projects */}
                      {(false) && (
                        <div>
                          <h4 className="font-medium text-white mb-2">Results:</h4>
                          <p className="text-gray-400">
                            {project.title === "FDX Sports"
                              ? "$10K to $120K/month sales, $500K+ ad spend, AOV up 2.5x"
                              : project.title === "Codiste"
                              ? "4x team output, 2.5x sales response, full-stack process automation"
                              : project.title === "Zentrades"
                              ? "MQLs 9→60/month, 125% traffic growth, 3x demo conversion, 5000+ landing pages"
                              : project.title === "InboxBites"
                              ? "MVP built in 6 weeks, 200+ waitlisters, 60% solo-coded, live waitlist"
                              : project.title === "Solgames"
                              ? "3K devs/gamers, $150K seed, Solana hackathon top 10, 1K+ hackathon apps"
                              : project.title === "Martian Wallet"
                              ? "1M+ installs, $2B+ volume, 400K new users, 50+ partnerships, $1M DApp daily"
                              : "180K installs, 100K+ community, 10K+ agents, 120+ partnerships, 50+ IRL events"}
                          </p>
                        </div>
                      )}

                      {/* Technologies - For non-custom structured projects */}
                      {(false) && (
                        <div>
                          <h4 className="font-medium text-white mb-3">Technologies:</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.slice(0, 8).map((tech) => (
                              <span 
                                key={tech}
                                className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                              >
                                {tech === "React & Next.js" ? "React" : 
                                 tech === "Node.js & Express" ? "Node.js" :
                                 tech === "PostgreSQL" ? "PostgreSQL" :
                                 tech === "MongoDB" ? "MongoDB" : tech}
                              </span>
                            ))}
                          </div>
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
                          key={similarProject.id}
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
                              onError={(e) => {
                                console.warn('Failed to load similar project video:', similarProject.video);
                              }}
                            />
                          )}
                          <img
                            src={similarProject.image}
                            alt={similarProject.title}
                            className="w-full h-32 object-cover group-hover:opacity-0 transition-opacity duration-300"
                            onError={(e) => {
                              console.warn('Failed to load similar project image:', similarProject.image);
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