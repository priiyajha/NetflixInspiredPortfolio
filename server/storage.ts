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
        title: "Cazpro",
        description: "Built and scaled a leading college-focused merchandise brand from ground up as founder. Achieved 2.5M INR sales in 15 months and 200+ daily orders in 3 months through strategic D2C marketing, performance marketing campaigns, and data-driven analytics. Successfully executed profitable exit after establishing strong market presence in the college merch space.",
        image: "/attached_assets/trip-planner.png",
        video: "/attached_assets/20250731_1725_Seasons Through Travelers' Eyes_simple_compose_01k1g5c80efe0s652h0fdr7mjz_1753966935310.mp4",
        technologies: ["Shopify", "PHP", "HTML", "SEMrush", "Google Ads", "Meta Ads", "Klaviyo", "MailChimp"],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "D2C marketing strategy and execution",
          "Social media brand building and engagement",
          "Performance marketing with Google and Meta Ads",
          "B2C customer acquisition and retention",
          "SEO optimization for organic growth",
          "Email marketing campaigns with Klaviyo and MailChimp",
          "Analytics and data-driven decision making",
          "High-velocity sales operations and scaling"
        ],
        skills: ["D2C marketing", "social media", "performance marketing", "B2C", "SEO", "email marketing", "analytics"],
        goal: "Build and scale a leading college-focused merch brand, drive high-velocity sales, achieve profitable exit",
        kpis: ["Monthly sales", "order volume", "organic growth rate", "website traffic", "campaign ROI"],
        results: "2.5M INR sales in 15 months, 200+ daily orders in 3 months, successful exit",
        engagementType: "Founder (Full Time)",
        period: "May 2014 – Dec 2015"
      },
      {
        id: "2",
        title: "Millionth Mile Marketing",
        description: "Co-founded a growth agency that became an Andhra Pradesh top 5, racking up 40+ global clients, 2 years, $180K revenue, and 25 teammates. Built teams, scaled campaigns, won awards, and hustled for brands from Vizag to Europe. Brought a bold attitude to every pitch.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["Google Ads", "Meta Ads", "SEMrush", "Ahrefs", "Mailchimp", "HubSpot", "WordPress"],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "Strategic Google Ads campaign management and optimization",
          "Meta Ads scaling and performance marketing", 
          "Advanced SEO research and keyword strategy with SEMrush",
          "Comprehensive backlink analysis and content strategy with Ahrefs",
          "Email marketing automation and segmentation with Mailchimp",
          "CRM integration and lead nurturing workflows with HubSpot",
          "WordPress-based landing page and website development",
          "Performance analytics, reporting and growth optimization"
        ],
        skills: ["Growth marketing", "B2B sales", "team building", "media buying", "analytics", "design thinking"],
        goal: "Land marquee clients, drive high revenue growth, build a leading regional agency",
        kpis: ["Client acquisition", "revenue", "ad spend managed", "team size", "media features"],
        results: "$180K revenue in 2 years, 40+ clients (60% overseas), 10+ media features, top 5 agency recognition",
        engagementType: "Co-founder, Head of Growth (Full Time)",
        period: "2017 – Dec 2019"
      },
      {
        id: "3",
        title: "DigiPay",
        description: "Joined as first marketing hire, scaled the team to 28, and helped take revenue from $4M to $80M in 19 months. Drove growth with everything from guerrilla tactics to field ops. Orchestrated viral B2B installs and led the brand through major funding rounds.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["CleverTap", "AppsFlyer", "Amplitude", "Google Firebase", "Google Analytics", "SEMrush", "Branch.io"],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "Advanced user behavior tracking and segmentation with CleverTap",
          "Mobile attribution and campaign optimization with AppsFlyer",
          "Product analytics and user journey mapping with Amplitude",
          "Real-time database and mobile authentication with Google Firebase",
          "Comprehensive web and app analytics with Google Analytics",
          "SEO optimization and content strategy with SEMrush",
          "Deep linking and viral attribution with Branch.io",
          "Performance marketing and B2B conversion optimization"
        ],
        skills: ["B2B marketing", "field ops", "performance marketing", "attribution", "mobile marketing", "onboarding", "analytics"],
        goal: "Drive B2B installs, scale revenue, build top-tier marketing org",
        kpis: ["App downloads", "revenue growth", "team size", "lead volume", "merchant activation"],
        results: "$4M to $80M revenue, 30K B2B app installs, 500K merchant downloads, built team from 1 to 28",
        engagementType: "Head of Marketing (Full Time)",
        period: "Dec 2019 – Sep 2021"
      },
      {
        id: "4",
        title: "Inventrax",
        description: "Drove a 600% organic traffic jump for a warehouse automation SaaS in 4 months as a marketing consultant. Cracked the top 2 spots for three high-value keywords and turned traffic into leads with CRO and smart automation. Growth hacking, done right.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: "/attached_assets/20250731_1654_Neon Code Symphony_simple_compose_01k1g3kq5af70vc1a2b12hvja6_1753961284060.mp4",
        technologies: ["SEMrush", "Backlinko.io", "Ahrefs", "Google Analytics", "Google Search Console"],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "Advanced keyword research and ranking strategy with SEMrush",
          "Content strategy optimization using Backlinko.io methodology",
          "Comprehensive backlink analysis and acquisition with Ahrefs",
          "Traffic performance tracking and analysis with Google Analytics",
          "Search visibility and ranking monitoring with Google Search Console",
          "Programmatic SEO implementation for scale",
          "Conversion rate optimization and lead generation",
          "Email automation and lead nurturing systems"
        ],
        skills: ["Programmatic SEO", "CRO", "lead magnets", "email automation", "blog marketing"],
        goal: "Boost organic traffic, rank for Northstar keywords, generate high-quality B2B leads",
        kpis: ["Organic traffic growth", "keyword ranking", "lead volume", "conversion rates"],
        results: "600% traffic growth, ranked top 1-2 for 3 keywords, lead volume surge",
        engagementType: "Consultant (Freelance)",
        period: "2022"
      },
      {
        id: "11",
        title: "FDX Sports",
        description: "Turbocharged FDX into a million-dollar D2C brand in Europe. Drove sales from $10K to $120K/month in 6 months, spent half a million on ads, reworked CRO and email automation, and 2.5x'd average cart value. Did not just play the game, rewrote the playbook.",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["Shopify", "Google Ads", "Meta Ads", "Klaviyo", "SMSBump"],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "High-performance Shopify store optimization and scaling",
          "Strategic Google Ads campaigns with $500K+ spend management",
          "Meta Ads performance marketing and international expansion",
          "Advanced email automation and segmentation with Klaviyo",
          "SMS marketing campaigns and retention with SMSBump",
          "Conversion rate optimization and funnel building",
          "User-generated content strategy and implementation",
          "International D2C growth and scaling operations"
        ],
        skills: ["Performance marketing", "CRO", "funnel building", "D2C marketing", "UGC", "email/SMS automation"],
        goal: "10x sales, optimize for scale, automate funnel, drive international growth",
        kpis: ["Monthly sales", "ROAS", "AOV", "cart conversion rate", "organic growth"],
        results: "$10K to $120K/month sales, $500K+ ad spend, AOV up 2.5x",
        engagementType: "Consultant (Freelance)",
        period: "2023"
      },
      {
        id: "12",
        title: "Smart Learning Platform",
        description: "An adaptive e-learning platform that personalizes course content based on learning patterns, provides AI tutoring, and creates custom study schedules for optimal knowledge retention and skill development.",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["React & Next.js", "Node.js & Express", "PostgreSQL"],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "coming-soon",
        features: [
          "Personalized learning path generation",
          "AI-powered tutoring assistance",
          "Adaptive content difficulty adjustment",
          "Custom study schedule optimization",
          "Progress tracking and analytics",
          "Interactive skill assessments",
          "Peer collaboration features",
          "Knowledge retention monitoring"
        ],
        skills: null,
        goal: null,
        kpis: null,
        results: null,
        engagementType: null,
        period: null
      },
      {
        id: "13",
        title: "AI Content Generator",
        description: "A comprehensive content creation platform that generates high-quality blog posts, social media content, and marketing copy using advanced AI. Features SEO optimization and brand voice customization.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["React & Next.js", "Node.js & Express", "MongoDB"],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "coming-soon",
        features: [
          "AI-powered blog post generation",
          "Social media content creation",
          "SEO-optimized marketing copy",
          "Brand voice customization",
          "Content calendar management",
          "Multi-platform publishing",
          "Performance analytics tracking",
          "Content variation testing"
        ],
        skills: null,
        goal: null,
        kpis: null,
        results: null,
        engagementType: null,
        period: null
      },
      {
        id: "14",
        title: "Smart Home Automation",
        description: "An intelligent IoT platform that automates home devices, learns user preferences, optimizes energy consumption, and provides predictive maintenance alerts for a seamless smart home experience.",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["React & Next.js", "Node.js & Express", "PostgreSQL"],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "coming-soon",
        features: [
          "Automated device control and scheduling",
          "User preference learning algorithms",
          "Energy consumption optimization",
          "Predictive maintenance alerts",
          "Voice command integration",
          "Security system monitoring",
          "Weather-based automation",
          "Remote access and control"
        ],
        skills: null,
        goal: null,
        kpis: null,
        results: null,
        engagementType: null,
        period: null
      },
      {
        id: "15",
        title: "AI Health Monitor",
        description: "A comprehensive health tracking platform that monitors vital signs, predicts health risks, provides personalized wellness recommendations, and connects users with healthcare professionals when needed.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["React & Next.js", "Node.js & Express", "PostgreSQL"],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "coming-soon",
        features: [
          "Real-time vital signs monitoring",
          "Health risk prediction algorithms",
          "Personalized wellness recommendations",
          "Healthcare professional connections",
          "Medication reminder system",
          "Emergency alert notifications",
          "Health trend analysis",
          "Wearable device integration"
        ],
        skills: null,
        goal: null,
        kpis: null,
        results: null,
        engagementType: null,
        period: null
      },
      {
        id: "16",
        title: "AI Recipe Optimizer",
        description: "An intelligent cooking platform that creates personalized recipes based on dietary preferences, available ingredients, and nutritional goals. Features meal planning and grocery list automation.",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["React & Next.js", "Node.js & Express", "MongoDB"],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "coming-soon",
        features: [
          "Personalized recipe recommendations",
          "Ingredient-based recipe generation",
          "Nutritional goal optimization",
          "Dietary restriction accommodation",
          "Automated meal planning",
          "Smart grocery list generation",
          "Cooking time estimation",
          "Recipe difficulty adjustment"
        ],
        skills: null,
        goal: null,
        kpis: null,
        results: null,
        engagementType: null,
        period: null
      },

      // Web Development - Keep only 2 real ones
      {
        id: "5",
        title: "FarmFolio",
        description: "Farmfolio is an intelligent crop recommendation system that personalizes suggestions based on user inputs like geography, soil type, budget, area, and cultivation goals. Trained on curated datasets, it not only identifies the most suitable crops but also offers issue-specific fertilizer recommendations (e.g., for pests or soil fertility). The app integrates real-time weather and news updates through an interactive chatbot, enhanced with a personality agent to keep conversations engaging and a translator agent that uses NLP to detect and respond in the user's native language, even when typed phonetically in English. Built to unify diverse farming needs in one accessible platform.",
        image: "/attached_assets/ChatGPT Image Jul 31, 2025, 02_55_14 PM_1753965385040.png",
        video: "/attached_assets/1753954183383590_1753966280383.mp4",
        technologies: ["HTML/CSS", "JavaScript", "BotPress"],
        category: "web",
        liveUrl: "https://farmfolio-lilac.vercel.app/",
        githubUrl: "https://github.com/priiyajha/Farmfolio",
        featured: "false",
        status: "live",
        features: [
          "Personalized crop recommendations based on geography and soil",
          "Issue-specific fertilizer recommendations for pests and fertility",
          "Real-time weather integration for farming decisions",
          "Interactive chatbot with personality agent",
          "Multi-language NLP translator for native language support",
          "Curated dataset training for accurate suggestions",
          "Budget and area optimization analysis",
          "Unified platform for diverse farming needs"
        ],
        skills: null,
        goal: null,
        kpis: null,
        results: null,
        engagementType: null,
        period: null
      },
      {
        id: "6",
        title: "Trip Planner",
        description: "Trip Planner is a smart, collaborative travel planning platform that brings everything, destination discovery, personalized recommendations, real-time weather, transport options, and group itinerary planning, into one seamless web experience. With modern UI/UX and powerful backend integration, users can explore cities by category or season, manage bookings, and plan trips interactively, while admins maintain full control over content and insights through a dedicated dashboard.",
        image: "/attached_assets/trip-planner.png",
        video: "/attached_assets/20250731_1725_Seasons Through Travelers' Eyes_simple_compose_01k1g5c80efe0s652h0fdr7mjz_1753966935310.mp4",
        technologies: ["React & Next.js", "Node.js & Express", "PostgreSQL"],
        category: "web",
        liveUrl: "https://trip-planner-nu-one.vercel.app/",
        githubUrl: "https://github.com/priiyajha/Your-Tour-Partner",
        featured: "false",
        status: "live",
        features: [
          "Destination discovery with category-based exploration",
          "Personalized recommendations based on preferences",
          "Real-time weather integration and forecasts",
          "Comprehensive transport options comparison",
          "Collaborative group itinerary planning",
          "Interactive booking management system",
          "Season-specific city exploration guides",
          "Admin dashboard with content and analytics control"
        ],
        skills: null,
        goal: null,
        kpis: null,
        results: null,
        engagementType: null,
        period: null
      },
      {
        id: "7",
        title: "AI Mind Journal",
        description: "A mindful journaling application powered by AI that provides personalized insights, mood tracking, and mental health recommendations. Features secure data encryption and intelligent pattern recognition for emotional well-being.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["React & Next.js", "Node.js & Express", "PostgreSQL"],
        category: "web",
        liveUrl: "",
        githubUrl: "",
        featured: "false",
        status: "coming-soon",
        features: [
          "AI-powered personalized insights from journal entries",
          "Advanced mood tracking and pattern recognition",
          "Mental health recommendations and resources",
          "Secure end-to-end data encryption",
          "Intelligent emotional pattern analysis",
          "Personalized wellness suggestions",
          "Privacy-focused data handling",
          "Daily reflection prompts and guidance"
        ],
        skills: null,
        goal: null,
        kpis: null,
        results: null,
        engagementType: null,
        period: null
      },
      {
        id: "9",
        title: "AI Gym Guide",
        description: "An intelligent fitness companion that creates personalized workout plans, tracks progress with AI-powered form analysis, and provides real-time coaching. Features exercise recognition and adaptive training recommendations.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["React & Next.js", "Node.js & Express", "MongoDB"],
        category: "web",
        liveUrl: "",
        githubUrl: "",
        featured: "false",
        status: "coming-soon",
        features: [
          "AI-powered personalized workout plan creation",
          "Real-time form analysis and correction",
          "Progress tracking with intelligent insights",
          "Exercise recognition through computer vision",
          "Adaptive training recommendations",
          "Real-time coaching and feedback",
          "Fitness goal optimization",
          "Social fitness community integration"
        ],
        skills: null,
        goal: null,
        kpis: null,
        results: null,
        engagementType: null,
        period: null
      },
      {
        id: "10",
        title: "AI StayWise",
        description: "An intelligent accommodation platform that provides personalized lodging recommendations based on user preferences, budget, and travel patterns. Features AI-powered price predictions, local insights, and smart booking assistance for optimal travel experiences.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["React & Next.js", "Node.js & Express", "PostgreSQL"],
        category: "web",
        liveUrl: "",
        githubUrl: "",
        featured: "false",
        status: "coming-soon",
        features: [
          "AI-powered accommodation recommendations",
          "Smart price prediction algorithms",
          "Local insights and neighborhood analysis",
          "Budget optimization suggestions",
          "Travel pattern recognition",
          "Real-time availability tracking",
          "User preference learning system",
          "Integrated booking assistance"
        ],
        skills: null,
        goal: null,
        kpis: null,
        results: null,
        engagementType: null,
        period: null
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
        frontend: ["React.js", "Vue.js", "TypeScript", "Tailwind CSS"],
        backend: ["Node.js", "Python", "PostgreSQL", "AWS"]
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
      technologies: insertProject.technologies as string[],
      category: insertProject.category,
      liveUrl: insertProject.liveUrl || null,
      githubUrl: insertProject.githubUrl || null,
      featured: insertProject.featured || null,
      status: insertProject.status || "live",
      features: insertProject.features ? [...insertProject.features] : null,
      skills: insertProject.skills ? [...insertProject.skills] : null,
      goal: insertProject.goal || null,
      kpis: insertProject.kpis ? [...insertProject.kpis] : null,
      results: insertProject.results || null,
      engagementType: insertProject.engagementType || null,
      period: insertProject.period || null
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
      skills: {
        frontend: [...insertProfile.skills.frontend],
        backend: [...insertProfile.skills.backend]
      },
      social: insertProfile.social
    };
    this.profileData = profile;
    return profile;
  }
}

export const storage = new MemStorage();
