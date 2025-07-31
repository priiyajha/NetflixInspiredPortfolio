import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Twitter, Download } from "lucide-react";
import Header from "../components/header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
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

  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: "priya@inbetabypriya.com",
      href: "mailto:priya@inbetabypriya.com",
      color: "text-red-400"
    },
    {
      icon: Github,
      label: "GitHub",
      value: "@priya-jha",
      href: "https://github.com/priya-jha",
      color: "text-gray-400"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Priya Jha",
      href: "https://linkedin.com/in/priya-jha",
      color: "text-blue-400"
    },
    {
      icon: Twitter,
      label: "Twitter",
      value: "@inbetabypriya",
      href: "https://twitter.com/inbetabypriya",
      color: "text-blue-300"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-20 px-4 md:px-12 py-16">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Let's Connect
          </motion.h1>
          
          <motion.p
            className="text-lg text-netflix-light-gray mb-12 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Ready to collaborate on your next project or discuss exciting opportunities? 
            I'm always open to connecting with fellow developers, entrepreneurs, and visionaries.
          </motion.p>

          <motion.div
            className="grid md:grid-cols-2 gap-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {contactMethods.map((method, index) => (
              <motion.a
                key={method.label}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 bg-netflix-dark-gray rounded-lg hover:bg-netflix-light-gray/10 transition-all duration-300 transform hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center space-x-4">
                  <method.icon className={`w-8 h-8 ${method.color} group-hover:scale-110 transition-transform duration-300`} />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{method.label}</h3>
                    <p className="text-netflix-light-gray group-hover:text-white transition-colors duration-300">
                      {method.value}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Button
              onClick={handleDownloadResume}
              className="bg-netflix-red hover:bg-red-700 text-white px-8 py-4 rounded font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
              size="lg"
            >
              <Download className="w-5 h-5" />
              Download Resume
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}