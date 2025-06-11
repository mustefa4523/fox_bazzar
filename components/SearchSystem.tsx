import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {
  Search,
  Filter,
  X,
  Clock,
  TrendingUp,
  Star,
} from 'lucide-react-native';

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
}

interface SearchFilters {
  category: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest';
}

interface SearchSystemProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onSearch: (query: string, filters: SearchFilters) => void;
}

const categories = [
  'الكل',
  'موبايلات',
  'ملابس',
  'أدوات',
  'منزل',
  'سيارات',
  'كتب',
];

const recentSearches = [
  'iPhone 15',
  'Samsung Galaxy',
  'AirPods',
  'MacBook',
];

const trendingSearches = [
  'iPhone 15 Pro Max',
  'Samsung Galaxy S24',
  'AirPods Pro',
  'iPad Air',
  'MacBook Pro M3',
];

export default function SearchSystem({
  products,
  onProductSelect,
  onSearch,
}: SearchSystemProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'الكل',
    minPrice: 0,
    maxPrice: 10000,
    rating: 0,
    sortBy: 'relevance',
  });
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearching(true);
      performSearch();
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, filters]);

  const performSearch = () => {
    let results = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply filters
    if (filters.category !== 'الكل') {
      results = results.filter(product => product.category === filters.category);
    }

    results = results.filter(
      product =>
        product.price >= filters.minPrice &&
        product.price <= filters.maxPrice &&
        product.rating >= filters.rating
    );

    // Apply sorting
    switch (filters.sortBy) {
      case 'price_low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Assuming newer products have higher IDs
        results.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        // Relevance - keep original order
        break;
    }

    setSearchResults(results);
    onSearch(searchQuery, filters);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderSearchSuggestions = () => (
    <View style={styles.suggestionsContainer}>
      {/* Recent Searches */}
      <View style={styles.suggestionSection}>
        <View style={styles.suggestionHeader}>
          <Clock size={16} color="#9CA3AF" />
          <Text style={styles.suggestionTitle}>عمليات البحث الأخيرة</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionChip}
              onPress={() => handleRecentSearch(search)}
            >
              <Text style={styles.suggestionChipText}>{search}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Trending Searches */}
      <View style={styles.suggestionSection}>
        <View style={styles.suggestionHeader}>
          <TrendingUp size={16} color="#8B5CF6" />
          <Text style={styles.suggestionTitle}>الأكثر بحثاً</Text>
        </View>
        {trendingSearches.map((search, index) => (
          <TouchableOpacity
            key={index}
            style={styles.trendingItem}
            onPress={() => handleRecentSearch(search)}
          >
            <Text style={styles.trendingText}>{search}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      {/* Categories */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>التصنيف</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                filters.category === category && styles.categoryChipActive,
              ]}
              onPress={() => setFilters({ ...filters, category })}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  filters.category === category && styles.categoryChipTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Price Range */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>نطاق السعر</Text>
        <View style={styles.priceRange}>
          <TextInput
            style={styles.priceInput}
            value={filters.minPrice.toString()}
            onChangeText={(text) =>
              setFilters({ ...filters, minPrice: parseInt(text) || 0 })
            }
            placeholder="من"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
          <Text style={styles.priceSeparator}>-</Text>
          <TextInput
            style={styles.priceInput}
            value={filters.maxPrice.toString()}
            onChangeText={(text) =>
              setFilters({ ...filters, maxPrice: parseInt(text) || 10000 })
            }
            placeholder="إلى"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Rating */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>التقييم</Text>
        <View style={styles.ratingFilter}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <TouchableOpacity
              key={rating}
              style={styles.ratingOption}
              onPress={() => setFilters({ ...filters, rating })}
            >
              <Star
                size={20}
                color={rating <= filters.rating ? '#FCD34D' : '#6B7280'}
                fill={rating <= filters.rating ? '#FCD34D' : 'transparent'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sort By */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>ترتيب حسب</Text>
        <View style={styles.sortOptions}>
          {[
            { key: 'relevance', label: 'الأكثر صلة' },
            { key: 'price_low', label: 'السعر: من الأقل للأعلى' },
            { key: 'price_high', label: 'السعر: من الأعلى للأقل' },
            { key: 'rating', label: 'التقييم' },
            { key: 'newest', label: 'الأحدث' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortOption,
                filters.sortBy === option.key && styles.sortOptionActive,
              ]}
              onPress={() =>
                setFilters({ ...filters, sortBy: option.key as any })
              }
            >
              <Text
                style={[
                  styles.sortOptionText,
                  filters.sortBy === option.key && styles.sortOptionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderSearchResults = () => (
    <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.resultsCount}>
        {searchResults.length} نتيجة للبحث عن "{searchQuery}"
      </Text>
      
      {searchResults.map((product) => (
        <TouchableOpacity
          key={product.id}
          style={styles.resultItem}
          onPress={() => onProductSelect(product)}
        >
          <Image source={{ uri: product.image }} style={styles.resultImage} />
          <View style={styles.resultInfo}>
            <Text style={styles.resultName}>{product.name}</Text>
            <Text style={styles.resultCategory}>{product.category}</Text>
            <View style={styles.resultMeta}>
              <Text style={styles.resultPrice}>${product.price}</Text>
              <View style={styles.resultRating}>
                <Star size={12} color="#FCD34D" fill="#FCD34D" />
                <Text style={styles.resultRatingText}>{product.rating}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Search size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="ابحث عن المنتجات..."
          placeholderTextColor="#9CA3AF"
        />
        
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <X size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && renderFilters()}

      {/* Content */}
      {!isSearching && !searchQuery && renderSearchSuggestions()}
      {isSearching && searchQuery && renderSearchResults()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginVertical: 16,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginHorizontal: 12,
  },
  filterButton: {
    padding: 4,
  },
  filtersContainer: {
    backgroundColor: '#1F2937',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  categoryChip: {
    backgroundColor: '#374151',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#8B5CF6',
  },
  categoryChipText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  priceRange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  priceSeparator: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginHorizontal: 12,
  },
  ratingFilter: {
    flexDirection: 'row',
  },
  ratingOption: {
    padding: 4,
    marginRight: 8,
  },
  sortOptions: {
    gap: 8,
  },
  sortOption: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortOptionActive: {
    backgroundColor: '#8B5CF6',
  },
  sortOptionText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  sortOptionTextActive: {
    color: '#FFFFFF',
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
  },
  suggestionSection: {
    marginBottom: 24,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  suggestionChip: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  suggestionChipText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  trendingItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  trendingText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
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
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  resultCategory: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultPrice: {
    color: '#8B5CF6',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  resultRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultRatingText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
});