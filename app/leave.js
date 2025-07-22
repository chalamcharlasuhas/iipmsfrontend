// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity, TextInput, Platform,
//   Dimensions, ScrollView, KeyboardAvoidingView, Alert
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Picker } from '@react-native-picker/picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import * as Animatable from 'react-native-animatable';
// import { router } from 'expo-router';
// import { useUser } from '../contexts/UserContext';
// import ipfront from '../constants/ipadd';
// import { LinearGradient } from 'expo-linear-gradient';

// const API_URL = ipfront;
// const { height, width } = Dimensions.get("window");

// const LeaveApplication = () => {
//   const { user } = useUser();
//   const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
//   const [leaveType, setLeaveType] = useState('');
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);
//   const [reason, setReason] = useState('');
//   const [showFromDatePicker, setShowFromDatePicker] = useState(false);
//   const [showToDatePicker, setShowToDatePicker] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!user || !user.token) {
//       router.push('/login');
//     }
//   }, [user]);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const formatDate = (date) => {
//     if (!date) return 'Select Date';
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const handleFromDateChange = (event, selectedDate) => {
//     setShowFromDatePicker(Platform.OS === 'ios');
//     if (event.type === 'set' && selectedDate) {
//       setFromDate(selectedDate);
//       setError(null);
//     }
//     if (event.type === 'dismissed' && Platform.OS === 'android') {
//       setShowFromDatePicker(false);
//     }
//   };

//   const handleToDateChange = (event, selectedDate) => {
//     setShowToDatePicker(Platform.OS === 'ios');
//     if (event.type === 'set' && selectedDate) {
//       setToDate(selectedDate);
//       setError(null);
//     }
//     if (event.type === 'dismissed' && Platform.OS === 'android') {
//       setShowToDatePicker(false);
//     }
//   };

//   const validateForm = () => {
//     if (!leaveType) return setError('Please select a leave type.') || false;
//     if (!fromDate) return setError('Please select a from date.') || false;
//     if (!toDate) return setError('Please select a to date.') || false;
//     if (fromDate > toDate) return setError('From date cannot be later than to date.') || false;
//     if (!reason.trim()) return setError('Please provide a reason for your leave.') || false;

//     if (leaveType !== 'sick' && leaveType !== 'emergency') {
//       const currentDate = new Date();
//       currentDate.setHours(0, 0, 0, 0);
//       const fromDateStart = new Date(fromDate);
//       fromDateStart.setHours(0, 0, 0, 0);

//       const fiveBusinessDaysBefore = new Date(fromDateStart);
//       let daysSubtracted = 0;
//       while (daysSubtracted < 5) {
//         fiveBusinessDaysBefore.setDate(fiveBusinessDaysBefore.getDate() - 1);
//         const day = fiveBusinessDaysBefore.getDay();
//         if (day !== 0 && day !== 6) {
//           daysSubtracted++;
//         }
//       }
//       if (currentDate > fiveBusinessDaysBefore) {
//         return setError('Leave must be applied at least 5 business days before the start date.') || false;
//       }
//     }
//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!user?.employeeId || !user?.token) {
//       Alert.alert('Error', 'User authentication data is missing');
//       router.push('/login');
//       return;
//     }

//     if (!validateForm()) {
//       Alert.alert('Error', error);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const leaveRequest = {
//         employeeId: user.employeeId,
//         leaveType,
//         fromDate: formatDate(fromDate),
//         toDate: formatDate(toDate),
//         reason,
//         status: 'pending',
//       };

//       console.log('Submitting leave request:', leaveRequest);

//       const response = await fetch(`${API_URL}/api/leave/apply`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${user.token}`,
//         },
//         body: JSON.stringify(leaveRequest),
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         throw new Error(responseData.message || 'Failed to submit leave request');
//       }

//       Alert.alert('Success', 'Leave request submitted successfully');
//       setLeaveType('');
//       setFromDate(null);
//       setToDate(null);
//       setReason('');
//     } catch (err) {
//       Alert.alert('Error', err.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <LinearGradient
//       colors={["#002343", "#002343", "#4c87ba", "#002343"]}
//       start={{ x: 0.1, y: 0 }}
//       end={{ x: 0.9, y: 1 }}
//       style={styles.gradientBackground}
//     >
//       <SafeAreaView style={styles.safeArea}>
//         <KeyboardAvoidingView
//           style={styles.keyboardAvoidingView}
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//         >
//           <ScrollView contentContainerStyle={styles.container}>
//             <Animatable.View animation="fadeInUp" duration={1000} style={styles.form}>
//               <Text style={styles.heading}>Leave Application</Text>

//               <Text style={styles.label}>Leave Type</Text>
//               {leaveType ? (
//                 <Text style={styles.selectedLeaveType}>
//                   Selected: {leaveType.charAt(0).toUpperCase() + leaveType.slice(1)}
//                 </Text>
//               ) : null}
//               <View style={styles.pickerContainer}>
//                 <Picker
//                   selectedValue={leaveType}
//                   onValueChange={(value) => {
//                     setLeaveType(value);
//                     setError(null);
//                   }}
//                   style={styles.picker}
//                   itemStyle={styles.pickerItem}
//                 >
//                   <Picker.Item label="Select Leave Type" value="" style={styles.placeholderItem} />
//                   <Picker.Item label="Casual" value="casual" />
//                   <Picker.Item label="Sick" value="sick" />
//                   <Picker.Item label="Emergency" value="emergency" />
//                 </Picker>
//               </View>

//               <Text style={styles.label}>From Date</Text>
//               <TouchableOpacity onPress={() => setShowFromDatePicker(true)} style={styles.dateInput}>
//                 <Text>{formatDate(fromDate)}</Text>
//               </TouchableOpacity>
//               {showFromDatePicker && (
//                 <DateTimePicker
//                   value={fromDate || new Date()}
//                   mode="date"
//                   display="default"
//                   onChange={handleFromDateChange}
//                   minimumDate={new Date()}
//                 />
//               )}

//               <Text style={styles.label}>To Date</Text>
//               <TouchableOpacity onPress={() => setShowToDatePicker(true)} style={styles.dateInput}>
//                 <Text>{formatDate(toDate)}</Text>
//               </TouchableOpacity>
//               {showToDatePicker && (
//                 <DateTimePicker
//                   value={toDate || new Date()}
//                   mode="date"
//                   display="default"
//                   onChange={handleToDateChange}
//                   minimumDate={fromDate || new Date()}
//                 />
//               )}

//               <Text style={styles.label}>Reason</Text>
//               <TextInput
//                 style={styles.textInput}
//                 value={reason}
//                 onChangeText={(text) => {
//                   setReason(text);
//                   setError(null);
//                 }}
//                 multiline
//                 placeholder="Enter reason for leave"
//               />

//               {error && <Text style={styles.error}>{error}</Text>}

//               <TouchableOpacity
//                 onPress={handleSubmit}
//                 style={[styles.submitButton, loading && styles.disabledButton]}
//                 disabled={loading}
//               >
//                 <Text style={styles.submitText}>
//                   {loading ? 'Submitting...' : 'Submit Leave'}
//                 </Text>
//               </TouchableOpacity>
//             </Animatable.View>
//           </ScrollView>
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
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   container: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   form: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 20,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 6,
//       },
//     }),
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#002444',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   label: {
//     marginBottom: 5,
//     fontWeight: '600',
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     marginBottom: 15,
//     backgroundColor: '#fff',
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//     ...Platform.select({
//       ios: {
//         color: '#000',
//         fontSize: 16,
//       },
//       android: {
//         color: '#000',
//       },
//     }),
//   },
//   pickerItem: {
//     fontSize: 16,
//     color: '#000',
//     ...Platform.select({
//       ios: {
//         height: 150,
//       },
//     }),
//   },
//   placeholderItem: {
//     color: '#999',
//     fontSize: 16,
//   },
//   selectedLeaveType: {
//     fontSize: 14,
//     color: '#1890ff',
//     marginBottom: 5,
//   },
//   dateInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 15,
//     textAlignVertical: 'top',
//     height: 80,
//   },
//   error: {
//     color: 'red',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   submitButton: {
//     backgroundColor: '#1890ff',
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   disabledButton: {
//     backgroundColor: '#cccccc',
//   },
//   submitText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default LeaveApplication;

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Platform,
  Dimensions, ScrollView, KeyboardAvoidingView, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import * as Animatable from 'react-native-animatable';
import { router } from 'expo-router';
import { useUser } from '../contexts/UserContext';
import ipfront from '../constants/ipadd';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';

const API_URL = ipfront;
const { height, width } = Dimensions.get("window");

const LeaveApplication = () => {
  const { user } = useUser();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const [leaveType, setLeaveType] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [reason, setReason] = useState('');
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.token) {
      router.push('/login');
    }
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    if (!date) return 'Select Date';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const validateForm = () => {
    if (!leaveType) return setError('Please select a leave type.') || false;
    if (!fromDate) return setError('Please select a from date.') || false;
    if (!toDate) return setError('Please select a to date.') || false;
    if (new Date(fromDate) > new Date(toDate)) return setError('From date cannot be later than to date.') || false;
    if (!reason.trim()) return setError('Please provide a reason for your leave.') || false;

    if (leaveType !== 'sick' && leaveType !== 'emergency') {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const fromDateStart = new Date(fromDate);
      fromDateStart.setHours(0, 0, 0, 0);

      const fiveBusinessDaysBefore = new Date(fromDateStart);
      let daysSubtracted = 0;
      while (daysSubtracted < 5) {
        fiveBusinessDaysBefore.setDate(fiveBusinessDaysBefore.getDate() - 1);
        const day = fiveBusinessDaysBefore.getDay();
        if (day !== 0 && day !== 6) {
          daysSubtracted++;
        }
      }
      if (currentDate > fiveBusinessDaysBefore) {
        return setError('Leave must be applied at least 5 business days before the start date.') || false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!user?.employeeId || !user?.token) {
      Alert.alert('Error', 'User authentication data is missing');
      router.push('/login');
      return;
    }

    if (!validateForm()) {
      Alert.alert('Error', error);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const leaveRequest = {
        employeeId: user.employeeId,
        leaveType,
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
        reason,
        status: 'pending',
      };

      const response = await fetch(`${API_URL}/api/leave/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(leaveRequest),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to submit leave request');
      }

      Alert.alert('Success', 'Leave request submitted successfully');
      setLeaveType('');
      setFromDate(null);
      setToDate(null);
      setReason('');
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#002343", "#002343", "#4c87ba", "#002343"]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.gradientBackground}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView contentContainerStyle={styles.container}>
            <Animatable.View animation="fadeInUp" duration={1000} style={styles.form}>
              <Text style={styles.heading}>Leave Application</Text>

              <Text style={styles.label}>Leave Type</Text>
              {leaveType ? (
                <Text style={styles.selectedLeaveType}>
                  Selected: {leaveType.charAt(0).toUpperCase() + leaveType.slice(1)}
                </Text>
              ) : null}
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={leaveType}
                  onValueChange={(value) => {
                    setLeaveType(value);
                    setError(null);
                  }}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item label="Select Leave Type" value="" style={styles.placeholderItem} />
                  <Picker.Item label="Casual" value="casual" />
                  <Picker.Item label="Sick" value="sick" />
                  <Picker.Item label="Emergency" value="emergency" />
                </Picker>
              </View>

              <Text style={styles.label}>From Date</Text>
              <TouchableOpacity onPress={() => setShowFromCalendar(!showFromCalendar)} style={styles.dateInput}>
                <Text>{formatDate(fromDate)}</Text>
              </TouchableOpacity>
              {showFromCalendar && (
                <Calendar
                  onDayPress={(day) => {
                    setFromDate(day.dateString);
                    setShowFromCalendar(false);
                    setError(null);
                  }}
                  markedDates={{
                    [fromDate]: {
                      selected: true,
                      selectedColor: '#1890ff'
                    }
                  }}
                  minDate={new Date().toISOString().split('T')[0]}
                />
              )}

              <Text style={styles.label}>To Date</Text>
              <TouchableOpacity onPress={() => setShowToCalendar(!showToCalendar)} style={styles.dateInput}>
                <Text>{formatDate(toDate)}</Text>
              </TouchableOpacity>
              {showToCalendar && (
                <Calendar
                  onDayPress={(day) => {
                    setToDate(day.dateString);
                    setShowToCalendar(false);
                    setError(null);
                  }}
                  markedDates={{
                    [toDate]: {
                      selected: true,
                      selectedColor: '#1890ff'
                    }
                  }}
                  minDate={fromDate || new Date().toISOString().split('T')[0]}
                />
              )}

              <Text style={styles.label}>Reason</Text>
              <TextInput
                style={styles.textInput}
                value={reason}
                onChangeText={(text) => {
                  setReason(text);
                  setError(null);
                }}
                multiline
                placeholder="Enter reason for leave"
              />

              {error && <Text style={styles.error}>{error}</Text>}

              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.submitButton, loading && styles.disabledButton]}
                disabled={loading}
              >
                <Text style={styles.submitText}>{loading ? 'Submitting...' : 'Submit Leave'}</Text>
              </TouchableOpacity>
            </Animatable.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardAvoidingView: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  form: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 8 },
      android: { elevation: 6 },
    }),
  },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#002444', textAlign: 'center', marginBottom: 20 },
  label: { marginBottom: 5, fontWeight: '600' },
  pickerContainer: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10, marginBottom: 15, backgroundColor: '#fff',
  },
  picker: { height: 50, width: '100%', color: '#000' },
  pickerItem: { fontSize: 16, color: '#000' },
  placeholderItem: { color: '#999', fontSize: 16 },
  selectedLeaveType: { fontSize: 14, color: '#1890ff', marginBottom: 5 },
  dateInput: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 10, marginBottom: 15,
  },
  textInput: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 10, marginBottom: 15,
    textAlignVertical: 'top', height: 80,
  },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  submitButton: {
    backgroundColor: '#1890ff', paddingVertical: 12, borderRadius: 10, alignItems: 'center',
  },
  disabledButton: { backgroundColor: '#cccccc' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default LeaveApplication;
