import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import { useUser } from '../contexts/UserContext';
import ipfront from '../constants/ipadd';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = ipfront;

const EditProfile = ({ onClose }) => {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNo: user.phoneNo || '',
        role: user.role || '',
        department: user.department || '',
        roleType: user.roleType || '',
      });
    }
  }, [user]);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/${user.employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Update failed');

      Alert.alert('Success', 'Profile updated successfully');
      setUser(result.user);
      if (onClose) onClose();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  // Map field keys to display names
  const fieldLabels = {
    name: 'Name',
    email: 'Email',
    phoneNo: 'Phone Number',
    role: 'Role',
    department: 'Department',
    roleType: 'Role Type',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#002343', '#002343', '#4c87ba', '#002343']}
        locations={[0.04, 0.19, 0.41, 0.67]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.15 }}
        style={styles.modalContainer}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Edit Profile</Text>
          {['name', 'email', 'phoneNo', 'role', 'department', 'roleType'].map((field) => (
            <View key={field} style={styles.inputContainer}>
              <Text style={styles.label}>{fieldLabels[field]}</Text>
              <TextInput
                style={styles.input}
                placeholder={fieldLabels[field]}
                value={formData[field]}
                onChangeText={(text) => handleChange(field, text)}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 50,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff', // Ensure visibility on gradient background
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#fff', // Ensure visibility on gradient background
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#003087',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditProfile;