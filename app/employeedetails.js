// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Table, Row } from 'react-native-table-component';
// import * as Animatable from 'react-native-animatable';
// import { useUser } from '../contexts/UserContext';
// import { router } from 'expo-router';
// import { Feather } from '@expo/vector-icons';
// import Profile from './profile';
// import ipfront from '../constants/ipadd';
// import { LinearGradient } from 'expo-linear-gradient';
// const API_URL = ipfront;

// const EmployeeDetails = () => {
//   const { user, setUser } = useUser();
//   const [profileVisible, setProfileVisible] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
//   const [currentDate] = useState(new Date());
//   const [employeeData, setEmployeeData] = useState([]);
//   const [weeklyHours, setWeeklyHours] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { height } = Dimensions.get('window');

//   // Updated tableHead to include Email
//   const tableHead = ['#', 'Employee ID', 'Name', 'Email', 'Department', 'Role', 'Weekly Hours'];
//   const columnWidths = [50, 120, 170, 200, 120, 120, 120]; // Adjusted widths for new column

//   useEffect(() => {
//     if (!user || !user.token) {
//       console.log('EmployeeDetails.js - User not authenticated, redirecting to login');
//       router.push('/login');
//       return;
//     }
//     if (user.roleType !== 'Manager') {
//       console.log('EmployeeDetails.js - User is not a manager, redirecting to login');
//       router.push('/login');
//     }
//   }, [user]);

//   const calculateSeconds = (checkInTime, checkOutTime) => {
//     if (!checkInTime || !checkOutTime || checkInTime === 'N/A' || checkOutTime === 'N/A') {
//       console.log('EmployeeDetails.js - Invalid time values:', { checkInTime, checkOutTime });
//       return 0;
//     }

//     const timeRegex = /(\d+):(\d+)(?::(\d+))?\s([AP]M)/;
//     const checkInMatch = checkInTime.match(timeRegex);
//     const checkOutMatch = checkOutTime.match(timeRegex);

//     if (!checkInMatch || !checkOutMatch) {
//       console.log('EmployeeDetails.js - Invalid time format:', { checkInTime, checkOutTime });
//       return 0;
//     }

//     let checkInHours = parseInt(checkInMatch[1]);
//     let checkInMinutes = parseInt(checkInMatch[2]);
//     let checkInSeconds = checkInMatch[3] ? parseInt(checkInMatch[3]) : 0;
//     const checkInPeriod = checkInMatch[4];

//     let checkOutHours = parseInt(checkOutMatch[1]);
//     let checkOutMinutes = parseInt(checkOutMatch[2]);
//     let checkOutSeconds = checkOutMatch[3] ? parseInt(checkOutMatch[3]) : 0;
//     const checkOutPeriod = checkOutMatch[4];

//     if (checkInPeriod === 'PM' && checkInHours !== 12) checkInHours += 12;
//     if (checkInPeriod === 'AM' && checkInHours === 12) checkInHours = 0;
//     if (checkOutPeriod === 'PM' && checkOutHours !== 12) checkOutHours += 12;
//     if (checkOutPeriod === 'AM' && checkOutHours === 12) checkOutHours = 0;

//     const checkInTotalSeconds = (checkInHours * 3600) + (checkInMinutes * 60) + checkInSeconds;
//     const checkOutTotalSeconds = (checkOutHours * 3600) + (checkOutMinutes * 60) + checkOutSeconds;

//     const secondsWorked = checkOutTotalSeconds - checkInTotalSeconds;
//     return secondsWorked > 0 ? secondsWorked : 0;
//   };

//   const formatTime = (seconds) => {
//     if (seconds >= 3600) {
//       const hours = seconds / 3600;
//       return `${hours.toFixed(2)} hrs`;
//     } else if (seconds >= 60) {
//       const minutes = seconds / 60;
//       return `${minutes.toFixed(2)} min`;
//     } else {
//       return `${seconds.toFixed(2)} sec`;
//     }
//   };

//   const getTargetDisplay = (seconds) => {
//     const targetHours = 45;
//     if (seconds >= 3600) {
//       return `/45 hrs`;
//     } else if (seconds >= 60) {
//       const targetMinutes = targetHours * 60;
//       return `/${targetMinutes} min`;
//     } else {
//       const targetSeconds = targetHours * 3600;
//       return `/${targetSeconds} sec`;
//     }
//   };

//   const getRowBackgroundColor = (seconds) => {
//     const hours = seconds / 3600;
//     if (hours >= 35 && hours <= 45) return '#90ee90';
//     if (hours >= 25 && hours < 35) return '#ffff99';
//     if (hours < 25) return '#ff6347';
//     return '#fff';
//   };

