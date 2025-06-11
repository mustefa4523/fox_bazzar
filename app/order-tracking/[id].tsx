import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Phone,
  MessageCircle,
  MapPin,
  Star,
} from 'lucide-react-native';

interface OrderStatus {
  id: string;
  title: string;
  description: string;
  time: string;
  completed: boolean;
  icon: any;
}

interface DeliveryPerson {
  name: string;
  phone: string;
  rating: number;
  avatar: string;
  vehicleType: string;
  vehicleNumber: string;
}

const orderStatuses: OrderStatus[] = [
  {
    id: '1',
    title: 'تم تأكيد الطلب',
    description: 'تم استلام طلبك وجاري المراجعة',
    time: '10:30 ص',
    completed: true,
    icon: CheckCircle,
  },
  {
    id: '2',
    title: 'جاري التحضير',
    description: 'التاجر يحضر طلبك للشحن',
    time: '11:15 ص',
    completed: true,
    icon: Package,
  },
  {
    id: '3',
    title: 'خرج للتوصيل',
    description: 'الطلب في الطريق إليك',
    time: '12:45 م',
    completed: true,
    icon: Truck,
  },
  {
    id: '4',
    title: 'تم التوصيل',
    description: 'تم تسليم الطلب بنجاح',
    time: '',
    completed: false,
    icon: CheckCircle,
  },
];

const deliveryPerson: DeliveryPerson = {
  name: 'محمد أحمد',
  phone: '+963 999 123 456',
  rating: 4.8,
  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
  vehicleType: 'دراجة نارية',
  vehicleNumber: 'دمشق 123456',
};

const orderItems = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 1299,
    quantity: 1,
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    name: 'AirPods Pro',
    price: 249,
    quantity: 2,
    image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function OrderTrackingPage() {
  const { id } = useLocalSearchParams();
  const [currentStatus, setCurrentStatus] = useState(2);
  const [estimatedTime, setEstimatedTime] = useState('15-20 دقيقة');

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (currentStatus < orderStatuses.length - 1) {
        setCurrentStatus(prev => prev + 1);
      }
    }, 30000); // Update every 30 seconds for demo

    return () => clearInterval(interval);
  }, [currentStatus]);

  const handleCallDelivery = () => {
    Linking.openURL(`tel:${deliveryPerson.phone}`);
  };

  const handleChatDelivery = () => {
    // Open chat with delivery person
    console.log('Open chat with delivery person');
  };

  const handleTrackOnMap = () => {
    // Open map tracking
    console.log('Open map tracking');
  };

  const handleRateDelivery = () => {
    // Open rating modal
    console.log('Rate delivery person');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        color={index < rating ? '#FCD34D' : '#6B7280'}
        fill={index < rating ? '#FCD34D' : 'transparent'}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تتبع الطلب #{id?.toString().toUpperCase()}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>حالة الطلب</Text>
          <View style={styles.statusContainer}>
            {orderStatuses.map((status, index) => {
              const IconComponent = status.icon;
              const isCompleted = index <= currentStatus;
              const isCurrent = index === currentStatus;
              
              return (
                <View key={status.id} style={styles.statusItem}>
                  <View style={styles.statusLeft}>
                    <View style={[
                      styles.statusIcon,
                      isCompleted && styles.statusIconCompleted,
                      isCurrent && styles.statusIconCurrent,
                    ]}>
                      <IconComponent
                        size={20}
                        color={isCompleted ? '#FFFFFF' : '#6B7280'}
                      />
                    </View>
                    {index < orderStatuses.length - 1 && (
                      <View style={[
                        styles.statusLine,
                        isCompleted && styles.statusLineCompleted,
                      ]} />
                    )}
                  </View>
                  
                  <View style={styles.statusContent}>
                    <Text style={[
                      styles.statusTitle,
                      isCompleted && styles.statusTitleCompleted,
                    ]}>
                      {status.title}
                    </Text>
                    <Text style={styles.statusDescription}>
                      {status.description}
                    </Text>
                    {status.time && (
                      <Text style={styles.statusTime}>{status.time}</Text>
                    )}
                    {isCurrent && !isCompleted && (
                      <View style={styles.estimatedTime}>
                        <Clock size={14} color="#8B5CF6" />
                        <Text style={styles.estimatedTimeText}>
                          الوقت المتوقع: {estimatedTime}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Delivery Person Info */}
        {currentStatus >= 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات الموصل</Text>
            <View style={styles.deliveryCard}>
              <View style={styles.deliveryHeader}>
                <Image source={{ uri: deliveryPerson.avatar }} style={styles.deliveryAvatar} />
                <View style={styles.deliveryInfo}>
                  <Text style={styles.deliveryName}>{deliveryPerson.name}</Text>
                  <View style={styles.deliveryRating}>
                    {renderStars(Math.floor(deliveryPerson.rating))}
                    <Text style={styles.ratingText}>{deliveryPerson.rating}</Text>
                  </View>
                  <Text style={styles.vehicleInfo}>
                    {deliveryPerson.vehicleType} - {deliveryPerson.vehicleNumber}
                  </Text>
                </View>
              </View>
              
              <View style={styles.deliveryActions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleCallDelivery}>
                  <Phone size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>اتصال</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={handleChatDelivery}>
                  <MessageCircle size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>رسالة</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={handleTrackOnMap}>
                  <MapPin size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>الخريطة</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>تفاصيل الطلب</Text>
          <View style={styles.itemsContainer}>
            {orderItems.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    ${item.price} × {item.quantity}
                  </Text>
                </View>
                <Text style={styles.itemTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ملخص الطلب</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>المجموع الفرعي</Text>
              <Text style={styles.summaryValue}>$1,797.00</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>الضريبة</Text>
              <Text style={styles.summaryValue}>$179.70</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>التوصيل</Text>
              <Text style={styles.summaryValue}>$15.00</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>الإجمالي</Text>
              <Text style={styles.totalValue}>$1,991.70</Text>
            </View>
          </View>
        </View>

        {/* Rate Delivery Button */}
        {currentStatus === orderStatuses.length - 1 && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.rateButton} onPress={handleRateDelivery}>
              <Star size={20} color="#FFFFFF" />
              <Text style={styles.rateButtonText}>قيم تجربة التوصيل</Text>
            </TouchableOpacity>
          </View>
        )}
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
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  statusContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  statusItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statusLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconCompleted: {
    backgroundColor: '#10B981',
  },
  statusIconCurrent: {
    backgroundColor: '#8B5CF6',
  },
  statusLine: {
    width: 2,
    height: 30,
    backgroundColor: '#374151',
    marginTop: 8,
  },
  statusLineCompleted: {
    backgroundColor: '#10B981',
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  statusTitleCompleted: {
    color: '#FFFFFF',
  },
  statusDescription: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  statusTime: {
    color: '#8B5CF6',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  estimatedTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  estimatedTimeText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  deliveryCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveryAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  deliveryRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  vehicleInfo: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  deliveryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  itemsContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  itemPrice: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  itemTotal: {
    color: '#8B5CF6',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  summaryCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  totalValue: {
    color: '#8B5CF6',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  rateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
});