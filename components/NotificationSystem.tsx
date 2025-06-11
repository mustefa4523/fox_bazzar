import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Package,
  DollarSign,
  ShoppingBag,
} from 'lucide-react-native';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'order' | 'payment' | 'delivery';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const { width } = Dimensions.get('window');

export default function NotificationSystem({
  notifications,
  onMarkAsRead,
  onDismiss,
}: NotificationSystemProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);
  const [animations] = useState(new Map<string, Animated.Value>());

  useEffect(() => {
    // Show only unread notifications
    const unreadNotifications = notifications.filter(n => !n.read).slice(0, 3);
    setVisibleNotifications(unreadNotifications);

    // Initialize animations for new notifications
    unreadNotifications.forEach(notification => {
      if (!animations.has(notification.id)) {
        const animValue = new Animated.Value(0);
        animations.set(notification.id, animValue);
        
        // Animate in
        Animated.spring(animValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();

        // Auto dismiss after 5 seconds
        setTimeout(() => {
          handleDismiss(notification.id);
        }, 5000);
      }
    });
  }, [notifications]);

  const handleDismiss = (id: string) => {
    const animValue = animations.get(id);
    if (animValue) {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setVisibleNotifications(prev => prev.filter(n => n.id !== id));
        animations.delete(id);
        onDismiss(id);
      });
    }
  };

  const handlePress = (notification: Notification) => {
    onMarkAsRead(notification.id);
    handleDismiss(notification.id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'error':
        return AlertCircle;
      case 'warning':
        return AlertCircle;
      case 'order':
        return ShoppingBag;
      case 'payment':
        return DollarSign;
      case 'delivery':
        return Package;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'order':
        return '#8B5CF6';
      case 'payment':
        return '#06B6D4';
      case 'delivery':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  return (
    <View style={styles.container}>
      {visibleNotifications.map((notification) => {
        const IconComponent = getNotificationIcon(notification.type);
        const color = getNotificationColor(notification.type);
        const animValue = animations.get(notification.id);

        if (!animValue) return null;

        return (
          <Animated.View
            key={notification.id}
            style={[
              styles.notification,
              {
                transform: [
                  {
                    translateY: animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-100, 0],
                    }),
                  },
                  {
                    scale: animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
                opacity: animValue,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.notificationContent}
              onPress={() => handlePress(notification)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: color }]}>
                <IconComponent size={20} color="#FFFFFF" />
              </View>
              
              <View style={styles.textContainer}>
                <Text style={styles.title}>{notification.title}</Text>
                <Text style={styles.message}>{notification.message}</Text>
                <Text style={styles.timestamp}>
                  {formatTime(notification.timestamp)}
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.dismissButton}
                onPress={() => handleDismiss(notification.id)}
              >
                <X size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  notification: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  message: {
    color: '#D1D5DB',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 4,
  },
  timestamp: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
});