//   useEffect(() => {
//     const fetchAssignedEmployeesAndHours = async () => {
//       if (!user || !user.token || user.roleType !== 'Manager') return;

//       try {
//         setLoading(true);
//         setError(null);

//         const employeesResponse = await fetch(`${API_URL}/api/manager/employees`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });

//         const contentType = employeesResponse.headers.get('content-type');
//         if (!contentType || !contentType.includes('application/json')) {
//           const text = await employeesResponse.text();
//           console.error('EmployeeDetails.js - Non-JSON response (employees):', text.slice(0, 100));
//           throw new Error(`Expected JSON, received ${contentType || 'unknown content type'}`);
//         }

//         const employeesData = await employeesResponse.json();
//         if (!employeesResponse.ok) {
//           throw new Error(employeesData.message || 'Failed to fetch employees');
//         }

//         const attendanceResponse = await fetch(`${API_URL}/api/manager/attendance`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });

//         const attendanceContentType = attendanceResponse.headers.get('content-type');
//         if (!attendanceContentType || !attendanceContentType.includes('application/json')) {
//           const text = await attendanceResponse.text();
//           console.error('EmployeeDetails.js - Non-JSON response (attendance):', text.slice(0, 100));
//           throw new Error(`Expected JSON, received ${attendanceContentType || 'unknown content type'}`);
//         }

//         const attendanceData = await attendanceResponse.json();
//         if (!attendanceResponse.ok) {
//           throw new Error(attendanceData.message || 'Failed to fetch attendance data');
//         }

//         const uniqueAttendanceMap = new Map();
//         attendanceData.attendance.forEach(record => {
//           const { employeeId, date, checkInTime } = record;
//           const key = `${employeeId}-${date}`;

//           if (!uniqueAttendanceMap.has(key)) {
//             uniqueAttendanceMap.set(key, record);
//           } else {
//             const existingRecord = uniqueAttendanceMap.get(key);
//             const existingCheckIn = existingRecord.checkInTime;
//             const newCheckIn = checkInTime;

//             if (existingCheckIn !== 'N/A' && newCheckIn !== 'N/A') {
//               const existingTime = new Date(`1970-01-01 ${existingCheckIn}`);
//               const newTime = new Date(`1970-01-01 ${newCheckIn}`);
//               if (newTime > existingTime) {
//                 uniqueAttendanceMap.set(key, record);
//               }
//             } else if (newCheckIn !== 'N/A') {
//               uniqueAttendanceMap.set(key, record);
//             }
//           }
//         });

//         const uniqueAttendance = Array.from(uniqueAttendanceMap.values());

//         const secondsByEmployee = {};
//         uniqueAttendance.forEach(record => {
//           const { employeeId, checkInTime, checkOutTime } = record;
//           console.log('EmployeeDetails.js - Processing attendance:', { employeeId, checkInTime, checkOutTime });

//           if (!secondsByEmployee[employeeId]) {
//             secondsByEmployee[employeeId] = 0;
//           }
//           const seconds = calculateSeconds(checkInTime, checkOutTime);
//           secondsByEmployee[employeeId] += seconds;
//         });

//         setWeeklyHours(secondsByEmployee);
//         console.log('EmployeeDetails.js - Weekly hours (seconds):', secondsByEmployee);

//         const employees = employeesData.employees || [];
//         const formattedData = employees.map((emp, index) => {
//           const rowData = {
//             data: [
//               (index + 1).toString(),
//               emp.employeeId || 'N/A',
//               emp.name || 'N/A',
//               emp.email || 'N/A', // Added email field
//               emp.department || 'N/A',
//               emp.role || 'N/A',
//               secondsByEmployee[emp.employeeId]
//                 ? `${formatTime(secondsByEmployee[emp.employeeId])}${getTargetDisplay(secondsByEmployee[emp.employeeId])}`
//                 : '0 sec/162000 sec',
//             ],
//             employeeId: emp.employeeId,
//           };
//           console.log('EmployeeDetails.js - Formatted row:', rowData);
//           return rowData;
//         });
//         setEmployeeData(formattedData);
//         console.log('EmployeeDetails.js - Fetched employees:', formattedData);
//       } catch (error) {
//         console.error('EmployeeDetails.js - Fetch error:', error.message);
//         setError('Unable to connect to the server');
//         if (error.message.includes('Token')) {
//           console.log('EmployeeDetails.js - Token expired, redirecting to login');
//           setUser(null);
//           router.push('/login');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user && user.token) {
//       fetchAssignedEmployeesAndHours();
//     }
//   }, [user, setUser, currentDate]);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const toggleProfile = () => {
//     setProfileVisible(!profileVisible);
//   };

