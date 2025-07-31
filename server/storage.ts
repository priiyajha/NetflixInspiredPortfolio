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
        title: "E-commerce Platform",
        description: "A modern e-commerce platform built with React and Node.js, featuring real-time inventory management, secure payment processing, and responsive design. This platform handles thousands of daily transactions and provides an intuitive shopping experience.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        technologies: ["React", "Node.js", "MongoDB", "Stripe", "Redis"] as string[],
        category: "featured",
        liveUrl: "https://example-ecommerce.com",
        githubUrl: "https://github.com/example/ecommerce",
        featured: "true"
      },
      {
        id: "2",
        title: "Analytics Dashboard",
        description: "A comprehensive analytics dashboard with real-time data visualization, built using Vue.js and Python. Features include interactive charts, data filtering, and automated reporting for business intelligence.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        technologies: ["Vue.js", "Python", "PostgreSQL", "D3.js", "Docker"] as string[],
        category: "featured",
        liveUrl: "https://example-analytics.com",
        githubUrl: "https://github.com/example/analytics",
        featured: "true"
      },
      // Featured Coming Soon placeholders
      {
        id: "3",
        title: "Coming Soon",
        description: "An exciting new project in development. Stay tuned for updates on this innovative solution that will push the boundaries of modern web development.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        technologies: ["Coming Soon"] as string[],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true"
      },
      {
        id: "4",
        title: "Coming Soon",
        description: "Another groundbreaking project is currently in the works. This will showcase cutting-edge technology and innovative problem-solving approaches.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        technologies: ["Coming Soon"] as string[],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true"
      },
      // Web Development - Keep only 2 real ones
      {
        id: "5",
        title: "FarmFolio",
        description: "A comprehensive crop recommendation system designed to help farmers make informed decisions about their agricultural practices. Features intelligent recommendations and user-friendly interface.",
        image: "/attached_assets/ChatGPT Image Jul 31, 2025, 02_55_14 PM_1753965385040.png",
        technologies: ["HTML", "CSS", "JavaScript", "BotPress"] as string[],
        category: "web",
        liveUrl: "https://example-farmfolio.com",
        githubUrl: "https://github.com/example/farmfolio",
        featured: "false"
      },
      {
        id: "6",
        title: "Portfolio Website",
        description: "A modern portfolio website showcasing creative work with smooth animations and interactive elements. Built with React and styled with Tailwind CSS for optimal performance.",
        image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        technologies: ["React", "Tailwind CSS", "Framer Motion"] as string[],
        category: "web",
        liveUrl: "https://example-portfolio.com",
        githubUrl: "https://github.com/example/portfolio",
        featured: "false"
      },
      // Web Development Coming Soon placeholders
      {
        id: "7",
        title: "Coming Soon",
        description: "A revolutionary web application is being crafted with the latest technologies. This project will demonstrate advanced web development techniques and user experience design.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
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
