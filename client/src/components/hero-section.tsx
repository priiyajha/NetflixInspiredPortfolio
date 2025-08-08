import { motion } from "framer-motion";
import { Download, Play, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@shared/schema";
import { useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
// Background video for immersive hero experience

interface HeroSectionProps {
  profile?: Profile;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleViewResume = () => {
    const resumeUrl = "/attached_assets/FAROOQ%20CHISTY%20%20RESUME%202025%20%281%29_1754665051871.pdf";
    window.open(resumeUrl, "_blank");
  };

  const navigateToProjects = () => {
    setLocation('/projects');
  };

  return (
    <section id="home" className="relative h-screen flex items-end overflow-hidden" 
      style={{
        backgroundColor: '#1a1a1a',
        // Mobile performance optimizations
        contain: 'layout style paint',
        contentVisibility: 'auto'
      }}>
      {/* Background Video or Fallback */}
      <div className="absolute inset-0">
        {!videoError ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
            onLoadedData={() => {
              // Ensure video starts playing with mobile-specific handling
              if (videoRef.current) {
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                  playPromise.catch(() => {
                    console.log('Video autoplay prevented by browser - user interaction required');
                  });
                }
              }
            }}
            onCanPlay={() => {
              // Ensure video plays when ready
              if (videoRef.current) {
                videoRef.current.play().catch(() => {
                  console.log('Video play prevented');
                });
              }
            }}
            style={{
              // Performance optimizations
              willChange: 'auto',
              transform: 'translateZ(0)', // Hardware acceleration
            }}
          >
            <source src="/attached_assets/videoBg_1754666843775.mp4" type="video/mp4" />
          </video>
        ) : (
          // Fallback gradient background if video fails to load
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)"
            }}
          />
        )}

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/40"></div>
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
            Growth Operator | Vibe Marketer | AI Generalist
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
              onClick={navigateToProjects}
              className="bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded font-semibold text-base sm:text-lg hover:bg-netflix-light-gray transition-colors duration-200 flex items-center justify-center gap-2"
              size="lg"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              View Projects
            </Button>
            
            <Button
              onClick={handleViewResume}
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