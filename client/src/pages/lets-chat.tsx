import { motion } from "framer-motion";
import { useEffect } from "react";
import Header from "@/components/header";

export default function LetsChatPage() {
  // Load Calendly script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Clean up script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Main Content */}
      <main className="pt-24 pb-20">
        <div className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20">
          
          {/* Calendly Scheduling Section */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Calendly Embed */}
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
              <div 
                className="calendly-inline-widget" 
                data-url="https://calendly.com/farooqsheik52543" 
                style={{minWidth: '320px', height: '700px'}}
              ></div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}