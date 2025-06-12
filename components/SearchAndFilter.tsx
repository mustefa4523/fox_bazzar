import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import {
  Search,
  Filter,
  X,
  Star,
  DollarSign,
  TrendingUp,
  Clock,
} from 'lucide-react-native';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  categories: string[];
}

interface FilterOptions {
  category: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  sortBy: 'newest' | 'price_low' | 'price_high' | 'rating' | 'popular';
}

const sortOptions = [
  { key: 'newest', label: 'الأحدث', icon: Clock },
  { key: 'popular', label: 'الأكثر شعبية', icon: TrendingUp },
  { key: 'price_low', label: 'السعر: من الأقل للأعلى', icon: DollarSign },
  { key: 'price_high', label: 'السعر: من الأعلى للأقل', icon: DollarSign },
  { key: 'rating', label: 'الأعلى تقييماً', icon: Star },
];

export default function SearchAndFilter({
  onSearch,
  onFilter,
  categories,
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'الكل',
    minPrice: 0,
    maxPrice: 10000,
    rating: 0,
    sortBy: 'newest',
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleApplyFilters = () => {
    onFilter(filters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      category: 'الكل',
      minPrice: 0,
      maxPrice: 10000,
      rating: 0,
      sortBy: 'newest' as const,
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => setFilters({ ...filters, rating: index + 1 })}
      >
        <Star
          size={20}
          color={index < rating ? '#FCD34D' : '#6B7280'}
          fill={index < rating ? '#FCD34D' : 'transparent'}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="ابحث عن المنتجات..."
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      {/* Quick Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickFilters}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.quickFilterChip,
              filters.category === category && styles.activeQuickFilter,
            ]}
            onPress={() => {
              const newFilters = { ...filters, category };
              setFilters(newFilters);
              onFilter(newFilters);
            }}
          >
            <Text
              style={[
                styles.quickFilterText,
                filters.category === category && styles.activeQuickFilterText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>تصفية النتائج</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Categories */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>التصنيف</Text>
                <View style={styles.categoryGrid}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        filters.category === category && styles.activeCategoryChip,
                      ]}
                      onPress={() => setFilters({ ...filters, category })}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          filters.category === category && styles.activeCategoryChipText,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>نطاق السعر</Text>
                <View style={styles.priceRange}>
                  <View style={styles.priceInput}>
                    <Text style={styles.priceLabel}>من</Text>
                    <TextInput
                      style={styles.priceField}
                      value={filters.minPrice.toString()}
                      onChangeText={(text) =>
                        setFilters({ ...filters, minPrice: parseInt(text) || 0 })
                      }
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  
                  <Text style={styles.priceSeparator}>-</Text>
                  
                  <View style={styles.priceInput}>
                    <Text style={styles.priceLabel}>إلى</Text>
                    <TextInput
                      style={styles.priceField}
                      value={filters.maxPrice.toString()}
                      onChangeText={(text) =>
                        setFilters({ ...filters, maxPrice: parseInt(text) || 10000 })
                      }
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </View>

              {/* Rating */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>التقييم</Text>
                <View style={styles.ratingContainer}>
                  {renderStars(filters.rating)}
                  <Text style={styles.ratingText}>
                    {filters.rating > 0 ? `${filters.rating} نجوم فأكثر` : 'جميع التقييمات'}
                  </Text>
                </View>
              </View>

              {/* Sort By */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>ترتيب حسب</Text>
                <View style={styles.sortOptions}>
                  {sortOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <TouchableOpacity
                        key={option.key}
                        style={[
                          styles.sortOption,
                          filters.sortBy === option.key && styles.activeSortOption,
                        ]}
                        onPress={() => setFilters({ ...filters, sortBy: option.key })}
                      >
                        <IconComponent
                          size={16}
                          color={filters.sortBy === option.key ? '#8B5CF6' : '#9CA3AF'}
                        />
                        <Text
                          style={[
                            styles.sortOptionText,
                            filters.sortBy === option.key && styles.activeSortOptionText,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetFilters}
              >
                <Text style={styles.resetButtonText}>إعادة تعيين</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyButtonText}>تطبيق الفلاتر</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
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
  },
  filterButton: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickFilters: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  quickFilterChip: {
    backgroundColor: '#1F2937',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeQuickFilter: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  quickFilterText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  activeQuickFilterText: {
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  filterSection: {
    marginVertical: 20,
  },
  filterTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#374151',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeCategoryChip: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  categoryChipText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  activeCategoryChipText: {
    color: '#FFFFFF',
  },
  priceRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
  priceLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  priceField: {
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
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
  },
  sortOptions: {
    gap: 8,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeSortOption: {
    backgroundColor: '#4C1D95',
    borderColor: '#8B5CF6',
  },
  sortOptionText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  activeSortOptionText: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});