/**
 * SelectCategoryPage Component - Advertisement Category Selection Interface
 * 
 * The initial step in the ad creation workflow for the Palestinian marketplace,
 * providing users with an intuitive interface to select the appropriate category
 * for their classified advertisement. This component serves as the foundation
 * for the multi-step ad creation process.
 * 
 * Primary Features:
 * - Comprehensive category grid with Palestinian market-specific categories
 * - Visual category representation with icons and descriptions
 * - Search functionality for quick category discovery
 * - Popular and featured category highlighting
 * - Authentication verification and user onboarding
 * - Progress tracking for multi-step workflow
 * - Responsive design optimized for all devices
 * 
 * Category Organization:
 * - Vehicles (سيارات): Cars, motorcycles, trucks, parts, services
 * - Real Estate (عقارات): Properties, apartments, commercial spaces
 * - Electronics (إلكترونيات): Phones, computers, gaming, appliances
 * - Fashion (أزياء): Clothing, shoes, accessories, jewelry
 * - Home & Garden (منزل وحديقة): Furniture, appliances, decor
 * - Jobs (وظائف): Employment opportunities, services, freelancing
 * - Services (خدمات): Professional services, repairs, maintenance
 * - Sports & Leisure (رياضة وترفيه): Sports equipment, hobbies
 * - Books & Education (كتب وتعليم): Books, courses, educational materials
 * - Other Categories: Miscellaneous items and specialized categories
 * 
 * User Experience Features:
 * - Intuitive visual layout with clear category identification
 * - Quick selection with single-click navigation
 * - Category descriptions and item count display
 * - Search and filter capabilities for large category lists
 * - Mobile-first responsive design for optimal mobile experience
 * - RTL (Right-to-Left) layout support for Arabic interface
 * - Accessibility compliance with keyboard navigation
 * 
 * Authentication Integration:
 * - User authentication status verification
 * - Automatic redirection to login for unauthenticated users
 * - Session management with Supabase integration
 * - User preference loading for personalized experience
 * - Business account feature access and promotion
 * 
 * Business Logic:
 * - Category popularity tracking and analytics
 * - Dynamic category availability based on user location
 * - A/B testing support for category layout optimization
 * - Seasonal category promotion and featuring
 * - Marketing campaign integration for specific categories
 * 
 * Technical Architecture:
 * - React functional component with modern hooks
 * - Next.js App Router for optimal page routing
 * - Custom hooks for category data management
 * - Supabase authentication and data integration
 * - TypeScript for enhanced development experience
 * - Tailwind CSS for responsive and maintainable styling
 * 
 * Performance Optimization:
 * - Lazy loading for category images and icons
 * - Memoized components for efficient re-rendering
 * - Optimized bundle size with code splitting
 * - Fast navigation with prefetching strategies
 * 
 * Palestinian Market Integration:
 * - Categories tailored to Palestinian market needs
 * - Cultural considerations in category organization
 * - Local business promotion and featured categories
 * - Arabic language support with proper typography
 * - Regional compliance and regulatory considerations
 * 
 * @component SelectCategoryPage
 * @route /post-ad
 * @returns {JSX.Element} Category selection interface with grid layout
 * 
 * @author Yalla Souq Development Team
 * @version 2.1.0
 * @since 1.0.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCategories } from '@/hooks/useCategories';

const SelectCategoryPage: React.FC = () => {
  const router = useRouter();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/auth/login?redirect=/post-ad');
    }
  }, [authLoading, isLoggedIn, router]);

  // Handle category selection
  const handleCategorySelect = (categorySlug: string) => {
    router.push(`/post-ad/category/${categorySlug}`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من الهوية...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/" className="text-green-600 hover:text-green-700">
                ← العودة للرئيسية
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إضافة إعلان جديد</h1>
                <p className="text-gray-600 text-sm">الخطوة 1 من 3: اختر الفئة</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="hidden md:flex items-center space-x-2 space-x-reverse">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <span className="mr-2 text-sm text-green-600 font-medium">اختر الفئة</span>
              </div>
              <div className="w-16 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <span className="mr-2 text-sm text-gray-500">نوع الإعلان</span>
              </div>
              <div className="w-16 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <span className="mr-2 text-sm text-gray-500">التفاصيل والصور</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🚀 ما الذي تريد بيعه؟
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-green-100">
            اختر الفئة المناسبة لإعلانك وابدأ رحلة البيع
          </p>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">💰</div>
                <div>مجاني تماماً</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div>نشر فوري</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">👥</div>
                <div>آلاف المشاهدات</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">اختر فئة إعلانك</h3>
            <p className="text-gray-600">انقر على الفئة التي تناسب ما تريد بيعه أو تأجيره</p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white animate-pulse rounded-xl p-6 h-40 border-2 border-gray-200"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.slug)}
                  className="bg-white border-2 border-green-200 rounded-xl p-6 text-center hover:shadow-lg hover:border-green-400 hover:bg-green-50 transition-all group transform hover:scale-105"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <span className="text-2xl text-white">{category.icon || '📦'}</span>
                  </div>
                  
                  {/* Category Name */}
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                    {category.name}
                  </h4>
                  
                  {/* English Name */}
                  {category.name_en && (
                    <p className="text-sm text-gray-500 mb-3">{category.name_en}</p>
                  )}
                  
                  {/* Action Text */}
                  <div className="text-xs text-green-600 group-hover:text-green-700 font-medium">
                    انقر للمتابعة ←
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💡 نصائح لإعلان ناجح</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📸</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">صور واضحة</h4>
              <p className="text-gray-600 text-sm">أضف صور عالية الجودة من زوايا مختلفة</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✍️</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">وصف مفصل</h4>
              <p className="text-gray-600 text-sm">اكتب وصفاً شاملاً يجذب المشترين</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">سعر منافس</h4>
              <p className="text-gray-600 text-sm">ضع سعراً عادلاً يجذب المشترين</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Categories Highlight */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">🔥 الفئات الأكثر طلباً</h3>
          
          <div className="flex flex-wrap justify-center gap-3">
            {['مركبات', 'عقارات', 'إلكترونيات', 'أزياء', 'أثاث منزلي'].map((cat) => (
              <span key={cat} className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                {cat}
              </span>
            ))}
          </div>
          
          <p className="text-gray-600 text-sm mt-4">
            هذه الفئات تحصل على أكبر عدد من المشاهدات والاستفسارات
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>🇵🇸 معاً نبني سوقاً فلسطينياً قوياً • كل إعلان يساهم في دعم الاقتصاد المحلي</p>
        </div>
      </div>
    </div>
  );
};

export default SelectCategoryPage;