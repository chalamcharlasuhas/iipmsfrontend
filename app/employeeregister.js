// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { router } from 'expo-router';
// import Icon from 'react-native-vector-icons/Feather';
// import axios from 'axios';
// import { LinearGradient } from 'expo-linear-gradient';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ipfront from '../constants/ipadd';

// const API_URL = ipfront;

// const Register = () => {
//   const [formData, setFormData] = useState({
//     initial: '',
//     name: '',
//     role: '',
//     department: '',
//     roleType: 'Employee',
//     phoneNo: '',
//     email: '',
//     password: '',
//     managerId: '', // Added managerId field
//   });

//   const handleInputChange = (key, value) => {
//     setFormData({ ...formData, [key]: value });
//   };

//   const handleSubmit = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const response = await axios.post(`${API_URL}/api/register`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log('Registration successful:', response.data);
//       alert(`User registered with Employee ID: ${response.data.employeeId}`);
//       router.push('/');
//     } catch (error) {
//       console.error('Registration error:', error.response?.data?.message || error.message);
//       alert(error.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//         <LinearGradient
//       colors={["#002343", "#002343", "#4c87ba", "#002343"]}
//       start={{ x: 0.1, y: 0 }}
//       end={{ x: 0.9, y: 1 }}
//       style={styles.gradientBackground}
//     >
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         style={styles.flex}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContainer}
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.innerContainer}>
//             <View style={styles.header}>
//               <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//                 <Icon name="arrow-left" size={20} color="#000" />
//               </TouchableOpacity>
//               <Text style={styles.headerTitle}>Employee Registration</Text>
//             </View>

//             <View style={styles.formContainer}>
//               <Text style={styles.label}>Initial</Text>
//               <TextInput
//                 style={styles.input}
//                 value={formData.initial}
//                 onChangeText={(text) => handleInputChange('initial', text)}
//                 placeholder="e.g., R"
//                 placeholderTextColor="#999"
//               />

//               <Text style={styles.label}>Full Name</Text>
//               <TextInput
//                 style={styles.input}
//                 value={formData.name}
//                 onChangeText={(text) => handleInputChange('name', text)}
//                 placeholder="e.g., Robert Brown"
//                 placeholderTextColor="#999"
//               />

//               <Text style={styles.label}>Role</Text>
//               <TextInput
//                 style={styles.input}
//                 value={formData.role}
//                 onChangeText={(text) => handleInputChange('role', text)}
//                 placeholder="e.g., software_engineer"
//                 placeholderTextColor="#999"
//               />

//               <Text style={styles.label}>Department</Text>
//               <TextInput
//                 style={styles.input}
//                 value={formData.department}
//                 onChangeText={(text) => handleInputChange('department', text)}
//                 placeholder="e.g., Vice Counsellor"
//                 placeholderTextColor="#999"
//               />

//               <Text style={styles.label}>Role Type</Text>
//               <Picker
//                 selectedValue={formData.roleType}
//                 style={styles.picker}
//                 onValueChange={(itemValue) => handleInputChange('roleType', itemValue)}
//                 itemStyle={styles.pickerItem}
//               >
//                 <Picker.Item label="Employee" value="Employee" />
//                 <Picker.Item label="Manager" value="Manager" />
//                 <Picker.Item label="Admin" value="Admin" />
//               </Picker>

//               <Text style={styles.label}>Phone Number</Text>
//               <TextInput
//                 style={styles.input}
//                 value={formData.phoneNo}
//                 onChangeText={(text) => handleInputChange('phoneNo', text)}
//                 placeholder="e.g., 6543210987"
//                 keyboardType="phone-pad"
//                 placeholderTextColor="#999"
//               />

//               <Text style={styles.label}>Email</Text>
//               <TextInput
//                 style={styles.input}
//                 value={formData.email}
//                 onChangeText={(text) => handleInputChange('email', text)}
//                 placeholder="e.g., robert.brown@example.com"
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 placeholderTextColor="#999"
//               />

