import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bell,
  Shield,
  Globe,
  Moon,
  HelpCircle,
  MessageCircle,
  Star,
  Info,
  ChevronRight,
  Smartphone,
  Mail,
  Volume2,
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
    orders: true,
    promotions: false,
    newProducts: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showOnlineStatus: false,
    allowMessages: true,
  });

  const [preferences, setPreferences] = useState({
    darkMode: true,
    language: 'ar',
    currency: 'USD',
    autoPlay: false,
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const settingSections = [
    {
      title: 'الإشعارات',
      icon: Bell,
      items: [
        {
          title: 'الإشعارات الفورية',
          subtitle: 'تلقي إشعارات على الجهاز',
          type: 'switch',
          value: notifications.push,
          onToggle: (value: boolean) => handleNotificationChange('push', value),
        },
        {
          title: 'إشعارات البريد الإلكتروني',
          subtitle: 'تلقي إشعارات عبر البريد',
          type: 'switch',
          value: notifications.email,
          onToggle: (value: boolean) => handleNotificationChange('email', value),
        },
        {
          title: 'الرسائل النصية',
          subtitle: 'تلقي رسائل SMS',
          type: 'switch',
          value: notifications.sms,
          onToggle: (value: boolean) => handleNotificationChange('sms', value),
        },
        {
          title: 'إشعارات الطلبات',
          subtitle: 'تحديثات حالة الطلبات',
          type: 'switch',
          value: notifications.orders,
          onToggle: (value: boolean) => handleNotificationChange('orders', value),
        },
        {
          title: 'العروض والتخفيضات',
          subtitle: 'إشعارات العروض الخاصة',
          type: 'switch',
          value: notifications.promotions,
          onToggle: (value: boolean) => handleNotificationChange('promotions', value),
        },
        {
          title: 'المنتجات الجديدة',
          subtitle: 'إشعارات المنتجات الجديدة',
          type: 'switch',
          value: notifications.newProducts,
          onToggle: (value: boolean) => handleNotificationChange('newProducts', value),
        },
      ],
    },
    {
      title: 'الخصوصية والأمان',
      icon: Shield,
      items: [
        {
          title: 'إظهار الملف الشخصي',
          subtitle: 'السماح للآخرين برؤية ملفك',
          type: 'switch',
          value: privacy.profileVisible,
          onToggle: (value: boolean) => handlePrivacyChange('profileVisible', value),
        },
        {
          title: 'إظهار حالة الاتصال',
          subtitle: 'إظهار متى كنت متصلاً آخر مرة',
          type: 'switch',
          value: privacy.showOnlineStatus,
          onToggle: (value: boolean) => handlePrivacyChange('showOnlineStatus', value),
        },
        {
          title: 'السماح بالرسائل',
          subtitle: 'تلقي رسائل من المستخدمين',
          type: 'switch',
          value: privacy.allowMessages,
          onToggle: (value: boolean) => handlePrivacyChange('allowMessages', value),
        },
        {
          title: 'تغيير كلمة المرور',
          subtitle: 'تحديث كلمة المرور',
          type: 'navigation',
          onPress: () => Alert.alert('تغيير كلمة المرور', 'سيتم توجيهك لصفحة تغيير كلمة المرور'),
        },
        {
          title: 'المصادقة الثنائية',
          subtitle: 'تأمين إضافي للحساب',
          type: 'navigation',
          onPress: () => Alert.alert('المصادقة الثنائية', 'تفعيل المصادقة الثنائية'),
        },
      ],
    },
    {
      title: 'التفضيلات',
      icon: Globe,
      items: [
        {
          title: 'الوضع الليلي',
          subtitle: 'تفعيل الثيم الداكن',
          type: 'switch',
          value: preferences.darkMode,
          onToggle: (value: boolean) => handlePreferenceChange('darkMode', value),
        },
        {
          title: 'اللغة',
          subtitle: 'العربية',
          type: 'navigation',
          onPress: () => Alert.alert('اللغة', 'اختيار لغة التطبيق'),
        },
        {
          title: 'العملة',
          subtitle: 'الدولار الأمريكي (USD)',
          type: 'navigation',
          onPress: () => Alert.alert('العملة', 'اختيار العملة المفضلة'),
        },
        {
          title: 'تشغيل الفيديو تلقائياً',
          subtitle: 'تشغيل الفيديوهات تلقائياً',
          type: 'switch',
          value: preferences.autoPlay,
          onToggle: (value: boolean) => handlePreferenceChange('autoPlay', value),
        },
      ],
    },
    {
      title: 'المساعدة والدعم',
      icon: HelpCircle,
      items: [
        {
          title: 'مركز المساعدة',
          subtitle: 'الأسئلة الشائعة والدعم',
          type: 'navigation',
          onPress: () => Alert.alert('مركز المساعدة', 'سيتم توجيهك لمركز المساعدة'),
        },
        {
          title: 'تواصل معنا',
          subtitle: 'إرسال رسالة للدعم الفني',
          type: 'navigation',
          onPress: () => Alert.alert('تواصل معنا', 'سيتم فتح نافذة التواصل'),
        },
        {
          title: 'تقييم التطبيق',
          subtitle: 'قيم تجربتك معنا',
          type: 'navigation',
          onPress: () => Alert.alert('تقييم التطبيق', 'شكراً لك على التقييم'),
        },
        {
          title: 'الإبلاغ عن مشكلة',
          subtitle: 'أبلغ عن خطأ أو مشكلة',
          type: 'navigation',
          onPress: () => Alert.alert('الإبلاغ عن مشكلة', 'سيتم إرسال تقرير المشكلة'),
        },
      ],
    },
    {
      title: 'حول التطبيق',
      icon: Info,
      items: [
        {
          title: 'الإصدار',
          subtitle: '1.0.0',
          type: 'info',
        },
        {
          title: 'شروط الاستخدام',
          subtitle: 'اقرأ شروط الاستخدام',
          type: 'navigation',
          onPress: () => Alert.alert('شروط الاستخدام', 'سيتم عرض شروط الاستخدام'),
        },
        {
          title: 'سياسة الخصوصية',
          subtitle: 'اقرأ سياسة الخصوصية',
          type: 'navigation',
          onPress: () => Alert.alert('سياسة الخصوصية', 'سيتم عرض سياسة الخصوصية'),
        },
        {
          title: 'التراخيص',
          subtitle: 'تراخيص المكتبات المستخدمة',
          type: 'navigation',
          onPress: () => Alert.alert('التراخيص', 'سيتم عرض التراخيص'),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => {
    switch (item.type) {
      case 'switch':
        return (
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: '#374151', true: '#8B5CF6' }}
              thumbColor={item.value ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>
        );

      case 'navigation':
        return (
          <TouchableOpacity style={styles.settingItem} onPress={item.onPress}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        );

      case 'info':
        return (
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الإعدادات</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, sectionIndex) => {
          const IconComponent = section.icon;
          
          return (
            <View key={sectionIndex} style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconComponent size={20} color="#8B5CF6" />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>

              <View style={styles.sectionContent}>
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    {renderSettingItem(item)}
                    {itemIndex < section.items.length - 1 && (
                      <View style={styles.separator} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>FOX BAZAR</Text>
          <Text style={styles.appInfoSubtext}>
            تطبيق التجارة الإلكترونية الشامل
          </Text>
          <Text style={styles.appInfoVersion}>الإصدار 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  sectionContent: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  settingSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  separator: {
    height: 1,
    backgroundColor: '#374151',
    marginHorizontal: 16,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 20,
  },
  appInfoText: {
    color: '#8B5CF6',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  appInfoSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  appInfoVersion: {
    color: '#6B7280',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});