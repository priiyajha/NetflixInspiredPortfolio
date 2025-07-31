import { motion } from "framer-motion";
import { Linkedin, Github, Mail } from "lucide-react";
import Header from "../components/header";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Header />
      
      {/* Header Section */}
      <div className="pt-32 px-4 md:px-12 pb-16">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          <motion.h1
            className="text-5xl md:text-7xl font-black mb-8 text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Get in Touch
          </motion.h1>
          
          {/* Subheading - Two lines */}
          <motion.div
            className="text-xl md:text-2xl text-gray-300 mb-12 text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="mb-2">Ready to streamline your workflows?</p>
            <p>Let's connect and turn chaos into clarity.</p>
          </motion.div>

          {/* Status Indicators */}
          <motion.div
            className="flex flex-col items-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-lg text-gray-300">Available for new projects</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-lg text-gray-300">Usually responds within 24 hours</span>
            </div>
          </motion.div>

          {/* Connect With Me Section */}
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Connect With Me</h2>
            
            {/* LinkedIn Profile Card */}
            <motion.div
              className="bg-gray-800 rounded-2xl p-8 mb-8 border border-gray-700 hover:border-gray-600 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start space-x-6">
                {/* Profile Avatar Placeholder */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Linkedin className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-2xl font-bold text-white">LinkedIn</h3>
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">Professional</span>
                  </div>
                  
                  <p className="text-xl text-gray-300 mb-2">Priya Jha</p>
                  <p className="text-gray-400 text-sm mb-6">
                    Connect with me professionally and explore my journey.
                  </p>
                  
                  <a
                    href="https://linkedin.com/in/priya-jha"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-white text-black hover:bg-gray-200 px-6 py-3 font-bold transition-all duration-300 hover:shadow-lg hover:shadow-white/20">
                      Connect Now
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Additional Contact Methods */}
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              {/* GitHub Card */}
              <motion.a
                href="https://github.com/priya-jha"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-gray-600 transition-colors duration-300">
                    <Github className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">GitHub</h4>
                    <p className="text-gray-400 text-sm">@priya-jha</p>
                  </div>
                </div>
              </motion.a>

              {/* Email Card */}
              <motion.a
                href="mailto:priya@inbetabypriya.com"
                className="group bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-500 transition-colors duration-300">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Email</h4>
                    <p className="text-gray-400 text-sm">priya@inbetabypriya.com</p>
                  </div>
                </div>
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}