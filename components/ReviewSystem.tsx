import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Camera,
  Send,
} from 'lucide-react-native';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  images?: string[];
  helpful: number;
  notHelpful: number;
  verified: boolean;
}

interface ReviewSystemProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onSubmitReview: (review: Omit<Review, 'id' | 'date' | 'helpful' | 'notHelpful'>) => void;
  onVoteHelpful: (reviewId: string, helpful: boolean) => void;
}

export default function ReviewSystem({
  productId,
  reviews,
  averageRating,
  totalReviews,
  onSubmitReview,
  onVoteHelpful,
}: ReviewSystemProps) {
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: [] as string[],
  });
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful'>('newest');

  const handleSubmitReview = () => {
    if (newReview.rating === 0) {
      Alert.alert('خطأ', 'يرجى اختيار تقييم');
      return;
    }
    
    if (newReview.comment.trim().length < 10) {
      Alert.alert('خطأ', 'يرجى كتابة تعليق لا يقل عن 10 أحرف');
      return;
    }

    onSubmitReview({
      userId: 'current_user',
      userName: 'أحمد محمد',
      userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      images: newReview.images,
      verified: true,
    });

    setNewReview({ rating: 0, title: '', comment: '', images: [] });
    setShowWriteReview(false);
    Alert.alert('شكراً لك', 'تم إرسال تقييمك بنجاح');
  };

  const renderStars = (rating: number, size: number = 16, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity
        key={index}
        disabled={!interactive}
        onPress={() => interactive && setNewReview({ ...newReview, rating: index + 1 })}
      >
        <Star
          size={size}
          color={index < rating ? '#FCD34D' : '#6B7280'}
          fill={index < rating ? '#FCD34D' : 'transparent'}
        />
      </TouchableOpacity>
    ));
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      distribution[review.rating - 1]++;
    });
    return distribution.reverse();
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'rating_high':
        return b.rating - a.rating;
      case 'rating_low':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const ratingDistribution = getRatingDistribution();

  return (
    <View style={styles.container}>
      {/* Rating Summary */}
      <View style={styles.ratingSummary}>
        <View style={styles.averageRating}>
          <Text style={styles.averageNumber}>{averageRating.toFixed(1)}</Text>
          <View style={styles.averageStars}>
            {renderStars(Math.floor(averageRating), 20)}
          </View>
          <Text style={styles.totalReviews}>({totalReviews} تقييم)</Text>
        </View>

        <View style={styles.ratingDistribution}>
          {ratingDistribution.map((count, index) => (
            <View key={index} style={styles.distributionRow}>
              <Text style={styles.starNumber}>{5 - index}</Text>
              <Star size={12} color="#FCD34D" fill="#FCD34D" />
              <View style={styles.distributionBar}>
                <View
                  style={[
                    styles.distributionFill,
                    { width: `${totalReviews > 0 ? (count / totalReviews) * 100 : 0}%` },
                  ]}
                />
              </View>
              <Text style={styles.distributionCount}>{count}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.writeReviewButton}
          onPress={() => setShowWriteReview(true)}
        >
          <MessageCircle size={16} color="#FFFFFF" />
          <Text style={styles.writeReviewText}>اكتب تقييم</Text>
        </TouchableOpacity>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>ترتيب:</Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              // Show sort options modal
            }}
          >
            <Text style={styles.sortText}>
              {sortBy === 'newest' && 'الأحدث'}
              {sortBy === 'oldest' && 'الأقدم'}
              {sortBy === 'rating_high' && 'أعلى تقييم'}
              {sortBy === 'rating_low' && 'أقل تقييم'}
              {sortBy === 'helpful' && 'الأكثر فائدة'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reviews List */}
      <ScrollView style={styles.reviewsList} showsVerticalScrollIndicator={false}>
        {sortedReviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: review.userAvatar }} style={styles.userAvatar} />
              <View style={styles.reviewInfo}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{review.userName}</Text>
                  {review.verified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>مشتري موثق</Text>
                    </View>
                  )}
                </View>
                <View style={styles.reviewMeta}>
                  <View style={styles.reviewStars}>
                    {renderStars(review.rating, 14)}
                  </View>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              </View>
            </View>

            {review.title && (
              <Text style={styles.reviewTitle}>{review.title}</Text>
            )}

            <Text style={styles.reviewComment}>{review.comment}</Text>

            {review.images && review.images.length > 0 && (
              <ScrollView horizontal style={styles.reviewImages}>
                {review.images.map((image, index) => (
                  <Image key={index} source={{ uri: image }} style={styles.reviewImage} />
                ))}
              </ScrollView>
            )}

            <View style={styles.reviewActions}>
              <TouchableOpacity
                style={styles.helpfulButton}
                onPress={() => onVoteHelpful(review.id, true)}
              >
                <ThumbsUp size={14} color="#10B981" />
                <Text style={styles.helpfulText}>مفيد ({review.helpful})</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.helpfulButton}
                onPress={() => onVoteHelpful(review.id, false)}
              >
                <ThumbsDown size={14} color="#EF4444" />
                <Text style={styles.helpfulText}>غير مفيد ({review.notHelpful})</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Write Review Modal */}
      <Modal
        visible={showWriteReview}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWriteReview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>اكتب تقييمك</Text>

            {/* Rating */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>التقييم</Text>
              <View style={styles.interactiveStars}>
                {renderStars(newReview.rating, 24, true)}
              </View>
            </View>

            {/* Title */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>العنوان (اختياري)</Text>
              <TextInput
                style={styles.titleInput}
                value={newReview.title}
                onChangeText={(text) => setNewReview({ ...newReview, title: text })}
                placeholder="اكتب عنوان للتقييم"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Comment */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>التعليق</Text>
              <TextInput
                style={styles.commentInput}
                value={newReview.comment}
                onChangeText={(text) => setNewReview({ ...newReview, comment: text })}
                placeholder="شارك تجربتك مع هذا المنتج..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Images */}
            <View style={styles.inputSection}>
              <TouchableOpacity style={styles.addImageButton}>
                <Camera size={20} color="#8B5CF6" />
                <Text style={styles.addImageText}>إضافة صور (اختياري)</Text>
              </TouchableOpacity>
            </View>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowWriteReview(false)}
              >
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitReview}
              >
                <Send size={16} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>إرسال</Text>
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
  ratingSummary: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
  },
  averageRating: {
    alignItems: 'center',
    marginRight: 20,
  },
  averageNumber: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  averageStars: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  totalReviews: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  ratingDistribution: {
    flex: 1,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starNumber: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    width: 12,
  },
  distributionBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    backgroundColor: '#FCD34D',
  },
  distributionCount: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    width: 20,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  writeReviewText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 8,
  },
  sortButton: {
    backgroundColor: '#374151',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  sortText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  reviewsList: {
    maxHeight: 400,
  },
  reviewCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: '#10B981',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviewDate: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  reviewTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  reviewComment: {
    color: '#D1D5DB',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewImages: {
    marginBottom: 12,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 16,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpfulText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
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
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  interactiveStars: {
    flexDirection: 'row',
    gap: 4,
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  commentInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    borderStyle: 'dashed',
  },
  addImageText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
});