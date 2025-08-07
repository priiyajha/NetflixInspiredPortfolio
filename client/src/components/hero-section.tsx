import { motion } from "framer-motion";
import { Download, Play, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@shared/schema";
import backgroundVideo from "@assets/20250731_1654_Neon Code Symphony_simple_compose_01k1g3kq5af70vc1a2b12hvja6_1753961284060.mp4";

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
    <section id="home" className="relative h-screen flex items-end overflow-hidden" style={{ minHeight: 'calc(100vh + 8rem)' }}>
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        >
          <source src={backgroundVideo} type="video/mp4" />
          {/* Fallback background image if video fails to load */}
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
            }}
          />
        </video>
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/30"></div>
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 pb-16 sm:pb-24 md:pb-32"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="max-w-4xl">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 leading-tight text-white drop-shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Farooq Chisty
          </motion.h1>
          
          <motion.h2
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-white drop-shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Full-Stack & Vibe Coding | Marketing
          </motion.h2>
          
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl drop-shadow-md leading-relaxed"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {profile?.bio || "Creating modern web applications with cutting-edge technologies. Passionate about user experience and scalable solutions."}
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <Button
              onClick={scrollToProjects}
              className="bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded font-semibold text-base sm:text-lg hover:bg-netflix-light-gray transition-colors duration-200 flex items-center justify-center gap-2"
              size="lg"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              View Projects
            </Button>
            
            <Button
              onClick={handleDownloadResume}
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded font-semibold text-base sm:text-lg hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-2"
              size="lg"
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              View Resume
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}