// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Picker } from '@react-native-picker/picker';
// import { Table, Row } from 'react-native-table-component';
// import { useUser } from '../contexts/UserContext';
// import { router } from 'expo-router';
// import ipfront from '../constants/ipadd';
// import { LinearGradient } from 'expo-linear-gradient';

// const API_URL = ipfront;

// const EmployeeSelector = ({ selectedEmployee }) => {
//   const { user } = useUser();
//   const [employeeData, setEmployeeData] = useState([]);
//   const [attendanceReportData, setAttendanceReportData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState(selectedEmployee);

//   const reportTableHead = ['#', 'Date', 'Check-In Time', 'Check-Out Time', 'Status'];
//   const reportColumnWidths = [50, 100, 120, 120, 100];

//   useEffect(() => {
//     if (!user?.token || user.roleType !== 'Manager') {
//       router.push('/login');
//       return;
//     }

//     const fetchAssignedEmployees = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${API_URL}/api/manager/employees`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });

//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || 'Failed to fetch employees');

//         const formattedData = (data.employees || []).map((emp, index) => ({
//           data: [
//             (index + 1).toString(),
//             emp.employeeId || 'N/A',
//             emp.name || 'N/A',
//             emp.department || 'N/A',
//             emp.role || 'N/A',
//           ],
//           employeeId: emp.employeeId,
//         }));
//         setEmployeeData(formattedData);
//       } catch (error) {
//         setError('Unable to fetch employees');
//         if (error.message.includes('Token')) router.push('/login');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignedEmployees();
//   }, [user]);

