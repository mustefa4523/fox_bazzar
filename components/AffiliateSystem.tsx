import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Share,
  Clipboard,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Users,
  DollarSign,
  Share2,
  Copy,
  TrendingUp,
  Gift,
  Link,
  Target,
} from 'lucide-react-native';

interface AffiliateData {
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  conversionRate: number;
  thisMonthReferrals: number;
  thisMonthEarnings: number;
}

interface AffiliateSystemProps {
  data: AffiliateData;
  onWithdraw: (amount: number) => void;
}

export default function AffiliateSystem({ data, onWithdraw }: AffiliateSystemProps) {
  const [customMessage, setCustomMessage] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const referralLink = `https://foxbazar.app/ref/${data.referralCode}`;

  const handleCopyLink = async () => {
    try {
      await Clipboard.setString(referralLink);
      Alert.alert('تم النسخ', 'تم نسخ رابط الإحالة إلى الحافظة');
    } catch (error) {
      Alert.alert('خطأ', 'فشل في نسخ الرابط');
    }
  };

  const handleShareLink = async () => {
    try {
      const message = customMessage || 
        `انضم إلى FOX BAZAR واحصل على خصم خاص! استخدم رابط الإحالة الخاص بي: ${referralLink}`;
      
      await Share.share({
        message,
        url: referralLink,
        title: 'انضم إلى FOX BAZAR',
      });
    } catch (error) {
      Alert.alert('خطأ', 'فشل في مشاركة الرابط');
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || amount <= 0) {
      Alert.alert('خطأ', 'ي��جى إدخال مبلغ صحيح');
      return;
    }
    
    if (amount > data.pendingEarnings) {
      Alert.alert('خطأ', 'المبلغ أكبر من الأرباح المتاحة');
      return;
    }
    
    Alert.alert(
      'تأكيد السحب',
      `هل تريد سحب $${amount.toFixed(2)} من أرباحك؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'سحب',
          onPress: () => {
            onWithdraw(amount);
            setWithdrawAmount('');
            Alert.alert('تم السحب', 'تم تحويل المبلغ إلى محفظتك بنجاح');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Users size={24} color="#3B82F6" />
          <Text style={styles.statValue}>{data.totalReferrals}</Text>
          <Text style={styles.statLabel}>إجمالي الإحالات</Text>
        </View>
        
        <View style={styles.statCard}>
          <DollarSign size={24} color="#10B981" />
          <Text style={styles.statValue}>${data.totalEarnings.toFixed(2)}</Text>
          <Text style={styles.statLabel}>إجمالي الأرباح</Text>
        </View>
        
        <View style={styles.statCard}>
          <Gift size={24} color="#F59E0B" />
          <Text style={styles.statValue}>${data.pendingEarnings.toFixed(2)}</Text>
          <Text style={styles.statLabel}>أرباح معلقة</Text>
        </View>
        
        <View style={styles.statCard}>
          <TrendingUp size={24} color="#8B5CF6" />
          <Text style={styles.statValue}>{data.conversionRate}%</Text>
          <Text style={styles.statLabel}>معدل التحويل</Text>
        </View>
      </View>

      {/* This Month Performance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>أداء هذا الشهر</Text>
        <View style={styles.monthlyStats}>
          <View style={styles.monthlyStatItem}>
            <Text style={styles.monthlyStatValue}>{data.thisMonthReferrals}</Text>
            <Text style={styles.monthlyStatLabel}>إحالات جديدة</Text>
          </View>
          <View style={styles.monthlyStatItem}>
            <Text style={styles.monthlyStatValue}>${data.thisMonthEarnings.toFixed(2)}</Text>
            <Text style={styles.monthlyStatLabel}>أرباح الشهر</Text>
          </View>
        </View>
      </View>

      {/* Referral Link */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>رابط الإحالة الخاص بك</Text>
        <View style={styles.linkContainer}>
          <View style={styles.linkDisplay}>
            <Link size={20} color="#8B5CF6" />
            <Text style={styles.linkText} numberOfLines={1}>
              {referralLink}
            </Text>
          </View>
          
          <View style={styles.linkActions}>
            <TouchableOpacity style={styles.linkButton} onPress={handleCopyLink}>
              <Copy size={16} color="#FFFFFF" />
              <Text style={styles.linkButtonText}>نسخ</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.linkButton} onPress={handleShareLink}>
              <Share2 size={16} color="#FFFFFF" />
              <Text style={styles.linkButtonText}>مشاركة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Custom Message */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>رسالة مخصصة للمشاركة</Text>
        <TextInput
          style={styles.messageInput}
          value={customMessage}
          onChangeText={setCustomMessage}
          placeholder="اكتب رسالة مخصصة لمشاركتها مع الرابط..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Withdraw Earnings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>سحب الأرباح</Text>
        <View style={styles.withdrawContainer}>
          <Text style={styles.availableEarnings}>
            الأرباح المتاحة: ${data.pendingEarnings.toFixed(2)}
          </Text>
          
          <View style={styles.withdrawForm}>
            <TextInput
              style={styles.withdrawInput}
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              placeholder="المبلغ المراد سحبه"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
            
            <TouchableOpacity
              style={[
                styles.withdrawButton,
                (!withdrawAmount || parseFloat(withdrawAmount) <= 0) && styles.withdrawButtonDisabled,
              ]}
              onPress={handleWithdraw}
              disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
            >
              <DollarSign size={16} color="#FFFFFF" />
              <Text style={styles.withdrawButtonText}>سحب</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* How It Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>كيف يعمل نظام الإحالة؟</Text>
        <View style={styles.howItWorks}>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>شارك رابط الإحالة الخاص بك مع الأصدقاء</Text>
          </View>
          
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>عندما ينضم صديق ويسجل حساب جديد، تحصل على $5</Text>
          </View>
          
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>عندما يقوم بأول عملية شراء، تحصل على 10% عمولة</Text>
          </View>
          
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={styles.stepText}>اسحب أرباحك إلى محفظتك في أي وقت</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  statCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginTop: 8,
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  monthlyStats: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  monthlyStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  monthlyStatValue: {
    color: '#8B5CF6',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  monthlyStatLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  linkContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  linkDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
    flex: 1,
  },
  linkActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  linkButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginLeft: 6,
  },
  messageInput: {
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
  withdrawContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  availableEarnings: {
    color: '#10B981',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  withdrawForm: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  withdrawInput: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginRight: 12,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  withdrawButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  withdrawButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginLeft: 6,
  },
  howItWorks: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  stepText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
    lineHeight: 20,
  },
});