import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Button } from "./ui/button";
import { X, Play, Plus, Volume2, VolumeX, ThumbsUp } from "lucide-react";

interface NetflixModalProps {
  projectId: string | null;
  onClose: () => void;
  onProjectSwitch?: (projectId: string) => void;
}

export default function NetflixModal({ projectId, onClose, onProjectSwitch }: NetflixModalProps) {
  const [isMuted, setIsMuted] = useState(true);

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
                          : "Complex processes now run seamlessly."
                        }
                      </h2>

                      {/* Detailed Description */}
                      <p className="text-gray-300 text-base leading-relaxed">
                        {project.title === "Cazpro" 
                          ? "College merchandise was fragmented: scattered suppliers, broken brand positioning, and buried customer insights that had to be cleaned and restructured just to process a single campaign. Multiple brand managers were manually coordinating marketing efforts every day to meet tight sales deadlines. I built a comprehensive D2C solution using Shopify and performance marketing that processes unstructured customer data and generates clean, system-ready campaigns in minutes. Today, we achieved 200+ daily orders in under 3 months with complete accuracy and zero marketing stress. What used to be a daily bottleneck became a seamless high-velocity sales machine that generated 2.5M INR and a successful exit."
                          : project.title === "Millionth Mile Marketing"
                          ? "Regional marketing was fragmented: scattered agencies, broken client relationships, and buried growth insights that had to be cleaned and restructured just to land a single marquee client. Multiple founders were manually pitching prospects every day to meet tight revenue deadlines. I co-founded a comprehensive growth solution using Google Ads, Meta Ads, and team building that processes unstructured market data and generates clean, system-ready campaigns in minutes. Today, we built a top 5 agency with 40+ clients across continents with complete accuracy and zero pitch stress. What used to be a daily hustle became a seamless acquisition machine that generated $180K revenue and industry recognition."
                          : project.title === "DigiPay"
                          ? "B2B fintech marketing was chaos: scattered installs, broken attribution flows, and buried growth insights that had to be cleaned and restructured just to land a single merchant. Multiple marketers were manually coordinating campaigns every day to meet tight revenue deadlines. I joined as the first marketing hire and built a comprehensive growth solution using CleverTap, AppsFlyer, and mobile analytics that processes unstructured user data and generates clean, system-ready campaigns in minutes. Today, we scaled from $4M to $80M revenue with complete accuracy and zero growth stress. What used to be a daily bottleneck became a seamless acquisition machine that generated 30K B2B installs and 500K merchant downloads."
                          : project.title === "Inventrax"
                          ? "Warehouse automation SaaS traffic was chaos: scattered content, broken keyword strategies, and buried ranking insights that had to be cleaned and restructured just to land a single lead. Multiple marketers were manually analyzing search data every day to meet tight traffic deadlines. I joined as a consultant and built a comprehensive growth solution using SEMrush, Ahrefs, and programmatic SEO that processes unstructured search data and generates clean, system-ready optimizations in minutes. Today, we achieved 600% traffic growth with complete accuracy and zero ranking stress. What used to be a daily bottleneck became a seamless organic lead machine that cracked top 2 positions for 3 high-value keywords."
                          : project.title === "FDX Sports"
                          ? "European D2C sports marketing was chaos: scattered campaigns, broken customer journeys, and buried conversion insights that had to be cleaned and restructured just to process a single sale. Multiple marketers were manually coordinating channels every day to meet tight revenue deadlines. I joined as a consultant and built a comprehensive growth solution using Shopify, Google Ads, and automation that processes unstructured customer data and generates clean, system-ready campaigns in minutes. Today, we scaled from $10K to $120K monthly with complete accuracy and zero campaign stress. What used to be a daily bottleneck became a seamless million-dollar revenue machine with $500K+ ad spend and 2.5x AOV growth."
                          : project.title === "Codiste"
                          ? "Marketing and sales operations were chaos: scattered teams, broken processes, and buried optimization insights that had to be cleaned and restructured just to generate a single qualified lead. Multiple team members were manually executing campaigns every day to meet tight output deadlines. I joined as Fractional CMO and built a comprehensive solution using Apollo, LeadDino, and automation that processes unstructured marketing data and generates clean, system-ready campaigns in minutes. Today, we achieved 4x team output and 2.5x sales response with complete accuracy and zero process stress. What used to be a daily bottleneck became a seamless high-output marketing machine with full-stack automation and AI integration."
                          : project.title === "ZO Labs"
                          ? "AI startup growth was chaos: scattered user acquisition, broken community engagement, and buried partnership insights that had to be cleaned and restructured just to land a single install. Multiple growth marketers were manually coordinating campaigns every day to meet tight scaling deadlines. I joined as Head of Growth and built a comprehensive solution using HubSpot, ActiveCampaign, and AI automation that processes unstructured growth data and generates clean, system-ready campaigns in minutes. Today, we scaled from stealth to 180K installs with complete accuracy and zero growth stress. What used to be a daily bottleneck became a seamless AI-powered growth machine that shipped 10K+ agents and secured 120+ partnerships."
                          : project.description
                        }
                      </p>
                    </div>

                    {/* Vertical Navy Blue Separator */}
                    <div className="hidden lg:block w-px bg-navy-700 mx-6 opacity-50" style={{backgroundColor: '#1e3a8a'}}></div>

                    {/* Right Column - Project Details (1/3 width) */}
                    <div className="w-full lg:w-1/3 pl-0 lg:pl-0 mt-8 lg:mt-0 space-y-6">
                      {/* Director */}
                      <div>
                        <h4 className="font-medium text-white mb-2">Director:</h4>
                        <p className="text-gray-400">Priya Jha</p>
                      </div>

                      {/* Cast */}
                      <div>
                        <h4 className="font-medium text-white mb-2">Cast:</h4>
                        <p className="text-gray-400">Solo Builder Team</p>
                      </div>

                      {/* Challenge */}
                      <div>
                        <h4 className="font-medium text-white mb-2">
                          {(project.title === "Cazpro" || project.title === "Millionth Mile Marketing") ? "Goal:" : "Challenge:"}
                        </h4>
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
                            : "Manual data processing under tight deadlines"
                          }
                        </p>
                      </div>

                      {/* Role */}
                      <div>
                        <h4 className="font-medium text-white mb-2">Role:</h4>
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
                            : "Solo Builder + Marketer"}
                        </p>
                      </div>

                      {/* Results - For Business Projects */}
                      {(project.title === "Cazpro" || project.title === "Millionth Mile Marketing" || project.title === "DigiPay" || project.title === "Inventrax" || project.title === "FDX Sports" || project.title === "Codiste" || project.title === "ZO Labs") && (
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
                              : "180K installs, 100K+ community, 10K+ agents, 120+ partnerships, 50+ IRL events"}
                          </p>
                        </div>
                      )}

                      {/* Technologies */}
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

                      {/* Period - For Business Projects */}
                      {(project.title === "Cazpro" || project.title === "Millionth Mile Marketing" || project.title === "DigiPay" || project.title === "Inventrax" || project.title === "FDX Sports" || project.title === "Codiste" || project.title === "ZO Labs") && (
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
                              : "Jan 2024 – Aug 2025"}
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