//   const handleLogout = () => {
//     setProfileVisible(false);
//     setUser(null);
//     router.push('/login');
//   };

//   if (!user || !user.token || user.roleType !== 'Manager') {
//     return null;
//   }

//   return (
//          <LinearGradient
//           colors={["#002343", "#002343", "#4c87ba", "#002343"]}
//           start={{ x: 0.1, y: 0 }}
//           end={{ x: 0.9, y: 1 }}
//           style={styles.gradientBackground}
//         >
//     <SafeAreaView style={styles.container}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={toggleProfile} style={styles.menuButton}>
//             <Feather name="menu" size={24} color="#666" />
//           </TouchableOpacity>
//           <View style={styles.headerCenter}>
//             <ImageBackground
//               style={{
//                 height: height / 4,
//                 width: 200,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}
//               resizeMode="contain"
//               source={require('../assets/images/logo.png')}
//             />
//             <Text style={styles.headerSubLogo}>IIPMS</Text>
//           </View>
//           <View style={styles.headerRight}>
//             <Text style={styles.time}>{currentTime}</Text>
//           </View>
//         </View>

//         <View style={styles.navTabs}>
//           <TouchableOpacity style={[styles.tab, styles.activeTab]} onPress={() => router.push('/managerdashboard')}>
//             <Text style={[styles.tabText, styles.activeTabText]}>Home</Text>
//           </TouchableOpacity>
//         </View>

//         <Animatable.View animation="fadeIn" style={styles.header}>
//           <Text style={styles.headerText}>Employee Details</Text>
//         </Animatable.View>
//         <View style={styles.tableContainer}>
//           <View style={styles.headerActions}>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search"
//               placeholderTextColor="#999"
//             />
//           </View>

//           <ScrollView horizontal>
//             <View style={styles.tableWrapper}>
//               <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd' }}>
//                 <Row
//                   data={tableHead}
//                   style={styles.tableHead}
//                   textStyle={styles.tableHeadText}
//                   widthArr={columnWidths}
//                   flexArr={Array(tableHead.length).fill(1)}
//                 />
//                 {loading ? (
//                   <Row
//                     data={[<Text style={styles.noDataText}>Loading...</Text>]}
//                     style={styles.tableRow}
//                     textStyle={styles.tableText}
//                     widthArr={[750]} // Adjusted for new column
//                   />
//                 ) : error ? (
//                   <Row
//                     data={[<Text style={styles.noDataText}>{error}</Text>]}
//                     style={styles.tableRow}
//                     textStyle={styles.tableText}
//                     widthArr={[750]}
//                   />
//                 ) : employeeData.length > 0 ? (
//                   employeeData.map((row, rowIndex) => (
//                     <Row
//                       key={rowIndex}
//                       data={row.data.map((cell, cellIndex) => (
//                         <View style={[styles.cell, rowIndex % 2 === 0 && styles.altRow]}>
//                           <Text style={styles.tableText}>{cell}</Text>
//                         </View>
//                       ))}
//                       style={[styles.tableRow, { backgroundColor: getRowBackgroundColor(weeklyHours[row.employeeId] || 0) }]}
//                       textStyle={styles.tableText}
//                       widthArr={columnWidths}
//                       flexArr={Array(tableHead.length).fill(1)}
//                     />
//                   ))
//                 ) : (
//                   <Row
//                     data={[<Text style={styles.noDataText}>No employees assigned</Text>]}
//                     style={styles.tableRow}
//                     textStyle={styles.tableText}
//                     widthArr={[750]}
//                   />
//                 )}
//               </Table>
//             </View>
//           </ScrollView>

//           <Text style={styles.footerText}>
//             Showing {employeeData.length} to {employeeData.length} of {employeeData.length} rows
//           </Text>
//         </View>