//   const fetchAttendanceReport = async (employeeId) => {
//     if (!employeeId) {
//       setAttendanceReportData([]);
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_URL}/api/manager/attendance`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || 'Failed to fetch attendance report');

//       const today = new Date().toISOString().split('T')[0];
//       const employeeAttendance = data.attendance.filter(
//         record => record.employeeId === employeeId && record.date !== today
//       );

//       const uniqueMap = new Map();
//       employeeAttendance.forEach(record => {
//         const key = `${record.employeeId}-${record.date}`;
//         if (!uniqueMap.has(key) || (record.checkInTime && !uniqueMap.get(key).checkInTime)) {
//           uniqueMap.set(key, record);
//         }
//       });

//       const uniqueAttendance = Array.from(uniqueMap.values());

//       const formattedReport = uniqueAttendance.map((record, index) => [
//         (index + 1).toString(),
//         record.date || 'N/A',
//         record.checkInTime || 'N/A',
//         record.checkOutTime || 'N/A',
//         record.status || 'N/A',
//       ]);
//       setAttendanceReportData(formattedReport);
//     } catch (error) {
//       setError('Failed to fetch attendance report');
//       setAttendanceReportData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEmployeeSelect = (value) => {
//     setSelectedEmployeeId(value);
//     fetchAttendanceReport(value);
//   };

//   return (
//     <LinearGradient       colors={["#002343", "#002343", "#4c87ba", "#002343"]}
//       start={{ x: 0.1, y: 0 }}
//       end={{ x: 0.9, y: 1 }}
//        style={styles.gradient}>
//       <SafeAreaView style={styles.container}>
//         <View style={styles.pickerContainer}>
//           <LinearGradient colors={['#4c87ba', '#5393ed']} style={styles.pickerGradient}>
//             {error ? (
//               <Text style={styles.errorText}>{error}</Text>
//             ) : loading ? (
//               <Text style={styles.loadingText}>Loading employees...</Text>
//             ) : (
//               <Picker
//                 selectedValue={selectedEmployeeId}
//                 onValueChange={handleEmployeeSelect}
//                 style={styles.picker}
//                 dropdownIconColor="#fff"
//               >
//                 <Picker.Item label="Select Employee for Report" value={null} />
//                 {employeeData.length > 0 ? (
//                   employeeData.map((emp, index) => (
//                     <Picker.Item
//                       key={index}
//                       label={`${emp.data[2]} (${emp.data[1]})`}
//                       value={emp.employeeId}
//                     />
//                   ))
//                 ) : (
//                   <Picker.Item label="No employees available" value={null} />
//                 )}
//               </Picker>
//             )}
//           </LinearGradient>
//         </View>

//         {selectedEmployeeId && (
//           <View style={styles.tableContainer}>
//             <Text style={styles.tableTitle}>Attendance Report (Previous Days)</Text>
//             <LinearGradient colors={['#dbe9f5', '#e6f1fb']} style={styles.tableWrapperGradient}>
//               <ScrollView>
//                 <ScrollView horizontal>
//                   <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd' }}>
//                     <Row
//                       data={reportTableHead}
//                       style={styles.tableHead}
//                       textStyle={styles.tableHeadText}
//                       widthArr={reportColumnWidths}
//                       flexArr={Array(reportTableHead.length).fill(1)}
//                     />
//                     {attendanceReportData.length > 0 ? (
//                       attendanceReportData.map((rowData, rowIndex) => (
//                         <Row
//                           key={rowIndex}
//                           data={rowData.map((cell) => (
//                             <View style={[styles.cell, rowIndex % 2 === 0 && styles.altRow]}>
//                               <Text style={styles.tableText}>{cell}</Text>
//                             </View>
//                           ))}
//                           style={styles.tableRow}
//                           textStyle={styles.tableText}
//                           widthArr={reportColumnWidths}
//                           flexArr={Array(reportTableHead.length).fill(1)}
//                         />
//                       ))
//                     ) : (
//                       <Row
//                         data={[<Text style={styles.noDataText}>No attendance data available</Text>]}
//                         style={styles.tableRow}
//                         textStyle={styles.tableText}
//                         widthArr={[490]}
//                       />
//                     )}
//                   </Table>
//                 </ScrollView>
//               </ScrollView>
//             </LinearGradient>
//           </View>
//         )}
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradient: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//   },
//   pickerContainer: {
//     width: '85%',
//     alignSelf: 'center',
//     marginVertical: 10,
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   pickerGradient: {
//     borderRadius: 10,
//     paddingHorizontal: 10,
//   },
//   picker: {
//     height: 50,
//     color: '#fff',
//     backgroundColor: 'transparent',
//   },
//   errorText: {
//     fontSize: 14,
//     color: '#FF6347',
//     textAlign: 'center',
//     padding: 10,
//   },
//   loadingText: {
//     fontSize: 14,
//     color: '#fff',
//     textAlign: 'center',
//     padding: 10,
//   },
//   tableContainer: {
//     marginTop: 10,
//     paddingHorizontal: 10,
//   },
//   tableTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   tableWrapperGradient: {
//     borderRadius: 8,
//     padding: 5,
//     maxHeight: 350,
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
// });

// export default EmployeeSelector;

// it works well

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Picker } from '@react-native-picker/picker';
// import { Table, Row } from 'react-native-table-component';
// import { useUser } from '../contexts/UserContext';
// import { router } from 'expo-router';
// import ipfront from '../constants/ipadd';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Calendar } from 'react-native-calendars';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
// import * as XLSX from 'xlsx';

// const API_URL = ipfront;

// const EmployeeSelector = ({ selectedEmployee }) => {
//   const { user } = useUser();
//   const [employeeData, setEmployeeData] = useState([]);
//   const [attendanceReportData, setAttendanceReportData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState(selectedEmployee);
//   const [dateRange, setDateRange] = useState({ start: null, end: null });
//   const [markedDates, setMarkedDates] = useState({});
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);

//   const reportTableHead = ['#', 'Date', 'Check-In Time', 'Check-Out Time', 'Status'];
//   const reportColumnWidths = [50, 100, 120, 120, 100];

//   useEffect(() => {
//     if (!user?.token || user.roleType !== 'Manager') {
//       router.push('/login');
//       return;
//     }

//     const fetchAssignedEmployees = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${API_URL}/api/manager/employees`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || 'Failed to fetch employees');

//         const formattedData = (data.employees || []).map((emp, index) => ({
//           data: [
//             (index + 1).toString(),
//             emp.employeeId || 'N/A',
//             emp.name || 'N/A',
//             emp.department || 'N/A',
//             emp.role || 'N/A',
//           ],
//           employeeId: emp.employeeId,
//         }));
//         setEmployeeData(formattedData);
//       } catch (error) {
//         setError('Unable to fetch employees');
//         if (error.message.includes('Token')) router.push('/login');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignedEmployees();
//   }, [user]);

