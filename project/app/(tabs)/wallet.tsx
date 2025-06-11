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
  Wallet,
  Plus,
  ArrowUpDown,
  Download,
  CreditCard,
  Smartphone,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
} from 'lucide-react-native';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: 'USD' | 'SYP';
  description: string;
  date: string;
}

const transactions: Transaction[] = [
  {
    id: '1',
    type: 'credit',
    amount: 50,
    currency: 'USD',
    description: 'شحن رصيد - PayPal',
    date: '2024-01-15',
  },
  {
    id: '2',
    type: 'debit',
    amount: 25,
    currency: 'USD',
    description: 'شراء - iPhone 15 Pro',
    date: '2024-01-14',
  },
  {
    id: '3',
    type: 'credit',
    amount: 100000,
    currency: 'SYP',
    description: 'تحويل عملة - USD إلى SYP',
    date: '2024-01-13',
  },
  {
    id: '4',
    type: 'credit',
    amount: 15,
    currency: 'USD',
    description: 'مكافأة مهمة يومية',
    date: '2024-01-12',
  },
];

export default function WalletPage() {
  const [usdBalance] = useState(245.50);
  const [sypBalance] = useState(1250000);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const exchangeRate = 15000; // 1 USD = 15000 SYP

  const handleRecharge = () => {
    if (!rechargeAmount || !selectedPaymentMethod) {
      Alert.alert('خطأ', 'يرجى إدخال المبلغ واختيار وسيلة الدفع');
      return;
    }

    Alert.alert(
      'تأكيد الشحن',
      `هل تريد شحن ${rechargeAmount}$ باستخدام ${getPaymentMethodName(selectedPaymentMethod)}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تأكيد',
          onPress: () => {
            setShowRechargeModal(false);
            setRechargeAmount('');
            setSelectedPaymentMethod(null);
            Alert.alert('نجح الشحن', 'تم شحن رصيدك بنجاح!');
          },
        },
      ]
    );
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'paypal':
        return 'PayPal';
      case 'rcell':
        return 'Rcell';
      case 'syriatel':
        return 'سيرياتيل';
      case 'card':
        return 'بطاقة مسبقة الدفع';
      default:
        return '';
    }
  };

  const renderTransaction = (transaction: Transaction) => {
    const isCredit = transaction.type === 'credit';
    const IconComponent = isCredit ? TrendingUp : TrendingDown;
    const amountColor = isCredit ? '#10B981' : '#EF4444';
    const sign = isCredit ? '+' : '-';

    return (
      <View key={transaction.id} style={styles.transactionItem}>
        <View style={styles.transactionIcon}>
          <IconComponent size={20} color={amountColor} />
        </View>
        
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
          <View style={styles.transactionMeta}>
            <Calendar size={12} color="#9CA3AF" />
            <Text style={styles.transactionDate}>{transaction.date}</Text>
          </View>
        </View>
        
        <Text style={[styles.transactionAmount, { color: amountColor }]}>
          {sign}{transaction.amount.toLocaleString()} {transaction.currency}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المحفظة</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Cards */}
        <View style={styles.balanceContainer}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <DollarSign size={24} color="#10B981" />
              <Text style={styles.balanceLabel}>الرصيد بالدولار</Text>
            </View>
            <Text style={styles.balanceAmount}>${usdBalance.toFixed(2)}</Text>
          </View>
          
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Wallet size={24} color="#F59E0B" />
              <Text style={styles.balanceLabel}>الرصيد بالليرة</Text>
            </View>
            <Text style={styles.balanceAmount}>{sypBalance.toLocaleString()} ل.س</Text>
          </View>
        </View>

        {/* Exchange Rate */}
        <View style={styles.exchangeCard}>
          <Text style={styles.exchangeTitle}>سعر الصرف الحالي</Text>
          <Text style={styles.exchangeRate}>1 USD = {exchangeRate.toLocaleString()} SYP</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rechargeButton]}
            onPress={() => setShowRechargeModal(true)}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>شحن رصيد</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.exchangeButton]}>
            <ArrowUpDown size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>تحويل عملة</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.withdrawButton]}>
            <Download size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>سحب أرباح</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>سجل الحركات المالية</Text>
          {transactions.map(renderTransaction)}
        </View>
      </ScrollView>

      {/* Recharge Modal */}
      <Modal
        visible={showRechargeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRechargeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>شحن الرصيد</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>المبلغ (بالدولار)</Text>
              <TextInput
                style={styles.input}
                value={rechargeAmount}
                onChangeText={setRechargeAmount}
                placeholder="أدخل المبلغ"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
            
            <Text style={styles.paymentMethodsTitle}>اختر وسيلة الدفع</Text>
            
            <View style={styles.paymentMethods}>
              {[
                { id: 'paypal', name: 'PayPal', icon: CreditCard },
                { id: 'rcell', name: 'Rcell', icon: Smartphone },
                { id: 'syriatel', name: 'سيرياتيل', icon: Smartphone },
                { id: 'card', name: 'بطاقة مسبقة الدفع', icon: CreditCard },
              ].map(method => {
                const IconComponent = method.icon;
                const isSelected = selectedPaymentMethod === method.id;
                
                return (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.paymentMethod,
                      isSelected && styles.paymentMethodSelected,
                    ]}
                    onPress={() => setSelectedPaymentMethod(method.id)}
                  >
                    <IconComponent
                      size={20}
                      color={isSelected ? '#8B5CF6' : '#9CA3AF'}
                    />
                    <Text
                      style={[
                        styles.paymentMethodText,
                        isSelected && styles.paymentMethodTextSelected,
                      ]}
                    >
                      {method.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowRechargeModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>إلغاء</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleRecharge}
              >
                <Text style={styles.modalConfirmButtonText}>شحن</Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  balanceContainer: {
    marginVertical: 20,
  },
  balanceCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  exchangeCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  exchangeTitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  exchangeRate: {
    color: '#8B5CF6',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  rechargeButton: {
    backgroundColor: '#10B981',
  },
  exchangeButton: {
    backgroundColor: '#8B5CF6',
  },
  withdrawButton: {
    backgroundColor: '#F59E0B',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
  },
  transactionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionDate: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  transactionAmount: {
    fontSize: 14,
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
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  paymentMethodsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 12,
  },
  paymentMethods: {
    marginBottom: 24,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentMethodSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#4C1D95',
  },
  paymentMethodText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
  },
  paymentMethodTextSelected: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  modalCancelButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  modalConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});