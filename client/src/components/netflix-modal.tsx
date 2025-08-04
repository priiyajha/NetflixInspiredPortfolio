import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { X, Play, Plus, Volume2, VolumeX, ThumbsUp, ChevronLeft, ChevronRight, Share } from "lucide-react";

interface NetflixModalProps {
  projectId: string | null;
  onClose: () => void;
  onProjectSwitch?: (projectId: string) => void;
}

export default function NetflixModal({ projectId, onClose, onProjectSwitch }: NetflixModalProps) {
  const [isMuted, setIsMuted] = useState(true);
  const imageScrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
    if (onProjectSwitch) {
      onProjectSwitch(newProjectId);
    }
  };

  // Sample images for the scroller - in a real app, these would come from the project data
  const projectImages = [
    project?.image || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
  ];

  const scrollImages = (direction: 'left' | 'right') => {
    const container = imageScrollRef.current;
    if (!container) return;
    
    const scrollAmount = 200;
    container.scrollBy({ 
      left: direction === 'left' ? -scrollAmount : scrollAmount, 
      behavior: 'smooth' 
    });
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

                      {/* Share Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 rounded-full border-2 border-white/70"
                        onClick={async () => {
                          try {
                            const projectUrl = `${window.location.origin}?project=${project.id}`;
                            
                            if (navigator.share) {
                              await navigator.share({
                                title: project.title,
                                text: `Check out this project: ${project.title}`,
                                url: projectUrl
                              });
                              toast({
                                title: "Shared successfully!",
                                description: "Project link has been shared.",
                              });
                            } else {
                              // Fallback to clipboard
                              await navigator.clipboard.writeText(projectUrl);
                              toast({
                                title: "Link copied to clipboard!",
                                description: "You can now paste the project link anywhere.",
                              });
                            }
                          } catch (error) {
                            console.error('Share failed:', error);
                            // Final fallback - create a temporary text element and copy
                            try {
                              const projectUrl = `${window.location.origin}?project=${project.id}`;
                              const textArea = document.createElement('textarea');
                              textArea.value = projectUrl;
                              textArea.style.position = 'fixed';
                              textArea.style.left = '-999999px';
                              textArea.style.top = '-999999px';
                              document.body.appendChild(textArea);
                              textArea.focus();
                              textArea.select();
                              document.execCommand('copy');
                              textArea.remove();
                              
                              toast({
                                title: "Link copied!",
                                description: "Project link has been copied to clipboard.",
                              });
                            } catch (fallbackError) {
                              console.error('Final fallback failed:', fallbackError);
                              toast({
                                title: "Share failed",
                                description: "Unable to share or copy the link. Please copy the URL manually.",
                                variant: "destructive",
                              });
                            }
                          }
                        }}
                      >
                        <Share className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="px-8 py-12 bg-[#141414]">
                {/* Container with max width and centering */}
                <div className="w-full max-w-[1280px] mx-auto">
                  {/* Two Column Layout with Blue Neon Line Separator */}
                  <div className="flex flex-col lg:flex-row">
                    {/* Left Column - All Content (2/3 width) */}
                    <div className="w-full lg:w-2/3 pr-0 lg:pr-6">
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
                          ? "Co-built Soulgames, a GameFi dev toolkit, into a Solana hackathon winner and landed $150K in seed with 3K-strong dev/gamer community."
                          : project.title === "Martian Wallet"
                          ? "Headed marketing at Martian Wallet, scaling installs by 50%, landing 400K+ new users, and doubling DApp transaction volumes from $1.2B to $2B."
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
                          ? "Co-built Soulgames, a GameFi dev toolkit, into a Solana hackathon winner and landed $150K in seed. Rallied a 3K-strong dev/gamer community, ran hackathons with 1K+ participants, and delivered a live MVP in 3 months. Paused by market chaos, but left a mark."
                          : project.title === "Martian Wallet"
                          ? "Headed marketing at Martian Wallet, scaling installs by 50%, landing 400K+ new users, and doubling DApp transaction volumes from $1.2B to $2B. Launched a DApp that hit $1M daily volume in a month, forged 50+ partnerships, and kept the Web3 world buzzing."
                          : project.description
                        }
                      </p>

                      {/* Image Scroller Section */}
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-white mb-4">Project Gallery</h3>
                        <div className="relative group">
                          {/* Left Arrow */}
                          <button
                            onClick={() => scrollImages('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                            aria-label="Scroll left"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          {/* Right Arrow */}
                          <button
                            onClick={() => scrollImages('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                            aria-label="Scroll right"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {/* Scrollable Images Container */}
                          <div
                            ref={imageScrollRef}
                            className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                          >
                            {projectImages.map((image, index) => (
                              <div key={index} className="flex-none">
                                <img
                                  src={image}
                                  alt={`${project?.title} screenshot ${index + 1}`}
                                  className="w-32 h-20 object-cover rounded-md hover:scale-105 transition-transform duration-200 cursor-pointer"
                                  draggable={false}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vertical Navy Blue Separator */}
                    <div className="hidden lg:block w-px bg-navy-700 mx-6 opacity-50" style={{backgroundColor: '#1e3a8a'}}></div>

                    {/* Right Column - Project Details (1/3 width) */}
                    <div className="w-full lg:w-1/3 pl-0 lg:pl-0 mt-8 lg:mt-0 space-y-6">
                      {/* Tech Stacks - For Cazpro, Millionth Mile Marketing, DigiPay, Inventrax, FDX Sports, Codiste, and ZO Labs */}
                      {(project.title === "Cazpro" || project.title === "Millionth Mile Marketing" || project.title === "DigiPay" || project.title === "Inventrax" || project.title === "FDX Sports" || project.title === "Codiste" || project.title === "ZO Labs") && (
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
                            ) : (
                              ["HubSpot", "ActiveCampaign", "Firebase Studio", "AppsFlyer", "AppRadar", "WebEngage", "Discord", "Twitter"].slice(0, 8).map((tech) => (
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
                      {(project.title === "Cazpro" || project.title === "Millionth Mile Marketing" || project.title === "DigiPay" || project.title === "Inventrax" || project.title === "FDX Sports" || project.title === "Codiste" || project.title === "ZO Labs" || project.title === "Zentrades" || project.title === "InboxBites" || project.title === "Solgames" || project.title === "Martian Wallet") && (
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
                              : "Web3 marketing, community ops, DApp growth, partnerships, content, BD"
                            }
                          </p>
                        </div>
                      )}

                      {/* Goal - For all projects with custom structure */}
                      {(project.title === "Cazpro" || project.title === "Millionth Mile Marketing" || project.title === "DigiPay" || project.title === "Inventrax" || project.title === "FDX Sports" || project.title === "Codiste" || project.title === "ZO Labs" || project.title === "Zentrades" || project.title === "InboxBites" || project.title === "Solgames" || project.title === "Martian Wallet") && (
                        <div>
                          <h4 className="font-medium text-white mb-2">Goal:</h4>
                          <p className="text-gray-400">
                            {project.title === "Cazpro"
                              ? "Build profitable D2C college merch business, achieve market leadership, scale operations"
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
                              : "Grow user base, launch DApp, increase transaction volume, build global partnerships"
                            }
                          </p>
                        </div>
                      )}

                      {/* Director - For non-custom structured projects */}
                      {(project.title !== "Cazpro" && project.title !== "Millionth Mile Marketing" && project.title !== "DigiPay" && project.title !== "Inventrax" && project.title !== "FDX Sports" && project.title !== "Codiste" && project.title !== "ZO Labs" && project.title !== "Zentrades" && project.title !== "InboxBites" && project.title !== "Solgames" && project.title !== "Martian Wallet") && (
                        <div>
                          <h4 className="font-medium text-white mb-2">Director:</h4>
                          <p className="text-gray-400">Farooq Chisty</p>
                        </div>
                      )}

                      {/* Cast - For non-custom structured projects */}
                      {(project.title !== "Cazpro" && project.title !== "Millionth Mile Marketing" && project.title !== "DigiPay" && project.title !== "Inventrax" && project.title !== "FDX Sports" && project.title !== "Codiste" && project.title !== "ZO Labs" && project.title !== "Zentrades" && project.title !== "InboxBites" && project.title !== "Solgames" && project.title !== "Martian Wallet") && (
                        <div>
                          <h4 className="font-medium text-white mb-2">Cast:</h4>
                          <p className="text-gray-400">Solo Builder Team</p>
                        </div>
                      )}



                      {/* KPIs - For custom structured projects */}
                      {(project.title === "Cazpro" || project.title === "Millionth Mile Marketing" || project.title === "DigiPay" || project.title === "Inventrax" || project.title === "FDX Sports" || project.title === "Codiste" || project.title === "ZO Labs" || project.title === "Zentrades" || project.title === "InboxBites" || project.title === "Solgames" || project.title === "Martian Wallet") && (
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
                              : "User acquisition, transaction volume, partnership deals, DApp engagement"
                            }
                          </p>
                        </div>
                      )}

                      {/* Results - For custom structured projects */}
                      {(project.title === "Cazpro" || project.title === "Millionth Mile Marketing" || project.title === "DigiPay" || project.title === "Inventrax" || project.title === "FDX Sports" || project.title === "Codiste" || project.title === "ZO Labs" || project.title === "Zentrades" || project.title === "InboxBites" || project.title === "Solgames" || project.title === "Martian Wallet") && (
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
                              : "50K+ users, 10K+ transactions, 20+ partnerships, global adoption across 30+ countries"
                            }
                          </p>
                        </div>
                      )}

                      {/* Engagement Type for custom structured projects, Role for others */}
                      <div>
                        <h4 className="font-medium text-white mb-2">
                          {(project.title === "Cazpro" || project.title === "Millionth Mile Marketing" || project.title === "DigiPay" || project.title === "Inventrax" || project.title === "FDX Sports" || project.title === "Codiste" || project.title === "ZO Labs" || project.title === "Zentrades" || project.title === "InboxBites" || project.title === "Solgames" || project.title === "Martian Wallet") ? "Engagement Type:" : "Role:"}
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
                            : "Solo Builder + Marketer"}
                        </p>
                      </div>

                      {/* Period - For custom structured projects */}
                      {(project.title === "Millionth Mile Marketing" || project.title === "DigiPay" || project.title === "Inventrax" || project.title === "FDX Sports" || project.title === "Codiste" || project.title === "ZO Labs" || project.title === "Zentrades" || project.title === "InboxBites") && (
                        <div>
                          <h4 className="font-medium text-white mb-2">Period:</h4>
                          <p className="text-gray-400">
                            {project.title === "Millionth Mile Marketing"
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
                              ? "Dec 2023 – Aug 2024"
                              : project.title === "Zentrades"
                              ? "2023"
                              : project.title === "InboxBites"
                              ? "2024"
                              : project.title === "Solgames"
                              ? "Nov 2022 – May 2023"
                              : "2024"
                            }
                          </p>
                        </div>
                      )}

                      {/* Results - For non-custom structured projects */}
                      {(project.title === "Martian Wallet") && (
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
                      {(project.title !== "Cazpro" && project.title !== "Millionth Mile Marketing" && project.title !== "DigiPay" && project.title !== "Inventrax" && project.title !== "FDX Sports" && project.title !== "Codiste" && project.title !== "ZO Labs" && project.title !== "Zentrades" && project.title !== "InboxBites" && project.title !== "Solgames" && project.title !== "Martian Wallet") && (
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
                              <span>2025</span>
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