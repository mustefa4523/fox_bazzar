import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Heart,
  ShoppingCart,
  Star,
  Trash2,
  Share2,
} from 'lucide-react-native';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  inStock: boolean;
}

interface WishlistSystemProps {
  items: WishlistItem[];
  onRemoveItem: (id: string) => void;
  onAddToCart: (id: string) => void;
  onShare: (item: WishlistItem) => void;
}

export default function WishlistSystem({
  items,
  onRemoveItem,
  onAddToCart,
  onShare,
}: WishlistSystemProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
  };

  const handleRemoveSelected = () => {
    Alert.alert(
      'حذف المنتجات',
      `هل تريد حذف ${selectedItems.length} منتج من المفضلة؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            selectedItems.forEach(id => onRemoveItem(id));
            setSelectedItems([]);
          },
        },
      ]
    );
  };

  const handleAddSelectedToCart = () => {
    const availableItems = selectedItems.filter(id => {
      const item = items.find(i => i.id === id);
      return item?.inStock;
    });

    if (availableItems.length === 0) {
      Alert.alert('تنبيه', 'لا توجد منتجات متاحة في المنتجات المحددة');
      return;
    }

    availableItems.forEach(id => onAddToCart(id));
    Alert.alert('تمت الإضافة', `تم إضافة ${availableItems.length} منتج إلى السلة`);
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

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Heart size={80} color="#6B7280" />
        <Text style={styles.emptyTitle}>قائمة المفضلة فارغة</Text>
        <Text style={styles.emptySubtitle}>
          أضف المنتجات التي تعجبك لتجدها هنا لاحقاً
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Actions */}
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.selectAllButton}
          onPress={handleSelectAll}
        >
          <Text style={styles.selectAllText}>
            {selectedItems.length === items.length ? 'إلغاء التحديد' : 'تحديد الكل'}
          </Text>
        </TouchableOpacity>

        {selectedItems.length > 0 && (
          <View style={styles.selectedActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAddSelectedToCart}
            >
              <ShoppingCart size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>إضافة للسلة</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleRemoveSelected}
            >
              <Trash2 size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>حذف</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Wishlist Items */}
      <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => handleSelectItem(item.id)}
            >
              <View style={[
                styles.checkbox,
                selectedItems.includes(item.id) && styles.checkedBox,
              ]}>
                {selectedItems.includes(item.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>

            <Image source={{ uri: item.image }} style={styles.itemImage} />

            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>

              <View style={styles.ratingContainer}>
                <View style={styles.stars}>
                  {renderStars(Math.floor(item.rating))}
                </View>
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.price}>${item.price}</Text>
                {item.originalPrice && (
                  <Text style={styles.originalPrice}>${item.originalPrice}</Text>
                )}
              </View>

              <Text style={[
                styles.stockStatus,
                { color: item.inStock ? '#10B981' : '#EF4444' }
              ]}>
                {item.inStock ? 'متوفر' : 'غير متوفر'}
              </Text>
            </View>

            <View style={styles.itemActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onShare(item)}
              >
                <Share2 size={20} color="#8B5CF6" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.iconButton,
                  !item.inStock && styles.disabledButton,
                ]}
                onPress={() => onAddToCart(item.id)}
                disabled={!item.inStock}
              >
                <ShoppingCart
                  size={20}
                  color={item.inStock ? '#10B981' : '#6B7280'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onRemoveItem(item.id)}
              >
                <Heart size={20} color="#EF4444" fill="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {items.length} منتج في المفضلة
        </Text>
        {selectedItems.length > 0 && (
          <Text style={styles.selectedText}>
            {selectedItems.length} محدد
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  selectAllButton: {
    paddingVertical: 8,
  },
  selectAllText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  selectedActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
  },
  itemsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    alignItems: 'center',
  },
  selectButton: {
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 4,
  },
  ratingText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    color: '#8B5CF6',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginRight: 8,
  },
  originalPrice: {
    color: '#6B7280',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textDecorationLine: 'line-through',
  },
  stockStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  itemActions: {
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    backgroundColor: '#1F2937',
  },
  summaryText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  selectedText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});