'use client';

import React, { useState, useEffect } from 'react';
import { mockDataService, MockAd, MockCategory } from '@/lib/mockData';
import { logger } from '@/lib/logger';

const MockDataAdminPage: React.FC = () => {
  const [ads, setAds] = useState<MockAd[]>([]);
  const [categories, setCategories] = useState<MockCategory[]>([]);
  const [stats, setStats] = useState({ totalAds: 0, totalUsers: 0, totalCategories: 0 });
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    loadData();
    loadLogs();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [adsResult, categoriesResult, statsResult] = await Promise.all([
        mockDataService.getAds({}, 1, 10),
        mockDataService.getCategories(),
        mockDataService.getStats()
      ]);

      setAds(adsResult.data);
      setCategories(categoriesResult.data);
      setStats(statsResult.data);
    } catch (error) {
      logger.error('Failed to load mock data', error, 'MockDataAdmin');
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = () => {
    const recentLogs = logger.getRecentLogs(20);
    setLogs(recentLogs);
  };

  const createTestAd = async () => {
    const testAd = {
      title: `إعلان تجريبي ${Date.now()}`,
      description: 'هذا إعلان تجريبي تم إنشاؤه من لوحة التحكم',
      category_id: '3',
      price: Math.floor(Math.random() * 1000) + 100,
      currency: 'ILS',
      price_type: 'fixed' as const,
      city: 'رام الله',
      region: 'ramallah',
      ad_type: 'sell' as const,
      contact_name: 'مستخدم تجريبي',
      contact_phone: '0591234567',
      contact_method: ['phone'],
      is_urgent: Math.random() > 0.5
    };

    const result = await mockDataService.createAd(testAd);
    if (result.data) {
      logger.info('Test ad created successfully', { id: result.data.id }, 'MockDataAdmin');
      await loadData();
    }
  };

  const toggleFavorite = async (adId: string) => {
    const result = await mockDataService.toggleFavorite(adId);
    if (result.error) {
      logger.error('Failed to toggle favorite', result.error, 'MockDataAdmin');
    } else {
      await loadData();
    }
  };

  const clearLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 لوحة تحكم البيانات التجريبية
          </h1>
          <p className="text-gray-600">
            إدارة ومراقبة البيانات التجريبية لمنصة يلا سوق الفلسطينية
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">📢</div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الإعلانات</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalAds}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">👥</div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">📁</div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الفئات</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalCategories}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🛠️ أدوات التحكم</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={createTestAd}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ➕ إنشاء إعلان تجريبي
            </button>
            <button
              onClick={loadData}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              🔄 إعادة تحميل البيانات
            </button>
            <button
              onClick={clearLogs}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              🗑️ مسح السجلات
            </button>
            <button
              onClick={loadLogs}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              📋 تحديث السجلات
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Ads */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📢 آخر الإعلانات</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {ads.map((ad) => (
                <div key={ad.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{ad.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {ad.price} {ad.currency} • {ad.city}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>👁️ {ad.views_count}</span>
                        <span className="mr-3">❤️ {ad.favorites_count}</span>
                        <span className="mr-3">💬 {ad.messages_count}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {ad.is_featured && <span className="text-yellow-500">⭐</span>}
                      {ad.is_urgent && <span className="text-red-500">🔥</span>}
                      <button
                        onClick={() => toggleFavorite(ad.id)}
                        className={`text-xl ${ad.is_favorited ? 'text-red-500' : 'text-gray-400'}`}
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Logs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📋 سجل النظام</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-sm">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    log.level === 'error'
                      ? 'bg-red-50 text-red-800'
                      : log.level === 'warn'
                      ? 'bg-yellow-50 text-yellow-800'
                      : log.level === 'info'
                      ? 'bg-blue-50 text-blue-800'
                      : 'bg-gray-50 text-gray-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium">
                      [{log.level.toUpperCase()}] {log.source && `[${log.source}]`}
                    </span>
                    <span className="text-xs">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="mt-1">{log.message}</div>
                  {log.data && (
                    <div className="mt-1 text-xs opacity-75">
                      {JSON.stringify(log.data, null, 2)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">📁 الفئات المتاحة</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="text-center p-4 border rounded-lg">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.slug}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockDataAdminPage;
