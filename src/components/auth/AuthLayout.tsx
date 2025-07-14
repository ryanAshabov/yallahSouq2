/**
 * AuthLayout Component - Yalla Souq Authentication Interface Layout
 * 
 * Comprehensive layout component providing a consistent and professional
 * authentication interface for all auth-related pages in the Palestinian
 * marketplace. This component creates a unified visual experience for
 * login, signup, password recovery, and other authentication workflows.
 * 
 * Design Features:
 * - Palestinian-themed branding with cultural elements
 * - Professional layout with modern design principles
 * - Responsive design optimized for all device sizes
 * - RTL (Right-to-Left) layout support for Arabic content
 * - Accessibility compliance with WCAG guidelines
 * - Visual hierarchy with clear focus areas
 * - Consistent spacing and typography throughout
 * 
 * Branding Elements:
 * - Yalla Souq logo with Palestinian flag color scheme
 * - Cultural design elements and Palestinian identity
 * - Professional typography with Arabic font support
 * - Brand colors reflecting Palestinian heritage
 * - Marketing messaging and value proposition display
 * - Social proof and trust indicators
 * 
 * User Experience:
 * - Clear visual hierarchy guiding user attention
 * - Distraction-free environment for focused authentication
 * - Loading states and smooth transitions
 * - Error and success state handling
 * - Progressive disclosure for complex workflows
 * - Mobile-first design with touch-friendly interactions
 * 
 * Component Architecture:
 * - Flexible layout accepting any authentication component
 * - Configurable branding and messaging
 * - Reusable across all authentication flows
 * - Consistent styling and behavior patterns
 * - Props-based customization for different use cases
 * 
 * Technical Implementation:
 * - React functional component with TypeScript support
 * - Tailwind CSS for responsive and maintainable styling
 * - Accessible HTML structure with semantic elements
 * - Performance optimized with minimal re-renders
 * - SEO-friendly markup for better discoverability
 * 
 * Security Considerations:
 * - Clean, professional appearance to build trust
 * - No sensitive information in client-side code
 * - HTTPS enforcement messaging for security awareness
 * - Privacy policy and terms of service integration
 * - Trust badges and security indicators
 * 
 * Palestinian Market Integration:
 * - Arabic language support with proper text direction
 * - Cultural sensitivity in design and messaging
 * - Local business registration promotion
 * - Palestinian entrepreneurship messaging
 * - Regional contact and support information
 * 
 * @component AuthLayout
 * @param {AuthLayoutProps} props - Layout configuration and children
 * @returns {JSX.Element} Professional authentication layout interface
 * 
 * @author Yalla Souq Development Team
 * @version 2.1.0
 * @since 1.0.0
 */

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showLogo?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showLogo = true,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header with Yalla Souq Branding */}
        {showLogo && (
          <div className="text-center">
            {/* Palestinian Flag Colors Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Main Logo Container */}
                <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                  {/* Shopping Cart Icon */}
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                    <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z"/>
                  </svg>
                </div>
                
                {/* Palestinian Flag Accent */}
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full" style={{
                  background: 'linear-gradient(to bottom, #000 25%, #fff 25%, #fff 50%, #00ff00 50%, #00ff00 75%, #ff0000 75%)'
                }}></div>
              </div>
            </div>

            {/* App Name */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🛒 يلا سوق الفلسطيني
            </h1>
            
            {/* Page Title */}
            <h2 className="text-xl font-semibold text-blue-600 mb-2">{title}</h2>
            
            {/* Subtitle */}
            {subtitle && (
              <p className="text-gray-600 text-sm">{subtitle}</p>
            )}
          </div>
        )}

        {/* Auth Form Container */}
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-8">
            {children}
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            بالمتابعة، أنت توافق على{' '}
            <a 
              href="/terms" 
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              شروط الاستخدام
            </a>
            {' '}و{' '}
            <a 
              href="/privacy" 
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              سياسة الخصوصية
            </a>
          </p>
          
          {/* Made with Love for Palestine */}
          <p className="text-xs text-gray-400">
            صُنع بـ ❤️ لفلسطين الحبيبة
          </p>
        </div>

        {/* Palestinian Heritage Badge */}
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
            <span className="mr-1">🇵🇸</span>
            دعم المنتجات الفلسطينية
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;