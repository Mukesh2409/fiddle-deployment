# Text Tone Adjustment Application

## Overview

This is a full-stack web application that enables users to adjust the tone of their text using AI-powered transformations. Built with React, Express, and PostgreSQL, the application provides an intuitive interface for transforming text between different tones (formal, casual, technical, creative) using the Mistral AI API. The app features a modern UI with real-time feedback, undo/redo functionality, and persistent text storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: TailwindCSS with CSS variables for theming
- **State Management**: TanStack Query for server state, custom hooks for local state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling
- **Middleware**: Custom logging, JSON parsing, and error handling
- **Development**: Hot reload with Vite integration in development mode

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Structured text history with metadata support using JSONB
- **Migration**: Drizzle Kit for database schema management
- **In-Memory Storage**: Fallback storage implementation for development/testing
- **Client Storage**: LocalStorage for text persistence across sessions

### Authentication and Authorization
- **Session Management**: Session-based approach with generated session IDs
- **Security**: CORS handling and credential inclusion for API requests
- **Data Isolation**: Session-based data segregation for user privacy

### Key Features
- **Text Transformation**: Four distinct tone modes (formal-professional, casual-friendly, technical-precise, creative-engaging)
- **History Management**: Comprehensive undo/redo system with chronological tracking
- **Real-time Feedback**: Live word/character/line counting and transformation status
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Error Handling**: Graceful degradation with user-friendly error messages
- **Caching**: API response caching to optimize performance and reduce costs

## External Dependencies

### AI Services
- **Mistral AI API**: Primary text transformation service using mistral-small-latest model
- **API Integration**: RESTful integration with authentication and error handling
- **Response Caching**: 5-minute TTL cache to optimize API usage

### Database Services  
- **Neon Database**: Serverless PostgreSQL provider for production deployment
- **Connection**: URL-based connection with environment variable configuration

### UI Libraries
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Lucide React**: Icon library for consistent visual elements
- **Embla Carousel**: Carousel functionality for enhanced UI interactions

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution environment for development
- **PostCSS**: CSS processing with TailwindCSS and Autoprefixer

### Utility Libraries
- **Zod**: Runtime type validation and schema definition
- **Date-fns**: Date manipulation and formatting utilities
- **Class Variance Authority**: Dynamic className generation for component variants
- **CLSX & Tailwind Merge**: Conditional and optimized className handling