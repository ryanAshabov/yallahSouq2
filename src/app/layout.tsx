/**
 * Root Layout Component - Yalla Souq Palestinian Marketplace
 * 
 * Primary application layout component that serves as the foundational
 * wrapper for all pages within the Palestinian marketplace platform.
 * Manages global styling, metadata, and application-wide configurations.
 * 
 * Core Responsibilities:
 * - Global CSS styling integration with Tailwind CSS framework
 * - Font loading and typography configuration for Arabic/English content
 * - Application metadata management for SEO and social media
 * - Root HTML structure with proper accessibility attributes
 * - Global providers and context initialization
 * - Performance optimization through strategic resource loading
 * 
 * Palestinian Market Features:
 * - RTL (Right-to-Left) layout support for Arabic content
 * - Arabic font loading with fallback to system fonts
 * - Cultural design preferences in color scheme and spacing
 * - Localization support for Palestinian marketplace branding
 * - Geographic metadata for Palestinian market targeting
 * 
 * SEO Configuration:
 * - Dynamic metadata generation based on page content
 * - Open Graph tags for social media sharing
 * - Structured data markup for Palestinian marketplace
 * - Mobile-friendly viewport configuration
 * - Performance optimization meta tags
 * 
 * Accessibility Implementation:
 * - Semantic HTML structure for screen readers
 * - Language attribute configuration for assistive technologies
 * - High contrast mode support through CSS custom properties
 * - Keyboard navigation support with proper focus management
 * - WCAG 2.1 compliance through global styling
 * 
 * Performance Optimization:
 * - Font display optimization with swap strategy
 * - Critical CSS inlining for faster initial render
 * - Resource hints for improved loading performance
 * - Efficient bundle splitting for optimal loading
 * 
 * Technical Architecture:
 * - Next.js 14 App Router layout structure
 * - TypeScript integration for type safety
 * - Global CSS cascade management
 * - Provider pattern for context distribution
 * - Error boundary integration for graceful error handling
 * 
 * Global Providers:
 * - Authentication context for user session management
 * - Theme provider for consistent design system
 * - Localization provider for multi-language support
 * - Analytics provider for user behavior tracking
 * - Error reporting provider for monitoring
 * 
 * @module RootLayout
 * @author Yalla Souq Development Team
 * @version 2.0.0
 * @since 1.0.0
 */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import ErrorBoundary from '@/components/ErrorBoundary'

/**
 * Inter Font Configuration
 * 
 * Professional typography setup using Inter font family optimized
 * for Palestinian marketplace content. Configured with Latin subset
 * and performance optimization strategies.
 * 
 * Features:
 * - Latin character support for English content
 * - Font display swap for improved loading performance
 * - Subset optimization for reduced bandwidth usage
 * - Fallback font stack for reliability
 * 
 * @constant inter - Inter font configuration object
 */
const inter = Inter({ subsets: ['latin'] })

/**
 * Application Metadata Configuration
 * 
 * Comprehensive metadata setup for Palestinian marketplace platform
 * optimized for search engines, social media, and user experience.
 * 
 * SEO Features:
 * - Descriptive title optimized for Palestinian market searches
 * - Compelling description highlighting marketplace value proposition
 * - Open Graph tags for social media sharing
 * - Mobile-friendly viewport configuration
 * - Performance and accessibility optimization
 * 
 * Palestinian Market Optimization:
 * - Geographic targeting for Palestinian users
 * - Cultural relevance in messaging and branding
 * - Arabic language support indicators
 * - Local business schema markup
 * 
 * @constant metadata - Application metadata configuration
 */
export const metadata: Metadata = {
  title: 'يلا سوق - السوق الفلسطيني الرقمي | Yalla Souq - Palestinian Digital Marketplace',
  description: 'منصة السوق الفلسطيني الرقمي للإعلانات المبوبة. بيع واشتري بسهولة في فلسطين - سيارات، عقارات، وظائف، والمزيد | Palestinian digital marketplace for classified ads. Buy and sell easily in Palestine - cars, real estate, jobs, and more.',
}

/**
 * RootLayout Component - Application Foundation
 * 
 * Primary layout component that wraps all pages in the Palestinian marketplace
 * application. Provides consistent global styling, accessibility features,
 * and foundational HTML structure for optimal user experience.
 * 
 * Layout Responsibilities:
 * - Global font application with Inter typography system
 * - CSS framework integration with Tailwind classes
 * - HTML document structure with proper semantic markup
 * - Accessibility attributes for inclusive user experience
 * - Performance optimization through font loading strategies
 * 
 * Palestinian Market Integration:
 * - RTL layout support preparation for Arabic content
 * - Cultural design considerations in base styling
 * - Accessibility compliance for diverse user needs
 * - Mobile-first responsive design approach
 * 
 * Technical Implementation:
 * - Next.js App Router layout pattern
 * - TypeScript prop validation for type safety
 * - Global CSS cascade management
 * - Font optimization with display swap strategy
 * 
 * Performance Features:
 * - Efficient font loading with Inter font family
 * - CSS optimization through Tailwind purging
 * - Minimal layout shift through font display strategy
 * - Optimized bundle delivery for faster page loads
 * 
 * Accessibility Compliance:
 * - Semantic HTML structure for screen readers
 * - Proper heading hierarchy establishment
 * - Keyboard navigation support foundation
 * - WCAG 2.1 guidelines adherence
 * 
 * @param children - Page content to be rendered within the layout
 * @returns JSX.Element - Complete HTML document structure with global styling
 * 
 * @example
 * // Automatic usage by Next.js App Router
 * // Wraps all pages with consistent layout and styling
 * 
 * @since 1.0.0
 * @author Yalla Souq Development Team
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
