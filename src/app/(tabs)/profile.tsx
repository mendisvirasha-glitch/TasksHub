import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type StudentProfile = {
  name: string;
  id: string;
  imageUri: string | null;
};

const placeholderImage =
  'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

export default function ProfileScreen() {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    void loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('studentProfile');
      if (!storedProfile) {
        return;
      }

      const parsedProfile: StudentProfile = JSON.parse(storedProfile);
      setStudentName(parsedProfile.name || '');
      setStudentId(parsedProfile.id || '');
      setProfileImage(parsedProfile.imageUri || null);
    } catch (error) {
      console.error('Failed to load profile data:', error);
      Alert.alert('Unable to load profile', 'Please try again.');
    }
  };

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Allow access to your photos to choose a profile image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Failed to pick profile image:', error);
      Alert.alert('Unable to select image', 'Please try again.');
    }
  };

  const saveProfileData = async () => {
    if (!studentName.trim() || !studentId.trim()) {
      Alert.alert('Missing information', 'Please enter both your name and student ID.');
      return;
    }

    const profileData: StudentProfile = {
      name: studentName.trim(),
      id: studentId.trim(),
      imageUri: profileImage,
    };

    try {
      await AsyncStorage.setItem('studentProfile', JSON.stringify(profileData));
      Alert.alert('Success', 'Profile details saved successfully.');
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Unable to save profile', 'Please try again.');
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear all data?',
      'This will delete your saved profile and tasks from this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              try {
                await AsyncStorage.clear();
                setStudentName('');
                setStudentId('');
                setProfileImage(null);
                Alert.alert('Cleared', 'All local data has been removed.');
              } catch (error) {
                console.error('Failed to clear local data:', error);
                Alert.alert('Unable to clear data', 'Please try again.');
              }
            })();
          },
        },
      ],
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Student Profile</Text>
      <Text style={styles.subtitle}>Manage your profile details</Text>

      <TouchableOpacity
        onPress={pickImage}
        style={styles.imageContainer}
        accessibilityRole="button"
        accessibilityLabel="Choose profile image"
      >
        <Image source={{ uri: profileImage || placeholderImage }} style={styles.avatar} />
        <View style={styles.editBadge}>
          <Text style={styles.editBadgeText}>Edit</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#94a3b8"
          value={studentName}
          onChangeText={setStudentName}
          accessibilityLabel="Student name"
        />

        <Text style={styles.label}>Student ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your student ID"
          placeholderTextColor="#94a3b8"
          value={studentId}
          onChangeText={setStudentId}
          accessibilityLabel="Student ID"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveProfileData}
          accessibilityRole="button"
        >
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearAllData}
          accessibilityRole="button"
        >
          <Text style={styles.clearButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: 64,
    backgroundColor: '#f1f5f9',
  },
  heading: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 24,
    color: '#64748b',
    fontSize: 15,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  avatar: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: '#e2e8f0',
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#2563eb',
  },
  editBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#ffffff',
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
  saveButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: '#2563eb',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  clearButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 10,
  },
  clearButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '700',
  },
});