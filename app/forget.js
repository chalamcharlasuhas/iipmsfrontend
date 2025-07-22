// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ImageBackground,
//   Dimensions,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import axios from 'axios';
// import ipfront from '../constants/ipadd';

// const { height, width } = Dimensions.get('window');

// const APP_URL = ipfront;

// const ForgetPasswordScreen = () => {
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [stage, setStage] = useState('email'); // 'email', 'otp', 'reset'
//   const [resetToken, setResetToken] = useState('');
//   const navigation = useNavigation();
//   const router = useRouter();

//   const handleSendOTP = async () => {
//     try {
//       const response = await axios.post(`${APP_URL}/api/forgot-password`, { email });
//       Alert.alert('Success', response.data.message);
//       setStage('otp');
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
//     }
//   };

//   const handleVerifyOTP = async () => {
//     try {
//       const response = await axios.post(`${APP_URL}/api/verify-otp`, { email, otp });
//       setResetToken(response.data.resetToken);
//       Alert.alert('Success', response.data.message);
//       setStage('reset');
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to verify OTP');
//     }
//   };

//   const handleResetPassword = async () => {
//     if (newPassword !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return;
//     }
//     try {
//       const response = await axios.post(`${APP_URL}/api/reset-password`, { token: resetToken, newPassword });
//       Alert.alert('Success', response.data.message, [
//         { text: 'OK', onPress: () => router.push('/index') },
//       ]);
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to reset password');
//     }
//   };

