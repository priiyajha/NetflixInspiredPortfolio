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
        category: "fulltime",
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
        category: "consulting",
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
        category: "consulting",
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
        title: "Codiste",
        description: "Fractional CMO who built, trained, and turbocharged the marketing and outbound sales teams. 4x'd marketing output, 2.5x'd sales response rates, and baked AI and programmatic SEO into their DNA. Set up every process from social to cold DMs, always optimizing for impact.",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["Apollo", "LeadDino", "Phantom Buster", "Ahrefs", "Google Analytics", "Notion"],
        category: "consulting",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "Advanced contact discovery and team training with Apollo",
          "Lead qualification and sales process optimization with LeadDino",
          "Automated outreach and engagement scaling with Phantom Buster",
          "Programmatic SEO and competitive intelligence with Ahrefs",
          "Team performance tracking and optimization with Google Analytics",
          "Process documentation and workflow management with Notion",
          "Full-stack marketing and sales automation",
          "AI integration and programmatic marketing implementation"
        ],
        skills: ["Social", "organic", "B2B", "programmatic SEO", "copywriting", "analytics", "process optimization"],
        goal: "Build a high-output marketing org, automate lead gen, optimize funnel",
        kpis: ["Team output", "sales response rate", "lead volume", "organic traffic"],
        results: "4x team output, 2.5x sales response, full-stack process automation",
        engagementType: "Fractional CMO (Consulting)",
        period: "2024"
      },
      {
        id: "13",
        title: "ZO Labs",
        description: "As Head of Growth, took ZO Labs from stealth to 180K installs, built a 100K+ community, and shipped 10,000+ AI agent landing pages. Ran AI-led marketing sprints, bagged 120+ partnerships, and put ZO on the global stage. All hustle, zero fluff.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["HubSpot", "ActiveCampaign", "Firebase Studio", "AppsFlyer", "AppRadar", "WebEngage", "Discord", "Twitter", "LinkedIn", "Telegram", "Instagram"],
        category: "fulltime",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "Strategic growth planning and execution with HubSpot CRM",
          "AI-led marketing sprint campaigns with ActiveCampaign",
          "Advanced analytics and growth tracking with Firebase Studio",
          "App install optimization and attribution with AppsFlyer",
          "App store presence and monitoring with AppRadar",
          "User engagement and retention optimization with WebEngage",
          "Multi-platform community building across social channels",
          "Strategic partnership development and management"
        ],
        skills: ["Growth marketing", "product management", "AI automation", "community building", "partnerships"],
        goal: "Scale installs, community, and organic traffic, land strategic partnerships",
        kpis: ["App installs", "community growth", "landing pages shipped", "partnerships closed"],
        results: "180K installs, 100K+ community, 10K+ agents, 120+ partnerships, 50+ IRL events",
        engagementType: "Head of Growth (Full Time)",
        period: "Jan 2024 – Aug 2025"
      },
      {
        id: "14",
        title: "Zentrades",
        description: "Dropped into Zentrades as a marketing consultant, rewired their inbound engine, and took MQLs from single digits to 60 a month in 4 months. Engineered a 125% traffic spike, built 5000+ SEO-rich landing pages, and turned a good CRM into a qualified lead machine.",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["Programmatic SEO", "Google Analytics", "CRM", "marketing attribution tools"],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "Programmatic SEO with 5000+ landing pages",
          "Advanced Google Analytics implementation and tracking",
          "CRM optimization and lead qualification workflows",
          "Marketing attribution and conversion tracking",
          "Inbound marketing funnel optimization",
          "Technical SEO and site performance optimization",
          "Marketing analytics and performance reporting",
          "B2B lead generation and nurturing systems"
        ],
        skills: ["Technical SEO", "inbound marketing", "funnel building", "marketing analytics", "team leadership"],
        goal: "Scale high-quality B2B leads, boost organic traffic, optimize funnel stages",
        kpis: ["MQLs/month", "traffic growth", "MQL-to-demo ratio", "landing pages shipped"],
        results: "MQLs 9→60/month, 125% traffic growth, 3x demo conversion, 5000+ landing pages",
        engagementType: "Consultant (Freelance)",
        period: "2023"
      },
      {
        id: "15",
        title: "InboxBites",
        description: "Solo-built InboxBites, a microSaaS AI agent for Gmail, transforming newsletter chaos into snackable, swipeable, 50-word knowledge bites. Architected 60%+ of the code, GTM, UI/UX, and product strategy in 6 weeks. Already has 200+ waitlisters—built for hustlers who hate inbox overload.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["Replit Cloud Code (Anthropic)", "Gmail API", "PWA", "JavaScript"],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "AI-powered newsletter content processing and summarization",
          "Gmail API integration for seamless inbox management",
          "Progressive Web App (PWA) for cross-platform accessibility",
          "Swipeable interface for quick knowledge consumption",
          "50-word bite-sized content delivery system",
          "Smart content categorization and filtering",
          "Real-time waitlist and user engagement tracking",
          "Automated newsletter parsing and insight extraction"
        ],
        skills: ["Product management", "coding", "AI/ML logic", "UI/UX", "GTM", "content processing"],
        goal: "Turn newsletters into actionable micro-insights, deliver value via PWA",
        kpis: ["Waitlist signups", "engagement rate", "feature completion", "MVP timeline"],
        results: "MVP built in 6 weeks, 200+ waitlisters, 60% solo-coded, live waitlist",
        engagementType: "Founder (Side Hustle/MicroSaaS)",
        period: "2024"
      },
      {
        id: "16",
        title: "Solgames",
        description: "Co-built Soulgames, a GameFi dev toolkit, into a Solana hackathon winner and landed $150K in seed. Rallied a 3K-strong dev/gamer community, ran hackathons with 1K+ participants, and delivered a live MVP in 3 months. Paused by market chaos, but left a mark.",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["Solana", "Web3 tools", "tokenization protocols", "Discord", "Telegram"],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "GameFi development toolkit for Web2-to-Web3 transitions",
          "Solana blockchain integration and smart contract deployment",
          "Web3 tokenization protocols for in-game assets",
          "Discord community management and engagement systems",
          "Telegram bot automation for community operations",
          "Hackathon platform and participant management",
          "Developer onboarding and education programs",
          "Live MVP delivery and community feedback integration"
        ],
        skills: ["Growth marketing", "community building", "Web3 strategy", "hackathon ops", "program management"],
        goal: "Enable Web2-to-Web3 game transition, build dev/gamer ecosystem, MVP + community",
        kpis: ["Community size", "hackathon apps", "MVP delivery", "funding raised"],
        results: "3K devs/gamers, $150K seed, Solana hackathon top 10, 1K+ hackathon apps",
        engagementType: "Head of Growth, Co-founder",
        period: "Nov 2022 – May 2023"
      },
      {
        id: "17",
        title: "Martian Wallet",
        description: "Headed marketing at Martian Wallet, scaling installs by 50%, landing 400K+ new users, and doubling DApp transaction volumes from $1.2B to $2B. Launched a DApp that hit $1M daily volume in a month, forged 50+ partnerships, and kept the Web3 world buzzing.",
        image: "https://images.unsplash.com/photo-1559445368-28a7e73131b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["Aptos/Sui ecosystem", "DApp platform", "Chrome extension", "Discord", "Google Analytics"],
        category: "featured",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "Aptos/Sui blockchain ecosystem integration and optimization",
          "DApp platform development and user experience enhancement",
          "Chrome extension deployment and user acquisition campaigns",
          "Discord community building and engagement automation",
          "Google Analytics implementation for Web3 user tracking",
          "Partnership development and business development operations",
          "Transaction volume optimization and growth strategies",
          "Multi-chain wallet functionality and security protocols"
        ],
        skills: ["Web3 marketing", "community ops", "DApp growth", "partnerships", "content", "BD"],
        goal: "Grow user base, launch DApp, increase transaction volume, build global partnerships",
        kpis: ["Installs", "active users", "partnerships", "transaction volume", "community growth"],
        results: "1M+ installs, $2B+ volume, 400K new users, 50+ partnerships, $1M DApp daily",
        engagementType: "Head of Marketing (Full Time)",
        period: "May 2023 – Jan 2024"
      },

      // Web Development - Keep only 2 real ones
      {
        id: "5",
        title: "FarmFolio",
        description: "Farmfolio is an intelligent crop recommendation system that personalizes suggestions based on user inputs like geography, soil type, budget, area, and cultivation goals. Trained on curated datasets, it not only identifies the most suitable crops but also offers issue-specific fertilizer recommendations (e.g., for pests or soil fertility). The app integrates real-time weather and news updates through an interactive chatbot, enhanced with a personality agent to keep conversations engaging and a translator agent that uses NLP to detect and respond in the user's native language, even when typed phonetically in English. Built to unify diverse farming needs in one accessible platform.",
        image: "/attached_assets/ChatGPT Image Jul 31, 2025, 02_55_14 PM_1753965385040.png",
        video: "/attached_assets/1753954183383590_1753966280383.mp4",
        technologies: ["HTML/CSS", "JavaScript", "BotPress"],
        category: "sidehustle",
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
        category: "sidehustle",
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
      },

      // Keynote Projects
      {
        id: "keynote1",
        title: "TEDx Talk: The Future of Marketing Automation",
        description: "Delivered a captivating TEDx talk on how AI and automation are reshaping marketing landscapes. Shared insights from scaling multiple startups and the critical role of human creativity in an automated world.",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["Public Speaking", "TEDx", "Marketing Strategy", "AI"],
        category: "keynote",
        liveUrl: "",
        githubUrl: "",
        featured: "false",
        status: "completed",
        features: [
          "18-minute keynote presentation",
          "Live audience of 500+ attendees",
          "Streaming to 10K+ online viewers",
          "Interactive Q&A session",
          "Case studies from 3 successful startups",
          "AI automation demonstrations",
          "Future trends prediction",
          "Practical implementation strategies"
        ],
        skills: ["Public speaking", "storytelling", "marketing strategy", "AI trends"],
        goal: "Educate entrepreneurs on marketing automation best practices",
        kpis: ["Audience size", "engagement rate", "post-talk inquiries", "video views"],
        results: "500+ live audience, 10K+ online views, 50+ post-talk business inquiries",
        engagementType: "Keynote Speaker",
        period: "2024"
      },
      {
        id: "keynote2",
        title: "Growth Hacking Summit: Zero to Scale",
        description: "Keynote at Asia's largest growth summit sharing the playbook for taking companies from zero to million-dollar revenues. Deep dive into practical growth strategies that actually work.",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        technologies: ["Growth Strategy", "Performance Marketing", "Analytics", "Scaling"],
        category: "keynote",
        liveUrl: "",
        githubUrl: "",
        featured: "false",
        status: "completed",
        features: [
          "45-minute keynote presentation",
          "Live audience of 1200+ growth professionals",
          "Real case studies from FDX Sports and DigiPay",
          "Interactive growth framework demonstration",
          "Performance marketing deep dive",
          "Scaling strategies for different business models",
          "Q&A with growth leaders panel",
          "Networking session with 500+ attendees"
        ],
        skills: ["Growth marketing", "public speaking", "case study presentation", "framework development"],
        goal: "Share actionable growth strategies with Asia's top growth professionals",
        kpis: ["Audience size", "content downloads", "speaking rating", "follow-up connections"],
        results: "1200+ audience, 4.8/5 speaking rating, 200+ LinkedIn connections, 500+ framework downloads",
        engagementType: "Keynote Speaker",
        period: "2023"
      }
    ];

    sampleProjects.forEach(project => {
      this.projects.set(project.id, project);
    });

    this.profileData = {
      id: "1",
      name: "Farooq Chisty",
      title: "Farooq",
      subtitle: "Chisty",
      bio: "Farooq codes like he's curating a vibe, part full-stack dev, part automation whisperer, part marketing nerd. With the MERN stack at his fingertips and GenAI in his toolkit, he turns messy workflows into seamless systems. Beyond code, he leads with clarity, from TEDx stages to NSS teams, blending tech, voice, and vision. Quick to learn, faster to build, and always rewriting the rules, in beta, by choice.",
      mission: "Transforming complex workflows into elegant solutions through the perfect blend of technology, automation, and strategic thinking.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      email: "farooqsheik52543@gmail.com",
      phone: "+91-9878167456",
      location: "New Delhi, India",
      resumeUrl: "/resume.pdf",
      skills: {
        frontend: ["React.js", "Vue.js", "TypeScript", "Tailwind CSS"],
        backend: ["Node.js", "Python", "PostgreSQL", "AWS"]
      },
      social: {
        linkedin: "https://linkedin.com/in/farooqchisty",
        github: "https://github.com/farooqchisty",
        twitter: "https://twitter.com/farooqchisty"
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
