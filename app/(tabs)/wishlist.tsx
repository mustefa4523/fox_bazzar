import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WishlistSystem from '@/components/WishlistSystem';

const initialWishlistItems = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 1299,
    originalPrice: 1499,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    price: 999,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
  },
  {
    id: '3',
    name: 'MacBook Pro M3',
    price: 2399,
    originalPrice: 2599,
    rating: 4.9,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    inStock: false,
  },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);

  const handleRemoveItem = (id: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
    Alert.alert('تم الحذف', 'تم حذف المنتج من المفضلة');
  };

  const handleAddToCart = (id: string) => {
    const item = wishlistItems.find(item => item.id === id);
    if (item) {
      Alert.alert('تمت الإضافة', `تم إضافة ${item.name} إلى السلة`);
    }
  };

  const handleShare = async (item: any) => {
    try {
      await Share.share({
        message: `تحقق من هذا المنتج الرائع: ${item.name} بسعر $${item.price}`,
        title: item.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المفضلة</Text>
      </View>

      <WishlistSystem
        items={wishlistItems}
        onRemoveItem={handleRemoveItem}
        onAddToCart={handleAddToCart}
        onShare={handleShare}
      />
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
});