//   return (
//     <LinearGradient
//       colors={['#003087', '#0059b3', '#4c87ba', '#003087']}
//       start={{ x: 0.1, y: 0 }}
//       end={{ x: 0.9, y: 1 }}
//       style={styles.gradientBackground}
//     >
//       <SafeAreaView style={styles.safeArea}>
//         <KeyboardAvoidingView
//           style={styles.keyboardAvoidingContainer}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
//         >
//           <View style={styles.container}>
//             <ImageBackground
//               style={styles.logoImage}
//               resizeMode="contain"
//               source={require('../assets/images/logo.png')}
//             />
//             <View style={styles.logoContainer}>
//               <Text style={styles.logo}>IIPMS</Text>
//             </View>
//             <Text style={styles.subHeader}>
//               {stage === 'email' ? 'Forgot Password' : stage === 'otp' ? 'Verify OTP' : 'Reset Password'}
//             </Text>
//             {stage === 'email' && (
//               <>
//                 <TextInput
//                   style={styles.input}
//                   value={email}
//                   onChangeText={setEmail}
//                   placeholder="Your Email"
//                   placeholderTextColor="#a0a0a0"
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                 />
//                 {/* <TextInput
//                   style={[styles.input, styles.disabledInput]}
//                   value="shaganti74@gmail.com"
//                   editable={false}
//                   placeholder="Admin Email"
//                   placeholderTextColor="#a0a0a0"
//                 /> */}
//                 <TouchableOpacity style={styles.sendButton} onPress={handleSendOTP}>
//                   <Text style={styles.sendButtonText}>Send OTP</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//             {stage === 'otp' && (
//               <>
//                 <TextInput
//                   style={styles.input}
//                   value={otp}
//                   onChangeText={setOtp}
//                   placeholder="Enter OTP"
//                   placeholderTextColor="#a0a0a0"
//                   keyboardType="numeric"
//                 />
//                 <TouchableOpacity style={styles.sendButton} onPress={handleVerifyOTP}>
//                   <Text style={styles.sendButtonText}>Verify OTP</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//             {stage === 'reset' && (
//               <>
//                 <TextInput
//                   style={styles.input}
//                   value={newPassword}
//                   onChangeText={setNewPassword}
//                   placeholder="New Password"
//                   placeholderTextColor="#a0a0a0"
//                   secureTextEntry
//                 />
//                 <TextInput
//                   style={styles.input}
//                   value={confirmPassword}
//                   onChangeText={setConfirmPassword}
//                   placeholder="Confirm Password"
//                   placeholderTextColor="#a0a0a0"
//                   secureTextEntry
//                 />
//                 <TouchableOpacity style={styles.sendButton} onPress={handleResetPassword}>
//                   <Text style={styles.sendButtonText}>Reset Password</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//             <TouchableOpacity onPress={() => router.push('/index')}>
//               <Text style={styles.backToLogin}>← Go back to Login</Text>
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradientBackground: {
//     flex: 1,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   keyboardAvoidingContainer: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: 'rgba(0, 48, 135, 0.1)', // Slight overlay to enhance contrast
//   },
//   logoImage: {
//     height: height / 3.5,
//     width: width * 0.8,
//     maxWidth: 320,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   logoContainer: {
//     backgroundColor: '#ffffff',
//     borderRadius: 50,
//     padding: 12,
//     marginBottom: 16,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 6,
//       },
//       android: {
//         elevation: 6,
//       },
//     }),
//   },
//   logo: {
//     color: '#ff0000',
//     fontSize: 24,
//     fontWeight: '700',
//     fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto',
//   },
//   subHeader: {
//     color: '#ffffff',
//     fontSize: 28,
//     fontWeight: '600',
//     marginBottom: 24,
//     textAlign: 'center',
//     fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto',
//   },
//   input: {
//     width: '100%',
//     maxWidth: 400,
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16,
//     color: '#333333',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//   },
//   disabledInput: {
//     backgroundColor: '#f0f4f8',
//     opacity: 0.7,
//   },
//   sendButton: {
//     width: '100%',
//     maxWidth: 400,
//     backgroundColor: '#003087',
//     borderRadius: 8,
//     padding: 14,
//     alignItems: 'center',
//     marginBottom: 16,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.2,
//         shadowRadius: 6,
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   sendButtonText: {
//     color: '#ffffff',
//     fontSize: 18,
//     fontWeight: '600',
//     fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto',
//   },
//   backToLogin: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '500',
//     marginTop: 12,
//     textDecorationLine: 'underline',
//     fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'Roboto',
//   },
// });

// export default ForgetPasswordScreen;



import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import axios from 'axios';
import ipfront from '../constants/ipadd';

const { height, width } = Dimensions.get('window');

const APP_URL = ipfront;

const ForgetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stage, setStage] = useState('email'); // 'email', 'otp', 'reset', 'pending'
  const [resetToken, setResetToken] = useState('');
  const navigation = useNavigation();
  const router = useRouter();

  const handleSendOTP = async () => {
    try {
      const response = await axios.post(`${APP_URL}/api/forgot-password`, { email });
      Alert.alert('Success', response.data.message);
      if (response.data.message.includes('admin')) {
        setStage('pending');
      } else {
        setStage('otp');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send request');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post(`${APP_URL}/api/verify-otp`, { email, otp });
      setResetToken(response.data.resetToken);
      Alert.alert('Success', response.data.message);
      setStage('reset');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to verify OTP');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      const response = await axios.post(`${APP_URL}/api/reset-password`, { token: resetToken, newPassword });
      Alert.alert('Success', response.data.message, [
        { text: 'OK', onPress: () => router.push('/index') },
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <LinearGradient
      colors={['#003087', '#0059b3', '#4c87ba', '#003087']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.container}>
            <ImageBackground
              style={styles.logoImage}
              resizeMode="contain"
              source={require('../assets/images/logo.png')}
            />
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>IIPMS</Text>
            </View>
            <Text style={styles.subHeader}>
              {stage === 'email' ? 'Forgot Password' : 
               stage === 'otp' ? 'Verify OTP' : 
               stage === 'reset' ? 'Reset Password' : 
               'Pending Approval'}
            </Text>
            {stage === 'email' && (
              <>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Your Email"
                  placeholderTextColor="#a0a0a0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendOTP}>
                  <Text style={styles.sendButtonText}>Send Request</Text>
                </TouchableOpacity>
              </>
            )}
            {stage === 'pending' && (
              <Text style={styles.pendingText}>
                Your password reset request has been sent to the admin for approval. 
                You will receive an OTP once approved.
              </Text>
            )}
            {stage === 'otp' && (
              <>
                <TextInput
                  style={styles.input}
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="Enter OTP"
                  placeholderTextColor="#a0a0a0"
                  keyboardType="numeric"
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleVerifyOTP}>
                  <Text style={styles.sendButtonText}>Verify OTP</Text>
                </TouchableOpacity>
              </>
            )}
            {stage === 'reset' && (
              <>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New Password"
                  placeholderTextColor="#a0a0a0"
                  secureTextEntry
                />
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm Password"
                  placeholderTextColor="#a0a0a0"
                  secureTextEntry
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleResetPassword}>
                  <Text style={styles.sendButtonText}>Reset Password</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity onPress={() => router.push('/index')}>
              <Text style={styles.backToLogin}>← Go back to Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 48, 135, 0.1)',
  },
  logoImage: {
    height: height / 3.5,
    width: width * 0.8,
    maxWidth: 320,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  logo: {
    color: '#ff0000',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto',
  },
  subHeader: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto',
  },
  input: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sendButton: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#003087',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto',
  },
  backToLogin: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    textDecorationLine: 'underline',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'Roboto',
  },
  pendingText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'Roboto',
  },
});

export default ForgetPasswordScreen;