import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Target,
  Gift,
  Eye,
  ShoppingCart,
  Users,
  Star,
  CheckCircle,
  Clock,
} from 'lucide-react-native';

interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'daily' | 'weekly' | 'special';
  icon: any;
  completed: boolean;
  progress?: number;
  maxProgress?: number;
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'تسجيل الدخول اليومي',
    description: 'سجل دخولك يومياً لتحصل على نقاط',
    points: 10,
    type: 'daily',
    icon: CheckCircle,
    completed: true,
  },
  {
    id: '2',
    title: 'مشاهدة 5 منتجات',
    description: 'تصفح وشاهد 5 منتجات مختلفة',
    points: 15,
    type: 'daily',
    icon: Eye,
    completed: false,
    progress: 2,
    maxProgress: 5,
  },
  {
    id: '3',
    title: 'إضافة منتج للسلة',
    description: 'أضف منتج واحد على الأقل لسلة التسوق',
    points: 20,
    type: 'daily',
    icon: ShoppingCart,
    completed: false,
  },
  {
    id: '4',
    title: 'دعوة صديق',
    description: 'ادع صديقاً للانضمام للتطبيق',
    points: 100,
    type: 'weekly',
    icon: Users,
    completed: false,
  },
  {
    id: '5',
    title: 'تقييم منتج',
    description: 'قيم منتجاً اشتريته مؤخراً',
    points: 25,
    type: 'weekly',
    icon: Star,
    completed: false,
  },
  {
    id: '6',
    title: 'مهمة خاصة - عيد الميلاد',
    description: 'اشتر منتجين أو أكثر واحصل على نقاط مضاعفة',
    points: 200,
    type: 'special',
    icon: Gift,
    completed: false,
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [userLevel] = useState(5);
  const [userPoints] = useState(1250);
  const [dailyProgress] = useState(65);

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;

    Alert.alert(
      'إتمام المهمة',
      `هل تريد إتمام مهمة "${task.title}" والحصول على ${task.points} نقطة؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'إتمام',
          onPress: () => {
            setTasks(prevTasks =>
              prevTasks.map(t =>
                t.id === taskId ? { ...t, completed: true } : t
              )
            );
            Alert.alert('تهانينا!', `حصلت على ${task.points} نقطة!`);
          },
        },
      ]
    );
  };

  const getTaskTypeColor = (type: Task['type']) => {
    switch (type) {
      case 'daily':
        return '#10B981';
      case 'weekly':
        return '#F59E0B';
      case 'special':
        return '#EF4444';
      default:
        return '#8B5CF6';
    }
  };

  const getTaskTypeLabel = (type: Task['type']) => {
    switch (type) {
      case 'daily':
        return 'يومية';
      case 'weekly':
        return 'أسبوعية';
      case 'special':
        return 'خاصة';
      default:
        return '';
    }
  };

  const renderTask = (task: Task) => {
    const IconComponent = task.icon;
    const typeColor = getTaskTypeColor(task.type);

    return (
      <View key={task.id} style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <View style={styles.taskIcon}>
            <IconComponent size={24} color={typeColor} />
          </View>
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskDescription}>{task.description}</Text>
            {task.progress !== undefined && task.maxProgress && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(task.progress / task.maxProgress) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {task.progress}/{task.maxProgress}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.taskReward}>
            <View style={[styles.typeLabel, { backgroundColor: typeColor }]}>
              <Text style={styles.typeLabelText}>{getTaskTypeLabel(task.type)}</Text>
            </View>
            <Text style={styles.pointsText}>{task.points} نقطة</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.taskButton,
            task.completed && styles.taskButtonCompleted,
          ]}
          onPress={() => completeTask(task.id)}
          disabled={task.completed}
        >
          <Text
            style={[
              styles.taskButtonText,
              task.completed && styles.taskButtonTextCompleted,
            ]}
          >
            {task.completed ? 'مكتملة' : 'نفّذ المهمة'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المهام اليومية</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Target size={24} color="#8B5CF6" />
            <Text style={styles.statValue}>{userPoints}</Text>
            <Text style={styles.statLabel}>النقاط</Text>
          </View>
          
          <View style={styles.statCard}>
            <Star size={24} color="#F59E0B" />
            <Text style={styles.statValue}>{userLevel}</Text>
            <Text style={styles.statLabel}>المستوى</Text>
          </View>
          
          <View style={styles.statCard}>
            <Clock size={24} color="#10B981" />
            <Text style={styles.statValue}>{dailyProgress}%</Text>
            <Text style={styles.statLabel}>التقدم اليومي</Text>
          </View>
        </View>

        {/* Daily Progress Bar */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>التقدم اليومي</Text>
          <View style={styles.dailyProgressBar}>
            <View
              style={[
                styles.dailyProgressFill,
                { width: `${dailyProgress}%` },
              ]}
            />
          </View>
          <Text style={styles.progressPercentage}>{dailyProgress}%</Text>
        </View>

        {/* Tasks */}
        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>المهام المتاحة</Text>
          {tasks.map(renderTask)}
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  statCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
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
  },
  progressSection: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  progressTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 12,
  },
  dailyProgressBar: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  dailyProgressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  progressPercentage: {
    color: '#8B5CF6',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  tasksSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  taskIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  taskDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  progressText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  taskReward: {
    alignItems: 'flex-end',
  },
  typeLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  typeLabelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  pointsText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  taskButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  taskButtonCompleted: {
    backgroundColor: '#10B981',
  },
  taskButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  taskButtonTextCompleted: {
    color: '#FFFFFF',
  },
});