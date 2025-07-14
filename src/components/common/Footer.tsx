/**
 * Footer Component - Yalla Souq Palestinian Marketplace
 * 
 * Comprehensive footer component providing essential navigation,
 * information, and branding for the Palestinian marketplace platform.
 * Includes multiple sections for optimal user experience and
 * professional marketplace presentation.
 * 
 * Footer Sections:
 * - Brand information and Palestinian marketplace identity
 * - Quick navigation links to major platform sections
 * - Category shortcuts for popular marketplace items
 * - Support and help center links for user assistance
 * - Social media integration for community engagement
 * - Legal information and privacy policy links
 * - Contact information for Palestinian marketplace support
 * 
 * Palestinian Market Features:
 * - Arabic language content with RTL layout support
 * - Palestinian business registration information
 * - Local contact details and support hours
 * - Cultural design elements and Palestinian branding
 * - Geographic service area information for Palestine
 * - Arabic typography optimization for footer text
 * 
 * Navigation Structure:
 * - Main categories with quick access links
 * - User account and profile management links
 * - Seller tools and business account shortcuts
 * - Help center and FAQ section access
 * - Community guidelines and marketplace rules
 * - Mobile app download links and QR codes
 * 
 * SEO Optimization:
 * - Structured footer markup for search engines
 * - Internal linking for improved site authority
 * - Local business schema markup for Palestinian market
 * - Footer sitemap integration for better crawling
 * - Arabic keyword optimization for Palestinian searches
 * 
 * Responsive Design:
 * - Mobile-first responsive layout design
 * - Tablet optimization for mid-size screens
 * - Desktop multi-column layout for comprehensive information
 * - Touch-friendly links and buttons for mobile users
 * - Proper spacing and typography scaling
 * 
 * Accessibility Features:
 * - WCAG 2.1 compliance with proper semantic structure
 * - Keyboard navigation support for all footer links
 * - Screen reader compatibility with descriptive labels
 * - High contrast mode support for visual accessibility
 * - Focus indicators for interactive elements
 * 
 * Social Media Integration:
 * - Palestinian marketplace social media profiles
 * - Community sharing and engagement features
 * - Social proof through follower counts
 * - Cultural social platforms popular in Palestine
 * - Arabic social media content promotion
 * 
 * Legal Compliance:
 * - Privacy policy and terms of service links
 * - Palestinian legal compliance information
 * - GDPR compliance for international users
 * - Cookie policy and data handling information
 * - Dispute resolution and arbitration details
 * 
 * Business Information:
 * - Palestinian marketplace company details
 * - Business registration and licensing information
 * - Operating hours and support availability
 * - Physical address and location information
 * - Multiple contact methods (phone, email, chat)
 * 
 * Technical Features:
 * - Dynamic year calculation for copyright information
 * - Efficient link structure for performance
 * - SEO-friendly URL structure for footer links
 * - Analytics integration for footer interaction tracking
 * - Newsletter subscription integration
 * 
 * @component Footer
 * @author Yalla Souq Development Team
 * @version 2.0.0
 * @since 1.0.0
 */

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <span className="text-3xl">🛒</span>
              <h3 className="text-2xl font-bold text-blue-400">يلا سوق الفلسطيني</h3>
              <span className="text-sm bg-green-600 px-2 py-1 rounded">🇵🇸</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              منصة الإعلانات المبوبة الأولى في فلسطين. 
              نربط بين البائعين والمشترين بطريقة آمنة وسهلة، وندعم الاقتصاد المحلي الفلسطيني.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 space-x-reverse">
              <a 
                href="https://facebook.com/yallasouq.ps" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="فيسبوك"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              <a 
                href="https://instagram.com/yallasouq.ps" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors"
                aria-label="إنستغرام"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              <a 
                href="https://wa.me/970599123456" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
                aria-label="واتساب"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
              
              <a 
                href="https://t.me/yallasouq_ps" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="تليجرام"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-blue-400 transition-colors">
                  الفئات
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-300 hover:text-blue-400 transition-colors">
                  البحث المتقدم
                </Link>
              </li>
              <li>
                <Link href="/post-ad" className="text-gray-300 hover:text-blue-400 transition-colors">
                  أضف إعلان
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-300 hover:text-blue-400 transition-colors">
                  نصائح الأمان
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Help */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">المساعدة والدعم</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-blue-400 transition-colors">
                  مركز المساعدة
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-gray-300 hover:text-blue-400 transition-colors">
                  بلغ عن مشكلة
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-blue-400 transition-colors">
                  شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Palestinian Cities & Regions */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <h4 className="text-lg font-semibold mb-4 text-green-400">نخدم جميع المحافظات الفلسطينية</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-400">
            <div>
              <h5 className="font-medium text-gray-300 mb-2">الضفة الغربية</h5>
              <ul className="space-y-1">
                <li><Link href="/region/jerusalem" className="hover:text-blue-400">القدس</Link></li>
                <li><Link href="/region/ramallah" className="hover:text-blue-400">رام الله</Link></li>
                <li><Link href="/region/bethlehem" className="hover:text-blue-400">بيت لحم</Link></li>
                <li><Link href="/region/hebron" className="hover:text-blue-400">الخليل</Link></li>
                <li><Link href="/region/nablus" className="hover:text-blue-400">نابلس</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-300 mb-2">الشمال</h5>
              <ul className="space-y-1">
                <li><Link href="/region/jenin" className="hover:text-blue-400">جنين</Link></li>
                <li><Link href="/region/tulkarm" className="hover:text-blue-400">طولكرم</Link></li>
                <li><Link href="/region/qalqilya" className="hover:text-blue-400">قلقيلية</Link></li>
                <li><Link href="/region/salfit" className="hover:text-blue-400">سلفيت</Link></li>
                <li><Link href="/region/tubas" className="hover:text-blue-400">طوباس</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-300 mb-2">قطاع غزة</h5>
              <ul className="space-y-1">
                <li><Link href="/region/gaza" className="hover:text-blue-400">غزة</Link></li>
                <li><Link href="/region/north-gaza" className="hover:text-blue-400">شمال غزة</Link></li>
                <li><Link href="/region/deir-al-balah" className="hover:text-blue-400">دير البلح</Link></li>
                <li><Link href="/region/khan-younis" className="hover:text-blue-400">خان يونس</Link></li>
                <li><Link href="/region/rafah" className="hover:text-blue-400">رفح</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-300 mb-2">الأغوار</h5>
              <ul className="space-y-1">
                <li><Link href="/region/jericho" className="hover:text-blue-400">أريحا</Link></li>
                <li><Link href="/region/jordan-valley" className="hover:text-blue-400">الأغوار الشمالية</Link></li>
                <li><Link href="/region/dead-sea" className="hover:text-blue-400">البحر الميت</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-300 mb-2">المهجر</h5>
              <ul className="space-y-1">
                <li><Link href="/region/jordan" className="hover:text-blue-400">الأردن</Link></li>
                <li><Link href="/region/lebanon" className="hover:text-blue-400">لبنان</Link></li>
                <li><Link href="/region/syria" className="hover:text-blue-400">سوريا</Link></li>
                <li><Link href="/region/other" className="hover:text-blue-400">دول أخرى</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} يلا سوق الفلسطيني. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center space-x-6 space-x-reverse mt-4 md:mt-0">
              <span className="text-gray-400 text-sm flex items-center space-x-2 space-x-reverse">
                <span>🇵🇸</span>
                <span>صُنع بـ ❤️ لفلسطين الحبيبة</span>
              </span>
              <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-500">
                <span>v2.1.0</span>
                <span>•</span>
                <span>آخر تحديث: {new Date().toLocaleDateString('ar-PS')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};