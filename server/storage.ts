import { randomUUID } from "crypto";
import type { Profile, Project, InsertProfile, InsertProject } from "@shared/schema";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  getProfile(): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
}

class MemStorage implements IStorage {
  private projects = new Map<string, Project>();
  private profileData: Profile | undefined;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    const sampleProjects: Project[] = [
      // Founded Startups
      {
        id: "1",
        title: "Cazpro",
        description: "Built and scaled Cazpro, a D2C college merch brand, from a dorm room idea at 17 to a 2.5M INR sales machine in 15 months. Survived near shutdowns, sold to a local industrialist, and handled everything from code to partnerships. Hustled hard, shipped harder.",
        image: "/attached_assets/Cazpro_1754913612013.jpeg",
        video: "/attached_assets/1_1754491684471.mp4",
        gallery: ["/attached_assets/1_1_1754913832087.jpeg", "/attached_assets/1_2_1754913836591.jpeg"],
        technologies: ["CleverTap", "AppsFlyer", "Amplitude", "Google Firebase", "Google Analytics", "SEMrush", "Branch.io"],
        category: "startup",
        liveUrl: "https://cazpro.com",
        githubUrl: "",
        featured: "true",
        status: "live",
        features: [
          "Comprehensive freelancer-client matching platform",
          "Advanced project management and collaboration tools",
          "Secure payment processing and escrow system",
          "Skill-based matching algorithm for optimal connections",
          "Real-time messaging and communication features",
          "Portfolio showcase and professional profiles",
          "Review and rating system for quality assurance",
          "Mobile-responsive design for cross-platform access"
        ],
        skills: ["D2C marketing", "e-commerce", "college marketing", "brand building", "operations", "partnerships", "startup scaling"],
        goal: "Build and scale D2C college merch brand from dorm room to market leader",
        kpis: ["Revenue growth", "product sales", "college partnerships", "brand recognition", "market expansion"],
        results: "2.5M INR revenue in 15 months, scaled from dorm room to acquisition, handled end-to-end operations",
        engagementType: "Founder",
        period: "May 2014 – Dec 2015"
      },

      // Full-time Gigs
      {
        id: "3",
        title: "DigiPe",
        description: "Joined DigiPe as Head of Growth, scaling their fintech platform from startup to market leader. Drove user acquisition, optimized conversion funnels, and built growth systems that delivered consistent month-over-month expansion in the competitive digital payments space.",
        image: "/attached_assets/DigiPe_1754914961127.jpeg",
        video: "/attached_assets/3_1754492376019.mp4",
        gallery: ["/attached_assets/3_1_1754915141952.jpeg", "/attached_assets/3_2_1754915146922.jpeg", "/attached_assets/3_3_1754915150153.jpeg", "/attached_assets/3_4_1754915153234.jpeg"],
        technologies: ["CleverTap", "AppsFlyer", "Amplitude", "Google Firebase", "Google Analytics", "SEMrush", "Branch.io"],
        category: "fulltime",
        liveUrl: "https://digipe.com",
        githubUrl: "",
        featured: "true",
        status: "live",
        features: [
          "Digital payment processing and wallet solutions",
          "Multi-currency support and international transfers",
          "Advanced fraud detection and security protocols",
          "Merchant dashboard and payment analytics",
          "API integration for e-commerce platforms",
          "Real-time transaction monitoring",
          "Customer support and dispute resolution",
          "Compliance with banking regulations and KYC"
        ],
        skills: ["B2B marketing", "field ops", "performance marketing", "attribution", "mobile marketing", "onboarding", "analytics"],
        goal: "Drive B2B installs, scale revenue, build top-tier marketing org",
        kpis: ["App downloads", "revenue growth", "team size", "lead volume", "merchant activation"],
        results: "$4M to $80M revenue, 30K B2B app installs, 500K merchant downloads, built team from 1 to 28",
        engagementType: "Head of Marketing (Full Time)",
        period: "Dec 2019 – Sep 2021"
      },
      
      {
        id: "8",
        title: "FDX Sports",
        description: "Head of Growth at FDX Sports, scaling India's premier sports equipment platform. Built growth systems that drove 400% user acquisition, optimized conversion funnels, and established partnerships that expanded market reach across multiple sports categories.",
        image: "/attached_assets/FD_1754915223801.jpeg",
        video: "/attached_assets/5_1754499213095.mov",
        gallery: ["/attached_assets/5_1_1754915349881.jpeg", "/attached_assets/5_2_1754915353185.jpeg", "/attached_assets/5_3_1754915356711.jpeg"],
        technologies: ["Shopify", "Google Ads", "Meta Ads", "Klaviyo", "SMSBump"],
        category: "consulting",
        liveUrl: "https://fdxsports.com",
        githubUrl: "",
        featured: "true",
        status: "live",
        features: [
          "Comprehensive sports equipment catalog and inventory",
          "Advanced product filtering and recommendation engine",
          "Multi-sport category management and expertise",
          "User reviews and rating system for quality assurance",
          "Partnership integration with sports brands and vendors",
          "Mobile-optimized shopping experience",
          "Real-time inventory and availability tracking",
          "Customer support and product consultation services"
        ],
        skills: ["Growth marketing", "sports industry expertise", "partnership development", "e-commerce optimization", "team leadership"],
        goal: "Scale India's leading sports equipment platform and expand market reach",
        kpis: ["User acquisition", "conversion rate", "partnership growth", "revenue expansion"],
        results: "400% user growth, 60% conversion improvement, 50+ brand partnerships, 300% revenue increase",
        engagementType: "Head of Growth (Full Time)",
        period: "2022 – 2023"
      },

      {
        id: "12",
        title: "Codiste",
        description: "Joined Codiste as Technical Lead to scale development operations and optimize team productivity. Implemented automation systems, refined development workflows, and established quality standards that improved delivery speed and code quality across multiple client projects.",
        image: "/attached_assets/Codist_1754915382953.jpeg",
        video: "/attached_assets/6_1754494216948.mp4",
        gallery: ["/attached_assets/6_1_1754915456506.jpeg", "/attached_assets/6_2_1754915459647.jpeg"],
        technologies: ["Apollo", "LeadDino", "Phantom Buster", "Ahrefs", "Google Analytics", "Notion"],
        category: "consulting",
        liveUrl: "https://codiste.com",
        githubUrl: "",
        featured: "true",
        status: "live",
        features: [
          "Custom software development and consulting services",
          "Full-stack web and mobile application development",
          "DevOps automation and CI/CD pipeline implementation",
          "Quality assurance and testing framework optimization",
          "Code review and technical documentation standards",
          "Client project management and delivery tracking",
          "Team productivity tools and workflow automation",
          "Technical leadership and mentoring programs"
        ],
        skills: ["Technical leadership", "process optimization", "team management", "automation", "quality assurance"],
        goal: "Scale development operations and improve team productivity",
        kpis: ["Team output", "code quality", "delivery speed", "client satisfaction"],
        results: "4x team output, 2.5x sales response, full-stack process automation",
        engagementType: "Technical Lead (Full Time)",
        period: "2024"
      },

      {
        id: "11",
        title: "Zo Labs",
        description: "Head of Growth who scaled Zo Labs from stealth to 180K installs and built 100K+ community with 10K+ AI agents. Led partnerships, growth campaigns, and community building that established the platform as a leader in the AI agent ecosystem.",
        image: "/attached_assets/Zo-Labs_1754915521507.jpeg",
        video: "/attached_assets/7_1754494812964.mp4",
        gallery: ["/attached_assets/7_1_1754915591607.jpeg", "/attached_assets/7_2_1754915598780.jpeg"],
        technologies: ["HubSpot", "ActiveCampaign", "Firebase Studio", "AppsFlyer", "AppRadar", "WebEngage", "Discord", "Twitter", "LinkedIn", "Telegram", "Instagram"],
        category: "fulltime",
        liveUrl: "https://zolabs.ai",
        githubUrl: "",
        featured: "true",
        status: "live",
        features: [
          "AI agent development and deployment platform",
          "No-code agent builder with intuitive interface",
          "Community marketplace for AI agents and templates",
          "Advanced analytics and performance monitoring",
          "Integration with major AI models and APIs",
          "Real-time collaboration and team management",
          "Scalable cloud infrastructure for agent hosting",
          "Comprehensive documentation and learning resources"
        ],
        skills: ["Growth marketing", "product management", "AI automation", "community building", "partnerships"],
        goal: "Scale installs, community, and organic traffic, land strategic partnerships",
        kpis: ["App installs", "community growth", "landing pages shipped", "partnerships closed"],
        results: "180K installs, 100K+ community, 10K+ agents, 120+ partnerships, 50+ IRL events",
        engagementType: "Head of Growth (Full Time)",
        period: "Jan 2024 – Aug 2025"
      },

      {
        id: "17",
        title: "Martian Wallet",
        description: "Headed marketing at Martian Wallet, scaling installs by 50%, landing 400K+ new users, and doubling DApp transaction volumes from $1.2B to $2B. Launched a DApp that hit $1M daily volume in a month, forged 50+ partnerships, and kept the Web3 world buzzing.",
        image: "/attached_assets/Martin-W_1754915638509.jpeg",
        video: "/attached_assets/11_1754497873112.mov",
        gallery: ["/attached_assets/11_1_1754915721715.jpeg", "/attached_assets/11_2_1754915725194.jpeg"],
        technologies: ["Aptos/Sui ecosystem", "DApp platform", "Chrome extension", "Discord", "Google Analytics"],
        category: "fulltime",
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

      // Side Hustles
      {
        id: "18",
        title: "GEOptimer",
        description: "Founder and builder of GEOptimer, a micro-SaaS that scores and audits website content for LLM/AI engine visibility—think SEO for AI, not just search. Enter a URL, get a GEO Score, action-packed report, and clear next steps in seconds. Built for growth-obsessed marketers.",
        image: "/attached_assets/GEOptimer_1754915993193.jpeg",
        video: "/attached_assets/12_1754497096211.mp4",
        gallery: [],
        technologies: ["Replit", "Supabase", "Node.js", "Cursor", "Cloud Code", "custom scripts"],
        category: "sidehustle",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "AI-powered website content scoring for LLM visibility",
          "Comprehensive GEO Score generation and reporting",
          "URL-based instant auditing and analysis",
          "Action-packed reports with clear next steps",
          "Custom scripts for content optimization",
          "Supabase backend for data management",
          "Replit cloud development environment",
          "Real-time website content analysis"
        ],
        skills: ["AI SEO", "product management", "SaaS engineering", "growth analytics", "reporting"],
        goal: "Optimize websites for generative engine visibility and citations",
        kpis: ["GEO Score", "report depth", "user activation", "actionable insights delivered"],
        results: "Comprehensive reports in seconds, instant action items, live MVP",
        engagementType: "Founder (Solo Builder)",
        period: "2025 – ongoing"
      },

      {
        id: "19",
        title: "Growth Opportunity Agent",
        description: "Built a micro-SaaS agent that surfaces untapped digital growth opportunities for startups—automating what founders and marketers miss. Scans all digital touchpoints and delivers actionable insights, making \"where do I grow next?\" a one-click answer.",
        image: "/attached_assets/GrowthOp_1754916035395.jpeg",
        video: "/attached_assets/13_1754497974190.mp4",
        gallery: [],
        technologies: ["Replit", "Node.js", "Cloud Code", "Cursor", "custom logic"],
        category: "sidehustle",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "AI-powered market opportunity identification and analysis",
          "Competitor weakness detection and exploitation strategies",
          "Multi-channel growth opportunity mapping",
          "ROI prediction and priority ranking system",
          "Real-time market trend analysis and alerts",
          "Automated growth strategy generation",
          "Integration with major analytics platforms",
          "Custom reporting and dashboard visualization"
        ],
        skills: ["Growth analysis", "automation", "product design", "digital strategy"],
        goal: "Unlock growth channels for startups instantly",
        kpis: ["Growth opps surfaced", "activation rate", "time-to-value"],
        results: "Opportunities delivered in real time, MVP ready, beta users onboard",
        engagementType: "Founder (Micro-SaaS)",
        period: "2025 – ongoing"
      },

