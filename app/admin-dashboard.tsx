import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Settings,
  Shield,
  Bell,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
} from 'lucide-react-native';
import { router } from 'expo-router';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'merchant' | 'delivery';
  status: 'active' | 'suspended';
  joinDate: string;
  avatar: string;
}

interface Product {
  id: string;
  name: string;
  merchant: string;
  price: number;
  status: 'approved' | 'pending' | 'rejected';
  image: string;
}

const users: User[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    type: 'customer',
    status: 'active',
    joinDate: '2024-01-15',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '2',
    name: 'متجر التقنية',
    email: 'tech@example.com',
    type: 'merchant',
    status: 'active',
    joinDate: '2024-01-10',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    merchant: 'متجر التقنية',
    price: 1299,
    status: 'approved',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    merchant: 'متجر الهواتف',
    price: 999,
    status: 'pending',
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'orders' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const totalUsers = 1247;
  const totalMerchants = 89;
  const totalOrders = 3456;
  const totalRevenue = 125420;
  const pendingProducts = 23;
  const activeDeliveries = 45;

  const handleUserAction = (userId: string, action: 'view' | 'edit' | 'suspend' | 'delete') => {
    const user = users.find(u => u.id === userId);
    
    switch (action) {
      case 'view':
        setSelectedUser(user || null);
        setShowUserModal(true);
        break;
      case 'edit':
        Alert.alert('تعديل المستخدم', `تعديل بيانات ${user?.name}`);
        break;
      case 'suspend':
        Alert.alert(
          'تعليق الحساب',
          `هل تريد تعليق حساب ${user?.name}؟`,
          [
            { text: 'إلغاء', style: 'cancel' },
            { text: 'تعليق', style: 'destructive', onPress: () => console.log('User suspended') },
          ]
        );
        break;
      case 'delete':
        Alert.alert(
          'حذف الحساب',
          `هل تريد حذف حساب ${user?.name} نهائياً؟`,
          [
            { text: 'إلغاء', style: 'cancel' },
            { text: 'حذف', style: 'destructive', onPress: () => console.log('User deleted') },
          ]
        );
        break;
    }
  };

  const handleProductAction = (productId: string, action: 'approve' | 'reject' | 'delete') => {
    const product = products.find(p => p.id === productId);
    
    switch (action) {
      case 'approve':
        Alert.alert('تم الموافقة', `تم الموافقة على منتج ${product?.name}`);
        break;
      case 'reject':
        Alert.alert('تم الرفض', `تم رفض منتج ${product?.name}`);
        break;
      case 'delete':
        Alert.alert(
          'حذف المنتج',
          `هل تريد حذف ${product?.name}؟`,
          [
            { text: 'إلغاء', style: 'cancel' },
            { text: 'حذف', style: 'destructive', onPress: () => console.log('Product deleted') },
          ]
        );
        break;
    }
  };

  const getUserTypeText = (type: string) => {
    switch (type) {
      case 'customer':
        return 'عميل';
      case 'merchant':
        return 'تاجر';
      case 'delivery':
        return 'موصل';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return '#10B981';
      case 'suspended':
      case 'rejected':
        return '#EF4444';
      case 'pending':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const renderOverview = () => (
    <View>
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Users size={24} color="#3B82F6" />
          <Text style={styles.statValue}>{totalUsers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>إجمالي المستخدمين</Text>
        </View>
        
        <View style={styles.statCard}>
          <Package size={24} color="#8B5CF6" />
          <Text style={styles.statValue}>{totalMerchants}</Text>
          <Text style={styles.statLabel}>التجار</Text>
        </View>
        
        <View style={styles.statCard}>
          <ShoppingBag size={24} color="#10B981" />
          <Text style={styles.statValue}>{totalOrders.toLocaleString()}</Text>
          <Text style={styles.statLabel}>إجمالي الطلبات</Text>
        </View>
        
        <View style={styles.statCard}>
          <DollarSign size={24} color="#F59E0B" />
          <Text style={styles.statValue}>${totalRevenue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>إجمالي الإيرادات</Text>
        </View>
        
        <View style={styles.statCard}>
          <Bell size={24} color="#EF4444" />
          <Text style={styles.statValue}>{pendingProducts}</Text>
          <Text style={styles.statLabel}>منتجات معلقة</Text>
        </View>
        
        <View style={styles.statCard}>
          <TrendingUp size={24} color="#06B6D4" />
          <Text style={styles.statValue}>{activeDeliveries}</Text>
          <Text style={styles.statLabel}>توصيلات نشطة</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Users size={20} color="#FFFFFF" />
            <Text style={styles.quickActionText}>إدارة المستخدمين</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Package size={20} color="#FFFFFF" />
            <Text style={styles.quickActionText}>مراجعة المنتجات</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Settings size={20} color="#FFFFFF" />
            <Text style={styles.quickActionText}>إعدادات النظام</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>النشاط الأخير</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Users size={16} color="#3B82F6" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>انضم مستخدم جديد: أحمد محمد</Text>
              <Text style={styles.activityTime}>منذ 5 دقائق</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Package size={16} color="#8B5CF6" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>منتج جديد في انتظار الموافقة</Text>
              <Text style={styles.activityTime}>منذ 15 دقيقة</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <ShoppingBag size={16} color="#10B981" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>تم إتمام طلب بقيمة $1,299</Text>
              <Text style={styles.activityTime}>منذ 30 دقيقة</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderUsers = () => (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>إدارة المستخدمين</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color="#8B5CF6" />
          <Text style={styles.filterButtonText}>فلترة</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="البحث عن المستخدمين..."
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {users.map((user) => (
        <View key={user.id} style={styles.userCard}>
          <View style={styles.userInfo}>
            <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.userMeta}>
                <Text style={styles.userType}>{getUserTypeText(user.type)}</Text>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(user.status) }]} />
                <Text style={styles.userJoinDate}>انضم في {user.joinDate}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.userActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleUserAction(user.id, 'view')}
            >
              <Eye size={16} color="#3B82F6" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleUserAction(user.id, 'edit')}
            >
              <Edit size={16} color="#F59E0B" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleUserAction(user.id, 'suspend')}
            >
              <Shield size={16} color="#EF4444" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleUserAction(user.id, 'delete')}
            >
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderProducts = () => (
    <View>
      <Text style={styles.sectionTitle}>إدارة المنتجات</Text>
      
      {products.map((product) => (
        <View key={product.id} style={styles.productCard}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productMerchant}>التاجر: {product.merchant}</Text>
            <Text style={styles.productPrice}>${product.price}</Text>
          </View>
          
          <View style={styles.productStatus}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(product.status) }]}>
              <Text style={styles.statusText}>{product.status}</Text>
            </View>
            
            {product.status === 'pending' && (
              <View style={styles.productActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                  onPress={() => handleProductAction(product.id, 'approve')}
                >
                  <Text style={styles.actionButtonText}>موافقة</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                  onPress={() => handleProductAction(product.id, 'reject')}
                >
                  <Text style={styles.actionButtonText}>رفض</Text>
                </TouchableOpacity>
              </View>
            )}
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
        <Text style={styles.headerTitle}>لوحة الإدارة</Text>
        <TouchableOpacity>
          <Bell size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <BarChart3 size={16} color={activeTab === 'overview' ? '#FFFFFF' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            عام
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Users size={16} color={activeTab === 'users' ? '#FFFFFF' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            المستخدمين
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'products' && styles.activeTab]}
          onPress={() => setActiveTab('products')}
        >
          <Package size={16} color={activeTab === 'products' ? '#FFFFFF' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
            المنتجات
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Settings size={16} color={activeTab === 'settings' ? '#FFFFFF' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            الإعدادات
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'settings' && (
          <View>
            <Text style={styles.sectionTitle}>إعدادات النظام</Text>
            <Text style={styles.comingSoon}>قريباً...</Text>
          </View>
        )}
      </ScrollView>

      {/* User Details Modal */}
      <Modal
        visible={showUserModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUserModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تفاصيل المستخدم</Text>
            
            {selectedUser && (
              <View style={styles.userDetailsModal}>
                <Image source={{ uri: selectedUser.avatar }} style={styles.modalUserAvatar} />
                <Text style={styles.modalUserName}>{selectedUser.name}</Text>
                <Text style={styles.modalUserEmail}>{selectedUser.email}</Text>
                <Text style={styles.modalUserType}>النوع: {getUserTypeText(selectedUser.type)}</Text>
                <Text style={styles.modalUserJoinDate}>تاريخ الانضمام: {selectedUser.joinDate}</Text>
              </View>
            )}
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowUserModal(false)}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
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
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginTop: 8,
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterButtonText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
  },
  activityList: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  activityTime: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  userEmail: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userType: {
    color: '#8B5CF6',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginRight: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  userJoinDate: {
    color: '#6B7280',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  userActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  productMerchant: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  productPrice: {
    color: '#8B5CF6',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  productStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  productActions: {
    flexDirection: 'row',
  },
  comingSoon: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 50,
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
  userDetailsModal: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalUserAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  modalUserName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  modalUserEmail: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  modalUserType: {
    color: '#8B5CF6',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  modalUserJoinDate: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  modalCloseButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});