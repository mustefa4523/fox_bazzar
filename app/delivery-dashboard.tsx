import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Package,
  Navigation,
  Phone,
  CheckCircle,
  Truck,
  Star,
} from 'lucide-react-native';
import { router } from 'expo-router';

interface DeliveryOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: string[];
  total: number;
  distance: string;
  estimatedTime: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered';
  customerAvatar: string;
}

const deliveryOrders: DeliveryOrder[] = [
  {
    id: 'DEL001',
    customerName: 'أحمد محمد',
    customerPhone: '+963 999 123 456',
    customerAddress: 'شارع الثورة، بناء رقم 15، دمشق',
    items: ['iPhone 15 Pro Max', 'AirPods Pro'],
    total: 1548,
    distance: '2.5 كم',
    estimatedTime: '15 دقيقة',
    status: 'pending',
    customerAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: 'DEL002',
    customerName: 'فاطمة علي',
    customerPhone: '+963 999 654 321',
    customerAddress: 'شارع بغداد، مكتب رقم 8، دمشق',
    items: ['Samsung Galaxy S24'],
    total: 999,
    distance: '1.8 كم',
    estimatedTime: '12 دقيقة',
    status: 'accepted',
    customerAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

export default function DeliveryDashboard() {
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'history'>('available');
  const [isOnline, setIsOnline] = useState(true);

  const todayEarnings = 125;
  const todayDeliveries = 8;
  const averageRating = 4.9;
  const totalDistance = 45;

  const handleAcceptOrder = (orderId: string) => {
    Alert.alert(
      'قبول الطلب',
      'هل تريد قبول هذا الطلب؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'قبول',
          onPress: () => {
            Alert.alert('تم قبول الطلب', 'تم قبول الطلب بنجاح، يمكنك الآن التوجه لاستلامه');
          },
        },
      ]
    );
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    Alert.alert('تم تحديث الحالة', `تم تحديث حالة الطلب إلى: ${newStatus}`);
  };

  const handleCallCustomer = (phone: string) => {
    Alert.alert('اتصال', `سيتم الاتصال بـ ${phone}`);
  };

  const handleNavigate = (address: string) => {
    Alert.alert('التنقل', `سيتم فتح الخريطة للتوجه إلى: ${address}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'accepted':
        return '#3B82F6';
      case 'picked_up':
        return '#8B5CF6';
      case 'delivered':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار';
      case 'accepted':
        return 'مقبول';
      case 'picked_up':
        return 'تم الاستلام';
      case 'delivered':
        return 'تم التوصيل';
      default:
        return status;
    }
  };

  const renderAvailableOrders = () => (
    <View>
      <Text style={styles.sectionTitle}>الطلبات المتاحة</Text>
      {deliveryOrders
        .filter(order => order.status === 'pending')
        .map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.customerInfo}>
                <Image source={{ uri: order.customerAvatar }} style={styles.customerAvatar} />
                <View>
                  <Text style={styles.customerName}>{order.customerName}</Text>
                  <Text style={styles.orderId}>#{order.id}</Text>
                </View>
              </View>
              <Text style={styles.orderTotal}>${order.total}</Text>
            </View>
            
            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#8B5CF6" />
                <Text style={styles.detailText}>{order.customerAddress}</Text>
              </View>
              <View style={styles.detailRow}>
                <Navigation size={16} color="#10B981" />
                <Text style={styles.detailText}>{order.distance}</Text>
              </View>
              <View style={styles.detailRow}>
                <Clock size={16} color="#F59E0B" />
                <Text style={styles.detailText}>{order.estimatedTime}</Text>
              </View>
            </View>
            
            <Text style={styles.orderItems}>
              المنتجات: {order.items.join(', ')}
            </Text>
            
            <View style={styles.orderActions}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAcceptOrder(order.id)}
              >
                <CheckCircle size={20} color="#FFFFFF" />
                <Text style={styles.acceptButtonText}>قبول الطلب</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
    </View>
  );

  const renderActiveOrders = () => (
    <View>
      <Text style={styles.sectionTitle}>الطلبات النشطة</Text>
      {deliveryOrders
        .filter(order => order.status === 'accepted' || order.status === 'picked_up')
        .map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.customerInfo}>
                <Image source={{ uri: order.customerAvatar }} style={styles.customerAvatar} />
                <View>
                  <Text style={styles.customerName}>{order.customerName}</Text>
                  <Text style={styles.orderId}>#{order.id}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
              </View>
            </View>
            
            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#8B5CF6" />
                <Text style={styles.detailText}>{order.customerAddress}</Text>
              </View>
            </View>
            
            <View style={styles.orderActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleCallCustomer(order.customerPhone)}
              >
                <Phone size={16} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>اتصال</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleNavigate(order.customerAddress)}
              >
                <Navigation size={16} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>التنقل</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => handleUpdateStatus(order.id, 'delivered')}
              >
                <CheckCircle size={16} color="#FFFFFF" />
                <Text style={styles.updateButtonText}>تم التوصيل</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
    </View>
  );

  const renderHistory = () => (
    <View>
      <Text style={styles.sectionTitle}>سجل التوصيلات</Text>
      {deliveryOrders
        .filter(order => order.status === 'delivered')
        .map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.customerInfo}>
                <Image source={{ uri: order.customerAvatar }} style={styles.customerAvatar} />
                <View>
                  <Text style={styles.customerName}>{order.customerName}</Text>
                  <Text style={styles.orderId}>#{order.id}</Text>
                </View>
              </View>
              <Text style={styles.orderTotal}>${order.total}</Text>
            </View>
            
            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={[styles.detailText, { color: '#10B981' }]}>تم التوصيل بنجاح</Text>
              </View>
            </View>
          </View>
        ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>لوحة الموصل</Text>
        <TouchableOpacity
          style={[styles.statusToggle, isOnline && styles.statusToggleOnline]}
          onPress={() => setIsOnline(!isOnline)}
        >
          <Text style={styles.statusToggleText}>
            {isOnline ? 'متصل' : 'غير متصل'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <DollarSign size={20} color="#10B981" />
          <Text style={styles.statValue}>${todayEarnings}</Text>
          <Text style={styles.statLabel}>أرباح اليوم</Text>
        </View>
        
        <View style={styles.statCard}>
          <Package size={20} color="#3B82F6" />
          <Text style={styles.statValue}>{todayDeliveries}</Text>
          <Text style={styles.statLabel}>توصيلات اليوم</Text>
        </View>
        
        <View style={styles.statCard}>
          <Star size={20} color="#F59E0B" />
          <Text style={styles.statValue}>{averageRating}</Text>
          <Text style={styles.statLabel}>التقييم</Text>
        </View>
        
        <View style={styles.statCard}>
          <Truck size={20} color="#8B5CF6" />
          <Text style={styles.statValue}>{totalDistance} كم</Text>
          <Text style={styles.statLabel}>المسافة</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.activeTab]}
          onPress={() => setActiveTab('available')}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
            متاحة
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            نشطة
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            السجل
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'available' && renderAvailableOrders()}
        {activeTab === 'active' && renderActiveOrders()}
        {activeTab === 'history' && renderHistory()}
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
  statusToggle: {
    backgroundColor: '#374151',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusToggleOnline: {
    backgroundColor: '#10B981',
  },
  statusToggleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statCard: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginTop: 4,
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  customerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  orderId: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  orderTotal: {
    color: '#8B5CF6',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  orderDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
    flex: 1,
  },
  orderItems: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  updateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 4,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
  },
});