      {
        id: "20",
        title: "Reply Agent (Auto-Commenter)",
        description: "Engineering a Reply Agent that auto-generates and posts targeted replies across LinkedIn, Twitter, and Reddit. Comment up to 150x a day, all automated and prompt-driven—think hustle in a headless browser. Launching with a waitlist on Product Hunt, August 25.",
        image: "/attached_assets/ReplyAgent_1754916074277.jpeg",
        video: "/attached_assets/14_1754499265362.mp4",
        gallery: [],
        technologies: ["Replit", "Cursor", "Cloud Code", "custom scripts"],
        category: "sidehustle",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "AI-powered contextual comment generation",
          "Multi-platform social media integration",
          "Brand voice and tone consistency",
          "Sentiment analysis and response optimization",
          "Automated engagement scheduling",
          "Real-time content monitoring and response",
          "Custom response templates and personalization",
          "Analytics and engagement tracking dashboard"
        ],
        skills: ["Automation", "headless browser ops", "prompt engineering", "multi-channel growth"],
        goal: "Automate replies for inbound, outreach, and community engagement at scale",
        kpis: ["Replies/day", "engagement", "conversion rate", "waitlist signups"],
        results: "150 auto-comments/day, Product Hunt launch scheduled, early demand",
        engagementType: "Founder (Micro-SaaS)",
        period: "2025 – ongoing"
      },

      {
        id: "21",
        title: "Internal Linking Agent",
        description: "Launching a plug-and-play internal linking agent for founders strapped on SEO budgets—instantly optimize content for search and LLMs. Built on Node.js, React, and custom logic, delivers fast actionable traffic/visibility gains. Shipping first week of September.",
        image: "/attached_assets/InternalLA_1755104029826.jpeg",
        video: "/attached_assets/15_1754499301804.mp4",
        gallery: [],
        technologies: ["Replicate", "Node.js", "React.js", "Cloud Code", "custom logic"],
        category: "sidehustle",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "Automated content analysis and semantic mapping",
          "Strategic internal link opportunity identification",
          "Contextual anchor text generation",
          "SEO performance impact analysis",
          "Bulk link suggestion export",
          "Page authority flow optimization",
          "Custom linking strategy recommendations",
          "Real-time content scanning and updates"
        ],
        skills: ["SEO automation", "React development", "SaaS engineering", "content strategy"],
        goal: "Drive internal linking + AI visibility for resource-constrained sites",
        kpis: ["Pages optimized", "time-to-optimize", "user retention"],
        results: "Live in September, beta user waitlist, agent workflow ready",
        engagementType: "Founder (Micro-SaaS)",
        period: "2025 – ongoing"
      },

      {
        id: "22",
        title: "Content Automation (Reddit → LinkedIn)",
        description: "Automated my LinkedIn content pipeline by scraping Reddit for trending AI/agent pain points, converting topics into hooks, and posting on LinkedIn with a human-in-the-loop review. All my posts now flow from this. Soon to be productized for other creators.",
        image: "/attached_assets/ContentAuto (1)_1755102943967.jpg",
        video: "/attached_assets/16_1754499401231.mp4",
        gallery: [],
        technologies: ["N8n", "RapidAPI", "CMS", "Reddit API", "LinkedIn API"],
        category: "sidehustle",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "Automated Reddit trending topic discovery",
          "AI-powered content transformation and adaptation",
          "Professional tone adjustment for LinkedIn audience",
          "Engagement pattern analysis and optimization",
          "Multi-platform content scheduling and posting",
          "Sentiment analysis and brand alignment",
          "Custom content templates and personalization",
          "Performance tracking and content analytics"
        ],
        skills: ["Automation", "scraping", "prompt engineering", "workflow design"],
        goal: "Turn Reddit trends into LinkedIn-ready content, automate ideation",
        kpis: ["Posts generated", "engagement rate", "review-to-post time"],
        results: "Automated 100% of LinkedIn pipeline, human QA in loop, next step: SaaS",
        engagementType: "Founder/Operator",
        period: "2025 – ongoing"
      },

      {
        id: "23",
        title: "Blog Automation (Purple City MCP)",
        description: "Built a flow to auto-repurpose trending articles via Purple City MCP and RSS, turning them into original blog posts with a human-in-the-loop review. All powered by n8n and will soon power InboxBites' blog at scale.",
        image: "/attached_assets/BlogAuto_1754916159539.jpeg",
        video: "/attached_assets/17_1754499849424.mp4",
        gallery: [],
        technologies: ["n8n", "Purple City MCP", "RSS feeds", "CMS"],
        category: "sidehustle",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "Automated content research and topic generation",
          "MCP-powered content creation and optimization",
          "SEO keyword integration and meta tag generation",
          "Multi-platform publishing automation",
          "Content performance tracking and analytics",
          "Editorial workflow with approval gates",
          "Brand voice consistency enforcement",
          "Scheduled content calendar management"
        ],
        skills: ["Content automation", "API integration", "workflow building"],
        goal: "Automate discovery and repurposing of trending content for blogs",
        kpis: ["Articles sourced", "posts published", "time saved per post"],
        results: "Deployed flow, InboxBites blog launch pending",
        engagementType: "Founder/Builder",
        period: "2025 – ongoing"
      },

      {
        id: "24",
        title: "Lead Generator Agent (LinkedIn, Twitter, Reddit)",
        description: "Created an agent to scrape, filter, and funnel target profiles talking about specific pain points on LinkedIn, Twitter, and Reddit—automates profile discovery and dashboarding, saving 60% of lead gen time. Frees founders and marketers to focus on closing, not scraping.",
        image: "/attached_assets/LeadGenAg_1754916199494.jpeg",
        video: "/attached_assets/18_1754499898932.mp4",
        gallery: [],
        technologies: ["N8n", "platform APIs", "dashboard (custom)"],
        category: "sidehustle",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "Multi-platform lead identification and targeting",
          "AI-powered prospect qualification and scoring",
          "Automated personalized outreach sequences",
          "Social media engagement pattern analysis",
          "Lead nurturing workflow automation",
          "CRM integration and pipeline management",
          "Performance tracking and conversion analytics",
          "Compliance-aware engagement protocols"
        ],
        skills: ["Lead scraping", "automation", "enrichment", "workflow engineering"],
        goal: "Automate discovery + outreach for B2B leads",
        kpis: ["Profiles scraped", "leads enriched", "time saved"],
        results: "60% lead gen time saved, dashboarded leads, live beta",
        engagementType: "Founder (Micro-SaaS)",
        period: "2025 – ongoing"
      },

      {
        id: "25",
        title: "AGENTSY",
        description: "Sold over $2M in digital products via AGENTSY—performance marketing funnels at scale. Ran campaigns on Facebook/Google, moved 20L+ INR in 6 months, sold e-books, templates, and downloadables. Built funnels, ran the stack, shipped results.",
        image: "/attached_assets/Agentsy_1754916226315.jpeg",
        video: "/attached_assets/19_1754500081499.mp4",
        gallery: [],
        technologies: ["ClickFunnels", "Hotcart", "Shopify", "WordPress", "Facebook Ads", "Google Ads", "GTM"],
        category: "sidehustle",
        liveUrl: "",
        githubUrl: "",
        featured: "true",
        status: "completed",
        features: [
          "AI agent marketplace with discovery and filtering",
          "Multi-agent workflow orchestration platform",
          "Real-time performance monitoring and analytics",
          "Enterprise integration capabilities",
          "Custom agent development tools",
          "Automated deployment and scaling",
          "Usage tracking and billing management",
          "API gateway for agent communication"
        ],
        skills: ["Performance marketing", "funnel building", "digital sales", "analytics"],
        goal: "Scale digital product sales via paid channels",
        kpis: ["Revenue", "funnel conversion", "ad spend ROI"],
        results: "$2M+ sales, 20L+ INR in 6 months, high-volume funnel ops",
        engagementType: "Founder (Solo)",
        period: "2025 – ongoing"
      },

      {
        id: "15",
        title: "InboxBites",
        description: "Solo-built InboxBites, a microSaaS AI agent for Gmail, transforming newsletter chaos into snackable, swipeable, 50-word knowledge bites. MVP in 6 weeks with 200+ waitlisters and 60% solo-coded, live waitlist driving organic engagement.",
        image: "/attached_assets/Inboxbites_1755104402481.png",
        video: "/attached_assets/9_1754495180203.mov",
        gallery: ["/attached_assets/9_1_1754914566747.jpeg", "/attached_assets/9_2_1754914569430.jpeg"],
        technologies: ["Replit Cloud Code (Anthropic)", "Gmail API", "PWA", "JavaScript"],
        category: "startup",
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
        description: "Co-built Solgames, a GameFi dev toolkit, into a Solana hackathon winner and landed $150K in seed. Rallied a 3K-strong dev/gamer community, ran hackathons with 1K+ participants, and delivered a live MVP in 3 months. Paused by market chaos, but left a mark.",
        image: "/attached_assets/Solgames_1755105321545.jpeg",
        video: "/attached_assets/10_video_1754917764906.mov",
        gallery: ["/attached_assets/10_1_1754914704093.jpeg", "/attached_assets/10_2_1754914710027.jpeg"],
        technologies: ["Solana", "Web3 tools", "tokenization protocols", "Discord", "Telegram"],
        category: "startup",
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

      // Consulting/Fractional CMO
      {
        id: "2",
        title: "Millionth Mile Marketing",
        description: "Millionth Mile Marketing is a comprehensive digital marketing platform that provides advanced marketing automation, campaign management, and analytics solutions. Built for businesses looking to scale their marketing efforts with data-driven strategies and real-time performance insights.",
        image: "/attached_assets/MMM_1754914789532.jpeg",
        video: "/attached_assets/2_1754492193766.mp4",
        gallery: ["/attached_assets/2_1_1754914900813.jpeg", "/attached_assets/2_2_1754914903994.jpeg"],
        technologies: ["Google Ads", "Meta Ads", "SEMrush", "Ahrefs", "Mailchimp", "HubSpot", "WordPress"],
        category: "startup",
        liveUrl: "https://millionthmiledgtl.com",
        githubUrl: "",
        featured: "true",
        status: "live",
        features: [
          "Advanced marketing automation and workflow management",
          "Multi-channel campaign management and optimization",
          "Real-time analytics and performance tracking",
          "Customer segmentation and targeted messaging",
          "A/B testing framework for campaign optimization",
          "Integration with major advertising platforms",
          "ROI tracking and conversion analytics",
          "White-label solutions for agencies"
        ],
        skills: ["Marketing automation", "campaign optimization", "analytics", "platform development", "client management"],
        goal: "Automate and scale marketing operations for growing businesses",
        kpis: ["Campaign performance", "client retention", "ROI improvement", "platform adoption"],
        results: "300% campaign efficiency increase, 150% client ROI improvement, 95% client retention",
        engagementType: "Founder & Marketing Strategist",
        period: "2021 – Present"
      },

      {
        id: "4",
        title: "Inventrax",
        description: "Inventrax is a comprehensive inventory management system designed for businesses of all sizes. Features real-time tracking, automated reordering, and advanced analytics to optimize stock levels and reduce operational costs.",
        image: "/attached_assets/Inventrax_1754916342697.jpeg",
        video: "/attached_assets/4_1754493466751.mov",
        gallery: ["/attached_assets/4_1_1754916584934.jpeg", "/attached_assets/4_2 (1)_1754916589241.jpg", "/attached_assets/4_3_1754916594959.jpeg"],
        technologies: ["SEMrush", "Backlinko.io", "Ahrefs", "Google Analytics", "Google Search Console"],
        category: "consulting",
        liveUrl: "https://inventrax.com",
        githubUrl: "",
        featured: "true",
        status: "live",
        features: [
          "Real-time inventory tracking and management",
          "Automated reordering and stock optimization",
          "Multi-location warehouse management",
          "Barcode scanning and RFID integration",
          "Advanced reporting and analytics dashboard",
          "Supplier management and purchase orders",
          "Integration with accounting and e-commerce platforms",
          "Mobile app for on-the-go inventory updates"
        ],
        skills: ["Inventory optimization", "system integration", "process automation", "data analytics", "business consulting"],
        goal: "Optimize inventory processes and reduce operational costs",
        kpis: ["Stock turnover", "cost reduction", "accuracy rate", "time savings"],
        results: "30% cost reduction, 95% inventory accuracy, 50% faster processing, 99.9% uptime",
        engagementType: "Technical Consultant",
        period: "2023"
      },

      {
        id: "13",
        title: "Zentrades",
        description: "Dropped into Zentrades as a marketing consultant, rewired their inbound engine, and took MQLs from single digits to 60 a month in 4 months. Built programmatic SEO systems, optimized conversion funnels, and delivered measurable growth that transformed their lead generation.",
        image: "/attached_assets/Zentrades_1754916312665.jpeg",
        video: "/attached_assets/8_1754494894057.mp4",
        gallery: ["/attached_assets/8_1_1754916459658.jpeg", "/attached_assets/8_2_1754916464956.jpeg"],
        technologies: ["Programmatic SEO", "Google Analytics", "CRM", "marketing attribution tools"],
        category: "consulting",
        liveUrl: "https://zentrades.com",
        githubUrl: "",
        featured: "true",
        status: "live",
        features: [
          "B2B marketplace connecting buyers and suppliers globally",
          "Advanced search and filtering for product discovery",
          "Secure transaction processing and escrow services",
          "Supplier verification and quality assurance system",
          "Multi-language support for international trade",
          "Real-time messaging and negotiation platform",
          "Analytics dashboard for trade insights and trends",
          "Mobile-optimized experience for on-the-go trading"
        ],
        skills: ["B2B marketing", "lead generation", "conversion optimization", "programmatic SEO", "funnel optimization"],
        goal: "Scale high-quality B2B leads, boost organic traffic, optimize funnel stages",
        kpis: ["MQLs", "conversion rate", "organic traffic", "lead quality"],
        results: "MQLs 9→60/month, 125% traffic growth, 3x demo conversion, 5000+ landing pages",
        engagementType: "Consultant (Freelance)",
        period: "2023"
      },

      // Keynotes
      {
        id: "keynote1",
        title: "TEDx Talk: The Future of Marketing Automation",
        description: "Delivered a captivating TEDx talk on how AI and automation are reshaping marketing landscapes. Shared insights from scaling multiple startups and the critical role of human creativity in an automated world.",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        video: null,
        gallery: [],
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
        gallery: [],
        technologies: ["Growth Strategy", "Performance Marketing", "Analytics", "Scaling"],
        category: "keynote",
        liveUrl: "",
        githubUrl: "",
        featured: "false",
        status: "completed",
        features: [
          "45-minute keynote presentation",
          "Live audience of 1200+ growth professionals",
          "Real case studies from FDX Sports and DigiPe",
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
      bio: "AI-first growth operator with 10+ years building, growing and helping scale businesses. Generated $80M+ in revenue across 5 ventures. Drove 2 Million+ users across 4 apps. TEDx speaker, 30+ Keynotes. Full-stack growth marketer delivering results by blending AI automation, systems thinking, and strategy.",
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
      gallery: Array.isArray(insertProject.gallery) ? [...insertProject.gallery] : [],
      technologies: Array.isArray(insertProject.technologies) ? [...insertProject.technologies] : [],
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