import { type Project, type InsertProject, type Profile, type InsertProfile } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  getProfile(): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;
  private profileData: Profile | undefined;

  constructor() {
    this.projects = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample portfolio data (only 2 real projects per category)
    const sampleProjects: Project[] = [
      // Featured Projects - Keep only 2 real ones
      {
        id: "1",
        title: "AI Content Generator",
        description: "An intelligent content generation platform powered by advanced AI models. Creates high-quality blog posts, social media content, and marketing copy with real-time editing and customization features.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["Next.js", "OpenAI GPT", "PostgreSQL", "TypeScript", "Tailwind CSS"] as string[],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true"
      },
      {
        id: "2",
        title: "Smart Finance Tracker",
        description: "A comprehensive personal finance management system with AI-driven insights, expense categorization, budget recommendations, and investment tracking. Features real-time notifications and predictive analytics.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["React", "Node.js", "Machine Learning", "Chart.js", "MongoDB"] as string[],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true"
      },
      // Featured Coming Soon placeholders
      {
        id: "3",
        title: "AI Code Reviewer",
        description: "An intelligent code review assistant that analyzes code quality, suggests improvements, detects potential bugs, and ensures best practices. Integrates with popular version control systems.",
        image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["Python", "FastAPI", "AI/ML", "Docker", "Redis"] as string[],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true"
      },
      {
        id: "4",
        title: "Real-time Collaboration Hub",
        description: "A modern workspace platform enabling seamless team collaboration with real-time document editing, video conferencing, project management, and AI-powered meeting summarization.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["Vue.js", "Socket.io", "Express", "WebRTC", "PostgreSQL"] as string[],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true"
      },
      {
        id: "8",
        title: "AI Interview Platform",
        description: "An intelligent interview platform that conducts automated technical and behavioral interviews using advanced AI. Features real-time code evaluation, sentiment analysis, and detailed candidate assessments with personalized feedback.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["React", "Python", "OpenAI", "WebRTC", "TensorFlow", "Node.js"] as string[],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true"
      },
      // Web Development - Keep only 2 real ones
      {
        id: "5",
        title: "FarmFolio",
        description: "Farmfolio is an intelligent crop recommendation system that personalizes suggestions based on user inputs like geography, soil type, budget, area, and cultivation goals. Trained on curated datasets, it not only identifies the most suitable crops but also offers issue-specific fertilizer recommendations (e.g., for pests or soil fertility). The app integrates real-time weather and news updates through an interactive chatbot, enhanced with a personality agent to keep conversations engaging and a translator agent that uses NLP to detect and respond in the user's native language, even when typed phonetically in English. Built to unify diverse farming needs in one accessible platform.",
        image: "/attached_assets/ChatGPT Image Jul 31, 2025, 02_55_14 PM_1753965385040.png",
        video: "/attached_assets/1753954183383590_1753966280383.mp4",
        technologies: ["HTML", "CSS", "JavaScript", "BotPress"] as string[],
        category: "web",
        liveUrl: "https://farmfolio-lilac.vercel.app/",
        githubUrl: "https://github.com/priiyajha/Farmfolio",
        featured: "false"
      },
      {
        id: "6",
        title: "Trip Planner",
        description: "Trip Planner is a smart, collaborative travel planning platform that brings everything, destination discovery, personalized recommendations, real-time weather, transport options, and group itinerary planning, into one seamless web experience. With modern UI/UX and powerful backend integration, users can explore cities by category or season, manage bookings, and plan trips interactively, while admins maintain full control over content and insights through a dedicated dashboard.",
        image: "/attached_assets/trip-planner.png",
        video: "/attached_assets/20250731_1725_Seasons Through Travelers' Eyes_simple_compose_01k1g5c80efe0s652h0fdr7mjz_1753966935310.mp4",
        technologies: ["React.js", "Node.js", "Express.js", "Firebase", "PostgreSQL"] as string[],
        category: "web",
        liveUrl: "https://trip-planner-nu-one.vercel.app/",
        githubUrl: "https://github.com/priiyajha/Your-Tour-Partner",
        featured: "false"
      },
      // Web Development Coming Soon placeholders
      {
        id: "7",
        title: "Coming Soon",
        description: "A revolutionary web application is being crafted with the latest technologies. This project will demonstrate advanced web development techniques and user experience design.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["Coming Soon"] as string[],
        category: "web",
        liveUrl: "",
        githubUrl: "",
        featured: "false"
      },
      {
        id: "8",
        title: "Coming Soon",
        description: "An innovative web solution is in development that will showcase modern frameworks and best practices in web development. Exciting features are being implemented.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["Coming Soon"] as string[],
        category: "web",
        liveUrl: "",
        githubUrl: "",
        featured: "false"
      }
    ];

    sampleProjects.forEach(project => {
      this.projects.set(project.id, project);
    });

    this.profileData = {
      id: "1",
      name: "Priya Jha",
      title: "Priya",
      subtitle: "Jha",
      bio: "Priya codes like she's curating a vibe, part full-stack dev, part automation whisperer, part marketing nerd. With the MERN stack at her fingertips and GenAI in her toolkit, she turns messy workflows into seamless systems. Beyond code, she leads with clarity, from TEDx stages to NSS teams, blending tech, voice, and vision. Quick to learn, faster to build, and always rewriting the rules, in beta, by choice.",
      mission: "Transforming complex workflows into elegant solutions through the perfect blend of technology, automation, and strategic thinking.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      email: "contact@portfolio.com",
      phone: "+1 (234) 567-8900",
      location: "San Francisco, CA",
      resumeUrl: "/resume.pdf",
      skills: {
        frontend: ["React.js", "Vue.js", "TypeScript", "Tailwind CSS"] as string[],
        backend: ["Node.js", "Python", "PostgreSQL", "AWS"] as string[]
      },
      social: {
        linkedin: "https://linkedin.com/in/example",
        github: "https://github.com/example",
        twitter: "https://twitter.com/example"
      }
    };
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      project => project.category === category
    );
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      project => project.featured === "true"
    );
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { 
      id,
      title: insertProject.title,
      description: insertProject.description,
      image: insertProject.image,
      video: insertProject.video || null,
      technologies: insertProject.technologies,
      category: insertProject.category,
      liveUrl: insertProject.liveUrl || null,
      githubUrl: insertProject.githubUrl || null,
      featured: insertProject.featured || null
    };
    this.projects.set(id, project);
    return project;
  }

  async getProfile(): Promise<Profile | undefined> {
    return this.profileData;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const profile: Profile = { 
      id,
      name: insertProfile.name,
      title: insertProfile.title,
      subtitle: insertProfile.subtitle,
      bio: insertProfile.bio,
      mission: insertProfile.mission,
      image: insertProfile.image,
      email: insertProfile.email,
      phone: insertProfile.phone,
      location: insertProfile.location,
      resumeUrl: insertProfile.resumeUrl || null,
      skills: insertProfile.skills,
      social: insertProfile.social
    };
    this.profileData = profile;
    return profile;
  }
}

export const storage = new MemStorage();