//         <Profile
//           visible={profileVisible}
//           onClose={toggleProfile}
//           onLogout={handleLogout}
//         />
//       </View>
//     </SafeAreaView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradientBackground: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
    
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     // backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   menuButton: {
//     position: 'absolute',
//     left: 10,
//   },
//   headerCenter: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   headerSubLogo: {
//     fontSize: 30,
//     color: '#ff0000',
//     fontWeight: 'bold',
//     fontStyle: 'italic',
//     marginTop: 5,
//   },
//   headerRight: {
//     position: 'absolute',
//     right: 10,
//     backgroundColor: '#003087',
//     padding: 5,
//     borderRadius: 5,
//   },
//   time: {
//     fontSize: 12,
//     color: '#fff',
//   },
//   navTabs: {
//     flexDirection: 'row',
//     backgroundColor: '#003087',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     justifyContent: 'space-around',
//   },
//   tab: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     backgroundColor: '#003087',
//   },
//   activeTab: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   tabText: {
//     fontSize: 14,
//     color: '#fff',
//     fontWeight: '600',
//   },
//   activeTabText: {
//     color: '#003087',
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//   },
//   tableContainer: {
//     flex: 1,
//     padding: 15,
//   },
//   headerActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginBottom: 10,
//   },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     padding: 8,
//     width: 150,
//     fontSize: 14,
//     color: '#333',
//     backgroundColor: '#fff',
//   },
//   tableWrapper: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   tableHead: {
//     backgroundColor: '#003087',
//   },
//   tableHeadText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     padding: 8,
//     color: '#fff',
//   },
//   tableRow: {
//     backgroundColor: '#fff',
//   },
//   altRow: {
//     backgroundColor: '#f9f9f9',
//   },
//   tableText: {
//     fontSize: 12,
//     textAlign: 'center',
//     padding: 8,
//     color: '#333',
//   },
//   cell: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 5,
//   },
//   noDataText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     padding: 20,
//   },
//   footerText: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 10,
//   },
// });

// export default EmployeeDetails;



// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Table, Row } from 'react-native-table-component';
// import * as Animatable from 'react-native-animatable';
// import { useUser } from '../contexts/UserContext';
// import { router } from 'expo-router';
// import { Feather } from '@expo/vector-icons';
// import Profile from './profile';
// import ipfront from '../constants/ipadd';
// import { LinearGradient } from 'expo-linear-gradient';

// const API_URL = ipfront;

// const EmployeeDetails = () => {
//   const { user, setUser } = useUser();
//   const [profileVisible, setProfileVisible] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
//   const [currentDate] = useState(new Date());
//   const [employeeData, setEmployeeData] = useState([]);
//   const [weeklyHours, setWeeklyHours] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 5;
//   const { height } = Dimensions.get('window');

//   const tableHead = ['#', 'Employee ID', 'Name', 'Email', 'Department', 'Role', 'Weekly Hours'];
//   const columnWidths = [50, 120, 170, 200, 120, 120, 120];

//   useEffect(() => {
//     if (!user || !user.token) {
//       router.push('/login');
//       return;
//     }
//     if (user.roleType !== 'Manager') {
//       router.push('/login');
//     }
//   }, [user]);

//   const calculateSeconds = (checkInTime, checkOutTime) => {
//     if (!checkInTime || !checkOutTime || checkInTime === 'N/A' || checkOutTime === 'N/A') return 0;
//     const timeRegex = /(\d+):(\d+)(?::(\d+))?\s([AP]M)/;
//     const checkInMatch = checkInTime.match(timeRegex);
//     const checkOutMatch = checkOutTime.match(timeRegex);
//     if (!checkInMatch || !checkOutMatch) return 0;

//     let [checkInHours, checkInMinutes, checkInSeconds = 0] = [parseInt(checkInMatch[1]), parseInt(checkInMatch[2]), parseInt(checkInMatch[3]) || 0];
//     let [checkOutHours, checkOutMinutes, checkOutSeconds = 0] = [parseInt(checkOutMatch[1]), parseInt(checkOutMatch[2]), parseInt(checkOutMatch[3]) || 0];

//     if (checkInMatch[4] === 'PM' && checkInHours !== 12) checkInHours += 12;
//     if (checkInMatch[4] === 'AM' && checkInHours === 12) checkInHours = 0;
//     if (checkOutMatch[4] === 'PM' && checkOutHours !== 12) checkOutHours += 12;
//     if (checkOutMatch[4] === 'AM' && checkOutHours === 12) checkOutHours = 0;

//     const checkInTotalSeconds = checkInHours * 3600 + checkInMinutes * 60 + checkInSeconds;
//     const checkOutTotalSeconds = checkOutHours * 3600 + checkOutMinutes * 60 + checkOutSeconds;

//     return Math.max(0, checkOutTotalSeconds - checkInTotalSeconds);
//   };

