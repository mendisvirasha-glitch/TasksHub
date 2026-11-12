import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Task = {
  id: string;
  taskName: string;
  taskDescription: string;
};

export default function AddTaskScreen() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const saveTask = async () => {
    const name = taskName.trim();
    const description = taskDescription.trim();

    if (!name || !description) {
      Alert.alert('Missing information', 'Please enter a task name and description.');
      return;
    }

    setIsSaving(true);
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      const tasks: Task[] = savedTasks ? JSON.parse(savedTasks) : [];
      if (!Array.isArray(tasks)) {
        throw new Error('Stored tasks are not in the expected format.');
      }

      const newTask: Task = {
        id: Date.now().toString(),
        taskName: name,
        taskDescription: description,
      };

      await AsyncStorage.setItem('tasks', JSON.stringify([...tasks, newTask]));
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Saved Successfully!',
          body: `Don't forget to complete ${name}.`,
        },
        trigger: null,
      });

      router.back();
    } catch (error) {
      console.error('Failed to save task:', error);
      Alert.alert('Unable to save task', 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://img.magnific.com/free-vector/isometric-time-management-concept-illustrated_52683-55534.jpg?semt=ais_hybrid&w=740&q=80',
      }}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.card}>
            <Text style={styles.heading}>Add a Task</Text>
            <Text style={styles.subtitle}>Plan your next task and stay on track.</Text>
            <Image
              source={{
                uri: 'https://static.vecteezy.com/system/resources/previews/016/921/110/non_2x/business-task-management-illustration-concept-on-white-background-vector.jpg',
              }}
              style={styles.banner}
              resizeMode="contain"
              accessibilityLabel="Task management illustration"
            />

            <Text style={styles.label}>Task Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter task name"
              placeholderTextColor="#94a3b8"
              value={taskName}
              onChangeText={setTaskName}
              accessibilityLabel="Task name"
              returnKeyType="next"
            />

            <Text style={styles.label}>Task Description</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Describe your task"
              placeholderTextColor="#94a3b8"
              value={taskDescription}
              onChangeText={setTaskDescription}
              accessibilityLabel="Task description"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.button, isSaving && styles.buttonDisabled]}
              onPress={saveTask}
              disabled={isSaving}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Save Task'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },
  keyboardView: {
    width: '100%',
  },
  card: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  heading: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    color: '#64748b',
    fontSize: 15,
  },
  banner: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    minHeight: 50,
    marginBottom: 18,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    color: '#0f172a',
    fontSize: 16,
  },
  descriptionInput: {
    minHeight: 110,
    paddingTop: 14,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: '#2563eb',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
