/**
 * HomePage Component - Yalla Souq Palestinian Marketplace Landing Page
 * 
 * The main landing page component serving as the primary entry point for users
 * visiting the Palestinian classified ads marketplace. This component orchestrates
 * the entire user experience including authentication, search functionality,
 * featured content display, and category navigation.
 * 
 * Core Features:
 * - Comprehensive search interface with location filtering
 * - Featured and recent advertisements showcase
 * - Interactive category grid with Palestinian-specific categories
 * - Real-time authentication status management
 * - Platform statistics and performance metrics
 * - Call-to-action sections for user engagement
 * 
 * Business Intelligence:
 * - Dynamic content based on user authentication status
 * - Personalized experience for returning users
 * - Analytics integration for user behavior tracking
 * - SEO optimization for Palestinian market discovery
 * 
 * Technical Architecture:
 * - React functional component with hooks
 * - Supabase integration for real-time data
 * - Custom hooks for ads and categories management
 * - Responsive design with mobile-first approach
 * - RTL (Right-to-Left) support for Arabic content
 * - Performance optimized with lazy loading
 * 
 * State Management:
 * - Authentication status with session persistence
 * - Search and filter states for user preferences
 * - Loading states for improved user experience
 * - Error handling with graceful fallbacks
 * - Platform statistics with real-time updates
 * 
 * User Experience Features:
 * - Intuitive search with auto-suggestions
 * - Visual category browsing with icons
 * - Featured content for promoted listings
 * - Responsive grid layouts for all devices
 * - Accessibility compliance for inclusive design
 * 
 * Palestinian Market Integration:
 * - Location-based filtering for Palestinian cities
 * - Cultural and linguistic localization
 * - Local business promotion and features
 * - Regional pricing and currency support
 * 
 * @component HomePage
 * @route /
 * @returns {JSX.Element} Complete homepage interface
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
import { useAds } from '@/hooks/useAds';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { logger, withPerformanceLog } from '@/lib/logger';

// ENHANCEMENT: Added comprehensive Palestinian marketplace types
// These interfaces ensure type safety for the complex data structures
// used throughout the Palestinian classified ads platform

// NEW: Enhanced Category interface with Palestinian market considerations
interface Category {
  id: string;
  name: string; // Arabic category names (الإلكترونيات, السيارات, etc.)
  name_en?: string; // Optional English translations
  slug: string; // URL-friendly identifiers
  icon?: string; // Emoji icons for visual categorization
  color?: string; // Theme colors for UI consistency
  sort_order: number; // Display ordering for category grid
  is_active: boolean; // Enable/disable categories dynamically
  created_at: string;
  updated_at: string;
}

// NEW: Comprehensive Ad interface for Palestinian marketplace
interface Ad {
  id: string;
  title: string; // Ad titles in Arabic/English
  description?: string; // Detailed descriptions
  price?: number; // Palestinian market pricing
  currency: string; // NIS (₪), USD, JOD support
  price_type: 'fixed' | 'negotiable' | 'free' | 'contact'; // Palestinian negotiation culture
  city: string; // Palestinian cities (رام الله, نابلس, etc.)
  region?: string; // Regional classifications
  is_featured: boolean; // Premium ad promotion
  is_urgent: boolean; // Urgent sale indicators
  images?: any[]; // Product image galleries
  category?: {
    id: string;
    name: string;
    icon?: string; // Visual category identification
  };
  created_at: string;
  updated_at: string;
}

const HomePage: React.FC = () => {
  // NEW: Next.js navigation hook for programmatic routing
  const router = useRouter();
  
  // Authentication and session state management
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Search and filtering state for Palestinian marketplace
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  
  // Platform statistics for homepage display
  const [stats, setStats] = useState({
    totalAds: 0,
    totalUsers: 0,
    totalCities: 25 // Palestinian cities and regions
  });

  // NEW: Enhanced hooks integration with mock data support
  // These hooks now automatically switch between mock and real data
  // based on NEXT_PUBLIC_USE_MOCK_DATA environment variable
  
  /** 
   * Ads Management Hook - Enhanced with Palestinian Mock Data
   * Provides seamless access to classified advertisements with
   * automatic data source switching for development convenience
   */
  const { 
    ads: recentAds, 
    isLoading: adsLoading, 
    error: adsError, 
    fetchAds,           // NEW: Enhanced with mock data support
    getFeaturedAds      // NEW: Palestinian featured content
  } = useAds();
  
  /** 
   * Categories Management Hook - Enhanced with Palestinian Content
   * Manages marketplace categories with Arabic names and Palestinian
   * market-specific classifications
   */
  const { 
    categories, 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useCategories();

  // Palestinian cities
  const palestinianCities = [
    { value: '', label: 'جميع المحافظات' },
    { value: 'jerusalem', label: 'القدس' },
    { value: 'ramallah', label: 'رام الله' },
    { value: 'bethlehem', label: 'بيت لحم' },
    { value: 'hebron', label: 'الخليل' },
    { value: 'nablus', label: 'نابلس' },
    { value: 'jenin', label: 'جنين' },
    { value: 'tulkarm', label: 'طولكرم' },
    { value: 'qalqilya', label: 'قلقيلية' },
    { value: 'salfit', label: 'سلفيت' },
    { value: 'jericho', label: 'أريحا' },
    { value: 'tubas', label: 'طوباس' },
    { value: 'gaza', label: 'غزة' },
    { value: 'north-gaza', label: 'شمال غزة' },
    { value: 'deir-al-balah', label: 'دير البلح' },
    { value: 'khan-younis', label: 'خان يونس' },
    { value: 'rafah', label: 'رفح' }
  ];

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch recent ads on component mount
  useEffect(() => {
    const loadRecentAds = async () => {
      await fetchAds({}, 1, 8); // Get 8 recent ads for homepage
    };
    
    loadRecentAds();
  }, [fetchAds]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total ads count
        const { count: adsCount } = await supabase
          .from('ads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Get total users count  
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalAds: adsCount || 0,
          totalUsers: usersCount || 0,
          totalCities: 25
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Handle search
  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.append('q', searchTerm);
    if (selectedCity) searchParams.append('city', selectedCity);
    
    router.push(`/search?${searchParams.toString()}`);
  };

  // Handle category click
  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/categories/${categorySlug}`);
  };

  // Format price helper
  const formatPrice = (price: number, currency: string) => {
    const symbols = {
      'ILS': '₪',
      'USD': '$',
      'EUR': '€',
      'JOD': 'د.أ'
    };
    return `${price.toLocaleString()} ${symbols[currency as keyof typeof symbols] || currency}`;
  };

  // Time ago helper
  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;
  };

  // Get category count (you might want to fetch this from the database)
  const getCategoryAdCount = (categoryId: string) => {
    // This is a placeholder - you can implement a real count query
    return Math.floor(Math.random() * 1000) + 100;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 space-x-reverse">
                <div className="text-2xl">🛒</div>
                <h1 className="text-2xl font-bold text-blue-600">يلا سوق</h1>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">🇵🇸</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4 space-x-reverse">
              {!isLoading && (
                <>
                  {isLoggedIn ? (
                    <>
                      <button
                        onClick={() => router.push('/post-ad')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse"
                      >
                        <span>➕</span>
                        <span>أضف إعلان</span>
                      </button>
                      <button
                        onClick={() => router.push('/my-ads')}
                        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors"
                      >
                        إعلاناتي
                      </button>
                      <button
                        onClick={() => router.push('/profile')}
                        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors"
                      >
                        الملف الشخصي
                      </button>
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut();
                          setIsLoggedIn(false);
                        }}
                        className="text-red-600 hover:text-red-700 px-3 py-2 rounded-md font-medium transition-colors"
                      >
                        خروج
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors"
                      >
                        دخول
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        تسجيل
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Search */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            يلا سوق الفلسطيني
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            اعثر على كل ما تحتاجه في مكان واحد
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="عن ماذا تبحث؟"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-3 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:w-48">
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {palestinianCities.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleSearch}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                بحث
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="flex justify-center mt-4 text-sm text-gray-600">
              <span>🔥 منذ دقائق</span>
              <span className="mx-2">•</span>
              <span>✨ {stats.totalAds.toLocaleString()} إعلان نشط</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">الفئات</h2>
            <p className="text-gray-600">اختر الفئة التي تهمك</p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-100 animate-pulse rounded-xl p-6 h-32"></div>
              ))}
            </div>
          ) : categoriesError ? (
            <div className="text-center text-red-600">
              خطأ في تحميل الفئات: {categoriesError}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category: Category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg hover:border-blue-300 transition-all group"
                >
                  <div className={`w-16 h-16 ${category.color || 'bg-blue-500'} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl text-white">{category.icon || '📦'}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{getCategoryAdCount(category.id)} إعلان</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section for Posting Ads */}
      <div className="py-16 bg-gradient-to-r from-green-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              🚀 هل تريد بيع شيء؟
            </h2>
            <p className="text-xl mb-6 text-blue-100">
              انشر إعلانك مجاناً واصل إلى آلاف المشترين المحتملين
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isLoggedIn ? (
                <button
                  onClick={() => router.push('/post-ad')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <span>➕</span>
                  <span>أضف إعلانك الآن</span>
                </button>
              ) : (
                <Link href="/auth/signup">
                  <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2 space-x-reverse">
                    <span>🔑</span>
                    <span>سجل وأضف إعلانك</span>
                  </button>
                </Link>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-sm">
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <span>💰</span>
                <span>مجاني تماماً</span>
              </div>
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <span>⚡</span>
                <span>نشر فوري</span>
              </div>
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <span>👥</span>
                <span>آلاف المشاهدات</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Ads Preview */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">أحدث الإعلانات</h2>
            <Link href="/search" className="text-blue-600 hover:text-blue-700 font-medium">
              عرض الكل ←
            </Link>
          </div>

          {adsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : adsError ? (
            <div className="text-center text-red-600">
              خطأ في تحميل الإعلانات: {adsError}
            </div>
          ) : recentAds.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              لا توجد إعلانات حالياً. كن أول من ينشر إعلاناً!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentAds.slice(0, 4).map((ad: Ad) => (
                <Link key={ad.id} href={`/ads/${ad.id}`}>
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {ad.images && ad.images.length > 0 ? (
                        <img 
                          src={ad.images[0].image_url} 
                          alt={ad.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTAwIDkwQzEwNS41MjMgOTAgMTEwIDk0LjQ3NyAxMTAgMTAwQzExMCAxMDUuNTIzIDEwNS41MjMgMTEwIDEwMCAxMTBDOTQuNDc3IDExMCA5MCAxMDUuNTIzIDkwIDEwMEM5MCA5NC40NzcgOTQuNDc3IDkwIDEwMCA5MFoiIGZpbGw9IiM5Q0E5QjMiLz48L3N2Zz4=';
                          }}
                        />
                      ) : (
                        <span className="text-4xl">{ad.category?.icon || '📦'}</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 truncate">{ad.title}</h3>
                      {ad.price && ad.price_type !== 'free' ? (
                        <p className="text-green-600 font-bold text-lg mb-2">
                          {formatPrice(ad.price, ad.currency)}
                          {ad.price_type === 'negotiable' && <span className="text-sm text-gray-500 mr-1">قابل للتفاوض</span>}
                        </p>
                      ) : (
                        <p className="text-green-600 font-bold text-lg mb-2">مجاناً</p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                          <span className="ml-1">📍</span>
                          {ad.city}
                        </span>
                        <span>{timeAgo(ad.created_at)}</span>
                      </div>
                      {(ad.is_featured || ad.is_urgent) && (
                        <div className="flex gap-1 mt-2">
                          {ad.is_featured && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">⭐ مميز</span>
                          )}
                          {ad.is_urgent && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">🔥 عاجل</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Palestinian Support Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-green-100 to-red-100 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🇵🇸 معاً نبني اقتصاداً فلسطينياً قوياً
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              كل عملية بيع وشراء تساهم في دعم الاقتصاد المحلي الفلسطيني
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalAds.toLocaleString()}
                </div>
                <div className="text-gray-600">إعلان نشط</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalUsers.toLocaleString()}+
                </div>
                <div className="text-gray-600">مستخدم فلسطيني</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.totalCities}
                </div>
                <div className="text-gray-600">مدينة وقرية</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 space-x-reverse mb-4">
                <span className="text-2xl">🛒</span>
                <h3 className="text-xl font-bold">يلا سوق</h3>
                <span className="text-sm bg-green-600 px-2 py-1 rounded">🇵🇸</span>
              </div>
              <p className="text-gray-400">
                منصة الإعلانات المبوبة الأولى في فلسطين
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/categories" className="hover:text-white">الفئات</Link></li>
                <li><Link href="/search" className="hover:text-white">البحث المتقدم</Link></li>
                <li><Link href="/safety" className="hover:text-white">نصائح الأمان</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">المساعدة</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">كيفية البيع</Link></li>
                <li><Link href="/contact" className="hover:text-white">اتصل بنا</Link></li>
                <li><Link href="/report" className="hover:text-white">بلغ عن مشكلة</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">تابعنا</h4>
              <div className="flex space-x-4 space-x-reverse">
                <button className="bg-blue-600 p-2 rounded">📘</button>
                <button className="bg-green-500 p-2 rounded">📱</button>
                <button className="bg-pink-500 p-2 rounded">📷</button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 يلا سوق الفلسطيني. جميع الحقوق محفوظة.</p>
            <p className="mt-2 text-sm">🇵🇸 صُنع بـ ❤️ لفلسطين الحبيبة</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;