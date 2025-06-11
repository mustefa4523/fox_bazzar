import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, CreditCard, Wallet, Truck, Gift, Check } from 'lucide-react-native';
import { router } from 'expo-router';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  phone: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'wallet' | 'card' | 'cod';
  name: string;
  icon: any;
  balance?: number;
}

const addresses: Address[] = [
  {
    id: '1',
    name: 'المنزل',
    street: 'شارع الثورة، بناء رقم 15',
    city: 'دمشق',
    phone: '+963 999 123 456',
    isDefault: true,
  },
  {
    id: '2',
    name: 'العمل',
    street: 'شارع بغداد، مكتب رقم 8',
    city: 'دمشق',
    phone: '+963 999 123 456',
    isDefault: false,
  },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: 'wallet',
    type: 'wallet',
    name: 'المحفظة الرقمية',
    icon: Wallet,
    balance: 245.50,
  },
  {
    id: 'card',
    type: 'card',
    name: 'بطاقة ائتمان',
    icon: CreditCard,
  },
  {
    id: 'cod',
    type: 'cod',
    name: 'الدفع عند الاستلام',
    icon: Truck,
  },
];

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  const subtotal = 1548;
  const tax = subtotal * 0.1;
  const shipping = 15;
  const couponDiscount = appliedCoupon ? 50 : 0;
  const total = subtotal + tax + shipping - couponDiscount;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'fox2024') {
      setAppliedCoupon(couponCode);
      setCouponCode('');
      Alert.alert('تم تطبيق الكوبون', 'حصلت على خصم $50!');
    } else {
      Alert.alert('كوبون غير صحيح', 'يرجى التحقق من رمز الكوبون');
    }
  };

  const handlePlaceOrder = () => {
    if (selectedPayment.type === 'wallet' && selectedPayment.balance! < total) {
      Alert.alert('رصيد غير كافي', 'يرجى شحن محفظتك أو اختيار وسيلة دفع أخرى');
      return;
    }

    Alert.alert(
      'تأكيد الطلب',
      `هل تريد تأكيد طلبك بقيمة $${total.toFixed(2)}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تأكيد',
          onPress: () => {
            const orderId = Math.random().toString(36).substr(2, 9);
            Alert.alert('تم تأكيد الطلب', `رقم طلبك: ${orderId.toUpperCase()}`);
            router.push(`/order-tracking/${orderId}`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>إتمام الطلب</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>عنوان التوصيل</Text>
          <TouchableOpacity
            style={styles.addressCard}
            onPress={() => setShowAddressModal(true)}
          >
            <View style={styles.addressIcon}>
              <MapPin size={20} color="#8B5CF6" />
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressName}>{selectedAddress.name}</Text>
              <Text style={styles.addressDetails}>
                {selectedAddress.street}, {selectedAddress.city}
              </Text>
              <Text style={styles.addressPhone}>{selectedAddress.phone}</Text>
            </View>
            <Text style={styles.changeText}>تغيير</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>وسيلة الدفع</Text>
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            const isSelected = selectedPayment.id === method.id;
            
            return (
              <TouchableOpacity
                key={method.id}
                style={[styles.paymentCard, isSelected && styles.selectedPaymentCard]}
                onPress={() => setSelectedPayment(method)}
              >
                <View style={styles.paymentLeft}>
                  <View style={styles.paymentIcon}>
                    <IconComponent size={20} color={isSelected ? '#8B5CF6' : '#9CA3AF'} />
                  </View>
                  <View>
                    <Text style={[styles.paymentName, isSelected && styles.selectedPaymentName]}>
                      {method.name}
                    </Text>
                    {method.balance && (
                      <Text style={styles.paymentBalance}>
                        الرصيد: ${method.balance.toFixed(2)}
                      </Text>
                    )}
                  </View>
                </View>
                {isSelected && (
                  <View style={styles.checkIcon}>
                    <Check size={16} color="#8B5CF6" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Coupon Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>كوبون الخصم</Text>
          <View style={styles.couponContainer}>
            <TextInput
              style={styles.couponInput}
              value={couponCode}
              onChangeText={setCouponCode}
              placeholder="أدخل رمز الكوبون"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.couponButton} onPress={handleApplyCoupon}>
              <Text style={styles.couponButtonText}>تطبيق</Text>
            </TouchableOpacity>
          </View>
          {appliedCoupon && (
            <View style={styles.appliedCoupon}>
              <Gift size={16} color="#10B981" />
              <Text style={styles.appliedCouponText}>
                تم تطبيق كوبون {appliedCoupon} - خصم $50
              </Text>
            </View>
          )}
        </View>

        {/* Order Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ملاحظات الطلب (اختياري)</Text>
          <TextInput
            style={styles.notesInput}
            value={orderNotes}
            onChangeText={setOrderNotes}
            placeholder="أضف أي ملاحظات خاصة بطلبك..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ملخص الطلب</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>المجموع الفرعي</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>الضريبة</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>التوصيل</Text>
              <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
            </View>
            
            {couponDiscount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: '#10B981' }]}>خصم الكوبون</Text>
                <Text style={[styles.summaryValue, { color: '#10B981' }]}>
                  -${couponDiscount.toFixed(2)}
                </Text>
              </View>
            )}
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>الإجمالي</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>تأكيد الطلب - ${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>

      {/* Address Selection Modal */}
      <Modal
        visible={showAddressModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>اختر عنوان التوصيل</Text>
            
            {addresses.map((address) => (
              <TouchableOpacity
                key={address.id}
                style={[
                  styles.addressOption,
                  selectedAddress.id === address.id && styles.selectedAddressOption,
                ]}
                onPress={() => {
                  setSelectedAddress(address);
                  setShowAddressModal(false);
                }}
              >
                <View style={styles.addressOptionInfo}>
                  <Text style={styles.addressOptionName}>{address.name}</Text>
                  <Text style={styles.addressOptionDetails}>
                    {address.street}, {address.city}
                  </Text>
                  <Text style={styles.addressOptionPhone}>{address.phone}</Text>
                </View>
                {selectedAddress.id === address.id && (
                  <Check size={20} color="#8B5CF6" />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowAddressModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  addressDetails: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  addressPhone: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  changeText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPaymentCard: {
    borderColor: '#8B5CF6',
    backgroundColor: '#4C1D95',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentName: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  selectedPaymentName: {
    color: '#FFFFFF',
  },
  paymentBalance: {
    color: '#8B5CF6',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginRight: 12,
  },
  couponButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  couponButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  appliedCoupon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#065F46',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  appliedCouponText: {
    color: '#10B981',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  notesInput: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  summaryCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  totalValue: {
    color: '#8B5CF6',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  bottomContainer: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  placeOrderButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  addressOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAddressOption: {
    borderColor: '#8B5CF6',
    backgroundColor: '#4C1D95',
  },
  addressOptionInfo: {
    flex: 1,
  },
  addressOptionName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  addressOptionDetails: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  addressOptionPhone: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  modalCloseButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});