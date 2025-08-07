import { useQuery } from "@tanstack/react-query";
import Header from "../components/header";
import HeroSection from "../components/hero-section";
import ProjectsSection from "../components/projects-section";
import NetflixModal from "../components/netflix-modal";
import { Profile } from "../../../shared/schema";
import { useState, useEffect } from "react";
import { Linkedin, Mail, Phone } from "lucide-react";
import { FaTwitter } from "react-icons/fa";

export default function Home() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Check for project parameter in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectParam = urlParams.get('project');
    if (projectParam) {
      setSelectedProjectId(projectParam);
      // Remove the parameter from URL without causing a page reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg sm:text-xl">Loading...</div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-lg sm:text-xl">Failed to load profile. Please refresh the page.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <div className="relative">
        <HeroSection profile={profile} />
        <div className="relative z-10" style={{ marginTop: '0rem' }}>
          <ProjectsSection onProjectClick={setSelectedProjectId} />
        </div>
      </div>
      
      {/* Footer Section */}
      <footer id="footer" className="bg-black/95 border-t border-gray-800 mt-16 sm:mt-20 md:mt-24 w-screen">
        <div className="w-screen px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 py-12 sm:py-14 md:py-16">
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
            
            {/* Contact Column */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a href="mailto:farooqsheik52543@gmail.com" className="text-xs sm:text-sm break-all">
                    farooqsheik52543@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a href="tel:+919878167456" className="text-xs sm:text-sm">
                    +91-9878167456
                  </a>
                </div>
              </div>
            </div>

            {/* Key Highlights Column */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Key Highlights</h3>
              <div className="space-y-3">
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• $80M+ revenue generated across 5 companies</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Managed $2M+ in paid ad spend</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Acquired more than 2 Million users across three apps</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Raised $150K Pre-seed</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Founded 3 startups. 1 exit</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• 30+ Keynotes in AI, Blockchain</div>
              </div>
            </div>

            {/* Core Skills Column */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Core Skills</h3>
              <div className="space-y-3">
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• AI Marketing</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Product Marketing</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Growth Strategy</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• D2C Marketing</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Marketing Automation</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Marketing Measurement</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• Performance Marketing</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">• GTM & Funnel Building</div>
              </div>
            </div>

            {/* Social Column */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Social</h3>
              <div className="space-y-3">
                <a 
                  href="https://x.com/farooqsheik" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                >
                  <FaTwitter className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Twitter</span>
                </a>
                <a 
                  href="https://linkedin.com/in/farooqchisty" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Border */}
          <div className="border-t border-gray-800 mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 w-full">
            <div className="text-center text-gray-400 text-xs sm:text-sm">
              © 2024 Farooq Chisty. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <NetflixModal 
        projectId={selectedProjectId} 
        onClose={() => setSelectedProjectId(null)}
        onProjectSwitch={(projectId) => setSelectedProjectId(projectId)}
      />
    </div>
  );
}