//   const formatTime = (seconds) => {
//     if (seconds >= 3600) return `${(seconds / 3600).toFixed(2)} hrs`;
//     if (seconds >= 60) return `${(seconds / 60).toFixed(2)} min`;
//     return `${seconds.toFixed(2)} sec`;
//   };

//   const getTargetDisplay = (seconds) => {
//     const target = 45;
//     return seconds >= 3600
//       ? `/45 hrs`
//       : seconds >= 60
//       ? `/${target * 60} min`
//       : `/${target * 3600} sec`;
//   };

//   const getRowBackgroundColor = (seconds) => {
//     const hours = seconds / 3600;
//     if (hours >= 35 && hours <= 45) return '#90ee90';
//     if (hours >= 25 && hours < 35) return '#ffff99';
//     if (hours < 25) return '#ff6347';
//     return '#fff';
//   };

//   useEffect(() => {
//     const fetchAssignedEmployeesAndHours = async () => {
//       if (!user || !user.token || user.roleType !== 'Manager') return;

//       try {
//         setLoading(true);
//         setError(null);

//         const employeesResponse = await fetch(`${API_URL}/api/manager/employees`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });

//         const employeesData = await employeesResponse.json();
//         if (!employeesResponse.ok) throw new Error(employeesData.message || 'Failed to fetch employees');

//         const attendanceResponse = await fetch(`${API_URL}/api/manager/attendance`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });

//         const attendanceData = await attendanceResponse.json();
//         if (!attendanceResponse.ok) throw new Error(attendanceData.message || 'Failed to fetch attendance data');

//         const uniqueAttendanceMap = new Map();
//         attendanceData.attendance.forEach(record => {
//           const key = `${record.employeeId}-${record.date}`;
//           const existing = uniqueAttendanceMap.get(key);
//           if (!existing || (record.checkInTime !== 'N/A' && record.checkInTime > existing.checkInTime)) {
//             uniqueAttendanceMap.set(key, record);
//           }
//         });

//         const uniqueAttendance = Array.from(uniqueAttendanceMap.values());
//         const secondsByEmployee = {};

//         uniqueAttendance.forEach(({ employeeId, checkInTime, checkOutTime }) => {
//           secondsByEmployee[employeeId] = (secondsByEmployee[employeeId] || 0) + calculateSeconds(checkInTime, checkOutTime);
//         });

//         setWeeklyHours(secondsByEmployee);

//         const formattedData = (employeesData.employees || []).map((emp, index) => ({
//           data: [
//             (index + 1).toString(),
//             emp.employeeId || 'N/A',
//             emp.name || 'N/A',
//             emp.email || 'N/A',
//             emp.department || 'N/A',
//             emp.role || 'N/A',
//             secondsByEmployee[emp.employeeId]
//               ? `${formatTime(secondsByEmployee[emp.employeeId])}${getTargetDisplay(secondsByEmployee[emp.employeeId])}`
//               : '0 sec/162000 sec',
//           ],
//           employeeId: emp.employeeId,
//         }));

//         setEmployeeData(formattedData);
//       } catch (err) {
//         setError('Unable to connect to the server');
//         if (err.message.includes('Token')) {
//           setUser(null);
//           router.push('/login');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignedEmployeesAndHours();
//   }, [user, setUser, currentDate]);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const toggleProfile = () => setProfileVisible(!profileVisible);
//   const handleLogout = () => {
//     setProfileVisible(false);
//     setUser(null);
//     router.push('/login');
//   };

//   if (!user || !user.token || user.roleType !== 'Manager') return null;

//   const filteredData = employeeData.filter(row =>
//     row.data[2].toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

//   return (
//     <LinearGradient
//       colors={["#002343", "#002343", "#4c87ba", "#002343"]}
//       start={{ x: 0.1, y: 0 }}
//       end={{ x: 0.9, y: 1 }}
//       style={styles.gradientBackground}
//     >
//       <SafeAreaView style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={toggleProfile} style={styles.menuButton}>
//             <Feather name="menu" size={24} color="#666" />
//           </TouchableOpacity>
//           <View style={styles.headerCenter}>
//             <ImageBackground
//               style={{ height: height / 4, width: 200, justifyContent: 'center', alignItems: 'center' }}
//               resizeMode="contain"
//               source={require('../assets/images/logo.png')}
//             />
//             <Text style={styles.headerSubLogo}>IIPMS</Text>
//           </View>
//           <View style={styles.headerRight}>
//             <Text style={styles.time}>{currentTime}</Text>
//           </View>
//         </View>

