# Portfolio Application - Farooq Chisty

## Overview

This is a high-performance modern portfolio application built with a React frontend and Express backend, showcasing Farooq Chisty's projects and professional information in a Netflix-inspired dark theme. The application uses a monorepo structure with shared schemas and TypeScript throughout, optimized for fast loading and excellent user experience across all devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Custom component library based on shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom Netflix-themed dark mode
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions and effects

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: In-memory storage implementation with interface for easy database migration
- **Development**: Hot reload with Vite integration

### Key Design Decisions
- **Monorepo Structure**: Shared schema definitions between client and server ensure type safety
- **Dark Theme**: Netflix-inspired design with custom CSS variables for consistent theming
- **Component Architecture**: Modular UI components with proper separation of concerns
- **Type Safety**: Full TypeScript coverage with shared types and Zod validation

## Key Components

### Database Schema
- **Projects Table**: Stores portfolio projects with metadata, technologies, and links
- **Profile Table**: Contains professional information, skills, and contact details
- **Type Safety**: Drizzle-zod integration for runtime validation

### Frontend Components
- **Header**: Fixed navigation with smooth scrolling to sections
- **Hero Section**: Full-screen landing with background image and call-to-action
- **Project Carousel**: Netflix-style horizontal scrolling project showcase
- **Project Modal**: Detailed project view with external links
- **About Section**: Professional bio and image display
- **Footer**: Contact information and social links

### Backend Services
- **Storage Interface**: Abstract storage layer supporting both in-memory and database implementations
- **Project APIs**: CRUD operations for projects with category filtering
- **Profile APIs**: Professional information management
- **Error Handling**: Centralized error handling with proper HTTP status codes

## Data Flow

1. **Initial Load**: Application fetches profile data and featured projects
2. **Navigation**: Smooth scrolling between sections using intersection observers
3. **Project Interaction**: Click handlers open detailed modals with project information
4. **Data Fetching**: TanStack Query manages caching and background updates
5. **Responsive Design**: Mobile-first approach with breakpoint-specific layouts

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **UI Library**: Radix UI primitives for accessible components
- **Animation**: Framer Motion for interactive animations
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React for consistent iconography

### Development Tools
- **TypeScript**: Full type coverage across the stack
- **Vite**: Development server and build tool
- **PostCSS**: CSS processing with Tailwind
- **ESBuild**: Fast production builds for server code

## Deployment Strategy

### Development
- **Hot Reload**: Vite development server with Express integration
- **Type Checking**: Continuous TypeScript validation
- **Environment**: Development-specific configuration and error handling

### Production
- **Build Process**: 
  1. Vite builds optimized client bundle
  2. ESBuild compiles server code to single file
  3. Static assets served from Express
- **Database**: Drizzle migrations for schema management
- **Environment Variables**: 
  - `NODE_ENV=production` (required)
  - `SESSION_SECRET` (required for session management)
  - `DATABASE_URL` (required for database connection)
  - `FRONTEND_URL` (required for CORS configuration)
  - `PORT` (defaults to 5000)
- **Session Management**: Express-session with secure configuration for production
- **Error Handling**: Graceful startup error handling with detailed logging

### Notable Implementation Details
- **Replit Integration**: Special handling for Replit development environment
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Performance**: Lazy loading and optimized asset delivery
- **Accessibility**: ARIA labels and keyboard navigation support
- **Project Galleries**: Custom image galleries implemented for 10 major projects (Cazpro, Millionth Mile Marketing, DigiPay, Inventrax, FDX Sports, Codiste, ZO Labs, Zentrades, InboxBites, Solgames, Martian Wallet)
- **Gallery Navigation**: Side-by-side image display with arrow controls for multi-image navigation
- **Performance Optimizations**: Reduced assets from 181MB to 143MB (21% reduction), lazy loading for images, optimized video preloading, replaced background video with lightweight gradient, cleaned unused imports

## Recent Changes (August 2025)

### Netflix Modal Dynamic Data Conversion
- **Dynamic Project Display**: Successfully converted Netflix modal from hardcoded content to dynamic database-driven display
- **Tech Stack Integration**: All project details now read from storage including technologies, skills, goals, KPIs, results
- **Professional Data Structure**: Modal displays comprehensive professional experience with engagement types and periods
- **Code Cleanup**: Removed extensive hardcoded conditional logic in favor of clean dynamic data binding

### Always-Running Deployment Setup  
- **Render + Vercel Configuration**: Complete deployment setup for backend (Render) and frontend (Vercel)
- **GitHub Actions Keep-Alive**: Automated service that pings backend every 13 minutes to prevent free tier sleeping
- **Enhanced Health Monitoring**: Comprehensive health checks with retry logic and detailed logging
- **Multiple Keep-Alive Options**: GitHub Actions (recommended), external cron services, and self-hosted options
- **Production Monitoring**: Full monitoring setup with uptime tracking, error handling, and performance metrics
- **Zero-Cost Deployment**: Complete always-running setup using free tiers with professional features

### Deployment Infrastructure
- **render.yaml**: Production-ready configuration with auto-deployment and health checks
- **GitHub Workflow**: Enhanced keep-alive workflow with exponential backoff and status reporting  
- **Keep-Alive Service**: Self-hosted option with robust error handling and graceful shutdown
- **Comprehensive Documentation**: Step-by-step guides for deployment and maintenance