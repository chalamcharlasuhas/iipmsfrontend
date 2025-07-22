import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { router } from 'expo-router';
import ipaddress from '../constants/ipadd';
import { LinearGradient } from 'expo-linear-gradient';
const API_URL = ipaddress;

const AdminResetPasswordScreen = () => {
  const { user } = useUser();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate OTP (6 digits)
  const validateOtp = (otp) => {
    return /^\d{6}$/.test(otp);
  };

  // Validate password (min 8 chars, letters, and numbers)
  const validatePassword = (password) => {
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
  };

  // Check authentication status on component mount
  useEffect(() => {
    if (!user || !user.employeeId || !user.token) {
      setError('Please log in to continue.');
      Alert.alert('Error', 'Please log in to continue.', [
        { text: 'OK', onPress: () => router.push('/login') },
      ]);
    } else if (user.roleType !== 'Admin') {
      setError('Admin access required.');
      Alert.alert('Error', 'You do not have admin access.', [
        { text: 'OK', onPress: () => router.push('/dashboard') },
      ]);
    }
  }, [user]);

  // Handle password reset
  const handleResetPassword = async () => {
    console.log('Resetting password:', { employeeEmail: email, otp, newPassword });
    console.log('Validation:', {
      emailValid: validateEmail(email),
      otpValid: validateOtp(otp),
      passwordValid: validatePassword(newPassword),
      passwordsMatch: newPassword === confirmPassword,
    });

    if (!email || !validateEmail(email)) {
      setError('Valid employee email is required');
      return;
    }
    if (!otp || !validateOtp(otp)) {
      setError('Valid 6-digit OTP is required');
      return;
    }
    if (!newPassword || !validatePassword(newPassword)) {
      setError('Password must be at least 8 characters with letters and numbers');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!user || !user.token) {
      setError('Please log in to continue.');
      Alert.alert('Error', 'Please log in to continue.', [
        { text: 'OK', onPress: () => router.push('/login') },
      ]);
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      console.log('JWT Token for password reset:', user.token);
      console.log('Sending password reset to:', `${API_URL}/api/reset-password`);
      const response = await axios.post(
        `${API_URL}/api/reset-password`,
        { employeeEmail: email, otp, newPassword },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      console.log('Password reset response:', response.data);
      setSuccess(response.data.message);
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Success', 'Password reset successfully', [{ text: 'OK' }]);
    } catch (err) {
      let errorMessage = 'Failed to reset password';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in.';
        Alert.alert('Error', 'Your session has expired. Please log in again.', [
          { text: 'OK', onPress: () => router.push('/login') },
        ]);
      } else if (err.response?.status === 403) {
        errorMessage = 'Admin access required';
        Alert.alert('Error', 'You do not have admin access.', [
          { text: 'OK', onPress: () => router.push('/dashboard') },
        ]);
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      console.error('Reset password error:', err);
      console.error('Error response:', JSON.stringify(err.response?.data, null, 2));
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
              <LinearGradient
            colors={['#002343', '#4c87ba', '#002343']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header} accessibilityLabel="Reset Employee Password Header">
            Reset Employee Password
          </Text>
          <Text style={styles.subHeader} accessibilityLabel="Instruction Text">
            Enter the employee’s email, OTP provided by their manager, and new password
          </Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText} accessibilityLabel="Error Message">
                {error}
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => setError('')}
                accessibilityLabel="Retry Button"
                accessibilityRole="button"
                accessibilityHint="Clear the error and try again"
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {success ? (
            <Text style={styles.successText} accessibilityLabel="Success Message">
              {success}
            </Text>
          ) : null}

          <View style={styles.inputContainer}>
            <Text style={styles.label} accessibilityLabel="Employee Email Label">
              Employee Email
            </Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => {
                console.log('Email changed:', text);
                setEmail(text);
              }}
              placeholder="employee@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Employee Email Input"
              accessibilityHint="Enter the employee's email address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label} accessibilityLabel="OTP Label">
              OTP
            </Text>
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={(text) => {
                console.log('OTP changed:', text);
                setOtp(text);
              }}
              placeholder="Enter 6-digit OTP"
              keyboardType="numeric"
              maxLength={6}
              accessibilityLabel="OTP Input"
              accessibilityHint="Enter the 6-digit OTP provided by the manager"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label} accessibilityLabel="New Password Label">
              New Password
            </Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={(text) => {
                console.log('New password changed:', text);
                setNewPassword(text);
              }}
              placeholder="Enter new password"
              secureTextEntry
              autoCapitalize="none"
              accessibilityLabel="New Password Input"
              accessibilityHint="Enter a new password with at least 8 characters, including letters and numbers"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label} accessibilityLabel="Confirm Password Label">
              Confirm Password
            </Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={(text) => {
                console.log('Confirm password changed:', text);
                setConfirmPassword(text);
              }}
              placeholder="Confirm new password"
              secureTextEntry
              autoCapitalize="none"
              accessibilityLabel="Confirm Password Input"
              accessibilityHint="Re-enter the new password to confirm"
            />
          </View>

          {loading && <ActivityIndicator size="large" color="#003087" style={styles.loadingSpinner} />}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={loading}
            accessibilityLabel="Reset Password Button"
            accessibilityRole="button"
            accessibilityHint="Submit the email, OTP, and new password to reset the employee's password"
          >
            <Text style={styles.buttonText}>
              {loading ? 'Processing...' : 'Reset Password'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    // backgroundColor: '#f4f4f4',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#d1d1d1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#28a745',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
  errorContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 5,
  },
  retryButtonText: {
    fontSize: 14,
    color: '#003087',
    fontWeight: '600',
  },
  successText: {
    fontSize: 14,
    color: '#28a745',
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingSpinner: {
    marginVertical: 15,
  },
});

export default AdminResetPasswordScreen;