//         <View style={styles.navTabs}>
//           <TouchableOpacity style={[styles.tab, styles.activeTab]} onPress={() => router.push('/managerdashboard')}>
//             <Text style={[styles.tabText, styles.activeTabText]}>Home</Text>
//           </TouchableOpacity>
//         </View>

//         <Animatable.View animation="fadeIn" style={styles.header}>
//           <Text style={styles.headerText}>Employee Details</Text>
//         </Animatable.View>

//         <View style={styles.tableContainer}>
//           <View style={styles.headerActions}>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search by name"
//               placeholderTextColor="#999"
//               value={searchQuery}
//               onChangeText={(text) => {
//                 setSearchQuery(text);
//                 setCurrentPage(1);
//               }}
//             />
//           </View>

//           <ScrollView horizontal>
//             <View style={styles.tableWrapper}>
//               <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd' }}>
//                 <Row
//                   data={tableHead}
//                   style={styles.tableHead}
//                   textStyle={styles.tableHeadText}
//                   widthArr={columnWidths}
//                 />
//                 {loading ? (
//                   <Row data={[<Text style={styles.noDataText}>Loading...</Text>]} widthArr={[750]} />
//                 ) : error ? (
//                   <Row data={[<Text style={styles.noDataText}>{error}</Text>]} widthArr={[750]} />
//                 ) : paginatedData.length > 0 ? (
//                   paginatedData.map((row, index) => (
//                     <Row
//                       key={index}
//                       data={row.data.map(cell => <View style={styles.cell}><Text style={styles.tableText}>{cell}</Text></View>)}
//                       style={[styles.tableRow, { backgroundColor: getRowBackgroundColor(weeklyHours[row.employeeId] || 0) }]}
//                       widthArr={columnWidths}
//                     />
//                   ))
//                 ) : (
//                   <Row data={[<Text style={styles.noDataText}>No employees found</Text>]} widthArr={[750]} />
//                 )}
//               </Table>
//             </View>
//           </ScrollView>

//           <View style={styles.paginationContainer}>
//             <TouchableOpacity
//               onPress={() => setCurrentPage(currentPage - 1)}
//               disabled={currentPage === 1}
//               style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
//             >
//               <Text style={styles.paginationText}>Previous</Text>
//             </TouchableOpacity>

//             <Text style={styles.pageIndicator}>Page {currentPage} of {Math.ceil(filteredData.length / rowsPerPage)}</Text>

//             <TouchableOpacity
//               onPress={() => setCurrentPage(currentPage + 1)}
//               disabled={currentPage * rowsPerPage >= filteredData.length}
//               style={[
//                 styles.paginationButton,
//                 currentPage * rowsPerPage >= filteredData.length && styles.disabledButton
//               ]}
//             >
//               <Text style={styles.paginationText}>Next</Text>
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.footerText}>
//             Showing {filteredData.length === 0 ? 0 : ((currentPage - 1) * rowsPerPage + 1)} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
//           </Text>
//         </View>

//         <Profile visible={profileVisible} onClose={toggleProfile} onLogout={handleLogout} />
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };





import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  ImageBackground, Dimensions, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row } from 'react-native-table-component';
import * as Animatable from 'react-native-animatable';
import { useUser } from '../contexts/UserContext';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Profile from './profile';
import ipfront from '../constants/ipadd';
import { LinearGradient } from 'expo-linear-gradient';

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const API_URL = ipfront;

