import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Mic, Smartphone, Shirt, Wrench, Chrome as HomeIcon, Car, Book, Clock } from 'lucide-react-native';
import FoxLogo from '@/components/FoxLogo';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';

const { width } = Dimensions.get('window');

const banners = [
  'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const categories = [
  { title: 'موبايلات', icon: Smartphone },
  { title: 'ملابس', icon: Shirt },
  { title: 'أدوات', icon: Wrench },
  { title: 'منزل', icon: HomeIcon },
  { title: 'سيارات', icon: Car },
  { title: 'كتب', icon: Book },
];

const featuredProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 1299,
    originalPrice: 1499,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    price: 999,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    name: 'MacBook Pro M3',
    price: 2399,
    originalPrice: 2599,
    rating: 4.9,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '4',
    name: 'AirPods Pro',
    price: 249,
    rating: 4.6,
    image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const renderBanner = ({ item, index }: { item: string; index: number }) => (
    <Image source={{ uri: item }} style={styles.bannerImage} />
  );

  const renderProduct = ({ item }: { item: typeof featuredProducts[0] }) => (
    <View style={styles.productContainer}>
      <ProductCard {...item} onAddToCart={() => console.log('Add to cart:', item.id)} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <FoxLogo size={40} />
            <Text style={styles.appName}>FOX BAZAR</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث عن المنتجات..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity>
              <Mic size={20} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner Slider */}
        <View style={styles.bannerContainer}>
          <FlatList
            data={banners}
            renderItem={renderBanner}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentBanner(index);
            }}
          />
          <View style={styles.bannerIndicators}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  { backgroundColor: index === currentBanner ? '#8B5CF6' : '#6B7280' },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>التصنيفات</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.title}
                icon={category.icon}
                onPress={() => console.log('Category pressed:', category.title)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Limited Offers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>عروض محدودة</Text>
            <View style={styles.timerContainer}>
              <Clock size={16} color="#EF4444" />
              <Text style={styles.timerText}>23:45:12</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.offersContainer}>
              {featuredProducts.slice(0, 2).map((product) => (
                <View key={product.id} style={styles.offerCard}>
                  <ProductCard {...product} onAddToCart={() => console.log('Add to cart:', product.id)} />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>منتجات مميزة</Text>
          <FlatList
            data={featuredProducts}
            renderItem={renderProduct}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.productRow}
          />
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
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginLeft: 12,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginHorizontal: 12,
    textAlign: 'right',
  },
  bannerContainer: {
    height: 180,
    marginBottom: 24,
    position: 'relative',
  },
  bannerImage: {
    width: width,
    height: 180,
    resizeMode: 'cover',
  },
  bannerIndicators: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timerText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginLeft: 6,
  },
  categoriesContainer: {
    paddingLeft: 20,
  },
  offersContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
  },
  offerCard: {
    width: 180,
    marginRight: 16,
  },
  productContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  productRow: {
    paddingHorizontal: 12,
  },
});