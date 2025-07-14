/**
 * Example Component with Logger Integration - Yalla Souq Palestinian Marketplace
 * 
 * This component demonstrates how to integrate the professional logging system
 * throughout the Palestinian marketplace application. Shows best practices
 * for logging user actions, API calls, performance metrics, and error handling.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { logger, withPerformanceLog } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

const ExampleComponent: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Example: Component lifecycle logging
  useEffect(() => {
    logger.debug('ExampleComponent mounted', { timestamp: Date.now() }, 'COMPONENT');
    
    // Load initial data with performance monitoring
    loadData();

    return () => {
      logger.debug('ExampleComponent unmounted', {}, 'COMPONENT');
    };
  }, []);

  // Example: API call with comprehensive logging
  const loadData = async () => {
    logger.userAction('Started loading data', { component: 'ExampleComponent' });
    setLoading(true);
    setError(null);

    try {
      // Use performance logging wrapper
      const result = await withPerformanceLog('load_example_data', async () => {
        logger.apiCall('GET', '/api/example-data');
        
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .limit(5);

        if (error) throw error;
        return data;
      });

      logger.apiResponse('GET', '/api/example-data', 200, { count: result?.length });
      logger.info('Data loaded successfully', { count: result?.length }, 'COMPONENT');
      
      setData(result || []);
      logger.userAction('Data loading completed', { count: result?.length });

    } catch (err: any) {
      logger.error('Failed to load data', err, 'COMPONENT');
      logger.apiResponse('GET', '/api/example-data', 500, err);
      
      setError(err.message || 'حدث خطأ في تحميل البيانات');
      logger.userAction('Data loading failed', { error: err.message });
      
    } finally {
      setLoading(false);
      logger.debug('Loading state cleared', {}, 'COMPONENT');
    }
  };

  // Example: User interaction logging
  const handleButtonClick = (action: string) => {
    logger.userAction(`Button clicked: ${action}`, {
      component: 'ExampleComponent',
      timestamp: Date.now()
    });

    // Simulate some operation
    logger.info(`Performing action: ${action}`, {}, 'USER_ACTION');
  };

  // Example: Error boundary logging
  const handleError = (error: Error) => {
    logger.error('Component error occurred', {
      message: error.message,
      stack: error.stack,
      component: 'ExampleComponent'
    }, 'ERROR_BOUNDARY');
  };

  // Example: Performance measurement for expensive operations
  const expensiveOperation = async () => {
    await withPerformanceLog('expensive_calculation', async () => {
      // Simulate expensive operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Complex calculation
      let result = 0;
      for (let i = 0; i < 1000000; i++) {
        result += Math.random();
      }
      
      logger.debug('Expensive operation completed', { result }, 'CALCULATION');
      return result;
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        مثال على نظام التسجيل
      </h1>

      {/* Status Display */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">حالة المكون</h2>
        <p>البيانات المحملة: {data.length} عنصر</p>
        <p>حالة التحميل: {loading ? 'جاري التحميل...' : 'مكتمل'}</p>
        {error && <p className="text-red-600">خطأ: {error}</p>}
      </div>

      {/* Action Buttons */}
      <div className="mb-6 space-x-4 space-x-reverse">
        <button
          onClick={() => handleButtonClick('reload_data')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          إعادة تحميل البيانات
        </button>

        <button
          onClick={() => handleButtonClick('test_logging')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          اختبار نظام التسجيل
        </button>

        <button
          onClick={expensiveOperation}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          عملية معقدة (قياس الأداء)
        </button>

        <button
          onClick={() => {
            logger.warn('Test warning logged', { userInitiated: true });
            alert('تم تسجيل تحذير تجريبي - تحقق من وحدة التحكم');
          }}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          تسجيل تحذير
        </button>

        <button
          onClick={() => {
            try {
              throw new Error('خطأ تجريبي لاختبار نظام التسجيل');
            } catch (err: any) {
              handleError(err);
              alert('تم تسجيل خطأ تجريبي - تحقق من وحدة التحكم');
            }
          }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          محاكاة خطأ
        </button>
      </div>

      {/* Data Display */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg bg-white shadow-sm">
              <h3 className="font-semibold">{item.first_name} {item.last_name}</h3>
              <p className="text-gray-600 text-sm">المعرف: {item.id}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent Logs Display */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">آخر السجلات</h2>
        <button
          onClick={() => {
            const recentLogs = logger.getRecentLogs(5);
            console.log('Recent Logs:', recentLogs);
            alert(`تم عرض ${recentLogs.length} سجل في وحدة التحكم`);
          }}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mb-4"
        >
          عرض آخر 5 سجلات
        </button>

        <button
          onClick={() => {
            logger.clearLogs();
            alert('تم مسح جميع السجلات');
          }}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 mr-2"
        >
          مسح السجلات
        </button>
      </div>

      {/* Logging Information */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2 text-blue-800">معلومات نظام التسجيل</h2>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• تسجيل أحداث المستخدم وتفاعلاته</p>
          <p>• مراقبة الأداء وقياس أوقات العمليات</p>
          <p>• تسجيل استدعاءات API والردود</p>
          <p>• تسجيل الأخطاء والتحذيرات</p>
          <p>• دعم مستويات تسجيل متعددة</p>
          <p>• تكامل مع متغيرات البيئة</p>
        </div>
      </div>
    </div>
  );
};

export default ExampleComponent;
