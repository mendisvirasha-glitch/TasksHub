import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Task = {
  id: string;
  taskName: string;
  taskDescription: string;
};

const backgroundImage =
  'https://img.magnific.com/free-vector/isometric-time-management-concept-illustrated_52683-55534.jpg?semt=ais_hybrid&w=740&q=80';

export default function DashboardScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = useCallback(async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      const parsedTasks: unknown = savedTasks ? JSON.parse(savedTasks) : [];
      if (!Array.isArray(parsedTasks)) {
        throw new Error('Stored tasks are not in the expected format.');
      }
      setTasks(parsedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      Alert.alert('Unable to load tasks', 'Please try again.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadTasks();
    }, [loadTasks]),
  );

  return (
    <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.heading}>Dashboard</Text>
        <Text style={styles.subtitle}>Your tasks at a glance</Text>

        <ScrollView contentContainerStyle={styles.list}>
          {tasks.length === 0 ? (
            <Text style={styles.empty}>No tasks saved yet. Add one!</Text>
          ) : (
            tasks.map((task) => (
              <View key={task.id} style={styles.taskCard}>
                <Text style={styles.taskName}>{task.taskName}</Text>
                <Text style={styles.taskDescription}>{task.taskDescription}</Text>
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-tasks')}
          accessibilityRole="button"
        >
          <Text style={styles.addButtonText}>+ Add New Task</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  heading: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 20,
    color: '#e2e8f0',
    fontSize: 16,
  },
  list: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  empty: {
    marginTop: 24,
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  taskCard: {
    marginBottom: 12,
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#ffffff',
  },
  taskName: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  taskDescription: {
    marginTop: 6,
    color: '#475569',
    fontSize: 14,
  },
  addButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#2563eb',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});