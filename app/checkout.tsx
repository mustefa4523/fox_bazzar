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
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Wallet,
  Plus,
  Edit,
  Check,
  Truck,
  Clock,
} from 'lucide-react-native';
import { router } from 'expo-router';

interface Address {
  id: string;
  name: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'wallet' | 'card' | 'cod';
  name: string;
  details?: string;
}

const addresses: Address[] = [
  {
    id: '1',
    name: 'المنزل',
    address: 'شارع الثورة، بناء رقم 15، الطابق الثالث، دمشق',
    phone: '+963 999 123 456',
    isDefault: true,
  },
  {
    id: '2',
    name: 'العمل',
    address: 'شارع بغداد، مكتب رقم 8، الطابق الثاني، دمشق',
    phone: '+963 999 654 321',
    isDefault: false,
  },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'wallet',
    name: 'المحفظة الرقمية',
    details: 'الرصيد: $245.50',
  },
  {
    id: '2',
    type: 'card',
    name: 'بطاقة ائتمان',
    details: '**** **** **** 1234',
  },
  {
    id: '3',
    type: 'cod',
    name: 'الدفع عند الاستلام',
    details: 'نقداً أو بطاقة',
  },
];

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Order summary data
  const subtotal = 1548.00;
  const discount = appliedCoupon ? 154.80 : 0;
  const tax = (subtotal - discount) * 0.1;
  const shipping = 15.00;
  const total = subtotal - discount + tax + shipping;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'save10') {
      setAppliedCoupon(couponCode);
      setCouponCode('');
      Alert.alert('تم تطبيق الكوبون', 'حصلت على خصم 10%!');
    } else {
      Alert.alert('كوبون غير صحيح', 'يرجى التحقق من رمز الكوبون');
    }
  };

  const handlePlaceOrder = () => {
    Alert.alert(
      'تأكيد الطلب',
      `إجمالي المبلغ: $${total.toFixed(2)}\nهل تريد تأكيد الطلب؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تأكيد',
          onPress: () => {
            const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
            Alert.alert('تم تأكيد الطلب', `رقم الطلب: ${orderId}`);
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
            <View style={styles.addressInfo}>
              <MapPin size={20} color="#8B5CF6" />
              <View style={styles.addressDetails}>
                <Text style={styles.addressName}>{selectedAddress.name}</Text>
                <Text style={styles.addressText}>{selectedAddress.address}</Text>
                <Text style={styles.addressPhone}>{selectedAddress.phone}</Text>
              </View>
            </View>
            <Edit size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Delivery Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>خيارات التوصيل</Text>
          <View style={styles.deliveryOptions}>
            <TouchableOpacity style={[styles.deliveryOption, styles.selectedDeliveryOption]}>
              <Truck size={20} color="#8B5CF6" />
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryTitle}>توصيل سريع</Text>
                <Text style={styles.deliveryTime}>خلال 2-4 ساعات</Text>
              </View>
              <Text style={styles.deliveryPrice}>$15.00</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.deliveryOption}>
              <Clock size={20} color="#9CA3AF" />
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryTitle}>توصيل عادي</Text>
                <Text style={styles.deliveryTime}>خلال 1-2 يوم</Text>
              </View>
              <Text style={styles.deliveryPrice}>$5.00</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>طريقة الدفع</Text>
          <TouchableOpacity
            style={styles.paymentCard}
            onPress={() => setShowPaymentModal(true)}
          >
            <View style={styles.paymentInfo}>
              {selectedPayment.type === 'wallet' && <Wallet size={20} color="#8B5CF6" />}
              {selectedPayment.type === 'card' && <CreditCard size={20} color="#8B5CF6" />}
              {selectedPayment.type === 'cod' && <Truck size={20} color="#8B5CF6" />}
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentName}>{selectedPayment.name}</Text>
                <Text style={styles.paymentDetailsText}>{selectedPayment.details}</Text>
              </View>
            </View>
            <Edit size={20} color="#9CA3AF" />
          </TouchableOpacity>
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
              <Check size={16} color="#10B981" />
              <Text style={styles.appliedCouponText}>تم تطبيق كوبون: {appliedCoupon}</Text>
            </View>
          )}
        </View>

        {/* Delivery Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ملاحظات التوصيل</Text>
          <TextInput
            style={styles.notesInput}
            value={deliveryNotes}
            onChangeText={setDeliveryNotes}
            placeholder="أضف ملاحظات للموصل (اختياري)"
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
            
            {appliedCoupon && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>الخصم</Text>
                <Text style={[styles.summaryValue, { color: '#10B981' }]}>-${discount.toFixed(2)}</Text>
              </View>
            )}
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>الضريبة</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>التوصيل</Text>
              <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
            </View>
            
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
                  <Text style={styles.addressOptionText}>{address.address}</Text>
                </View>
                {selectedAddress.id === address.id && (
                  <Check size={20} color="#8B5CF6" />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity style={styles.addAddressButton}>
              <Plus size={20} color="#8B5CF6" />
              <Text style={styles.addAddressText}>إضافة عنوان جديد</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowAddressModal(false)}
            >
              <Text style={styles.modalCloseText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Method Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>اختر طريقة الدفع</Text>
            
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  selectedPayment.id === method.id && styles.selectedPaymentOption,
                ]}
                onPress={() => {
                  setSelectedPayment(method);
                  setShowPaymentModal(false);
                }}
              >
                <View style={styles.paymentOptionInfo}>
                  <Text style={styles.paymentOptionName}>{method.name}</Text>
                  <Text style={styles.paymentOptionDetails}>{method.details}</Text>
                </View>
                {selectedPayment.id === method.id && (
                  <Check size={20} color="#8B5CF6" />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPaymentModal(false)}
            >
              <Text style={styles.modalCloseText}>إغلاق</Text>
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
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  addressDetails: {
    marginLeft: 12,
    flex: 1,
  },
  addressName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  addressText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  addressPhone: {
    color: '#8B5CF6',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  deliveryOptions: {
    gap: 12,
  },
  deliveryOption: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDeliveryOption: {
    borderColor: '#8B5CF6',
  },
  deliveryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  deliveryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  deliveryTime: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  deliveryPrice: {
    color: '#8B5CF6',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  paymentCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  paymentDetailsText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  couponContainer: {
    flexDirection: 'row',
    gap: 12,
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
  },
  couponButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  appliedCoupon: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAddressOption: {
    borderColor: '#8B5CF6',
  },
  addressOptionInfo: {
    flex: 1,
  },
  addressOptionName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  addressOptionText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 8,
  },
  addAddressText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  paymentOption: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPaymentOption: {
    borderColor: '#8B5CF6',
  },
  paymentOptionInfo: {
    flex: 1,
  },
  paymentOptionName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  paymentOptionDetails: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  modalCloseButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  modalCloseText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});