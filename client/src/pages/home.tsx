import { useQuery } from "@tanstack/react-query";
import Header from "../components/header";
import HeroSection from "../components/hero-section";
import ProjectsSection from "../components/projects-section";
import ProjectModal from "../components/project-modal";
import { Profile } from "../../../shared/schema";
import { useState } from "react";
import { Github, Linkedin, Mail, Phone } from "lucide-react";

export default function Home() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const { data: profile, isLoading: profileLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <HeroSection profile={profile} />
      <ProjectsSection onProjectClick={setSelectedProjectId} />
      
      {/* Footer Section */}
      <footer className="bg-black/95 border-t border-gray-800 mt-20 w-screen">
        <div className="w-screen px-6 md:px-12 lg:px-16 xl:px-20 py-16">
          <div className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 lg:gap-0">
            
            {/* Contact Column */}
            <div className="space-y-4 flex-1 lg:flex-[1] lg:max-w-[25%]">
              <h3 className="text-xl font-semibold text-white mb-6">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:jhapriiyaa2104@gmail.com" className="text-sm">
                    jhapriiyaa2104@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+919610373967" className="text-sm">
                    +91 - 9610373967
                  </a>
                </div>
              </div>
            </div>

            {/* Services Column */}
            <div className="space-y-4 flex-1 lg:flex-[1] lg:max-w-[25%]">
              <h3 className="text-xl font-semibold text-white mb-6">Services</h3>
              <div className="space-y-3">
                <div className="text-gray-300 text-sm hover:text-white transition-colors cursor-default">Web Development</div>
                <div className="text-gray-300 text-sm hover:text-white transition-colors cursor-default">Vibe Coding</div>
                <div className="text-gray-300 text-sm hover:text-white transition-colors cursor-default">Vibe Marketing</div>
                <div className="text-gray-300 text-sm hover:text-white transition-colors cursor-default">Gen AI</div>
              </div>
            </div>

            {/* Technologies Column */}
            <div className="space-y-4 flex-1 lg:flex-[1] lg:max-w-[25%]">
              <h3 className="text-xl font-semibold text-white mb-6">Technologies</h3>
              <div className="space-y-3">
                <div className="text-gray-300 text-sm hover:text-white transition-colors cursor-default">HTML/CSS</div>
                <div className="text-gray-300 text-sm hover:text-white transition-colors cursor-default">JavaScript</div>
                <div className="text-gray-300 text-sm hover:text-white transition-colors cursor-default">React & Next.js</div>
                <div className="text-gray-300 text-sm hover:text-white transition-colors cursor-default">Node.js & Express</div>
                <div className="text-gray-300 text-sm hover:text-white transition-colors cursor-default">MongoDB & PostgreSQL</div>
              </div>
            </div>

            {/* Social Column */}
            <div className="space-y-4 flex-1 lg:flex-[1] lg:max-w-[25%]">
              <h3 className="text-xl font-semibold text-white mb-6">Social</h3>
              <div className="space-y-3">
                <a 
                  href="https://github.com/priiyajha" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span className="text-sm">GitHub</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/priiyajhaa/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Border */}
          <div className="border-t border-gray-800 mt-12 pt-8 w-full">
            <div className="text-center text-gray-400 text-sm">
              © 2024 Priya Jha. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <ProjectModal 
        projectId={selectedProjectId} 
        onClose={() => setSelectedProjectId(null)} 
      />
    </div>
  );
}