//   const fetchAttendanceReport = async (employeeId, startDate, endDate) => {
//     if (!employeeId) {
//       setAttendanceReportData([]);
//       setMarkedDates({});
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_URL}/api/manager/attendance`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || 'Failed to fetch attendance report');

//       const today = new Date().toISOString().split('T')[0];
//       let employeeAttendance = data.attendance.filter(
//         record => record.employeeId === employeeId && record.date !== today
//       );

//       if (startDate && endDate) {
//         const start = new Date(startDate).toISOString().split('T')[0];
//         const end = new Date(endDate).toISOString().split('T')[0];
//         employeeAttendance = employeeAttendance.filter(record => {
//           const recordDate = new Date(record.date).toISOString().split('T')[0];
//           return recordDate >= start && recordDate <= end;
//         });
//       }

//       const uniqueMap = new Map();
//       employeeAttendance.forEach(record => {
//         const key = `${record.employeeId}-${record.date}`;
//         if (!uniqueMap.has(key) || (record.checkInTime && !uniqueMap.get(key).checkInTime)) {
//           uniqueMap.set(key, record);
//         }
//       });

//       const uniqueAttendance = Array.from(uniqueMap.values())
//         .sort((a, b) => new Date(b.date) - new Date(a.date))
//         .reverse();

//       const formattedReport = uniqueAttendance.map((record, index) => [
//         (index + 1).toString(),
//         record.date || 'N/A',
//         record.checkInTime || 'N/A',
//         record.checkOutTime || 'N/A',
//         record.status || 'N/A',
//       ]);

//       const marked = {};
//       uniqueAttendance.forEach(record => {
//         const recordDate = new Date(record.date).toISOString().split('T')[0];
//         marked[recordDate] = {
//           marked: true,
//           dotColor: record.status === 'Present' ? 'green' : record.status === 'Absent' ? 'red' : 'gray',
//         };
//       });

//       setAttendanceReportData(formattedReport);
//       setMarkedDates(marked);
//       setCurrentPage(1);
//     } catch (error) {
//       setError('Failed to fetch attendance report');
//       setAttendanceReportData([]);
//       setMarkedDates({});
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEmployeeSelect = (value) => {
//     setSelectedEmployeeId(value);
//     fetchAttendanceReport(value, dateRange.start, dateRange.end);
//   };

//   const handleDateSelect = (day) => {
//     const selectedDate = day.dateString;
//     if (!dateRange.start || (dateRange.start && dateRange.end)) {
//       setDateRange({ start: selectedDate, end: null });
//       setMarkedDates({ [selectedDate]: { selected: true, startingDay: true, color: '#4c87ba' } });
//     } else if (dateRange.start && !dateRange.end && selectedDate >= dateRange.start) {
//       setDateRange({ ...dateRange, end: selectedDate });
//       fetchAttendanceReport(selectedEmployeeId, dateRange.start, selectedDate);
//     }
//   };

//   const handleDownloadExcel = async () => {
//     if (!attendanceReportData.length) {
//       setError('No attendance data to export');
//       return;
//     }

//     try {
//       const ws = XLSX.utils.aoa_to_sheet([reportTableHead, ...attendanceReportData]);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');
//       const wbout = XLSX.write(wb, 'binary');
//       const fileName = `attendance_report_${selectedEmployeeId}_${new Date().toISOString().split('T')[0]}.xlsx`;
//       const fileUri = `${FileSystem.documentDirectory}${fileName}`;

//       await FileSystem.writeAsStringAsync(fileUri, wbout, {
//         encoding: FileSystem.EncodingType.Binary,
//       });

//       if (Platform.OS !== 'web') {
//         await Sharing.shareAsync(fileUri);
//       }
//     } catch (error) {
//       setError('Failed to generate or share Excel file');
//     }
//   };

//   const paginatedData = attendanceReportData.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   return (
//     <LinearGradient colors={["#002343", "#002343", "#4c87ba", "#002343"]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.gradient}>
//       <SafeAreaView style={styles.container}>
//         <ScrollView contentContainerStyle={styles.scrollContent}>

//           {/* Employee Picker */}
//           <View style={styles.pickerContainer}>
//             <LinearGradient colors={['#4c87ba', '#5393ed']} style={styles.pickerGradient}>
//               {error ? <Text style={styles.errorText}>{error}</Text> : loading ? <Text style={styles.loadingText}>Loading employees...</Text> : (
//                 <Picker selectedValue={selectedEmployeeId} onValueChange={handleEmployeeSelect} style={styles.picker} dropdownIconColor="#fff">
//                   <Picker.Item label="Select Employee for Report" value={null} />
//                   {employeeData.map((emp, index) => (
//                     <Picker.Item key={index} label={`${emp.data[2]} (${emp.data[1]})`} value={emp.employeeId} />
//                   ))}
//                 </Picker>
//               )}
//             </LinearGradient>
//           </View>

//           {/* Rows per page Picker */}
//           <View style={styles.pickerContainer}>
//             <LinearGradient colors={['#4c87ba', '#5393ed']} style={styles.pickerGradient}>
//               <Picker selectedValue={rowsPerPage} onValueChange={(value) => { setRowsPerPage(value); setCurrentPage(1); }} style={styles.picker} dropdownIconColor="#fff">
//                 <Picker.Item label="5 Rows" value={5} />
//                 <Picker.Item label="10 Rows" value={10} />
//                 <Picker.Item label="15 Rows" value={15} />
//               </Picker>
//             </LinearGradient>
//           </View>

//           {/* Calendar */}
//           {selectedEmployeeId && (
//             <View style={styles.calendarContainer}>
//               <Text style={styles.tableTitle}>Select Date Range</Text>
//               <LinearGradient colors={['#dbe9f5', '#e6f1fb']} style={styles.calendarGradient}>
//                 <Calendar
//                   onDayPress={handleDateSelect}
//                   markedDates={{
//                     ...markedDates,
//                     [dateRange.start]: { selected: true, startingDay: true, color: '#4c87ba' },
//                     [dateRange.end]: { selected: true, endingDay: true, color: '#4c87ba' },
//                   }}
//                   markingType={'period'}
//                   style={styles.calendar}
//                   theme={{
//                     backgroundColor: '#ffffff',
//                     calendarBackground: '#e6f1fb',
//                     textSectionTitleColor: '#003087',
//                     selectedDayBackgroundColor: '#4c87ba',
//                     selectedDayTextColor: '#ffffff',
//                     todayTextColor: '#003087',
//                     dayTextColor: '#000',
//                     dotColor: '#4c87ba',
//                     arrowColor: '#4c87ba',
//                     monthTextColor: '#003087',
//                     textMonthFontWeight: 'bold',
//                     textDayFontWeight: '500',
//                     textMonthFontSize: 16,
//                     textDayFontSize: 14,
//                     textDayHeaderFontSize: 12,
//                   }}
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           {/* Download Button */}
//           <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadExcel}>
//             <LinearGradient colors={['#4c87ba', '#5393ed']} style={styles.downloadButtonGradient}>
//               <Text style={styles.downloadButtonText}>Download Excel Report</Text>
//             </LinearGradient>
//           </TouchableOpacity>

//           {/* Attendance Table */}
//           <View style={styles.tableContainer}>
//             <Text style={styles.tableTitle}>Attendance Report (Previous Days)</Text>
//             <LinearGradient colors={['#dbe9f5', '#e6f1fb']} style={styles.tableWrapperGradient}>
//               <ScrollView horizontal>
//                 <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd' }}>
//                   <Row data={reportTableHead} style={styles.tableHead} textStyle={styles.tableHeadText} widthArr={reportColumnWidths} flexArr={Array(reportTableHead.length).fill(1)} />
//                   {paginatedData.length > 0 ? paginatedData.map((rowData, rowIndex) => (
//                     <Row key={rowIndex} data={rowData.map(cell => (<View style={[styles.cell, rowIndex % 2 === 0 && styles.altRow]}><Text style={styles.tableText}>{cell}</Text></View>))} style={styles.tableRow} textStyle={styles.tableText} widthArr={reportColumnWidths} flexArr={Array(reportTableHead.length).fill(1)} />
//                   )) : (
//                     <Row data={[<Text style={styles.noDataText}>No attendance data available</Text>]} style={styles.tableRow} textStyle={styles.tableText} widthArr={[490]} />
//                   )}
//                 </Table>
//               </ScrollView>
//               <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
//                 <TouchableOpacity onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
//                   <Text style={{ color: '#003087', marginHorizontal: 10 }}>Previous</Text>
//                 </TouchableOpacity>
//                 <Text style={{ color: '#003087' }}>{currentPage}</Text>
//                 <TouchableOpacity onPress={() => currentPage * rowsPerPage < attendanceReportData.length && setCurrentPage(currentPage + 1)}>
//                   <Text style={{ color: '#003087', marginHorizontal: 10 }}>Next</Text>
//                 </TouchableOpacity>
//               </View>
//             </LinearGradient>
//           </View>

//         </ScrollView>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//     calendarWrapper: {
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     marginBottom: 10,
//   },
//   calendar: {
//     borderRadius: 10,
//     width: 320,
//     height: 330,
//     elevation: 3,
//   },
//   paginationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: 10,
//   },
//   paginationText: {
//     color: '#fff',
//     fontSize: 14,
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   gradient: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 20,
//   },
//   pickerContainer: {
//     width: '85%',
//     alignSelf: 'center',
//     marginVertical: 10,
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   pickerGradient: {
//     borderRadius: 10,
//     paddingHorizontal: 10,
//   },
//   picker: {
//     height: 50,
//     color: '#fff',
//     backgroundColor: 'transparent',
//   },
//   errorText: {
//     fontSize: 14,
//     color: '#FF6347',
//     textAlign: 'center',
//     padding: 10,
//   },
//   loadingText: {
//     fontSize: 14,
//     color: '#fff',
//     textAlign: 'center',
//     padding: 10,
//   },
//   calendarContainer: {
//     marginTop: 10,
//     paddingHorizontal: 19,
//   },
//   calendarGradient: {
//     borderRadius: 8,
//     padding: 8,
//   },
//   calendar: {
//     borderRadius: 8,
//     width: 300,
//     height: 350,
//   },
//   downloadButton: {
//     width: '85%',
//     alignSelf: 'center',
//     marginVertical: 10,
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   downloadButtonGradient: {
//     padding: 15,
//     alignItems: 'center',
//   },
//   downloadButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   tableContainer: {
//     marginTop: 10,
//     paddingHorizontal: 10,
//   },
//   tableTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   tableWrapperGradient: {
//     borderRadius: 8,
//     padding: 5,
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
// });

// export default EmployeeSelector;



import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Table, Row } from 'react-native-table-component';
import { useUser } from '../contexts/UserContext';
import { router } from 'expo-router';
import ipfront from '../constants/ipadd';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

const API_URL = ipfront;

const EmployeeSelector = ({ selectedEmployee }) => {
  const { user } = useUser();
  const [employeeData, setEmployeeData] = useState([]);
  const [attendanceReportData, setAttendanceReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(selectedEmployee);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [markedDates, setMarkedDates] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const reportTableHead = ['#', 'Date', 'Check-In Time', 'Check-Out Time', 'Status'];
  const reportColumnWidths = [50, 100, 120, 120, 100];

  useEffect(() => {
    if (!user?.token || user.roleType !== 'Manager') {
      router.push('/login');
      return;
    }

    const fetchAssignedEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/manager/employees`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch employees');

        const formattedData = (data.employees || []).map((emp, index) => ({
          data: [
            (index + 1).toString(),
            emp.employeeId || 'N/A',
            emp.name || 'N/A',
            emp.department || 'N/A',
            emp.role || 'N/A',
          ],
          employeeId: emp.employeeId,
        }));
        setEmployeeData(formattedData);
      } catch (error) {
        setError('Unable to fetch employees');
        if (error.message.includes('Token')) router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedEmployees();
  }, [user]);

  const fetchAttendanceReport = async (employeeId, startDate, endDate) => {
    if (!employeeId) {
      setAttendanceReportData([]);
      setMarkedDates({});
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/manager/attendance`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch attendance report');

      let employeeAttendance = data.attendance.filter(
        record => record.employeeId === employeeId
      );

      if (startDate && endDate) {
        const start = new Date(startDate).toISOString().split('T')[0];
        const end = new Date(endDate).toISOString().split('T')[0];
        employeeAttendance = employeeAttendance.filter(record => {
          const recordDate = new Date(record.date).toISOString().split('T')[0];
          return recordDate >= start && recordDate <= end;
        });
      }

      const uniqueMap = new Map();
      employeeAttendance.forEach(record => {
        const key = `${record.employeeId}-${record.date}`;
        if (!uniqueMap.has(key) || (record.checkInTime && !uniqueMap.get(key).checkInTime)) {
          uniqueMap.set(key, record);
        }
      });

      const uniqueAttendance = Array.from(uniqueMap.values()).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      const formattedReport = uniqueAttendance.map((record, index) => [
        (index + 1).toString(),
        record.date || 'N/A',
        record.checkInTime || 'N/A',
        record.checkOutTime || 'N/A',
        record.status || 'N/A',
      ]);

      const marked = {};
      uniqueAttendance.forEach(record => {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        marked[recordDate] = {
          marked: true,
          dotColor: record.status === 'Present' ? 'green' : record.status === 'Absent' ? 'red' : 'gray',
        };
      });

      setAttendanceReportData(formattedReport);
      setMarkedDates(marked);
      setCurrentPage(1);
    } catch (error) {
      setError('Failed to fetch attendance report');
      setAttendanceReportData([]);
      setMarkedDates({});
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelect = (value) => {
    setSelectedEmployeeId(value);
    fetchAttendanceReport(value, dateRange.start, dateRange.end);
  };

  const handleDateSelect = (day) => {
    const selectedDate = day.dateString;
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({ start: selectedDate, end: null });
      setMarkedDates({ [selectedDate]: { selected: true, startingDay: true, color: '#4c87ba' } });
    } else if (dateRange.start && !dateRange.end && selectedDate >= dateRange.start) {
      setDateRange({ ...dateRange, end: selectedDate });
      fetchAttendanceReport(selectedEmployeeId, dateRange.start, selectedDate);
    }
  };

  const handleDownloadExcel = async () => {
    if (!attendanceReportData.length) {
      setError('No attendance data to export');
      return;
    }

    try {
      const ws = XLSX.utils.aoa_to_sheet([reportTableHead, ...attendanceReportData]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

      const fileName = `attendance_report_${selectedEmployeeId}_${new Date().toISOString().split('T')[0]}.xlsx`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (Platform.OS !== 'web') {
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      setError('Failed to generate or share Excel file');
    }
  };

  const paginatedData = attendanceReportData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <LinearGradient colors={["#002343", "#002343", "#4c87ba", "#002343"]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Employee Picker */}
          <View style={styles.pickerContainer}>
            <LinearGradient colors={['#4c87ba', '#5393ed']} style={styles.pickerGradient}>
              {error ? <Text style={styles.errorText}>{error}</Text> : loading ? <Text style={styles.loadingText}>Loading employees...</Text> : (
                <Picker selectedValue={selectedEmployeeId} onValueChange={handleEmployeeSelect} style={styles.picker} dropdownIconColor="#fff">
                  <Picker.Item label="Select Employee for Report" value={null} />
                  {employeeData.map((emp, index) => (
                    <Picker.Item key={index} label={`${emp.data[2]} (${emp.data[1]})`} value={emp.employeeId} />
                  ))}
                </Picker>
              )}
            </LinearGradient>
          </View>

          {/* Rows per page Picker */}
          <View style={styles.pickerContainer}>
            <LinearGradient colors={['#4c87ba', '#5393ed']} style={styles.pickerGradient}>
              <Picker selectedValue={rowsPerPage} onValueChange={(value) => { setRowsPerPage(value); setCurrentPage(1); }} style={styles.picker} dropdownIconColor="#fff">
                <Picker.Item label="5 Rows" value={5} />
                <Picker.Item label="10 Rows" value={10} />
                <Picker.Item label="15 Rows" value={15} />
              </Picker>
            </LinearGradient>
          </View>

          {/* Calendar */}
          {selectedEmployeeId && (
            <View style={styles.calendarContainer}>
              <Text style={styles.tableTitle}>Select Date Range</Text>
              <LinearGradient colors={['#dbe9f5', '#e6f1fb']} style={styles.calendarGradient}>
                <Calendar
                  onDayPress={handleDateSelect}
                  markedDates={{
                    ...markedDates,
                    [dateRange.start]: { selected: true, startingDay: true, color: '#4c87ba' },
                    [dateRange.end]: { selected: true, endingDay: true, color: '#4c87ba' },
                  }}
                  markingType={'period'}
                  style={styles.calendar}
                  theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#e6f1fb',
                    textSectionTitleColor: '#003087',
                    selectedDayBackgroundColor: '#4c87ba',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#003087',
                    dayTextColor: '#000',
                    dotColor: '#4c87ba',
                    arrowColor: '#4c87ba',
                    monthTextColor: '#003087',
                    textMonthFontWeight: 'bold',
                    textDayFontWeight: '500',
                    textMonthFontSize: 16,
                    textDayFontSize: 14,
                    textDayHeaderFontSize: 12,
                  }}
                />
              </LinearGradient>
            </View>
          )}

          {/* Download Excel */}
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadExcel}>
            <LinearGradient colors={['#4c87ba', '#5393ed']} style={styles.downloadButtonGradient}>
              <Text style={styles.downloadButtonText}>Download Excel Report</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Attendance Table */}
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>Attendance Report (Latest First)</Text>
            <LinearGradient colors={['#dbe9f5', '#e6f1fb']} style={styles.tableWrapperGradient}>
              <ScrollView horizontal>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd' }}>
                  <Row data={reportTableHead} style={styles.tableHead} textStyle={styles.tableHeadText} widthArr={reportColumnWidths} flexArr={Array(reportTableHead.length).fill(1)} />
                  {paginatedData.length > 0 ? paginatedData.map((rowData, rowIndex) => (
                    <Row key={rowIndex} data={rowData.map(cell => (<View style={[styles.cell, rowIndex % 2 === 0 && styles.altRow]}><Text style={styles.tableText}>{cell}</Text></View>))} style={styles.tableRow} textStyle={styles.tableText} widthArr={reportColumnWidths} flexArr={Array(reportTableHead.length).fill(1)} />
                  )) : (
                    <Row data={[<Text style={styles.noDataText}>No attendance data available</Text>]} style={styles.tableRow} textStyle={styles.tableText} widthArr={[490]} />
                  )}
                </Table>
              </ScrollView>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                <TouchableOpacity onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
                  <Text style={{ color: '#003087', marginHorizontal: 10 }}>Previous</Text>
                </TouchableOpacity>
                <Text style={{ color: '#003087' }}>{currentPage}</Text>
                <TouchableOpacity onPress={() => currentPage * rowsPerPage < attendanceReportData.length && setCurrentPage(currentPage + 1)}>
                  <Text style={{ color: '#003087', marginHorizontal: 10 }}>Next</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// 🔵 All styles (CSS-in-JS)
const styles = StyleSheet.create({
  calendarWrapper: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  calendar: {
    borderRadius: 10,
    width: 320,
    height: 330,
    elevation: 3,
  },
  gradient: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  pickerContainer: {
    width: '85%',
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  pickerGradient: { borderRadius: 10, paddingHorizontal: 10 },
  picker: { height: 50, color: '#fff', backgroundColor: 'transparent' },
  errorText: {
    fontSize: 14,
    color: '#FF6347',
    textAlign: 'center',
    padding: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    padding: 10,
  },
  calendarContainer: {
    marginTop: 10,
    paddingHorizontal: 19,
  },
  calendarGradient: {
    borderRadius: 8,
    padding: 8,
  },
  downloadButton: {
    width: '85%',
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  downloadButtonGradient: {
    padding: 15,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  tableWrapperGradient: {
    borderRadius: 8,
    padding: 5,
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
});

export default EmployeeSelector;
