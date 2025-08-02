import { useQuery } from "@tanstack/react-query";
import Header from "../components/header";
import HeroSection from "../components/hero-section";
import ProjectsSection from "../components/projects-section";
import NetflixModal from "../components/netflix-modal";
import { Profile } from "../../../shared/schema";
import { useState } from "react";
import { Linkedin, Mail, Phone } from "lucide-react";
import { FaTwitter } from "react-icons/fa";

export default function Home() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const { data: profile, isLoading: profileLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg sm:text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <HeroSection profile={profile} />
      <ProjectsSection onProjectClick={setSelectedProjectId} />
      
      {/* Footer Section */}
      <footer id="footer" className="bg-black/95 border-t border-gray-800 mt-12 sm:mt-16 md:mt-20 w-screen">
        <div className="w-screen px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 py-12 sm:py-14 md:py-16">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            
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

            {/* Services Column */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Services</h3>
              <div className="space-y-3">
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">Web Development</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">Vibe Coding</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">Vibe Marketing</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">Gen AI</div>
              </div>
            </div>

            {/* Technologies Column */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Technologies</h3>
              <div className="space-y-3">
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">HTML/CSS</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">JavaScript</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">React & Next.js</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">Node.js & Express</div>
                <div className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors cursor-default">MongoDB & PostgreSQL</div>
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
