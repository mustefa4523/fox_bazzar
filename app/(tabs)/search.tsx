import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchAndFilter from '@/components/SearchAndFilter';
import ProductCard from '@/components/ProductCard';

const categories = [
  'الكل',
  'موبايلات',
  'ملابس',
  'أدوات',
  'منزل',
  'سيارات',
  'كتب',
];

const allProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 1299,
    originalPrice: 1499,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'موبايلات',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    price: 999,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'موبايلات',
  },
  {
    id: '3',
    name: 'MacBook Pro M3',
    price: 2399,
    originalPrice: 2599,
    rating: 4.9,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    category: 'أدوات',
  },
  {
    id: '4',
    name: 'AirPods Pro',
    price: 249,
    rating: 4.6,
    image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'أدوات',
  },
];

export default function SearchPage() {
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleFilter = (filters: any) => {
    let filtered = allProducts;

    // Apply search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category !== 'الكل') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Apply price filter
    filtered = filtered.filter(
      product =>
        product.price >= filters.minPrice &&
        product.price <= filters.maxPrice
    );

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const renderProduct = ({ item }: { item: typeof allProducts[0] }) => (
    <View style={styles.productContainer}>
      <ProductCard
        {...item}
        onAddToCart={() => console.log('Add to cart:', item.id)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SearchAndFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        categories={categories}
      />

      <View style={styles.resultsContainer}>
        {searchQuery.trim() !== '' && (
          <Text style={styles.resultsCount}>
            {filteredProducts.length} نتيجة للبحث عن "{searchQuery}"
          </Text>
        )}

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>لا توجد نتائج</Text>
              <Text style={styles.emptySubtext}>جرب البحث بكلمات أخرى</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsCount: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  productsList: {
    paddingBottom: 20,
  },
  productContainer: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 12,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});