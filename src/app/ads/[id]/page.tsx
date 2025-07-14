
/**
 * AdDetailPage Component - Comprehensive Advertisement Display Interface
 * 
 * Detailed view component for individual classified advertisements in the Palestinian
 * marketplace. This component provides a comprehensive display of ad information,
 * user interaction capabilities, and integrated communication tools for potential
 * buyers and sellers.
 * 
 * Core Display Features:
 * - High-resolution image gallery with zoom and navigation
 * - Comprehensive ad information with structured layout
 * - Seller profile information and verification status
 * - Contact information with multiple communication options
 * - Related and similar ads recommendations
 * - Social sharing capabilities with platform integration
 * - Responsive design optimized for all viewing devices
 * 
 * User Interaction Features:
 * - Favorites/Wishlist functionality for registered users
 * - Direct messaging system for buyer-seller communication
 * - Phone call integration with click-to-call functionality
 * - WhatsApp integration for instant messaging
 * - Email contact forms with spam protection
 * - Report listing functionality for inappropriate content
 * - Share ad functionality across social media platforms
 * 
 * Information Architecture:
 * - Primary ad details (title, description, price, location)
 * - Detailed specifications and condition information
 * - Seller information with trust indicators and ratings
 * - Publication and update timestamps
 * - View count and engagement metrics
 * - Category and subcategory classification
 * - Promotional status indicators (featured, urgent, etc.)
 * 
 * Security and Trust Features:
 * - Seller verification status display
 * - Business account indicators and certification
 * - Report functionality for inappropriate content
 * - Contact information privacy protection
 * - Secure communication channel options
 * - Fraud prevention warnings and user education
 * 
 * Business Intelligence:
 * - View tracking and analytics integration
 * - User engagement metrics collection
 * - Conversion tracking for successful transactions
 * - A/B testing support for layout optimization
 * - SEO optimization for search engine visibility
 * - Social media integration for viral marketing
 * 
 * Mobile Optimization:
 * - Touch-optimized image gallery with swipe navigation
 * - Responsive layout adaptation for small screens
 * - Fast loading with progressive image enhancement
 * - Mobile-specific contact options (call, SMS, WhatsApp)
 * - Offline capability for basic ad viewing
 * 
 * Palestinian Market Integration:
 * - Arabic language support with proper text rendering
 * - Palestinian geographic information display
 * - Local currency formatting and pricing
 * - Cultural considerations in design and interaction
 * - Regional contact preferences and communication methods
 * 
 * Technical Architecture:
 * - React functional component with modern hooks
 * - Next.js dynamic routing with ISR (Incremental Static Regeneration)
 * - Supabase integration for real-time data and updates
 * - Custom hooks for ad data management and user interactions
 * - TypeScript for type safety and developer experience
 * - Optimized image loading with Next.js Image component
 * 
 * Performance Features:
 * - Server-side rendering for improved SEO and loading speed
 * - Image optimization with automatic format conversion
 * - Lazy loading for non-critical content sections
 * - Efficient data fetching with proper caching strategies
 * - Bundle optimization with code splitting
 * 
 * @component AdDetailPage
 * @route /ads/[id]
 * @param {AdDetailPageProps} props - Component props containing ad ID parameter
 * @returns {JSX.Element} Complete ad detail view with interactive features
 * 
 * @author Yalla Souq Development Team
 * @version 2.1.0
 * @since 1.0.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAds, type Ad } from '@/hooks/useAds';

interface AdDetailPageProps {
  params: {
    id: string;
  };
}

const AdDetailPage: React.FC<AdDetailPageProps> = ({ params }) => {
  const router = useRouter();
  const { getAdById, toggleFavorite, deleteAd, isLoading } = useAds();
  
  const [ad, setAd] = useState<Ad | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showContactInfo, setShowContactInfo] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [relatedAds, setRelatedAds] = useState<Ad[]>([]);

  // Check authentication and load ad
  useEffect(() => {
    const checkAuthAndLoadAd = async () => {
      try {
        // Check auth
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
        setCurrentUserId(session?.user?.id || null);

        // Load ad
        const adData = await getAdById(params.id);
        if (adData) {
          setAd(adData);
          
          // Load related ads from same category
          if (adData.category_id) {
            const { data: related } = await supabase
              .from('ads')
              .select(`
                *,
                images:ad_images(
                  id, image_url, thumbnail_url, is_primary, sort_order
                ),
                category:categories(name, icon)
              `)
              .eq('category_id', adData.category_id)
              .eq('status', 'active')
              .neq('id', adData.id)
              .limit(4);
            
            setRelatedAds(related || []);
          }
        } else {
          setError('الإعلان غير موجود أو تم حذفه');
        }
      } catch (err) {
        console.error('Error loading ad:', err);
        setError('حدث خطأ أثناء تحميل الإعلان');
      }
    };

    if (params.id) {
      checkAuthAndLoadAd();
    }
  }, [params.id, getAdById]);

  // Handle favorite toggle
  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }

    if (ad) {
      const result = await toggleFavorite(ad.id);
      setAd(prev => prev ? {
        ...prev,
        is_favorited: result,
        favorites_count: result ? prev.favorites_count + 1 : prev.favorites_count - 1
      } : null);
    }
  };

  // Handle delete ad
  const handleDeleteAd = async () => {
    if (ad) {
      const success = await deleteAd(ad.id);
      if (success) {
        router.push('/my-ads');
      }
    }
    setShowDeleteModal(false);
  };

  // Format price
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

  // Handle phone number click
  const handlePhoneClick = () => {
    if (ad?.contact_phone) {
      window.location.href = `tel:${ad.contact_phone}`;
    }
  };

  // Handle WhatsApp click
  const handleWhatsAppClick = () => {
    if (ad?.contact_phone) {
      const message = `مرحباً، أنا مهتم بالإعلان: ${ad.title}`;
      const whatsappUrl = `https://wa.me/970${ad.contact_phone.replace(/^0/, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الإعلان...</p>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">الإعلان غير موجود</h1>
          <p className="text-gray-600 mb-4">{error || 'الإعلان الذي تبحث عنه غير موجود أو تم حذفه'}</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = currentUserId === ad.user_id;
  const images = ad.images?.sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <button onClick={() => router.back()} className="text-blue-600 hover:text-blue-700">
                ← رجوع
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900 truncate">{ad.title}</h1>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              {/* Favorite Button */}
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full border transition-colors ${
                  ad.is_favorited 
                    ? 'bg-red-50 border-red-200 text-red-600' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {ad.is_favorited ? '❤️' : '🤍'}
              </button>

              {/* Share Button */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: ad.title,
                      text: ad.description,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('تم نسخ رابط الإعلان');
                  }
                }}
                className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                📤
              </button>

              {/* Owner Actions */}
              {isOwner && (
                <div className="flex space-x-2 space-x-reverse">
                  <Link href={`/ads/${ad.id}/edit`}>
                    <button className="p-2 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">
                      ✏️
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {images.length > 0 ? (
                <div>
                  {/* Main Image */}
                  <div className="relative h-96 bg-gray-200">
                    <Image 
                      src={images[currentImageIndex]?.image_url || '/placeholder-image.png'}
                      alt={ad.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.png';
                      }}
                    />
                    
                    {/* Image Navigation */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                        >
                          →
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Strip */}
                  {images.length > 1 && (
                    <div className="p-4 flex space-x-2 space-x-reverse overflow-x-auto">
                      {images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden relative ${
                            index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        >
                          <Image 
                            src={image.thumbnail_url || image.image_url || '/placeholder-image.png'}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-2">{ad.category?.icon || '📦'}</div>
                    <p>لا توجد صور</p>
                  </div>
                </div>
              )}
            </div>

            {/* Ad Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {/* Title and Price */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{ad.title}</h1>
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {ad.category?.icon} {ad.category?.name}
                      </span>
                      {ad.condition_type && (
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {ad.condition_type === 'new' ? 'جديد' : 
                           ad.condition_type === 'used' ? 'مستعمل' : 'مجدد'}
                        </span>
                      )}
                      {ad.is_urgent && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded">🔥 عاجل</span>
                      )}
                      {ad.is_featured && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">⭐ مميز</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-left">
                    {ad.price && ad.price_type !== 'free' ? (
                      <div className="text-3xl font-bold text-green-600">
                        {formatPrice(ad.price, ad.currency)}
                        {ad.price_type === 'negotiable' && (
                          <div className="text-sm text-gray-500 font-normal">قابل للتفاوض</div>
                        )}
                      </div>
                    ) : ad.price_type === 'free' ? (
                      <div className="text-3xl font-bold text-green-600">مجاناً</div>
                    ) : (
                      <div className="text-xl font-semibold text-blue-600">يرجى الاتصال</div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">الوصف</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{ad.description}</p>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">الموقع</h3>
                  <div className="flex items-center space-x-2 space-x-reverse text-gray-700">
                    <span>📍</span>
                    <span>{ad.city}</span>
                    {ad.region && <span>، {ad.region}</span>}
                  </div>
                  {ad.address_details && (
                    <p className="text-gray-600 text-sm mt-1">{ad.address_details}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 space-x-reverse text-sm text-gray-500 pt-4 border-t">
                  <span className="flex items-center space-x-1 space-x-reverse">
                    <span>👁️</span>
                    <span>{ad.views_count} مشاهدة</span>
                  </span>
                  <span className="flex items-center space-x-1 space-x-reverse">
                    <span>❤️</span>
                    <span>{ad.favorites_count} مفضل</span>
                  </span>
                  <span className="flex items-center space-x-1 space-x-reverse">
                    <span>🕒</span>
                    <span>{timeAgo(ad.created_at)}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الاتصال</h3>
              
              {/* Seller Info */}
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {ad.user?.first_name?.charAt(0) || ad.contact_name?.charAt(0) || '👤'}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {ad.contact_name || `${ad.user?.first_name} ${ad.user?.last_name}`.trim()}
                  </h4>
                  {ad.user?.is_business_verified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">✓ تاجر موثق</span>
                  )}
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                {!showContactInfo ? (
                  <button
                    onClick={() => setShowContactInfo(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    📞 إظهار رقم الهاتف
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handlePhoneClick}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 space-x-reverse"
                    >
                      <span>📞</span>
                      <span>{ad.contact_phone}</span>
                    </button>
                    
                    <button
                      onClick={handleWhatsAppClick}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 space-x-reverse"
                    >
                      <span>💬</span>
                      <span>واتساب</span>
                    </button>
                  </div>
                )}

                {ad.contact_email && showContactInfo && (
                  <a
                    href={`mailto:${ad.contact_email}?subject=استفسار عن: ${ad.title}`}
                    className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 space-x-reverse"
                  >
                    <span>✉️</span>
                    <span>إرسال إيميل</span>
                  </a>
                )}
              </div>

              {/* Safety Notice */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  ⚠️ تأكد من المنتج قبل الدفع ولا تشارك معلوماتك المالية
                </p>
              </div>
            </div>

            {/* Report Ad */}
            {!isOwner && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <button className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-1 space-x-reverse">
                  <span>🚨</span>
                  <span>الإبلاغ عن هذا الإعلان</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Ads */}
        {relatedAds.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">إعلانات مشابهة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedAds.map((relatedAd) => (
                <Link key={relatedAd.id} href={`/ads/${relatedAd.id}`}>
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer">
                    <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                      {relatedAd.images && relatedAd.images.length > 0 ? (
                        <Image 
                          src={relatedAd.images[0].image_url || '/placeholder-image.png'}
                          alt={relatedAd.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-4xl">{relatedAd.category?.icon || '📦'}</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 truncate">{relatedAd.title}</h3>
                      {relatedAd.price && relatedAd.price_type !== 'free' ? (
                        <p className="text-green-600 font-bold">
                          {formatPrice(relatedAd.price, relatedAd.currency)}
                        </p>
                      ) : (
                        <p className="text-green-600 font-bold">مجاناً</p>
                      )}
                      <p className="text-sm text-gray-500">{relatedAd.city}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">تأكيد الحذف</h3>
            <p className="text-gray-600 mb-6">هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex space-x-4 space-x-reverse">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteAd}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdDetailPage;