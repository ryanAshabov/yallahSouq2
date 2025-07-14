'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/lib/logger';

/**
 * Dashboard Page - Yalla Souq Palestinian Marketplace
 * 
 * Main user dashboard providing access to account management,
 * advertisements, favorites, and marketplace activity.
 */
const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    activeAds: 0,
    viewsCount: 0,
    favoritesCount: 0,
    messagesCount: 0
  });

  // Check authentication
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  // Load user stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        // In mock mode, use mock stats
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          setStats({
            activeAds: 3,
            viewsCount: 156,
            favoritesCount: 12,
            messagesCount: 8
          });
          return;
        }

        // In real mode, would fetch from Supabase
        logger.debug('Would fetch real stats from Supabase here', null, 'Dashboard');
      } catch (error) {
        logger.error('Failed to load dashboard stats', error, 'Dashboard');
      }
    };

    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/" className="text-blue-600 hover:text-blue-700">
                ← العودة للرئيسية
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            مرحباً، {user?.first_name || 'مستخدم'}! 👋
          </h2>
          <p className="text-gray-600">
            مرحباً بك في لوحة تحكم يلا سوق الفلسطيني. هنا يمكنك إدارة إعلاناتك ومتابعة نشاطك في السوق.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">إعلاناتك النشطة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeAds}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl">
                📢
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">إجمالي المشاهدات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.viewsCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xl">
                👁️
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">المفضلة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.favoritesCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 text-xl">
                ❤️
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">الرسائل</p>
                <p className="text-2xl font-bold text-gray-900">{stats.messagesCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-xl">
                💬
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/post-ad">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                  ➕
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">أضف إعلان جديد</h3>
                  <p className="text-sm text-gray-600">أضف إعلان جديد للبيع أو الإيجار</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/my-ads">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl">
                  📋
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">إعلاناتي</h3>
                  <p className="text-sm text-gray-600">إدارة إعلاناتك الحالية</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/profile">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                  👤
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">الملف الشخصي</h3>
                  <p className="text-sm text-gray-600">تعديل معلوماتك الشخصية</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">آخر النشاطات</h2>
          
          {/* Activity List */}
          <div className="space-y-4">
            <div className="flex items-start space-x-4 space-x-reverse border-b border-gray-100 pb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                👁️
              </div>
              <div className="flex-1">
                <p className="text-gray-900">شخص ما شاهد إعلانك <span className="font-medium">آيفون 14 برو ماكس للبيع</span></p>
                <p className="text-sm text-gray-500">منذ 2 ساعة</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 space-x-reverse border-b border-gray-100 pb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                ❤️
              </div>
              <div className="flex-1">
                <p className="text-gray-900">شخص ما أضاف إعلانك <span className="font-medium">سيارة تويوتا كامري 2019</span> للمفضلة</p>
                <p className="text-sm text-gray-500">منذ 5 ساعات</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 space-x-reverse">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                💬
              </div>
              <div className="flex-1">
                <p className="text-gray-900">لديك رسالة جديدة حول إعلان <span className="font-medium">شقة للإيجار في البيرة</span></p>
                <p className="text-sm text-gray-500">منذ يوم واحد</p>
              </div>
            </div>
          </div>
          
          {/* View All Link */}
          <div className="mt-4 text-center">
            <Link href="/activity" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              عرض كل النشاطات →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;