//               <Text style={styles.label}>Password</Text>
//               <TextInput
//                 style={styles.input}
//                 value={formData.password}
//                 onChangeText={(text) => handleInputChange('password', text)}
//                 placeholder="Enter password"
//                 secureTextEntry
//                 placeholderTextColor="#999"
//               />

//               {formData.roleType === 'Employee' && (
//                 <>
//                   <Text style={styles.label}>Manager ID</Text>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.managerId}
//                     onChangeText={(text) => handleInputChange('managerId', text)}
//                     placeholder="e.g., M-12345678"
//                     placeholderTextColor="#999"
//                   />
//                 </>
//               )}

//               <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//                 <Text style={styles.submitButtonText}>Register</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//     gradientBackground: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
    
//   },
//   flex: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   innerContainer: {
//     flex: 1,
//     paddingHorizontal: 15,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderRadius: 15,
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   backButton: {
//     padding: 10,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#003087',
//     marginLeft: 10,
//   },
//   formContainer: {
//     flex: 1,
//     paddingVertical: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#ffff',
//     marginBottom: 5,
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     fontSize: 14,
//     color: '#000',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   picker: {
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     marginBottom: 15,
//     color: '#000',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   pickerItem: {
//       color: '#000',
//       fontSize: 14,
//     },
//     pickerItem: {
//       color: '#000',
//       fontSize: 14,
//     },
//     submitButton: {
//       backgroundColor: '#2a3eb1',
//       paddingVertical: 15,
//       borderRadius: 10,
//       alignItems: 'center',
//       marginTop: 20,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.2,
//       shadowRadius: 3,
//       elevation: 3,
//     },
//     submitButtonText: {
//       color: '#fff',
//       fontSize: 16,
//       fontWeight: 'bold',
//     },
//   });

//   export default Register;



import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipfront from '../constants/ipadd';

const API_URL = ipfront;

const Register = () => {
  const [formData, setFormData] = useState({
    initial: '',
    name: '',
    role: '',
    department: '',
    roleType: 'Employee',
    phoneNo: '',
    email: '',
    password: '',
  });

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/register`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Registration successful:', response.data);
      alert(`User registered with Employee ID: ${response.data.employeeId}`);
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <LinearGradient
      colors={["#002343", "#002343", "#4c87ba", "#002343"]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.innerContainer}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                  <Icon name="arrow-left" size={20} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Employee Registration</Text>
              </View>

              <View style={styles.formContainer}>
                <Text style={styles.label}>Initial</Text>
                <TextInput
                  style={styles.input}
                  value={formData.initial}
                  onChangeText={(text) => handleInputChange('initial', text)}
                  placeholder="e.g., R"
                  placeholderTextColor="#999"
                />

                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                  placeholder="e.g., Robert Brown"
                  placeholderTextColor="#999"
                />

                <Text style={styles.label}>Role</Text>
                <TextInput
                  style={styles.input}
                  value={formData.role}
                  onChangeText={(text) => handleInputChange('role', text)}
                  placeholder="e.g., software_engineer"
                  placeholderTextColor="#999"
                />

                <Text style={styles.label}>Department</Text>
                <TextInput
                  style={styles.input}
                  value={formData.department}
                  onChangeText={(text) => handleInputChange('department', text)}
                  placeholder="e.g., Vice Counsellor"
                  placeholderTextColor="#999"
                />

                <Text style={styles.label}>Role Type</Text>
                <Picker
                  selectedValue={formData.roleType}
                  style={styles.picker}
                  onValueChange={(itemValue) => handleInputChange('roleType', itemValue)}
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item label="Employee" value="Employee" />
                  <Picker.Item label="Manager" value="Manager" />
                  <Picker.Item label="Admin" value="Admin" />
                </Picker>

                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phoneNo}
                  onChangeText={(text) => handleInputChange('phoneNo', text)}
                  placeholder="e.g., 6543210987"
                  keyboardType="phone-pad"
                  placeholderTextColor="#999"
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  placeholder="e.g., robert.brown@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                  placeholder="Enter password"
                  secureTextEntry
                  placeholderTextColor="#999"
                />

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003087',
    marginLeft: 10,
  },
  formContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffff',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 14,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  pickerItem: {
    color: '#000',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#2a3eb1',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Register;