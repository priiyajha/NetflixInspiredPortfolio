import { motion } from "framer-motion";
import { Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@shared/schema";

interface HeroSectionProps {
  profile?: Profile;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const { toast } = useToast();

  const handleDownloadResume = async () => {
    try {
      const response = await fetch("/api/download-resume");
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Resume Download",
          description: "Resume download initiated successfully",
        });
        // In a real app, this would trigger the actual download
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const scrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-end">
      {/* Background Video/Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 px-4 md:px-12 pb-32"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="max-w-3xl">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4 leading-tight text-gray-100"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Priya Jha
          </motion.h1>
          
          <motion.h2
            className="text-2xl md:text-3xl font-medium mb-6 text-gray-100"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Full-Stack & Vibe Coding | Marketing
          </motion.h2>
          
          <motion.p
            className="text-lg md:text-xl text-netflix-light-gray mb-8 max-w-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {profile?.bio || "Creating modern web applications with cutting-edge technologies. Passionate about user experience and scalable solutions."}
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <Button
              onClick={scrollToProjects}
              className="bg-white text-black px-8 py-4 rounded font-semibold text-lg hover:bg-netflix-light-gray transition-colors duration-200 flex items-center justify-center gap-2"
              size="lg"
            >
              <Play className="w-5 h-5" />
              View Projects
            </Button>
            
            <Button
              onClick={handleDownloadResume}
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded font-semibold text-lg hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-2"
              size="lg"
            >
              <Download className="w-5 h-5" />
              Download Resume
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}