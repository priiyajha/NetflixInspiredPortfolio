import { motion } from "framer-motion";
import { useEffect } from "react";
import Header from "@/components/header";
import { MessageCircle, Calendar, Phone, Mail, Linkedin, Send, Coffee, Lightbulb, Rocket } from "lucide-react";
import { FaTwitter } from "react-icons/fa";

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
          
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Let's Chat
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Got an idea? Need advice? Just want to brainstorm? I'm always up for a good conversation about growth, AI, marketing, or building something amazing.
            </p>
          </motion.div>

          {/* Chat Options Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            
            {/* Quick Chat */}
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 20px 40px rgba(229, 9, 20, 0.15)"
              }}
            >
              <div className="mb-6">
                <MessageCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">Quick Chat</h3>
                <p className="text-gray-300">
                  Drop me a message on LinkedIn or Twitter for quick questions and casual conversations.
                </p>
              </div>
              <div className="space-y-3">
                <a 
                  href="https://linkedin.com/in/farooqchisty" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn DM</span>
                </a>
                <a 
                  href="https://x.com/farooqsheik" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <FaTwitter className="w-5 h-5" />
                  <span>Twitter DM</span>
                </a>
              </div>
            </motion.div>

            {/* Coffee Chat */}
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 20px 40px rgba(229, 9, 20, 0.15)"
              }}
            >
              <div className="mb-6">
                <Coffee className="w-12 h-12 text-yellow-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">Coffee Chat</h3>
                <p className="text-gray-300">
                  Let's grab a virtual coffee and discuss your project, career, or anything interesting over a 30-min call.
                </p>
              </div>
              <div className="space-y-3">
                <a 
                  href="tel:+919878167456"
                  className="flex items-center space-x-3 text-green-400 hover:text-green-300 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>+91-9878167456</span>
                </a>
                <a 
                  href="mailto:farooqsheik52543@gmail.com?subject=Let's have a coffee chat"
                  className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>Schedule via Email</span>
                </a>
              </div>
            </motion.div>

            {/* Brainstorming Session */}
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 group md:col-span-2 lg:col-span-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 20px 40px rgba(229, 9, 20, 0.15)"
              }}
            >
              <div className="mb-6">
                <Lightbulb className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">Brainstorm Together</h3>
                <p className="text-gray-300">
                  Got a wild idea? Need to think through a strategy? Let's brainstorm and make magic happen.
                </p>
              </div>
              <a 
                href="mailto:farooqsheik52543@gmail.com?subject=Let's brainstorm together"
                className="flex items-center space-x-3 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Send className="w-5 h-5" />
                <span>Email me your idea</span>
              </a>
            </motion.div>
          </div>

          {/* What We Can Chat About */}
          <motion.div
            className="bg-gradient-to-br from-gray-900/50 to-black/50 p-8 md:p-12 rounded-xl border border-gray-800 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What We Can Chat About</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <Rocket className="w-8 h-8 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Growth Strategy</h3>
                <p className="text-gray-400 text-sm">Scaling up, user acquisition, growth hacking</p>
              </div>
              <div className="text-center">
                <Lightbulb className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI & Innovation</h3>
                <p className="text-gray-400 text-sm">AI tools, automation, future trends</p>
              </div>
              <div className="text-center">
                <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Marketing Ideas</h3>
                <p className="text-gray-400 text-sm">Campaigns, content, viral strategies</p>
              </div>
              <div className="text-center">
                <Coffee className="w-8 h-8 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Career & Life</h3>
                <p className="text-gray-400 text-sm">Entrepreneurship, startups, life lessons</p>
              </div>
            </div>
          </motion.div>

          {/* Calendly Scheduling Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Schedule a Call</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Pick a time that works for you and let's have a conversation about your project, ideas, or anything interesting.
            </p>
            
            {/* Calendly Embed */}
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
              <div 
                className="calendly-inline-widget" 
                data-url="https://calendly.com/farooqsheik52543" 
                style={{minWidth: '320px', height: '700px'}}
              ></div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Or Reach Out Directly</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Prefer a quick message? Drop me a line and I'll get back to you soon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://linkedin.com/in/farooqchisty"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Message Me on LinkedIn
              </a>
              <a
                href="mailto:farooqsheik52543@gmail.com?subject=Let's chat!"
                className="border border-white/30 hover:border-white text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-white/10"
              >
                Send an Email
              </a>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}