const EmployeeDetails = () => {
  const { user, setUser } = useUser();
  const [profileVisible, setProfileVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const [currentDate] = useState(new Date());
  const [employeeData, setEmployeeData] = useState([]);
  const [weeklyHours, setWeeklyHours] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;
  const { height } = Dimensions.get('window');

  const tableHead = ['#', 'Employee ID', 'Name', 'Email', 'Department', 'Role', 'Weekly Hours'];
  const columnWidths = [50, 120, 170, 200, 120, 120, 120];

  useEffect(() => {
    if (!user || !user.token || user.roleType !== 'Manager') {
      router.push('/login');
    }
  }, [user]);

  const calculateSeconds = (checkInTime, checkOutTime) => {
    if (!checkInTime || !checkOutTime || checkInTime === 'N/A' || checkOutTime === 'N/A') return 0;
    const timeRegex = /(\d+):(\d+)(?::(\d+))?\s([AP]M)/;
    const checkInMatch = checkInTime.match(timeRegex);
    const checkOutMatch = checkOutTime.match(timeRegex);
    if (!checkInMatch || !checkOutMatch) return 0;

    let [checkInHours, checkInMinutes, checkInSeconds = 0] = [parseInt(checkInMatch[1]), parseInt(checkInMatch[2]), parseInt(checkInMatch[3]) || 0];
    let [checkOutHours, checkOutMinutes, checkOutSeconds = 0] = [parseInt(checkOutMatch[1]), parseInt(checkOutMatch[2]), parseInt(checkOutMatch[3]) || 0];

    if (checkInMatch[4] === 'PM' && checkInHours !== 12) checkInHours += 12;
    if (checkInMatch[4] === 'AM' && checkInHours === 12) checkInHours = 0;
    if (checkOutMatch[4] === 'PM' && checkOutHours !== 12) checkOutHours += 12;
    if (checkOutMatch[4] === 'AM' && checkOutHours === 12) checkOutHours = 0;

    const checkInTotalSeconds = checkInHours * 3600 + checkInMinutes * 60 + checkInSeconds;
    const checkOutTotalSeconds = checkOutHours * 3600 + checkOutMinutes * 60 + checkOutSeconds;

    return Math.max(0, checkOutTotalSeconds - checkInTotalSeconds);
  };

  const formatTime = (seconds) => {
    if (seconds >= 3600) return `${(seconds / 3600).toFixed(2)} hrs`;
    if (seconds >= 60) return `${(seconds / 60).toFixed(2)} min`;
    return `${seconds.toFixed(2)} sec`;
  };

  const getTargetDisplay = (seconds) => {
    const target = 45;
    return seconds >= 3600
      ? `/45 hrs`
      : seconds >= 60
      ? `/${target * 60} min`
      : `/${target * 3600} sec`;
  };

  const getRowBackgroundColor = (seconds) => {
    const hours = seconds / 3600;
    if (hours >= 35 && hours <= 45) return '#90ee90';
    if (hours >= 25 && hours < 35) return '#ffff99';
    if (hours < 25) return '#ff6347';
    return '#fff';
  };

  useEffect(() => {
    const fetchAssignedEmployeesAndHours = async () => {
      if (!user || !user.token || user.roleType !== 'Manager') return;

      try {
        setLoading(true);
        setError(null);

        const employeesResponse = await fetch(`${API_URL}/api/manager/employees`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const employeesData = await employeesResponse.json();

        const attendanceResponse = await fetch(`${API_URL}/api/manager/attendance`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const attendanceData = await attendanceResponse.json();

        const uniqueAttendanceMap = new Map();
        attendanceData.attendance.forEach(record => {
          const key = `${record.employeeId}-${record.date}`;
          const existing = uniqueAttendanceMap.get(key);
          if (!existing || (record.checkInTime !== 'N/A' && record.checkInTime > existing.checkInTime)) {
            uniqueAttendanceMap.set(key, record);
          }
        });

        const uniqueAttendance = Array.from(uniqueAttendanceMap.values());
        const secondsByEmployee = {};
        uniqueAttendance.forEach(({ employeeId, checkInTime, checkOutTime }) => {
          secondsByEmployee[employeeId] = (secondsByEmployee[employeeId] || 0) + calculateSeconds(checkInTime, checkOutTime);
        });

        setWeeklyHours(secondsByEmployee);

        const formattedData = (employeesData.employees || []).map((emp, index) => ({
          data: [
            (index + 1).toString(),
            emp.employeeId || 'N/A',
            emp.name || 'N/A',
            emp.email || 'N/A',
            emp.department || 'N/A',
            emp.role || 'N/A',
            secondsByEmployee[emp.employeeId]
              ? `${formatTime(secondsByEmployee[emp.employeeId])}${getTargetDisplay(secondsByEmployee[emp.employeeId])}`
              : '0 sec/162000 sec',
          ],
          employeeId: emp.employeeId,
        }));

        setEmployeeData(formattedData);
      } catch (err) {
        setError('Unable to connect to the server');
        if (err.message.includes('Token')) {
          setUser(null);
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedEmployeesAndHours();
  }, [user, setUser, currentDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleProfile = () => setProfileVisible(!profileVisible);
  const handleLogout = () => {
    setProfileVisible(false);
    setUser(null);
    router.push('/login');
  };

  const filteredData = employeeData.filter(row =>
    row.data[2].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const exportToExcel = async () => {
    try {
      const dataToExport = employeeData.map(row => ({
        '#': row.data[0],
        'Employee ID': row.data[1],
        'Name': row.data[2],
        'Email': row.data[3],
        'Department': row.data[4],
        'Role': row.data[5],
        'Weekly Hours': row.data[6],
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

      const excelBuffer = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

      const fileUri = FileSystem.cacheDirectory + 'EmployeeData.xlsx';
      await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Export Employee Data',
        UTI: 'com.microsoft.excel.xlsx',
      });
    } catch (err) {
      console.error('Excel export error:', err);
      Alert.alert('Error', 'Failed to export Excel file');
    }
  };

  return (
    <LinearGradient colors={["#002343", "#002343", "#4c87ba", "#002343"]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.gradientBackground}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleProfile} style={styles.menuButton}>
            <Feather name="menu" size={24} color="#666" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <ImageBackground style={{ height: height / 4, width: 200 }} resizeMode="contain" source={require('../assets/images/logo.png')} />
            <Text style={styles.headerSubLogo}>IIPMS</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.time}>{currentTime}</Text>
          </View>
        </View>

        <View style={styles.navTabs}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]} onPress={() => router.push('/managerdashboard')}>
            <Text style={[styles.tabText, styles.activeTabText]}>Home</Text>
          </TouchableOpacity>
        </View>

        <Animatable.View animation="fadeIn" style={styles.header}>
          <Text style={styles.headerText}>Employee Details</Text>
        </Animatable.View>

        <View style={styles.tableContainer}>
          <View style={styles.headerActions}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setCurrentPage(1);
              }}
            />
            <TouchableOpacity style={styles.exportButton} onPress={exportToExcel}>
              <Text style={styles.exportButtonText}>Export to Excel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal>
            <View style={styles.tableWrapper}>
              <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd' }}>
                <Row data={tableHead} style={styles.tableHead} textStyle={styles.tableHeadText} widthArr={columnWidths} />
                {loading ? (
                  <Row data={[<Text style={styles.noDataText}>Loading...</Text>]} widthArr={[750]} />
                ) : error ? (
                  <Row data={[<Text style={styles.noDataText}>{error}</Text>]} widthArr={[750]} />
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => (
                    <Row
                      key={index}
                      data={row.data.map(cell => <View style={styles.cell}><Text style={styles.tableText}>{cell}</Text></View>)}
                      style={[styles.tableRow, { backgroundColor: getRowBackgroundColor(weeklyHours[row.employeeId] || 0) }]}
                      widthArr={columnWidths}
                    />
                  ))
                ) : (
                  <Row data={[<Text style={styles.noDataText}>No employees found</Text>]} widthArr={[750]} />
                )}
              </Table>
            </View>
          </ScrollView>

          <View style={styles.paginationContainer}>
            <TouchableOpacity
              onPress={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
            >
              <Text style={styles.paginationText}>Previous</Text>
            </TouchableOpacity>

            <Text style={styles.pageIndicator}>Page {currentPage} of {Math.ceil(filteredData.length / rowsPerPage)}</Text>

            <TouchableOpacity
              onPress={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * rowsPerPage >= filteredData.length}
              style={[
                styles.paginationButton,
                currentPage * rowsPerPage >= filteredData.length && styles.disabledButton
              ]}
            >
              <Text style={styles.paginationText}>Next</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            Showing {filteredData.length === 0 ? 0 : ((currentPage - 1) * rowsPerPage + 1)} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
          </Text>
        </View>

        <Profile visible={profileVisible} onClose={toggleProfile} onLogout={handleLogout} />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
    exportButton: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  paginationButton: {
    padding: 8,
    backgroundColor: '#003087',
    borderRadius: 5,
  },
  paginationText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  pageIndicator: {
    color: '#fff',
    fontSize: 12,
  },



    gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    // backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButton: {
    position: 'absolute',
    left: 10,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerSubLogo: {
    fontSize: 30,
    color: '#ff0000',
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginTop: 5,
  },
  headerRight: {
    position: 'absolute',
    right: 10,
    backgroundColor: '#003087',
    padding: 5,
    borderRadius: 5,
  },
  time: {
    fontSize: 12,
    color: '#fff',
  },
  navTabs: {
    flexDirection: 'row',
    backgroundColor: '#003087',
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#003087',
  },
  activeTab: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  tabText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#003087',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  tableContainer: {
    flex: 1,
    padding: 15,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    width: 150,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  tableWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHead: {
    backgroundColor: '#003087',
  },
  tableHeadText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
    color: '#fff',
  },
  tableRow: {
    backgroundColor: '#fff',
  },
  altRow: {
    backgroundColor: '#f9f9f9',
  },
  tableText: {
    fontSize: 12,
    textAlign: 'center',
    padding: 8,
    color: '#333',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
  },

});

export default EmployeeDetails;
