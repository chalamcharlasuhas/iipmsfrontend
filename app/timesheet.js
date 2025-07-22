// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, ImageBackground } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Table, Row, Rows } from 'react-native-table-component';
// import * as Animatable from 'react-native-animatable';
// import { Picker } from '@react-native-picker/picker';
// import { router } from 'expo-router';
// import axios from 'axios';
// import { useUser } from '../contexts/UserContext';
// import { LinearGradient } from 'expo-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ipfront from '../constants/ipadd';
// import { Dimensions } from 'react-native';

// const API_URL = ipfront;

// const Timesheet = () => {
//   const { user } = useUser();
//   const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [weekStartDate, setWeekStartDate] = useState(null);
//   const [weekEndDate, setWeekEndDate] = useState(null);
//   const [totalWeeklyHours, setTotalWeeklyHours] = useState(0);
//   const [tableBackgroundColor, setTableBackgroundColor] = useState('#fff');
//   const [tasks, setTasks] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [timeModalVisible, setTimeModalVisible] = useState(false);
//   const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
//   const [alertModalVisible, setAlertModalVisible] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
//   const [selectedDayIndex, setSelectedDayIndex] = useState(null);
//   const [selectedTime, setSelectedTime] = useState('');
//   const [taskCategory, setTaskCategory] = useState('');
//   const [taskTitle, setTaskTitle] = useState('');
//   const [taskDescription, setTaskDescription] = useState('');
//   const [percentComplete, setPercentComplete] = useState('0');
//   const [assignedBy, setAssignedBy] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

  

//   const updateWeekDates = (date) => {
//     const dayOfWeek = date.getDay();
//     const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
//     const start = new Date(date);
//     start.setDate(date.getDate() + diffToMonday);
//     start.setHours(0, 0, 0, 0);
//     const end = new Date(start);
//     end.setDate(start.getDate() + 6);
//     end.setHours(23, 59, 59, 999);
//     setWeekStartDate(start);
//     setWeekEndDate(end);
//   };

//   useEffect(() => {
//     updateWeekDates(currentDate);
//     const interval = setInterval(() => {
//       const newDate = new Date();
//       setCurrentDate(newDate);
//       setCurrentTime(newDate.toLocaleTimeString('en-US', { hour12: true }));
//       if (newDate.getDay() === 1 && newDate.getHours() === 0 && newDate.getMinutes() === 0) {
//         updateWeekDates(newDate);
//         setTableData([]);
//         setTotalWeeklyHours(0);
//         setTableBackgroundColor('#fff');
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (!user || !user.employeeId) {
//       setAlertMessage('Please log in to continue.');
//       setAlertModalVisible(true);
//       router.push('/login');
//       return;
//     }

//     const fetchTasks = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/api/tasks/${user.employeeId}`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         setTasks(response.data.tasks);
//       } catch (error) {
//         console.error('Error fetching tasks:', error);
//         setAlertMessage('Failed to fetch tasks: ' + (error.response?.data?.message || error.message));
//         setAlertModalVisible(true);
//       }
//     };

//     const fetchTimesheet = async () => {
//       if (!weekStartDate) return;
//       try {
//         const response = await axios.get(`${API_URL}/api/timesheet/${user.employeeId}`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         const timesheets = response.data.timesheets.filter(
//           (ts) => new Date(ts.weekStartDate).toDateString() === weekStartDate.toDateString()
//         );
//         const newTableData = timesheets.map((ts) => ({
//           projectName: ts.projectName,
//           activityName: ts.activityName,
//           hours: ts.hours,
//           loginTimes: ts.loginTimes,
//           logoutTimes: ts.logoutTimes,
//         }));
//         setTableData(newTableData);
//         calculateTotalWeeklyHours(newTableData);
//       } catch (error) {
//         console.error('Error fetching timesheet:', error);
//         setAlertMessage('Failed to fetch timesheet data: ' + (error.response?.data?.message || error.message));
//         setAlertModalVisible(true);
//       }
//     };

//     fetchTasks();
//     fetchTimesheet();
//   }, [user, weekStartDate]);

//   const calculateTotalWeeklyHours = (data) => {
//     let totalMinutes = 0;
//     data.forEach((row) => {
//       row.hours.forEach((hour) => {
//         if (hour && hour !== '00:00') {
//           const [hours, minutes] = hour.split(':').map(Number);
//           totalMinutes += hours * 60 + minutes;
//         }
//       });
//     });
//     const totalHours = totalMinutes / 60;
//     setTotalWeeklyHours(totalHours);
//     if (currentDate.getDay() === 0) {
//       if (totalHours === 45) {
//         setTableBackgroundColor('#fff');
//       } else if (totalHours >= 35) {
//         setTableBackgroundColor('#90EE90');
//       } else if (totalHours >= 25) {
//         setTableBackgroundColor('#FFFFE0');
//       } else {
//         setTableBackgroundColor('#FFB6C1');
//       }
//     } else {
//       setTableBackgroundColor('#fff');
//     }
//   };

//   const generateWeekDays = (startDate) => {
//     if (!startDate) return [];
//     const days = [];
//     const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
//     for (let i = 0; i < 7; i++) {
//       const currentDay = new Date(startDate);
//       currentDay.setDate(startDate.getDate() + i);
//       const dayName = dayNames[i];
//       const date = currentDay.getDate().toString().padStart(2, '0');
//       days.push(`${dayName} ${date}`);
//     }
//     return days;
//   };

//   const weekDays = generateWeekDays(weekStartDate);
//   const tableHead = ['Project Name', 'Activity Name', ...weekDays];
//   const columnWidths = [200, 200, ...Array(7).fill(80)];

//   const formatWeekRange = (startDate, endDate) => {
//     if (!startDate || !endDate) return '';
//     const startStr = startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
//     const endStr = endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
//     return `${startStr} - ${endStr}`;
//   };

//   const weekRange = formatWeekRange(weekStartDate, weekEndDate);
//   const totalRows = tableData.length;
//   const totalPages = Math.ceil(totalRows / rowsPerPage);
//   const paginatedData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

//   const calculateHoursDifference = (loginTime, logoutTime) => {
//     if (!loginTime || !logoutTime) return '00:00';
//     const [loginHours, loginMinutes] = loginTime.split(':').map(Number);
//     const [logoutHours, logoutMinutes] = logoutTime.split(':').map(Number);
//     const loginDate = new Date();
//     loginDate.setHours(loginHours, loginMinutes, 0, 0);
//     const logoutDate = new Date();
//     logoutDate.setHours(logoutHours, logoutMinutes, 0, 0);
//     const diffMs = logoutDate - loginDate;
//     if (diffMs < 0) return '00:00';
//     const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
//     const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
//     return `${diffHrs.toString().padStart(2, '0')}:${diffMins.toString().padStart(2, '0')}`;
//   };

//   const isDaySelectable = (dayIndex) => {
//     if (!weekStartDate) return false;
//     const selectedDay = new Date(weekStartDate);
//     selectedDay.setDate(weekStartDate.getDate() + dayIndex);
//     return selectedDay.toDateString() === currentDate.toDateString();
//   };

//   const handleTimeSlotClick = async (taskIndex, dayIndex) => {
//     if (!isDaySelectable(dayIndex)) {
//       setAlertMessage('You can only record time for today.');
//       setAlertModalVisible(true);
//       return;
//     }

//     const newTableData = [...tableData];
//     const currentRow = newTableData[taskIndex];

//     if (!currentRow.loginTimes[dayIndex]) {
//       currentRow.loginTimes[dayIndex] = currentTime;
//       setAlertMessage(`Your login time (${currentTime}) has been recorded.`);
//     } else if (!currentRow.logoutTimes[dayIndex]) {
//       currentRow.logoutTimes[dayIndex] = currentTime;
//       const hoursWorked = calculateHoursDifference(currentRow.loginTimes[dayIndex], currentRow.logoutTimes[dayIndex]);
//       currentRow.hours[dayIndex] = hoursWorked;
//       setAlertMessage(`Your logout time (${currentTime}) has been recorded. Hours: ${hoursWorked}`);
//     } else {
//       setSelectedTaskIndex(taskIndex);
//       setSelectedDayIndex(dayIndex);
//       setSelectedTime(currentRow.hours[dayIndex]);
//       setTimeModalVisible(true);
//       return;
//     }

//     setTableData(newTableData);
//     calculateTotalWeeklyHours(newTableData);

//     try {
//       await axios.post(`${API_URL}/api/timesheet`, {
//         employeeId: user.employeeId,
//         projectName: currentRow.projectName,
//         activityName: currentRow.activityName,
//         weekStartDate,
//         hours: currentRow.hours,
//         loginTimes: currentRow.loginTimes,
//         logoutTimes: currentRow.logoutTimes,
//       }, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//     } catch (error) {
//       console.error('Error saving timesheet:', error);
//       setAlertMessage('Failed to save timesheet data: ' + (error.response?.data?.message || error.message));
//       setAlertModalVisible(true);
//     }
//   };

//   const handleTimeUpdate = async () => {
//     if (selectedTaskIndex !== null && selectedDayIndex !== null) {
//       const newTableData = [...tableData];
//       newTableData[selectedTaskIndex].hours[selectedDayIndex] = selectedTime || '00:00';
//       setTableData(newTableData);
//       calculateTotalWeeklyHours(newTableData);

//       try {
//         await axios.post(`${API_URL}/api/timesheet`, {
//           employeeId: user.employeeId,
//           projectName: newTableData[selectedTaskIndex].projectName,
//           activityName: newTableData[selectedTaskIndex].activityName,
//           weekStartDate,
//           hours: newTableData[selectedTaskIndex].hours,
//           loginTimes: newTableData[selectedTaskIndex].loginTimes,
//           logoutTimes: newTableData[selectedTaskIndex].logoutTimes,
//         }, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//       } catch (error) {
//         console.error('Error updating timesheet:', error);
//         setAlertMessage('Failed to update timesheet data: ' + (error.response?.data?.message || error.message));
//         setAlertModalVisible(true);
//       }
//     }
//     setTimeModalVisible(false);
//     setSelectedTaskIndex(null);
//     setSelectedDayIndex(null);
//     setSelectedTime('');
//   };

//   const handleProjectChange = async (value, index) => {
//     const newTableData = [...tableData];
//     newTableData[index].projectName = value;
//     const matchingTask = tasks.find((task) => task.projectName === value);
//     newTableData[index].activityName = matchingTask ? matchingTask.activityName : '';
//     setTableData(newTableData);

//     try {
//       await axios.post(`${API_URL}/api/timesheet`, {
//         employeeId: user.employeeId,
//         projectName: newTableData[index].projectName,
//         activityName: newTableData[index].activityName,
//         weekStartDate,
//         hours: newTableData[index].hours,
//         loginTimes: newTableData[index].loginTimes,
//         logoutTimes: newTableData[index].logoutTimes,
//       }, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//     } catch (error) {
//       console.error('Error updating timesheet:', error);
//       setAlertMessage('Failed to update timesheet data: ' + (error.response?.data?.message || error.message));
//       setAlertModalVisible(true);
//     }
//   };

//   const handleActivityChange = async (value, index) => {
//     const newTableData = [...tableData];
//     newTableData[index].activityName = value;
//     setTableData(newTableData);

//     try {
//       await axios.post(`${API_URL}/api/timesheet`, {
//         employeeId: user.employeeId,
//         projectName: newTableData[index].projectName,
//         activityName: newTableData[index].activityName,
//         weekStartDate,
//         hours: newTableData[index].hours,
//         loginTimes: newTableData[index].loginTimes,
//         logoutTimes: newTableData[index].logoutTimes,
//       }, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//     } catch (error) {
//       console.error('Error updating timesheet:', error);
//       setAlertMessage('Failed to update timesheet data: ' + (error.response?.data?.message || error.message));
//       setAlertModalVisible(true);
//     }
//   };

//   const handleAddTask = async () => {
//     if (!user || !user.employeeId) {
//       setAlertMessage('Please log in to add a task.');
//       setAlertModalVisible(true);
//       router.push('/login');
//       return;
//     }

//     if (!taskCategory.trim() || !taskTitle.trim()) {
//       setAlertMessage('Project name and activity name are required');
//       setAlertModalVisible(true);
//       return;
//     }

//     const percentCompleteNum = parseFloat(percentComplete) || 0;
//     if (percentCompleteNum < 0 || percentCompleteNum > 100) {
//       setAlertMessage('Percent complete must be between 0 and 100');
//       setAlertModalVisible(true);
//       return;
//     }

//     // Check if a task with the same projectName and activityName already exists for the current week
//     const existingTimesheet = tableData.find(
//       (ts) => ts.projectName === taskCategory.trim() && ts.activityName === taskTitle.trim()
//     );

//     if (existingTimesheet) {
//       setAlertMessage('This task already exists for the current week.');
//       setAlertModalVisible(true);
//       return;
//     }

//     // Calculate the current day index (0 for Monday, 1 for Tuesday, etc.)
//     const currentDayIndex = weekStartDate
//       ? Math.floor((currentDate - weekStartDate) / (1000 * 60 * 60 * 24))
//       : 0;

//     // Initialize timesheet data only for the current day
//     const hours = Array(7).fill('00:00');
//     const loginTimes = Array(7).fill(null);
//     const logoutTimes = Array(7).fill(null);

//     // Set the current day's data (optional: you can set login time immediately if desired)
//     hours[currentDayIndex] = '00:00';
//     loginTimes[currentDayIndex] = null;
//     logoutTimes[currentDayIndex] = null;

//     const payload = {
//       employeeId: user.employeeId,
//       projectName: taskCategory.trim(),
//       activityName: taskTitle.trim(),
//       taskDescription: taskDescription ? taskDescription.trim() : '',
//       percentComplete: percentCompleteNum,
//       assignedBy: assignedBy ? assignedBy.trim() : '',
//     };

//     console.log('Adding task with payload:', payload);

//     try {
//       const response = await axios.post(`${API_URL}/api/tasks`, payload, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       const newTask = response.data.task;
//       setTasks([...tasks, newTask]);

//       const newTimesheet = {
//         projectName: taskCategory.trim(),
//         activityName: taskTitle.trim(),
//         hours,
//         loginTimes,
//         logoutTimes,
//       };
//       setTableData([...tableData, newTimesheet]);

//       await axios.post(`${API_URL}/api/timesheet`, {
//         employeeId: user.employeeId,
//         projectName: taskCategory.trim(),
//         activityName: taskTitle.trim(),
//         weekStartDate,
//         hours,
//         loginTimes,
//         logoutTimes,
//       }, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });

//       setTaskCategory('');
//       setTaskTitle('');
//       setTaskDescription('');
//       setPercentComplete('0');
//       setAssignedBy('');
//       setAddTaskModalVisible(false);
//       setAlertMessage('Task added successfully');
//       setAlertModalVisible(true);
//     } catch (error) {
//       console.error('Error adding task:', error);
//       setAlertMessage('Failed to add task: ' + (error.response?.data?.message || error.message));
//       setAlertModalVisible(true);
//     }
//   };

//   return (
//           <LinearGradient
//             colors={['#002343', '#4c87ba', '#002343']}
//             start={{ x: 0.1, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.gradient}
//           >
//     <SafeAreaView style={styles.container}>
//       <View style={styles.innerContainer}>
//         <Animatable.View animation="fadeInDown" style={styles.header}>
//           <View style={styles.headerCenter}>
//             <ImageBackground
//               style={styles.logo}
//               resizeMode="contain"
//               source={require('../assets/images/logo.png')}
//             />
//             <Text style={styles.headerSubLogo}>IIPMS</Text>
//           </View>
//           <View style={styles.headerRight}>
//             <Text style={styles.time}>{currentTime}</Text>
//           </View>
//         </Animatable.View>

//         <View style={styles.navTabs}>
//           <TouchableOpacity onPress={() => router.push('/')} style={styles.tab}>
//             <Text style={styles.tabText}>Home</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={[styles.tab, styles.activeTab]} onPress={() => {
//             if (user?.roleType === 'Employee') {
//               router.push('/dashboard');
//             } else if (user?.roleType === 'Manager') {
//               router.push('/managerdashboard');
//             } else if (user?.roleType === 'Admin') {
//               router.push('/admindashboard');
//             }
//           }}>
//             <Text style={[styles.tabText, styles.activeTabText]}>My Workspace</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.tab}>
//             <Text style={styles.tabText}>My Hours Dashboard</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={[styles.tableContainer, { backgroundColor: tableBackgroundColor }]}>
//           <View style={styles.tableHeader}>
//             <Text style={styles.tableHeaderText}>Add timesheet for week ({weekRange})</Text>
//             <TouchableOpacity style={styles.addTaskButton} onPress={() => setAddTaskModalVisible(true)}>
//               <Text style={styles.addTaskButtonText}>+ Add Task</Text>
//             </TouchableOpacity>
//           </View>
//           {currentDate.getDay() === 0 && (
//             <View style={styles.weeklyHoursContainer}>
//               <Text style={styles.weeklyHoursText}>
//                 Total Weekly Hours: {totalWeeklyHours.toFixed(2)} hrs
//               </Text>
//             </View>
//           )}
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
//                 {paginatedData.map((rowData, rowIndex) => {
//                   const actualIndex = (currentPage - 1) * rowsPerPage + rowIndex;
//                   const projectActivities = tasks
//                     .filter((task) => task.projectName === rowData.projectName)
//                     .map((task) => task.activityName);
//                   return (
//                     <Row
//                       key={actualIndex}
//                       data={[
//                         <View style={styles.cell}>
//                           {rowData.projectName ? (
//                             <Text style={styles.tableText}>{rowData.projectName}</Text>
//                           ) : (
//                             <View style={styles.pickerRow}>
//                               <View
//                                 style={[styles.pickerContainer, rowData.projectName && styles.selectedPickerContainer]}
//                               >
//                                 <Picker
//                                   selectedValue={rowData.projectName}
//                                   onValueChange={(value) => handleProjectChange(value, actualIndex)}
//                                   style={styles.picker}
//                                   dropdownIconColor="#333"
//                                 >
//                                   <Picker.Item label="Select Project" value="" />
//                                   {[...new Set(tasks.map((task) => task.projectName))].map((option, idx) => (
//                                     <Picker.Item key={idx} label={option} value={option} />
//                                   ))}
//                                 </Picker>
//                               </View>
//                             </View>
//                           )}
//                         </View>,
//                         <View style={styles.cell}>
//                           {rowData.activityName ? (
//                             <Text style={styles.tableText}>{rowData.activityName}</Text>
//                           ) : (
//                             <View style={styles.pickerRow}>
//                               <View
//                                 style={[styles.pickerContainer, rowData.activityName && styles.selectedPickerContainer]}
//                               >
//                                 <Picker
//                                   selectedValue={rowData.activityName}
//                                   onValueChange={(value) => handleActivityChange(value, actualIndex)}
//                                   style={styles.picker}
//                                   enabled={projectActivities.length > 0}
//                                   dropdownIconColor="#333"
//                                 >
//                                   <Picker.Item label="Select Activity" value="" />
//                                   {projectActivities.map((option, idx) => (
//                                     <Picker.Item key={idx} label={option} value={option} />
//                                   ))}
//                                 </Picker>
//                               </View>
//                             </View>
//                           )}
//                         </View>,
//                         ...rowData.hours.map((time, dayIndex) => (
//                           <TouchableOpacity
//                             key={dayIndex}
//                             style={[styles.cell, !isDaySelectable(dayIndex) && styles.disabledCell]}
//                             onPress={() => handleTimeSlotClick(actualIndex, dayIndex)}
//                             disabled={!isDaySelectable(dayIndex)}
//                           >
//                             <View style={styles.timeCellContent}>
//                               {rowData.loginTimes[dayIndex] ? (
//                                 <Text style={styles.timeDetailText}>
//                                   In: {rowData.loginTimes[dayIndex].slice(0, 5)}
//                                 </Text>
//                               ) : (
//                                 <Text style={styles.timeDetailText}>In: --:--</Text>
//                               )}
//                               {rowData.logoutTimes[dayIndex] ? (
//                                 <Text style={styles.timeDetailText}>
//                                   Out: {rowData.logoutTimes[dayIndex].slice(0, 5)}
//                                 </Text>
//                               ) : (
//                                 <Text style={styles.timeDetailText}>Out: --:--</Text>
//                               )}
//                               <Text editable={false} style={styles.hoursText}>Hrs: {time}</Text>
//                             </View>
//                             <Text style={styles.commentIcon}>🗨️</Text>
//                           </TouchableOpacity>
//                         )),
//                       ]}
//                       style={styles.tableRow}
//                       textStyle={styles.tableText}
//                       widthArr={columnWidths}
//                       flexArr={Array(tableHead.length).fill(1)}
//                     />
//                   );
//                 })}
//               </Table>
//             </View>
//           </ScrollView>

//           <View style={styles.paginationContainer}>
//             <View style={styles.pagination}>
//               <Text style={styles.paginationText}>Rows per page: </Text>
//               <Picker
//                 selectedValue={rowsPerPage}
//                 onValueChange={(value) => {
//                   setRowsPerPage(value);
//                   setCurrentPage(1);
//                 }}
//                 style={styles.paginationPicker}
//               >
//                 {[5, 10, 15].map((value) => (
//                   <Picker.Item key={value} label={`${value}`} value={value} />
//                 ))}
//               </Picker>
//               <Text style={styles.paginationText}>
//                 {`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, totalRows)} of ${totalRows}`}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
//                 disabled={currentPage === 1}
//               >
//                 <Text style={[styles.paginationArrow, currentPage === 1 && styles.disabledArrow]}>◄</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
//                 disabled={currentPage === totalPages}
//               >
//                 <Text style={[styles.paginationArrow, currentPage === totalPages && styles.disabledArrow]}>►</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={addTaskModalVisible}
//           onRequestClose={() => setAddTaskModalVisible(false)}
//         >
//           <Animatable.View animation="zoomIn" style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Add Task Details</Text>
//                 <TouchableOpacity onPress={() => setAddTaskModalVisible(false)}>
//                   <Text style={styles.closeIcon}>✖</Text>
//                 </TouchableOpacity>
//               </View>
//               <Text style={styles.inputLabel}>Project Name</Text>
//               <TextInput
//                 style={styles.input}
//                 value={taskCategory}
//                 onChangeText={setTaskCategory}
//                 placeholder="Enter project name"
//               />
//               <Text style={styles.inputLabel}>Activity Name</Text>
//               <TextInput
//                 style={styles.input}
//                 value={taskTitle}
//                 onChangeText={setTaskTitle}
//                 placeholder="Enter activity name"
//               />
//               <Text style={styles.inputLabel}>Task Description</Text>
//               <TextInput
//                 style={styles.input}
//                 value={taskDescription}
//                 onChangeText={setTaskDescription}
//                 placeholder="Enter task description"
//                 multiline
//               />
//               <Text style={styles.inputLabel}>% Complete</Text>
//               <TextInput
//                 style={styles.input}
//                 value={percentComplete}
//                 onChangeText={(text) => {
//                   if (/^\d*\.?\d*$/.test(text) || text === '') {
//                     setPercentComplete(text);
//                   }
//                 }}
//                 placeholder="Enter % complete (0-100)"
//                 keyboardType="numeric"
//               />
//               <Text style={styles.inputLabel}>Assigned By</Text>
//               <TextInput
//                 style={styles.input}
//                 value={assignedBy}
//                 onChangeText={setAssignedBy}
//                 placeholder="Enter assignee"
//               />
//               <TouchableOpacity style={styles.submitButton} onPress={handleAddTask}>
//                 <Text style={styles.submitButtonText}>Submit</Text>
//               </TouchableOpacity>
//             </View>
//           </Animatable.View>
//         </Modal>

//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={timeModalVisible}
//           onRequestClose={() => setTimeModalVisible(false)}
//         >
//           <Animatable.View animation="zoomIn" style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>
//                   Edit Time for {selectedDayIndex !== null && weekDays[selectedDayIndex]}
//                 </Text>
//                 <TouchableOpacity onPress={() => setTimeModalVisible(false)}>
//                   <Text style={styles.closeIcon}>✖</Text>
//                 </TouchableOpacity>
//               </View>
//               {selectedTaskIndex !== null && selectedDayIndex !== null && (
//                 <>
//                   <Text style={styles.inputLabel}>Login Time</Text>
//                   <Text style={styles.timeDisplay}>
//                     {tableData[selectedTaskIndex].loginTimes[selectedDayIndex] || 'Not set'}
//                   </Text>
//                   <Text style={styles.inputLabel}>Logout Time</Text>
//                   <Text style={styles.timeDisplay}>
//                     {tableData[selectedTaskIndex].logoutTimes[selectedDayIndex] || 'Not set'}
//                   </Text>
//                 </>
//               )}
//               <Text style={styles.inputLabel}>Hours Worked (e.g., 08:00)</Text>
//               <TextInput
//                 style={styles.input}
//                 value={selectedTime}
//                 onChangeText={setSelectedTime}
//                 editable={false}
//                 placeholder="Enter hours (e.g., 08:00)"
//               />
//               <View style={styles.modalButtons}>
//                 <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleTimeUpdate}>
//                   <Text style={styles.modalButtonText}>Confirm</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.modalButton, styles.cancelButton]}
//                   onPress={() => setTimeModalVisible(false)}
//                 >
//                   <Text style={styles.modalButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </Animatable.View>
//         </Modal>

//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={alertModalVisible}
//           onRequestClose={() => setAlertModalVisible(false)}
//         >
//           <Animatable.View animation="zoomIn" style={styles.modalContainer}>
//             <View style={styles.alertContent}>
//               <Text style={styles.alertTitle}>Notification</Text>
//               <Text style={styles.alertMessage}>{alertMessage}</Text>
//               <TouchableOpacity style={styles.alertButton} onPress={() => setAlertModalVisible(false)}>
//                 <Text style={styles.alertButtonText}>OK</Text>
//               </TouchableOpacity>
//             </View>
//           </Animatable.View>
//         </Modal>
//       </View>
//     </SafeAreaView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//     gradient: {
//     flex: 1,
    
//   },
//   container: {
//     flex: 1,
    
//   },
//   innerContainer: {
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
//   headerCenter: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   logo: {
//     height: 120,
//     width: 180,
//     justifyContent: 'center',
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
//   tableContainer: {
//     flex: 1,
//     padding: 15,
//   },
//   tableHeader: {
//     backgroundColor: '#003087',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   tableHeaderText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     flex: 1,
//   },
//   addTaskButton: {
//     backgroundColor: '#fff',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   addTaskButtonText: {
//     color: '#003087',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   weeklyHoursContainer: {
//     padding: 10,
//     alignItems: 'center',
//     // backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   weeklyHoursText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
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
//     backgroundColor: '#e6e6e6',
//   },
//   tableHeadText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     padding: 8,
//     color: '#333',
//   },
//   tableRow: {
//     backgroundColor: '#fff',
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
//   disabledCell: {
//     backgroundColor: '#f0f0f0',
//     opacity: 0.5,
//   },
//   timeCellContent: {
//     alignItems: 'center',
//   },
//   timeDetailText: {
//     fontSize: 10,
//     color: '#555',
//     marginBottom: 2,
//   },
//   hoursText: {
//     fontSize: 12,
//     color: '#333',
//     fontWeight: 'bold',
//   },
//   pickerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   pickerContainer: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     backgroundColor: '#fff',
//     marginHorizontal: 2,
//     height: 60,
//   },
//   selectedPickerContainer: {
//     backgroundColor: '#e6f0ff',
//   },
//   picker: {
//     flex: 1,
//     color: '#000',
//     fontSize: 16,
//     height: 60,
//   },
//   commentIcon: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   paginationContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 10,
//     marginBottom: 15,
//   },
//   pagination: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   paginationText: {
//     fontSize: 12,
//     marginHorizontal: 5,
//   },
//   paginationPicker: {
//     width: 60,
//     height: 30,
//     color: '#333',
//   },
//   paginationArrow: {
//     fontSize: 16,
//     marginHorizontal: 5,
//     color: '#003087',
//   },
//   disabledArrow: {
//     color: '#ccc',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     padding: 25,
//     borderRadius: 12,
//     width: 300,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#003087',
//   },
//   closeIcon: {
//     fontSize: 18,
//     color: '#333',
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 15,
//     fontSize: 14,
//     color: '#333',
//   },
//   timeDisplay: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 15,
//   },
//   submitButton: {
//     backgroundColor: '#28a745',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   modalButton: {
//     paddingVertical: 12,
//     borderRadius: 8,
//     width: 120,
//     alignItems: 'center',
//   },
//   confirmButton: {
//     backgroundColor: '#003087',
//   },
//   cancelButton: {
//     backgroundColor: '#ff0000',
//   },
//   modalButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   alertContent: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     width: 250,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   alertTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#003087',
//     marginBottom: 10,
//   },
//   alertMessage: {
//     fontSize: 14,
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   alertButton: {
//     backgroundColor: '#28a745',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   alertButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });


// export default Timesheet;



// import React, { useState, useEffect } from 'react';

// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, ImageBackground } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Table, Row, Rows } from 'react-native-table-component';
// import * as Animatable from 'react-native-animatable';
// import { Picker } from '@react-native-picker/picker';
// import { router } from 'expo-router';
// import axios from 'axios';
// import { useUser } from '../contexts/UserContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ipfront from '../constants/ipadd';

// const API_URL = ipfront;

// const App = () => {
//   const { user } = useUser();
//   const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [weekStartDate, setWeekStartDate] = useState(null);
//   const [weekEndDate, setWeekEndDate] = useState(null);
//   const [totalWeeklyHours, setTotalWeeklyHours] = useState(0);
//   const [tableBackgroundColor, setTableBackgroundColor] = useState('#fff');
//   const [tasks, setTasks] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [timeModalVisible, setTimeModalVisible] = useState(false);
//   const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
//   const [alertModalVisible, setAlertModalVisible] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
//   const [selectedDayIndex, setSelectedDayIndex] = useState(null);
//   const [selectedTime, setSelectedTime] = useState('');
//   const [taskCategory, setTaskCategory] = useState('');
//   const [taskTitle, setTaskTitle] = useState('');
//   const [taskDescription, setTaskDescription] = useState('');
//   const [percentComplete, setPercentComplete] = useState('0');
//   const [assignedBy, setAssignedBy] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const updateWeekDates = (date) => {
//     const dayOfWeek = date.getDay();
//     const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
//     const start = new Date(date);
//     start.setDate(date.getDate() + diffToMonday);
//     start.setHours(0, 0, 0, 0);
//     const end = new Date(start);
//     end.setDate(start.getDate() + 6);
//     end.setHours(23, 59, 59, 999);
//     setWeekStartDate(start);
//     setWeekEndDate(end);
//   };

//   useEffect(() => {
//     updateWeekDates(currentDate);
//     const interval = setInterval(() => {
//       const newDate = new Date();
//       setCurrentDate(newDate);
//       setCurrentTime(newDate.toLocaleTimeString('en-US', { hour12: true }));
//       if (newDate.getDay() === 1 && newDate.getHours() === 0 && newDate.getMinutes() === 0) {
//         updateWeekDates(newDate);
//         setTableData([]);
//         setTotalWeeklyHours(0);
//         setTableBackgroundColor('#fff');
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (!user || !user.employeeId) {
//       setAlertMessage('Please log in to continue.');
//       setAlertModalVisible(true);
//       router.push('/login');
//       return;
//     }

//     const fetchTasks = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/api/tasks/${user.employeeId}`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         setTasks(response.data.tasks);
//       } catch (error) {
//         console.error('Error fetching tasks:', error);
//         setAlertMessage('Failed to fetch tasks: ' + (error.response?.data?.message || error.message));
//         setAlertModalVisible(true);
//       }
//     };

//     const fetchTimesheet = async () => {
//       if (!weekStartDate) return;
//       try {
//         const response = await axios.get(`${API_URL}/api/timesheet/${user.employeeId}`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         const timesheets = response.data.timesheets.filter(
//           (ts) => new Date(ts.weekStartDate).toDateString() === weekStartDate.toDateString()
//         );
//         const newTableData = timesheets.map((ts) => ({
//           projectName: ts.projectName,
//           activityName: ts.activityName,
//           hours: ts.hours,
//           loginTimes: ts.loginTimes,
//           logoutTimes: ts.logoutTimes,
//         }));
//         setTableData(newTableData);
//         calculateTotalWeeklyHours(newTableData);
//       } catch (error) {
//         console.error('Error fetching timesheet:', error);
//         setAlertMessage('Failed to fetch timesheet data: ' + (error.response?.data?.message || error.message));
//         setAlertModalVisible(true);
//       }
//     };

//     fetchTasks();
//     fetchTimesheet();
//   }, [user, weekStartDate]);

//   const calculateTotalWeeklyHours = (data) => {
//     let totalMinutes = 0;
//     data.forEach((row) => {
//       row.hours.forEach((hour) => {
//         if (hour && hour !== '00:00') {
//           const [hours, minutes] = hour.split(':').map(Number);
//           totalMinutes += hours * 60 + minutes;
//         }
//       });
//     });
//     const totalHours = totalMinutes / 60;
//     setTotalWeeklyHours(totalHours);
//     if (currentDate.getDay() === 0) {
//       if (totalHours === 45) {
//         setTableBackgroundColor('#fff');
//       } else if (totalHours >= 35) {
//         setTableBackgroundColor('#90EE90');
//       } else if (totalHours >= 25) {
//         setTableBackgroundColor('#FFFFE0');
//       } else {
//         setTableBackgroundColor('#FFB6C1');
//       }
//     } else {
//       setTableBackgroundColor('#fff');
//     }
//   };

//   const generateWeekDays = (startDate) => {
//     if (!startDate) return [];
//     const days = [];
//     const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
//     for (let i = 0; i < 7; i++) {
//       const currentDay = new Date(startDate);
//       currentDay.setDate(startDate.getDate() + i);
//       const dayName = dayNames[i];
//       const date = currentDay.getDate().toString().padStart(2, '0');
//       days.push(`${dayName} ${date}`);
//     }
//     return days;
//   };

//   const weekDays = generateWeekDays(weekStartDate);
//   const tableHead = ['Project Name', 'Activity Name', ...weekDays];
//   const columnWidths = [200, 200, ...Array(7).fill(80)];

//   const formatWeekRange = (startDate, endDate) => {
//     if (!startDate || !endDate) return '';
//     const startStr = startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
//     const endStr = endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
//     return `${startStr} - ${endStr}`;
//   };

//   const weekRange = formatWeekRange(weekStartDate, weekEndDate);
//   const totalRows = tableData.length;
//   const totalPages = Math.ceil(totalRows / rowsPerPage);
//   const paginatedData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

//   const calculateHoursDifference = (loginTime, logoutTime) => {
//     if (!loginTime || !logoutTime) return '00:00';
//     const [loginHours, loginMinutes] = loginTime.split(':').map(Number);
//     const [logoutHours, logoutMinutes] = logoutTime.split(':').map(Number);
//     const loginDate = new Date();
//     loginDate.setHours(loginHours, loginMinutes, 0, 0);
//     const logoutDate = new Date();
//     logoutDate.setHours(logoutHours, logoutMinutes, 0, 0);
//     const diffMs = logoutDate - loginDate;
//     if (diffMs < 0) return '00:00';
//     const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
//     const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
//     return `${diffHrs.toString().padStart(2, '0')}:${diffMins.toString().padStart(2, '0')}`;
//   };

//   const isDaySelectable = (dayIndex) => {
//     if (!weekStartDate) return false;
//     const selectedDay = new Date(weekStartDate);
//     selectedDay.setDate(weekStartDate.getDate() + dayIndex);
//     return selectedDay.toDateString() === currentDate.toDateString();
//   };

//   const handleTimeSlotClick = async (taskIndex, dayIndex) => {
//     if (!isDaySelectable(dayIndex)) {
//       setAlertMessage('You can only record time for today.');
//       setAlertModalVisible(true);
//       return;
//     }

//     const newTableData = [...tableData];
//     const currentRow = newTableData[taskIndex];

//     if (!currentRow.loginTimes[dayIndex]) {
//       currentRow.loginTimes[dayIndex] = currentTime;
//       setAlertMessage(`Your login time (${currentTime}) has been recorded.`);
//     } else if (!currentRow.logoutTimes[dayIndex]) {
//       currentRow.logoutTimes[dayIndex] = currentTime;
//       const hoursWorked = calculateHoursDifference(currentRow.loginTimes[dayIndex], currentRow.logoutTimes[dayIndex]);
//       currentRow.hours[dayIndex] = hoursWorked;
//       setAlertMessage(`Your logout time (${currentTime}) has been recorded. Hours: ${hoursWorked}`);
//     } else {
//       setSelectedTaskIndex(taskIndex);
//       setSelectedDayIndex(dayIndex);
//       setSelectedTime(currentRow.hours[dayIndex]);
//       setTimeModalVisible(true);
//       return;
//     }

//     setTableData(newTableData);
//     calculateTotalWeeklyHours(newTableData);

//     try {
//       await axios.post(`${API_URL}/api/timesheet`, {
//         employeeId: user.employeeId,
//         projectName: currentRow.projectName,
//         activityName: currentRow.activityName,
//         weekStartDate,
//         hours: currentRow.hours,
//         loginTimes: currentRow.loginTimes,
//         logoutTimes: currentRow.logoutTimes,
//       }, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//     } catch (error) {
//       console.error('Error saving timesheet:', error);
//       setAlertMessage('Failed to save timesheet data: ' + (error.response?.data?.message || error.message));
//       setAlertModalVisible(true);
//     }
//   };

//   const handleTimeUpdate = async () => {
//     if (selectedTaskIndex !== null && selectedDayIndex !== null) {
//       const newTableData = [...tableData];
//       newTableData[selectedTaskIndex].hours[selectedDayIndex] = selectedTime || '00:00';
//       setTableData(newTableData);
//       calculateTotalWeeklyHours(newTableData);

//       try {
//         await axios.post(`${API_URL}/api/timesheet`, {
//           employeeId: user.employeeId,
//           projectName: newTableData[selectedTaskIndex].projectName,
//           activityName: newTableData[selectedTaskIndex].activityName,
//           weekStartDate,
//           hours: newTableData[selectedTaskIndex].hours,
//           loginTimes: newTableData[selectedTaskIndex].loginTimes,
//           logoutTimes: newTableData[selectedTaskIndex].logoutTimes,
//         }, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//       } catch (error) {
//         console.error('Error updating timesheet:', error);
//         setAlertMessage('Failed to update timesheet data: ' + (error.response?.data?.message || error.message));
//         setAlertModalVisible(true);
//       }
//     }
//     setTimeModalVisible(false);
//     setSelectedTaskIndex(null);
//     setSelectedDayIndex(null);
//     setSelectedTime('');
//   };

//   const handleProjectChange = async (value, index) => {
//     const newTableData = [...tableData];
//     newTableData[index].projectName = value;
//     const matchingTask = tasks.find((task) => task.projectName === value);
//     newTableData[index].activityName = matchingTask ? matchingTask.activityName : '';
//     setTableData(newTableData);

//     try {
//       await axios.post(`${API_URL}/api/timesheet`, {
//         employeeId: user.employeeId,
//         projectName: newTableData[index].projectName,
//         activityName: newTableData[index].activityName,
//         weekStartDate,
//         hours: newTableData[index].hours,
//         loginTimes: newTableData[index].loginTimes,
//         logoutTimes: newTableData[index].logoutTimes,
//       }, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//     } catch (error) {
//       console.error('Error updating timesheet:', error);
//       setAlertMessage('Failed to update timesheet data: ' + (error.response?.data?.message || error.message));
//       setAlertModalVisible(true);
//     }
//   };

//   const handleActivityChange = async (value, index) => {
//     const newTableData = [...tableData];
//     newTableData[index].activityName = value;
//     setTableData(newTableData);

//     try {
//       await axios.post(`${API_URL}/api/timesheet`, {
//         employeeId: user.employeeId,
//         projectName: newTableData[index].projectName,
//         activityName: newTableData[index].activityName,
//         weekStartDate,
//         hours: newTableData[index].hours,
//         loginTimes: newTableData[index].loginTimes,
//         logoutTimes: newTableData[index].logoutTimes,
//       }, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//     } catch (error) {
//       console.error('Error updating timesheet:', error);
//       setAlertMessage('Failed to update timesheet data: ' + (error.response?.data?.message || error.message));
//       setAlertModalVisible(true);
//     }
//   };

//   const handleAddTask = async () => {
//     if (!user || !user.employeeId) {
//       setAlertMessage('Please log in to add a task.');
//       setAlertModalVisible(true);
//       router.push('/login');
//       return;
//     }

//     if (!taskCategory.trim() || !taskTitle.trim()) {
//       setAlertMessage('Project name and activity name are required');
//       setAlertModalVisible(true);
//       return;
//     }

//     const percentCompleteNum = parseFloat(percentComplete) || 0;
//     if (percentCompleteNum < 0 || percentCompleteNum > 100) {
//       setAlertMessage('Percent complete must be between 0 and 100');
//       setAlertModalVisible(true);
//       return;
//     }

//     // Check if a task with the same projectName and activityName already exists for the current week
//     const existingTimesheet = tableData.find(
//       (ts) => ts.projectName === taskCategory.trim() && ts.activityName === taskTitle.trim()
//     );

//     if (existingTimesheet) {
//       setAlertMessage('This task already exists for the current week.');
//       setAlertModalVisible(true);
//       return;
//     }

//     // Calculate the current day index (0 for Monday, 1 for Tuesday, etc.)
//     const currentDayIndex = weekStartDate
//       ? Math.floor((currentDate - weekStartDate) / (1000 * 60 * 60 * 24))
//       : 0;

//     // Initialize timesheet data only for the current day
//     const hours = Array(7).fill('00:00');
//     const loginTimes = Array(7).fill(null);
//     const logoutTimes = Array(7).fill(null);

//     // Set the current day's data (optional: you can set login time immediately if desired)
//     hours[currentDayIndex] = '00:00';
//     loginTimes[currentDayIndex] = null;
//     logoutTimes[currentDayIndex] = null;

//     const payload = {
//       employeeId: user.employeeId,
//       projectName: taskCategory.trim(),
//       activityName: taskTitle.trim(),
//       taskDescription: taskDescription ? taskDescription.trim() : '',
//       percentComplete: percentCompleteNum,
//       assignedBy: assignedBy ? assignedBy.trim() : '',
//     };

//     console.log('Adding task with payload:', payload);

//     try {
//       const response = await axios.post(`${API_URL}/api/tasks`, payload, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       const newTask = response.data.task;
//       setTasks([...tasks, newTask]);

//       const newTimesheet = {
//         projectName: taskCategory.trim(),
//         activityName: taskTitle.trim(),
//         hours,
//         loginTimes,
//         logoutTimes,
//       };
//       setTableData([...tableData, newTimesheet]);

//       await axios.post(`${API_URL}/api/timesheet`, {
//         employeeId: user.employeeId,
//         projectName: taskCategory.trim(),
//         activityName: taskTitle.trim(),
//         weekStartDate,
//         hours,
//         loginTimes,
//         logoutTimes,
//       }, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });

//       setTaskCategory('');
//       setTaskTitle('');
//       setTaskDescription('');
//       setPercentComplete('0');
//       setAssignedBy('');
//       setAddTaskModalVisible(false);
//       setAlertMessage('Task added successfully');
//       setAlertModalVisible(true);
//     } catch (error) {
//       console.error('Error adding task:', error);
//       setAlertMessage('Failed to add task: ' + (error.response?.data?.message || error.message));
//       setAlertModalVisible(true);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.innerContainer}>
//         <Animatable.View animation="fadeInDown" style={styles.header}>
//           <View style={styles.headerCenter}>
//             <ImageBackground
//               style={styles.logo}
//               resizeMode="contain"
//               source={require('../assets/images/logo.png')}
//             />
//             <Text style={styles.headerSubLogo}>IIPMS</Text>
//           </View>
//           <View style={styles.headerRight}>
//             <Text style={styles.time}>{currentTime}</Text>
//           </View>
//         </Animatable.View>

//         <View style={styles.navTabs}>
//           <TouchableOpacity onPress={() => router.push('/')} style={styles.tab}>
//             <Text style={styles.tabText}>Home</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={[styles.tab, styles.activeTab]} onPress={() => {
//             if (user?.roleType === 'Employee') {
//               router.push('/dashboard');
//             } else if (user?.roleType === 'Manager') {
//               router.push('/managerdashboard');
//             } else if (user?.roleType === 'Admin') {
//               router.push('/admindashboard');
//             }
//           }}>
//             <Text style={[styles.tabText, styles.activeTabText]}>My Workspace</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.tab}>
//             <Text style={styles.tabText}>My Hours Dashboard</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={[styles.tableContainer, { backgroundColor: tableBackgroundColor }]}>
//           <View style={styles.tableHeader}>
//             <Text style={styles.tableHeaderText}>Add timesheet for week ({weekRange})</Text>
//             <TouchableOpacity style={styles.addTaskButton} onPress={() => setAddTaskModalVisible(true)}>
//               <Text style={styles.addTaskButtonText}>+ Add Task</Text>
//             </TouchableOpacity>
//           </View>
//           {currentDate.getDay() === 0 && (
//             <View style={styles.weeklyHoursContainer}>
//               <Text style={styles.weeklyHoursText}>
//                 Total Weekly Hours: {totalWeeklyHours.toFixed(2)} hrs
//               </Text>
//             </View>
//           )}
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
//                 {paginatedData.map((rowData, rowIndex) => {
//                   const actualIndex = (currentPage - 1) * rowsPerPage + rowIndex;
//                   const projectActivities = tasks
//                     .filter((task) => task.projectName === rowData.projectName)
//                     .map((task) => task.activityName);
//                   return (
//                     <Row
//                       key={actualIndex}
//                       data={[
//                         <View style={styles.cell}>
//                           {rowData.projectName ? (
//                             <Text style={styles.tableText}>{rowData.projectName}</Text>
//                           ) : (
//                             <View style={styles.pickerRow}>
//                               <View
//                                 style={[styles.pickerContainer, rowData.projectName && styles.selectedPickerContainer]}
//                               >
//                                 <Picker
//                                   selectedValue={rowData.projectName}
//                                   onValueChange={(value) => handleProjectChange(value, actualIndex)}
//                                   style={styles.picker}
//                                   dropdownIconColor="#333"
//                                 >
//                                   <Picker.Item label="Select Project" value="" />
//                                   {[...new Set(tasks.map((task) => task.projectName))].map((option, idx) => (
//                                     <Picker.Item key={idx} label={option} value={option} />
//                                   ))}
//                                 </Picker>
//                               </View>
//                             </View>
//                           )}
//                         </View>,
//                         <View style={styles.cell}>
//                           {rowData.activityName ? (
//                             <Text style={styles.tableText}>{rowData.activityName}</Text>
//                           ) : (
//                             <View style={styles.pickerRow}>
//                               <View
//                                 style={[styles.pickerContainer, rowData.activityName && styles.selectedPickerContainer]}
//                               >
//                                 <Picker
//                                   selectedValue={rowData.activityName}
//                                   onValueChange={(value) => handleActivityChange(value, actualIndex)}
//                                   style={styles.picker}
//                                   enabled={projectActivities.length > 0}
//                                   dropdownIconColor="#333"
//                                 >
//                                   <Picker.Item label="Select Activity" value="" />
//                                   {projectActivities.map((option, idx) => (
//                                     <Picker.Item key={idx} label={option} value={option} />
//                                   ))}
//                                 </Picker>
//                               </View>
//                             </View>
//                           )}
//                         </View>,
//                         ...rowData.hours.map((time, dayIndex) => (
//                           <TouchableOpacity
//                             key={dayIndex}
//                             style={[styles.cell, !isDaySelectable(dayIndex) && styles.disabledCell]}
//                             onPress={() => handleTimeSlotClick(actualIndex, dayIndex)}
//                             disabled={!isDaySelectable(dayIndex)}
//                           >
//                             <View style={styles.timeCellContent}>
//                               {rowData.loginTimes[dayIndex] ? (
//                                 <Text style={styles.timeDetailText}>
//                                   In: {rowData.loginTimes[dayIndex].slice(0, 5)}
//                                 </Text>
//                               ) : (
//                                 <Text style={styles.timeDetailText}>In: --:--</Text>
//                               )}
//                               {rowData.logoutTimes[dayIndex] ? (
//                                 <Text style={styles.timeDetailText}>
//                                   Out: {rowData.logoutTimes[dayIndex].slice(0, 5)}
//                                 </Text>
//                               ) : (
//                                 <Text style={styles.timeDetailText}>Out: --:--</Text>
//                               )}
//                               <Text editable={false} style={styles.hoursText}>Hrs: {time}</Text>
//                             </View>
//                             <Text style={styles.commentIcon}>🗨️</Text>
//                           </TouchableOpacity>
//                         )),
//                       ]}
//                       style={styles.tableRow}
//                       textStyle={styles.tableText}
//                       widthArr={columnWidths}
//                       flexArr={Array(tableHead.length).fill(1)}
//                     />
//                   );
//                 })}
//               </Table>
//             </View>
//           </ScrollView>

//           <View style={styles.paginationContainer}>
//             <View style={styles.pagination}>
//               <Text style={styles.paginationText}>Rows per page: </Text>
//               <Picker
//                 selectedValue={rowsPerPage}
//                 onValueChange={(value) => {
//                   setRowsPerPage(value);
//                   setCurrentPage(1);
//                 }}
//                 style={styles.paginationPicker}
//               >
//                 {[5, 10, 15].map((value) => (
//                   <Picker.Item key={value} label={`${value}`} value={value} />
//                 ))}
//               </Picker>
//               <Text style={styles.paginationText}>
//                 {`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, totalRows)} of ${totalRows}`}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
//                 disabled={currentPage === 1}
//               >
//                 <Text style={[styles.paginationArrow, currentPage === 1 && styles.disabledArrow]}>◄</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
//                 disabled={currentPage === totalPages}
//               >
//                 <Text style={[styles.paginationArrow, currentPage === totalPages && styles.disabledArrow]}>►</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={addTaskModalVisible}
//           onRequestClose={() => setAddTaskModalVisible(false)}
//         >
//           <Animatable.View animation="zoomIn" style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Add Task Details</Text>
//                 <TouchableOpacity onPress={() => setAddTaskModalVisible(false)}>
//                   <Text style={styles.closeIcon}>✖</Text>
//                 </TouchableOpacity>
//               </View>
//               <Text style={styles.inputLabel}>Project Name</Text>
//               <TextInput
//                 style={styles.input}
//                 value={taskCategory}
//                 onChangeText={setTaskCategory}
//                 placeholder="Enter project name"
//               />
//               <Text style={styles.inputLabel}>Activity Name</Text>
//               <TextInput
//                 style={styles.input}
//                 value={taskTitle}
//                 onChangeText={setTaskTitle}
//                 placeholder="Enter activity name"
//               />
//               <Text style={styles.inputLabel}>Task Description</Text>
//               <TextInput
//                 style={styles.input}
//                 value={taskDescription}
//                 onChangeText={setTaskDescription}
//                 placeholder="Enter task description"
//                 multiline
//               />
//               <Text style={styles.inputLabel}>% Complete</Text>
//               <TextInput
//                 style={styles.input}
//                 value={percentComplete}
//                 onChangeText={(text) => {
//                   if (/^\d*\.?\d*$/.test(text) || text === '') {
//                     setPercentComplete(text);
//                   }
//                 }}
//                 placeholder="Enter % complete (0-100)"
//                 keyboardType="numeric"
//               />
//               <Text style={styles.inputLabel}>Assigned By</Text>
//               <TextInput
//                 style={styles.input}
//                 value={assignedBy}
//                 onChangeText={setAssignedBy}
//                 placeholder="Enter assignee"
//               />
//               <TouchableOpacity style={styles.submitButton} onPress={handleAddTask}>
//                 <Text style={styles.submitButtonText}>Submit</Text>
//               </TouchableOpacity>
//             </View>
//           </Animatable.View>
//         </Modal>

//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={timeModalVisible}
//           onRequestClose={() => setTimeModalVisible(false)}
//         >
//           <Animatable.View animation="zoomIn" style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>
//                   Edit Time for {selectedDayIndex !== null && weekDays[selectedDayIndex]}
//                 </Text>
//                 <TouchableOpacity onPress={() => setTimeModalVisible(false)}>
//                   <Text style={styles.closeIcon}>✖</Text>
//                 </TouchableOpacity>
//               </View>
//               {selectedTaskIndex !== null && selectedDayIndex !== null && (
//                 <>
//                   <Text style={styles.inputLabel}>Login Time</Text>
//                   <Text style={styles.timeDisplay}>
//                     {tableData[selectedTaskIndex].loginTimes[selectedDayIndex] || 'Not set'}
//                   </Text>
//                   <Text style={styles.inputLabel}>Logout Time</Text>
//                   <Text style={styles.timeDisplay}>
//                     {tableData[selectedTaskIndex].logoutTimes[selectedDayIndex] || 'Not set'}
//                   </Text>
//                 </>
//               )}
//               <Text style={styles.inputLabel}>Hours Worked (e.g., 08:00)</Text>
//               <TextInput
//                 style={styles.input}
//                 value={selectedTime}
//                 onChangeText={setSelectedTime}
//                 editable={false}
//                 placeholder="Enter hours (e.g., 08:00)"
//               />
//               <View style={styles.modalButtons}>
//                 <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleTimeUpdate}>
//                   <Text style={styles.modalButtonText}>Confirm</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.modalButton, styles.cancelButton]}
//                   onPress={() => setTimeModalVisible(false)}
//                 >
//                   <Text style={styles.modalButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </Animatable.View>
//         </Modal>

//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={alertModalVisible}
//           onRequestClose={() => setAlertModalVisible(false)}
//         >
//           <Animatable.View animation="zoomIn" style={styles.modalContainer}>
//             <View style={styles.alertContent}>
//               <Text style={styles.alertTitle}>Notification</Text>
//               <Text style={styles.alertMessage}>{alertMessage}</Text>
//               <TouchableOpacity style={styles.alertButton} onPress={() => setAlertModalVisible(false)}>
//                 <Text style={styles.alertButtonText}>OK</Text>
//               </TouchableOpacity>
//             </View>
//           </Animatable.View>
//         </Modal>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   innerContainer: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   headerCenter: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   logo: {
//     height: 120,
//     width: 180,
//     justifyContent: 'center',
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
//   tableContainer: {
//     flex: 1,
//     padding: 15,
//   },
//   tableHeader: {
//     backgroundColor: '#003087',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   tableHeaderText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     flex: 1,
//   },
//   addTaskButton: {
//     backgroundColor: '#fff',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   addTaskButtonText: {
//     color: '#003087',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   weeklyHoursContainer: {
//     padding: 10,
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   weeklyHoursText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
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
//     backgroundColor: '#e6e6e6',
//   },
//   tableHeadText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     padding: 8,
//     color: '#333',
//   },
//   tableRow: {
//     backgroundColor: '#fff',
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
//   disabledCell: {
//     backgroundColor: '#f0f0f0',
//     opacity: 0.5,
//   },
//   timeCellContent: {
//     alignItems: 'center',
//   },
//   timeDetailText: {
//     fontSize: 10,
//     color: '#555',
//     marginBottom: 2,
//   },
//   hoursText: {
//     fontSize: 12,
//     color: '#333',
//     fontWeight: 'bold',
//   },
//   pickerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   pickerContainer: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     backgroundColor: '#fff',
//     marginHorizontal: 2,
//     height: 60,
//   },
//   selectedPickerContainer: {
//     backgroundColor: '#e6f0ff',
//   },
//   picker: {
//     flex: 1,
//     color: '#000',
//     fontSize: 16,
//     height: 60,
//   },
//   commentIcon: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   paginationContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 10,
//     marginBottom: 15,
//   },
//   pagination: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   paginationText: {
//     fontSize: 12,
//     marginHorizontal: 5,
//   },
//   paginationPicker: {
//     width: 60,
//     height: 30,
//     color: '#333',
//   },
//   paginationArrow: {
//     fontSize: 16,
//     marginHorizontal: 5,
//     color: '#003087',
//   },
//   disabledArrow: {
//     color: '#ccc',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     padding: 25,
//     borderRadius: 12,
//     width: 300,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#003087',
//   },
//   closeIcon: {
//     fontSize: 18,
//     color: '#333',
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 15,
//     fontSize: 14,
//     color: '#333',
//   },
//   timeDisplay: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 15,
//   },
//   submitButton: {
//     backgroundColor: '#28a745',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   modalButton: {
//     paddingVertical: 12,
//     borderRadius: 8,
//     width: 120,
//     alignItems: 'center',
//   },
//   confirmButton: {
//     backgroundColor: '#003087',
//   },
//   cancelButton: {
//     backgroundColor: '#ff0000',
//   },
//   modalButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   alertContent: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     width: 250,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   alertTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#003087',
//     marginBottom: 10,
//   },
//   alertMessage: {
//     fontSize: 14,
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   alertButton: {
//     backgroundColor: '#28a745',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   alertButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });

// export default App;







// working

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   Platform,
// } from 'react-native';
// import axios from 'axios';
// import moment from 'moment-timezone';
// import ipfront from '../constants/ipadd';

// const API_URL = ipfront;

// const Timesheet = () => {
//   const [user, setUser] = useState(null);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [tasks, setTasks] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [currentTime, setCurrentTime] = useState(
//     new Date().toLocaleTimeString('en-US', { hour12: true })
//   );
//   const [weekStartDate, setWeekStartDate] = useState(null);
//   const [weekEndDate, setWeekEndDate] = useState(null);
//   const [totalWeeklyHours, setTotalWeeklyHours] = useState(0);
//   const [taskCategory, setTaskCategory] = useState('');
//   const [taskTitle, setTaskTitle] = useState('');
//   const [taskDescription, setTaskDescription] = useState('');
//   const [percentComplete, setPercentComplete] = useState('0');
//   const [assignedBy, setAssignedBy] = useState('');
//   const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
//   const [timeModalVisible, setTimeModalVisible] = useState(false);
//   const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
//   const [selectedDayIndex, setSelectedDayIndex] = useState(null);
//   const [selectedTime, setSelectedTime] = useState('');

//   // Initialize week dates
//   const updateWeekDates = (date) => {
//     const momentDate = moment(date).tz('Asia/Kolkata');
//     const start = momentDate.startOf('isoWeek').toDate(); // Ensures Monday
//     const end = moment(start).add(6, 'days').endOf('day').toDate();
//     setWeekStartDate(start);
//     setWeekEndDate(end);
//     console.log('weekStartDate set to:', moment(start).format('YYYY-MM-DD'));
//   };

//   // Calculate hours difference
//   const calculateHoursDifference = (login, logout) => {
//     if (!login || !logout) return '00:00';
//     const loginTime = moment(login, 'hh:mm:ss A');
//     const logoutTime = moment(logout, 'hh:mm:ss A');
//     const diff = logoutTime.diff(loginTime, 'hours', true);
//     return diff.toFixed(2).replace('.', ':');
//   };

//   // Calculate total weekly hours
//   const calculateTotalWeeklyHours = (data) => {
//     let total = 0;
//     data.forEach((row) => {
//       row.hours.forEach((hour) => {
//         if (hour && hour !== '00:00') {
//           const [hours, minutes] = hour.split(':').map(Number);
//           total += hours + minutes / 60;
//         }
//       });
//     });
//     setTotalWeeklyHours(total.toFixed(2));
//   };

//   // Check if day is selectable (today only)
//   const isDaySelectable = (dayIndex) => {
//     const today = moment().tz('Asia/Kolkata');
//     const selectedDate = moment(weekStartDate).add(dayIndex, 'days');
//     return selectedDate.isSame(today, 'day');
//   };

//   // Fetch tasks
//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/tasks`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       setTasks(response.data.tasks);
//       const timesheets = response.data.tasks.map((task) => ({
//         projectName: task.projectName,
//         activityName: task.activityName,
//         hours: Array(7).fill('00:00'),
//         loginTimes: Array(7).fill(null),
//         logoutTimes: Array(7).fill(null),
//       }));
//       setTableData(timesheets);
//       calculateTotalWeeklyHours(timesheets);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//       Alert.alert('Error', 'Failed to fetch tasks: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // Handle login
//   const handleLogin = async () => {
//     try {
//       const response = await axios.post(`${API_URL}/api/login`, { email, password });
//       setUser(response.data);
//       setEmail('');
//       setPassword('');
//       await fetchTasks();
//     } catch (error) {
//       Alert.alert('Error', 'Login failed: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // Handle add task
//   const handleAddTask = async () => {
//     if (!taskCategory || !taskTitle) {
//       Alert.alert('Error', 'Project name and activity name are required');
//       return;
//     }

//     const formattedWeekStartDate = weekStartDate
//       ? moment(weekStartDate).format('YYYY-MM-DD')
//       : moment().startOf('isoWeek').format('YYYY-MM-DD');

//     if (moment(formattedWeekStartDate).day() !== 1) {
//       Alert.alert('Error', 'Week start date must be a Monday');
//       return;
//     }

//     const hours = Array(7).fill('00:00');
//     const loginTimes = Array(7).fill(null);
//     const logoutTimes = Array(7).fill(null);

//     const payload = {
//       employeeId: user.employeeId,
//       projectName: taskCategory.trim(),
//       activityName: taskTitle.trim(),
//       taskDescription: taskDescription ? taskDescription.trim() : '',
//       percentComplete: parseFloat(percentComplete) || 0,
//       assignedBy: assignedBy ? assignedBy.trim() : '',
//     };

//     try {
//       const response = await axios.post(`${API_URL}/api/tasks`, payload, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       const newTask = response.data.task;
//       setTasks([...tasks, newTask]);

//       const newTimesheet = {
//         projectName: taskCategory.trim(),
//         activityName: taskTitle.trim(),
//         hours,
//         loginTimes,
//         logoutTimes,
//       };
//       setTableData([...tableData, newTimesheet]);

//       await axios.post(`${API_URL}/api/timesheet`, {
//         employeeId: user.employeeId,
//         projectName: taskCategory.trim(),
//         activityName: taskTitle.trim(),
//         weekStartDate: formattedWeekStartDate,
//         hours,
//         loginTimes,
//         logoutTimes,
//       }, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });

//       setTaskCategory('');
//       setTaskTitle('');
//       setTaskDescription('');
//       setPercentComplete('0');
//       setAssignedBy('');
//       setAddTaskModalVisible(false);
//       Alert.alert('Success', 'Task added successfully');
//     } catch (error) {
//       console.error('Error adding task:', error);
//       Alert.alert('Error', 'Failed to add task: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // Handle time slot click
//   const handleTimeSlotClick = async (taskIndex, dayIndex) => {
//     if (!isDaySelectable(dayIndex)) {
//       Alert.alert('Error', 'You can only record time for today.');
//       return;
//     }

//     const formattedWeekStartDate = weekStartDate
//       ? moment(weekStartDate).format('YYYY-MM-DD')
//       : moment().startOf('isoWeek').format('YYYY-MM-DD');

//     if (moment(formattedWeekStartDate).day() !== 1) {
//       Alert.alert('Error', 'Week start date must be a Monday');
//       return;
//     }

//     const newTableData = [...tableData];
//     const currentRow = newTableData[taskIndex];

//     if (!currentRow.loginTimes[dayIndex]) {
//       currentRow.loginTimes[dayIndex] = currentTime;
//       Alert.alert('Success', `Your login time (${currentTime}) has been recorded.`);
//     } else if (!currentRow.logoutTimes[dayIndex]) {
//       currentRow.logoutTimes[dayIndex] = currentTime;
//       const hoursWorked = calculateHoursDifference(
//         currentRow.loginTimes[dayIndex],
//         currentRow.logoutTimes[dayIndex]
//       );
//       currentRow.hours[dayIndex] = hoursWorked;
//       Alert.alert('Success', `Your logout time (${currentTime}) has been recorded. Hours: ${hoursWorked}`);
//     } else {
//       setSelectedTaskIndex(taskIndex);
//       setSelectedDayIndex(dayIndex);
//       setSelectedTime(currentRow.hours[dayIndex]);
//       setTimeModalVisible(true);
//       return;
//     }

//     setTableData(newTableData);
//     calculateTotalWeeklyHours(newTableData);

//     try {
//       await axios.post(`${API_URL}/api/timesheet`, {
//         employeeId: user.employeeId,
//         projectName: currentRow.projectName,
//         activityName: currentRow.activityName,
//         weekStartDate: formattedWeekStartDate,
//         hours: currentRow.hours,
//         loginTimes: currentRow.loginTimes,
//         logoutTimes: currentRow.logoutTimes,
//       }, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//     } catch (error) {
//       console.error('Error saving timesheet:', error);
//       Alert.alert(
//         'Error',
//         'Failed to save timesheet data: ' + (error.response?.data?.message || error.message)
//       );
//     }
//   };

//   // Handle time update
//   const handleTimeUpdate = async () => {
//     if (selectedTaskIndex !== null && selectedDayIndex !== null) {
//       const formattedWeekStartDate = weekStartDate
//         ? moment(weekStartDate).format('YYYY-MM-DD')
//         : moment().startOf('isoWeek').format('YYYY-MM-DD');

//       if (moment(formattedWeekStartDate).day() !== 1) {
//         Alert.alert('Error', 'Week start date must be a Monday');
//         return;
//       }

//       const newTableData = [...tableData];
//       newTableData[selectedTaskIndex].hours[selectedDayIndex] = selectedTime || '00:00';
//       setTableData(newTableData);
//       calculateTotalWeeklyHours(newTableData);

//       try {
//         await axios.post(`${API_URL}/api/timesheet`, {
//           employeeId: user.employeeId,
//           projectName: newTableData[selectedTaskIndex].projectName,
//           activityName: newTableData[selectedTaskIndex].activityName,
//           weekStartDate: formattedWeekStartDate,
//           hours: newTableData[selectedTaskIndex].hours,
//           loginTimes: newTableData[selectedTaskIndex].loginTimes,
//           logoutTimes: newTableData[selectedTaskIndex].logoutTimes,
//         }, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//       } catch (error) {
//         console.error('Error updating timesheet:', error);
//         Alert.alert(
//           'Error',
//           'Failed to update timesheet data: ' + (error.response?.data?.message || error.message)
//         );
//       }
//     }
//     setTimeModalVisible(false);
//     setSelectedTaskIndex(null);
//     setSelectedDayIndex(null);
//     setSelectedTime('');
//   };

//   // Initialize component
//   useEffect(() => {
//     updateWeekDates(currentDate);
//     const interval = setInterval(() => {
//       const newDate = new Date();
//       setCurrentDate(newDate);
//       setCurrentTime(newDate.toLocaleTimeString('en-US', { hour12: true }));
//       if (newDate.getDay() === 1 && newDate.getHours() === 0 && newDate.getMinutes() === 0) {
//         console.log(
//           'Week reset triggered, new weekStartDate:',
//           moment(newDate).startOf('isoWeek').format('YYYY-MM-DD')
//         );
//         updateWeekDates(newDate);
//         setTableData([]);
//         setTotalWeeklyHours(0);
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // Render login or timesheet
//   if (!user) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Login</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />
//         <TouchableOpacity style={styles.button} onPress={handleLogin}>
//           <Text style={styles.buttonText}>Login</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Timesheet</Text>
//         <View>
//           <Text>Date: {moment(currentDate).format('YYYY-MM-DD')}</Text>
//           <Text>Time: {currentTime}</Text>
//         </View>
//       </View>
//       <View style={styles.weekInfo}>
//         <Text>
//           Week: {moment(weekStartDate).format('YYYY-MM-DD')} to{' '}
//           {moment(weekEndDate).format('YYYY-MM-DD')}
//         </Text>
//         <TouchableOpacity
//           style={styles.addTaskButton}
//           onPress={() => setAddTaskModalVisible(true)}
//         >
//           <Text style={styles.buttonText}>Add Task</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.table}>
//         <View style={styles.tableRow}>
//           <Text style={[styles.tableHeader, { flex: 2 }]}>Project Name</Text>
//           <Text style={[styles.tableHeader, { flex: 2 }]}>Activity Name</Text>
//           {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
//             <Text key={index} style={[styles.tableHeader, { flex: 1 }]}>
//               {day}
//             </Text>
//           ))}
//         </View>
//         <FlatList
//           data={tableData}
//           keyExtractor={(_, index) => index.toString()}
//           renderItem={({ item, index: taskIndex }) => (
//             <View style={styles.tableRow}>
//               <Text style={[styles.tableCell, { flex: 2 }]}>{item.projectName}</Text>
//               <Text style={[styles.tableCell, { flex: 2 }]}>{item.activityName}</Text>
//               {item.hours.map((hours, dayIndex) => (
//                 <TouchableOpacity
//                   key={dayIndex}
//                   style={[
//                     styles.tableCell,
//                     { flex: 1 },
//                     isDaySelectable(dayIndex) && styles.selectableCell,
//                   ]}
//                   onPress={() => handleTimeSlotClick(taskIndex, dayIndex)}
//                   disabled={!isDaySelectable(dayIndex)}
//                 >
//                   <Text>{hours}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         />
//       </View>
//       <Text style={styles.totalHours}>Total Weekly Hours: {totalWeeklyHours}</Text>

//       {/* Add Task Modal */}
//       <Modal visible={addTaskModalVisible} animationType="slide" transparent>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Add Task</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Project Name"
//               value={taskCategory}
//               onChangeText={setTaskCategory}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Activity Name"
//               value={taskTitle}
//               onChangeText={setTaskTitle}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Task Description"
//               value={taskDescription}
//               onChangeText={setTaskDescription}
//               multiline
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Percent Complete"
//               value={percentComplete}
//               onChangeText={setPercentComplete}
//               keyboardType="numeric"
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Assigned By"
//               value={assignedBy}
//               onChangeText={setAssignedBy}
//             />
//             <View style={styles.modalButtons}>
//               <TouchableOpacity style={styles.button} onPress={handleAddTask}>
//                 <Text style={styles.buttonText}>Save</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.button, styles.cancelButton]}
//                 onPress={() => {
//                   setTaskCategory('');
//                   setTaskTitle('');
//                   setTaskDescription('');
//                   setPercentComplete('0');
//                   setAssignedBy('');
//                   setAddTaskModalVisible(false);
//                 }}
//               >
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Time Update Modal */}
//       <Modal visible={timeModalVisible} animationType="slide" transparent>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Update Hours</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Hours (e.g., 08:00)"
//               value={selectedTime}
//               onChangeText={setSelectedTime}
//             />
//             <View style={styles.modalButtons}>
//               <TouchableOpacity style={styles.button} onPress={handleTimeUpdate}>
//                 <Text style={styles.buttonText}>Update</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.button, styles.cancelButton]}
//                 onPress={() => {
//                   setTimeModalVisible(false);
//                   setSelectedTaskIndex(null);
//                   setSelectedDayIndex(null);
//                   setSelectedTime('');
//                 }}
//               >
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   weekInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 8,
//     marginBottom: 16,
//     borderRadius: 4,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 12,
//     borderRadius: 4,
//     alignItems: 'center',
//     marginHorizontal: 4,
//   },
//   cancelButton: {
//     backgroundColor: '#dc3545',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   addTaskButton: {
//     backgroundColor: '#28a745',
//     padding: 8,
//     borderRadius: 4,
//   },
//   table: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     backgroundColor: '#fff',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//   },
//   tableHeader: {
//     fontWeight: 'bold',
//     padding: 8,
//     textAlign: 'center',
//     borderRightWidth: 1,
//     borderColor: '#ccc',
//   },
//   tableCell: {
//     padding: 8,
//     textAlign: 'center',
//     borderRightWidth: 1,
//     borderColor: '#ccc',
//   },
//   selectableCell: {
//     backgroundColor: '#e0e0e0',
//   },
//   totalHours: {
//     marginTop: 16,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 8,
//     width: '80%',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
// });

// export default Timesheet;\

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import axios from 'axios';
// import moment from 'moment-timezone';
// import ipfront from '../constants/ipadd';
// import { useUser } from '../contexts/UserContext';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const API_URL = ipfront;

// const Timesheet = () => {
//   const { user } = useUser();
//   const [tasks, setTasks] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [currentTime, setCurrentTime] = useState(
//     new Date().toLocaleTimeString('en-US', { hour12: true })
//   );
//   const [weekStartDate, setWeekStartDate] = useState(null);
//   const [weekEndDate, setWeekEndDate] = useState(null);
//   const [totalWeeklyHours, setTotalWeeklyHours] = useState(0);
//   const [taskCategory, setTaskCategory] = useState('');
//   const [taskTitle, setTaskTitle] = useState('');
//   const [taskDescription, setTaskDescription] = useState('');
//   const [percentComplete, setPercentComplete] = useState('0');
//   const [assignedBy, setAssignedBy] = useState('');
//   const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
//   const [timeModalVisible, setTimeModalVisible] = useState(false);
//   const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
//   const [selectedDayIndex, setSelectedDayIndex] = useState(null);
//   const [selectedTime, setSelectedTime] = useState('');

//   // Initialize week dates
//   const updateWeekDates = (date) => {
//     const momentDate = moment(date).tz('Asia/Kolkata');
//     const start = momentDate.startOf('isoWeek').toDate(); // Ensures Monday
//     const end = moment(start).add(6, 'days').endOf('day').toDate();
//     setWeekStartDate(start);
//     setWeekEndDate(end);
//     console.log('weekStartDate set to:', moment(start).format('YYYY-MM-DD'));
//   };

//   // Calculate hours difference
//   const calculateHoursDifference = (login, logout) => {
//     if (!login || !logout) return '00:00';
//     const loginTime = moment(login, 'hh:mm:ss A');
//     const logoutTime = moment(logout, 'hh:mm:ss A');
//     const diff = logoutTime.diff(loginTime, 'hours', true);
//     return diff.toFixed(2).replace('.', ':');
//   };

//   // Calculate total weekly hours
//   const calculateTotalWeeklyHours = (data) => {
//     let total = 0;
//     data.forEach((row) => {
//       row.hours.forEach((hour) => {
//         if (hour && hour !== '00:00') {
//           const [hours, minutes] = hour.split(':').map(Number);
//           total += hours + minutes / 60;
//         }
//       });
//     });
//     setTotalWeeklyHours(total.toFixed(2));
//   };

//   // Check if day is selectable (today only)
//   const isDaySelectable = (dayIndex) => {
//     const today = moment().tz('Asia/Kolkata');
//     const selectedDate = moment(weekStartDate).add(dayIndex, 'days');
//     return selectedDate.isSame(today, 'day');
//   };

//   // Fetch tasks
//   const fetchTasks = async () => {
//     if (!user || !user.token) return;
//     try {
//       const response = await axios.get(`${API_URL}/api/tasks`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       setTasks(response.data.tasks);
//       const timesheets = response.data.tasks.map((task) => ({
//         projectName: task.projectName,
//         activityName: task.activityName,
//         hours: Array(7).fill('00:00'),
//         loginTimes: Array(7).fill(null),
//         logoutTimes: Array(7).fill(null),
//       }));
//       setTableData(timesheets);
//       calculateTotalWeeklyHours(timesheets);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//       Alert.alert('Error', 'Failed to fetch tasks: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // Handle add task
//   const handleAddTask = async () => {
//     if (!taskCategory || !taskTitle) {
//       Alert.alert('Error', 'Project name and activity name are required');
//       return;
//     }

//     const formattedWeekStartDate = weekStartDate
//       ? moment(weekStartDate).format('YYYY-MM-DD')
//       : moment().startOf('isoWeek').format('YYYY-MM-DD');

//     if (moment(formattedWeekStartDate).day() !== 1) {
//       Alert.alert('Error', 'Week start date must be a Monday');
//       return;
//     }

//     const hours = Array(7).fill('00:00');
//     const loginTimes = Array(7).fill(null);
//     const logoutTimes = Array(7).fill(null);

//     const payload = {
//       employeeId: user.employeeId,
//       projectName: taskCategory.trim(),
//       activityName: taskTitle.trim(),
//       taskDescription: taskDescription ? taskDescription.trim() : '',
//       percentComplete: parseFloat(percentComplete) || 0,
//       assignedBy: assignedBy ? assignedBy.trim() : '',
//     };

//     try {
//       const response = await axios.post(`${API_URL}/api/tasks`, payload, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       const newTask = response.data.task;
//       setTasks([...tasks, newTask]);

//       const newTimesheet = {
//         projectName: taskCategory.trim(),
//         activityName: taskTitle.trim(),
//         hours,
//         loginTimes,
//         logoutTimes,
//       };
//       setTableData([...tableData, newTimesheet]);

//       await axios.post(`${API_URL}/api/timesheet`, {
//         employeeId: user.employeeId,
//         projectName: taskCategory.trim(),
//         activityName: taskTitle.trim(),
//         weekStartDate: formattedWeekStartDate,
//         hours,
//         loginTimes,
//         logoutTimes,
//       }, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });

//       setTaskCategory('');
//       setTaskTitle('');
//       setTaskDescription('');
//       setPercentComplete('0');
//       setAssignedBy('');
//       setAddTaskModalVisible(false);
//       Alert.alert('Success', 'Task added successfully');
//     } catch (error) {
//       console.error('Error adding task:', error);
//       Alert.alert('Error', 'Failed to add task: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // Handle time slot click
//   const handleTimeSlotClick = async (taskIndex, dayIndex) => {
//     if (!isDaySelectable(dayIndex)) {
//       Alert.alert('Error', 'You can only record time for today.');
//       return;
//     }

//     const formattedWeekStartDate = weekStartDate
//       ? moment(weekStartDate).format('YYYY-MM-DD')
//       : moment().startOf('isoWeek').format('YYYY-MM-DD');

//     if (moment(formattedWeekStartDate).day() !== 1) {
//       Alert.alert('Error', 'Week start date must be a Monday');
//       return;
//     }

//     const newTableData = [...tableData];
//     const currentRow = newTableData[taskIndex];

//     if (!currentRow.loginTimes[dayIndex]) {
//       currentRow.loginTimes[dayIndex] = currentTime;
//       Alert.alert('Success', `Your login time (${currentTime}) has been recorded.`);
//     } else if (!currentRow.logoutTimes[dayIndex]) {
//       currentRow.logoutTimes[dayIndex] = currentTime;
//       const hoursWorked = calculateHoursDifference(
//         currentRow.loginTimes[dayIndex],
//         currentRow.logoutTimes[dayIndex]
//       );
//       currentRow.hours[dayIndex] = hoursWorked;
//       Alert.alert('Success', `Your logout time (${currentTime}) has been recorded. Hours: ${hoursWorked}`);
//     } else {
//       setSelectedTaskIndex(taskIndex);
//       setSelectedDayIndex(dayIndex);
//       setSelectedTime(currentRow.hours[dayIndex]);
//       setTimeModalVisible(true);
//       return;
//     }

//     setTableData(newTableData);
//     calculateTotalWeeklyHours(newTableData);

//     try {
//       await axios.post(`${API_URL}/api/timesheet`, {
//         employeeId: user.employeeId,
//         projectName: currentRow.projectName,
//         activityName: currentRow.activityName,
//         weekStartDate: formattedWeekStartDate,
//         hours: currentRow.hours,
//         loginTimes: currentRow.loginTimes,
//         logoutTimes: currentRow.logoutTimes,
//       }, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//     } catch (error) {
//       console.error('Error saving timesheet:', error);
//       Alert.alert(
//         'Error',
//         'Failed to save timesheet data: ' + (error.response?.data?.message || error.message)
//       );
//     }
//   };

//   // Handle time update
//   const handleTimeUpdate = async () => {
//     if (selectedTaskIndex !== null && selectedDayIndex !== null) {
//       const formattedWeekStartDate = weekStartDate
//         ? moment(weekStartDate).format('YYYY-MM-DD')
//         : moment().startOf('isoWeek').format('YYYY-MM-DD');

//       if (moment(formattedWeekStartDate).day() !== 1) {
//         Alert.alert('Error', 'Week start date must be a Monday');
//         return;
//       }

//       const newTableData = [...tableData];
//       newTableData[selectedTaskIndex].hours[selectedDayIndex] = selectedTime || '00:00';
//       setTableData(newTableData);
//       calculateTotalWeeklyHours(newTableData);

//       try {
//         await axios.post(`${API_URL}/api/timesheet`, {
//           employeeId: user.employeeId,
//           projectName: newTableData[selectedTaskIndex].projectName,
//           activityName: newTableData[selectedTaskIndex].activityName,
//           weekStartDate: formattedWeekStartDate,
//           hours: newTableData[selectedTaskIndex].hours,
//           loginTimes: newTableData[selectedTaskIndex].loginTimes,
//           logoutTimes: newTableData[selectedTaskIndex].logoutTimes,
//         }, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//       } catch (error) {
//         console.error('Error updating timesheet:', error);
//         Alert.alert(
//           'Error',
//           'Failed to update timesheet data: ' + (error.response?.data?.message || error.message)
//         );
//       }
//     }
//     setTimeModalVisible(false);
//     setSelectedTaskIndex(null);
//     setSelectedDayIndex(null);
//     setSelectedTime('');
//   };

//   // Initialize component
//   useEffect(() => {
//     updateWeekDates(currentDate);
//     if (user) {
//       fetchTasks();
//     }
//     const interval = setInterval(() => {
//       const newDate = new Date();
//       setCurrentDate(newDate);
//       setCurrentTime(newDate.toLocaleTimeString('en-US', { hour12: true }));
//       if (newDate.getDay() === 1 && newDate.getHours() === 0 && newDate.getMinutes() === 0) {
//         console.log(
//           'Week reset triggered, new weekStartDate:',
//           moment(newDate).startOf('isoWeek').format('YYYY-MM-DD')
//         );
//         updateWeekDates(newDate);
//         setTableData([]);
//         setTotalWeeklyHours(0);
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [user]);

//   // Render if not logged in
//   if (!user) {
//     return (
//       <LinearGradient
//         colors={['#002343', '#4c87ba', '#002343']}
//         start={{ x: 0.1, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.gradient}
//       >
//         <View style={styles.container}>
//           <Text style={styles.title}>Please Log In</Text>
//           <Text style={styles.subtitle}>You need to be logged in to view the timesheet.</Text>
//         </View>
//       </LinearGradient>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//     <LinearGradient
//       colors={['#002343', '#4c87ba', '#002343']}
//       start={{ x: 0.1, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.gradient}
//     >
//       <ScrollView style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Timesheet</Text>
//           <View>
//             <Text style={styles.weekInfoText}>Date: {moment(currentDate).format('YYYY-MM-DD')}</Text>
//             <Text style={styles.weekInfoText}>Time: {currentTime}</Text>
//           </View>
//         </View>
//         <View style={styles.weekInfo}>
//           <Text style={styles.weekInfoText}>
//             Week: {moment(weekStartDate).format('YYYY-MM-DD')} to{' '}
//             {moment(weekEndDate).format('YYYY-MM-DD')}
//           </Text>
//           <TouchableOpacity
//             style={styles.addTaskButton}
//             onPress={() => setAddTaskModalVisible(true)}
//           >
//             <Text style={styles.buttonText}>Add Task</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.table}>
//           <ScrollView horizontal showsHorizontalScrollIndicator={true}>
//             <View style={styles.tableContent}>
//               <View style={styles.tableRow}>
//                 <Text style={[styles.tableHeader, { width: 120 }]}>Project Name</Text>
//                 <Text style={[styles.tableHeader, { width: 120 }]}>Activity Name</Text>
//                 {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
//                   <Text key={index} style={[styles.tableHeader, { width: 60 }]}>
//                     {day}
//                   </Text>
//                 ))}
//               </View>
//               <FlatList
//                 data={tableData}
//                 keyExtractor={(_, index) => index.toString()}
//                 renderItem={({ item, index: taskIndex }) => (
//                   <View style={styles.tableRow}>
//                     <Text
//                       style={[styles.tableCell, { width: 120 }]}
//                       numberOfLines={1}
//                       ellipsizeMode="tail"
//                     >
//                       {item.projectName}
//                     </Text>
//                     <Text
//                       style={[styles.tableCell, { width: 120 }]}
//                       numberOfLines={1}
//                       ellipsizeMode="tail"
//                     >
//                       {item.activityName}
//                     </Text>
//                     {item.hours.map((hours, dayIndex) => (
//                       <TouchableOpacity
//                         key={dayIndex}
//                         style={[
//                           styles.tableCell,
//                           { width: 60 },
//                           isDaySelectable(dayIndex) && styles.selectableCell,
//                         ]}
//                         onPress={() => handleTimeSlotClick(taskIndex, dayIndex)}
//                         disabled={!isDaySelectable(dayIndex)}
//                       >
//                         <Text>{hours}</Text>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                 )}
//               />
//             </View>
//           </ScrollView>
//         </View>
//         <Text style={styles.totalHours}>Total Weekly Hours: {totalWeeklyHours}</Text>

//         {/* Add Task Modal */}
//         <Modal visible={addTaskModalVisible} animationType="slide" transparent>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Add Task</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Project Name"
//                 value={taskCategory}
//                 onChangeText={setTaskCategory}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Activity Name"
//                 value={taskTitle}
//                 onChangeText={setTaskTitle}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Task Description"
//                 value={taskDescription}
//                 onChangeText={setTaskDescription}
//                 multiline
//                 numberOfLines={3}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Percent Complete"
//                 value={percentComplete}
//                 onChangeText={setPercentComplete}
//                 keyboardType="numeric"
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Assigned By"
//                 value={assignedBy}
//                 onChangeText={setAssignedBy}
//               />
//               <View style={styles.modalButtons}>
//                 <TouchableOpacity style={styles.button} onPress={handleAddTask}>
//                   <Text style={styles.buttonText}>Save</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.button, styles.cancelButton]}
//                   onPress={() => {
//                     setTaskCategory('');
//                     setTaskTitle('');
//                     setTaskDescription('');
//                     setPercentComplete('0');
//                     setAssignedBy('');
//                     setAddTaskModalVisible(false);
//                   }}
//                 >
//                   <Text style={styles.buttonText}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>

//         {/* Time Update Modal */}
//         <Modal visible={timeModalVisible} animationType="slide" transparent>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Update Hours</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Hours (e.g., 08:00)"
//                 value={selectedTime}
//                 onChangeText={setSelectedTime}
//               />
//               <View style={styles.modalButtons}>
//                 <TouchableOpacity style={styles.button} onPress={handleTimeUpdate}>
//                   <Text style={styles.buttonText}>Update</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.button, styles.cancelButton]}
//                   onPress={() => {
//                     setTimeModalVisible(false);
//                     setSelectedTaskIndex(null);
//                     setSelectedDayIndex(null);
//                     setSelectedTime('');
//                   }}
//                 >
//                   <Text style={styles.buttonText}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </ScrollView>
//     </LinearGradient>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // backgroundColor: '#f8fafc',
//     padding: 20,
//     marginTop: 15
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 20,
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#002343', // Dark blue from gradient
//     letterSpacing: 0.5,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#4b5563', // Neutral gray for subtitle
//     textAlign: 'center',
//     marginTop: 12,
//   },
//   weekInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   weekInfoText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#1f2937', // Dark gray for better contrast
//   },
//   table: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//     marginBottom: 20,
//   },
//   tableContent: {
//     minWidth: 540, // Ensures table is wide enough for all columns
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor: '#e5e7eb', // Light gray border
//     backgroundColor: '#fff',
//   },
//   tableHeader: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#fff',
//     textAlign: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//     borderRightWidth: 1,
//     borderColor: '#e5e7eb',
//     backgroundColor: '#4c87ba', // Medium blue from gradient
//   },
//   tableCell: {
//     fontSize: 13,
//     color: '#1f2937',
//     textAlign: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//     borderRightWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   selectableCell: {
//     backgroundColor: '#e6f0ff', // Light blue for selectable cells
//   },
//   totalHours: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//     textAlign: 'center',
//     padding: 16,
//     borderRadius: 12,
//     backgroundColor: '#002343', // Dark blue from gradient
//     marginBottom: 20,
//   },
//   addTaskButton: {
//     backgroundColor: '#22c55e', // Vibrant green for action button
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 35, 67, 0.7)', // Semi-transparent dark blue overlay
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     padding: 24,
//     borderRadius: 16,
//     width: '90%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 8,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#002343',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#d1d5db', // Light gray border
//     borderRadius: 8,
//     padding: 14,
//     marginBottom: 16,
//     fontSize: 16,
//     color: '#1f2937',
//     backgroundColor: '#f9fafb', // Very light gray input background
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   button: {
//     backgroundColor: '#002343', // Dark blue for primary buttons
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     flex: 1,
//     alignItems: 'center',
//     marginHorizontal: 8,
//   },
//   cancelButton: {
//     backgroundColor: '#ef4444', // Red for cancel buttons
//   },
//   gradient: {
//     ...StyleSheet.absoluteFillObject, // Fills entire container
//     zIndex: -1, // Places gradient behind content
//   },
// });

// export default Timesheet;



// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import axios from 'axios';
// import moment from 'moment-timezone';
// import ipfront from '../constants/ipadd';
// import { useUser } from '../contexts/UserContext';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useFocusEffect } from '@react-navigation/native';

// const API_URL = ipfront;

// const Timesheet = () => {
//   const { user } = useUser();
//   const [tasks, setTasks] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [currentTime, setCurrentTime] = useState(
//     new Date().toLocaleTimeString('en-US', { hour12: true })
//   );
//   const [weekStartDate, setWeekStartDate] = useState(null);
//   const [weekEndDate, setWeekEndDate] = useState(null);
//   const [totalWeeklyHours, setTotalWeeklyHours] = useState(0);
//   const [taskCategory, setTaskCategory] = useState('');
//   const [taskTitle, setTaskTitle] = useState('');
//   const [taskDescription, setTaskDescription] = useState('');
//   const [percentComplete, setPercentComplete] = useState('0');
//   const [assignedBy, setAssignedBy] = useState('');
//   const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
//   const [timeModalVisible, setTimeModalVisible] = useState(false);
//   const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
//   const [selectedDayIndex, setSelectedDayIndex] = useState(null);
//   const [selectedTime, setSelectedTime] = useState('');

//   // Initialize week dates
//   const updateWeekDates = (date) => {
//     const momentDate = moment(date).tz('Asia/Kolkata');
//     const start = momentDate.startOf('isoWeek').toDate(); // Ensures Monday
//     const end = moment(start).add(6, 'days').endOf('day').toDate();
//     setWeekStartDate(start);
//     setWeekEndDate(end);
//     console.log('weekStartDate set to:', moment(start).format('YYYY-MM-DD'));
//   };

//   // Calculate hours difference
//   const calculateHoursDifference = (login, logout) => {
//     if (!login || !logout) return '00:00';
//     const loginTime = moment(login, 'hh:mm:ss A');
//     const logoutTime = moment(logout, 'hh:mm:ss A');
//     const diff = logoutTime.diff(loginTime, 'hours', true);
//     return diff.toFixed(2).replace('.', ':');
//   };

//   // Calculate total weekly hours
//   const calculateTotalWeeklyHours = (data) => {
//     let total = 0;
//     data.forEach((row) => {
//       row.hours.forEach((hour) => {
//         if (hour && hour !== '00:00') {
//           const [hours, minutes] = hour.split(':').map(Number);
//           total += hours + minutes / 60;
//         }
//       });
//     });
//     setTotalWeeklyHours(total.toFixed(2));
//   };

//   // Check if day is selectable (today only)
//   const isDaySelectable = (dayIndex) => {
//     const today = moment().tz('Asia/Kolkata');
//     const selectedDate = moment(weekStartDate).add(dayIndex, 'days');
//     return selectedDate.isSame(today, 'day');
//   };

//   // Fetch tasks and timesheets
//   const fetchTasks = async () => {
//     if (!user || !user.token) return;
//     try {
//       // Fetch tasks
//       const taskResponse = await axios.get(`${API_URL}/api/tasks`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       const tasks = taskResponse.data.tasks;

//       // Fetch timesheets for the current week
//       const formattedWeekStartDate = weekStartDate
//         ? moment(weekStartDate).format('YYYY-MM-DD')
//         : moment().startOf('isoWeek').format('YYYY-MM-DD');
//       const timesheetResponse = await axios.get(`${API_URL}/api/timesheet`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//         params: {
//           employeeId: user.employeeId,
//           weekStartDate: formattedWeekStartDate,
//         },
//       });
//       const timesheets = timesheetResponse.data.timesheets || [];

//       // Merge tasks with timesheet data
//       const mergedData = tasks.map((task) => {
//         const timesheet = timesheets.find(
//           (ts) =>
//             ts.projectName === task.projectName &&
//             ts.activityName === task.activityName &&
//             ts.weekStartDate === formattedWeekStartDate
//         );
//         return {
//           projectName: task.projectName,
//           activityName: task.activityName,
//           hours: timesheet?.hours || Array(7).fill('00:00'),
//           loginTimes: timesheet?.loginTimes || Array(7).fill(null),
//           logoutTimes: timesheet?.logoutTimes || Array(7).fill(null),
//         };
//       });

//       setTasks(tasks);
//       setTableData(mergedData);
//       calculateTotalWeeklyHours(mergedData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       Alert.alert('Error', 'Failed to fetch data: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // Handle add task
//   const handleAddTask = async () => {
//     if (!taskCategory || !taskTitle) {
//       Alert.alert('Error', 'Project name and activity name are required');
//       return;
//     }

//     const formattedWeekStartDate = weekStartDate
//       ? moment(weekStartDate).format('YYYY-MM-DD')
//       : moment().startOf('isoWeek').format('YYYY-MM-DD');

//     if (moment(formattedWeekStartDate).day() !== 1) {
//       Alert.alert('Error', 'Week start date must be a Monday');
//       return;
//     }

//     const hours = Array(7).fill('00:00');
//     const loginTimes = Array(7).fill(null);
//     const logoutTimes = Array(7).fill(null);

//     const taskPayload = {
//       employeeId: user.employeeId,
//       projectName: taskCategory.trim(),
//       activityName: taskTitle.trim(),
//       taskDescription: taskDescription ? taskDescription.trim() : '',
//       percentComplete: parseFloat(percentComplete) || 0,
//       assignedBy: assignedBy ? assignedBy.trim() : '',
//     };

//     try {
//       // Add task
//       const taskResponse = await axios.post(`${API_URL}/api/tasks`, taskPayload, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       const newTask = taskResponse.data.task;
//       setTasks([...tasks, newTask]);

//       // Add timesheet
//       const newTimesheet = {
//         projectName: taskCategory.trim(),
//         activityName: taskTitle.trim(),
//         hours,
//         loginTimes,
//         logoutTimes,
//       };
//       setTableData([...tableData, newTimesheet]);

//       await axios.post(
//         `${API_URL}/api/timesheet`,
//         {
//           employeeId: user.employeeId,
//           projectName: taskCategory.trim(),
//           activityName: taskTitle.trim(),
//           weekStartDate: formattedWeekStartDate,
//           hours,
//           loginTimes,
//           logoutTimes,
//         },
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         }
//       );

//       setTaskCategory('');
//       setTaskTitle('');
//       setTaskDescription('');
//       setPercentComplete('0');
//       setAssignedBy('');
//       setAddTaskModalVisible(false);
//       Alert.alert('Success', 'Task added successfully');
//     } catch (error) {
//       console.error('Error adding task:', error);
//       Alert.alert('Error', 'Failed to add task: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // Handle time slot click
//   const handleTimeSlotClick = async (taskIndex, dayIndex) => {
//     if (!isDaySelectable(dayIndex)) {
//       Alert.alert('Error', 'You can only record time for today.');
//       return;
//     }

//     const formattedWeekStartDate = weekStartDate
//       ? moment(weekStartDate).format('YYYY-MM-DD')
//       : moment().startOf('isoWeek').format('YYYY-MM-DD');

//     if (moment(formattedWeekStartDate).day() !== 1) {
//       Alert.alert('Error', 'Week start date must be a Monday');
//       return;
//     }

//     // Fetch latest timesheet data for the task
//     try {
//       const timesheetResponse = await axios.get(`${API_URL}/api/timesheet`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//         params: {
//           employeeId: user.employeeId,
//           weekStartDate: formattedWeekStartDate,
//           projectName: tableData[taskIndex].projectName,
//           activityName: tableData[taskIndex].activityName,
//         },
//       });
//       const timesheet = timesheetResponse.data.timesheets?.[0] || {};

//       const newTableData = [...tableData];
//       const currentRow = newTableData[taskIndex];

//       // Update currentRow with latest data from backend
//       currentRow.hours = timesheet.hours || currentRow.hours;
//       currentRow.loginTimes = timesheet.loginTimes || currentRow.loginTimes;
//       currentRow.logoutTimes = timesheet.logoutTimes || currentRow.logoutTimes;

//       if (!currentRow.loginTimes[dayIndex]) {
//         // Record login time
//         currentRow.loginTimes[dayIndex] = currentTime;
//         Alert.alert('Success', `Your login time (${currentTime}) has been recorded.`);
//       } else if (!currentRow.logoutTimes[dayIndex]) {
//         // Record logout time
//         currentRow.logoutTimes[dayIndex] = currentTime;
//         const hoursWorked = calculateHoursDifference(
//           currentRow.loginTimes[dayIndex],
//           currentRow.logoutTimes[dayIndex]
//         );
//         currentRow.hours[dayIndex] = hoursWorked;
//         Alert.alert('Success', `Your logout time (${currentTime}) has been recorded. Hours: ${hoursWorked}`);
//       } else {
//         // Both times recorded; open edit modal
//         setSelectedTaskIndex(taskIndex);
//         setSelectedDayIndex(dayIndex);
//         setSelectedTime(currentRow.hours[dayIndex]);
//         setTimeModalVisible(true);
//         return;
//       }

//       setTableData(newTableData);
//       calculateTotalWeeklyHours(newTableData);

//       // Save updated timesheet
//       await axios.post(
//         `${API_URL}/api/timesheet`,
//         {
//           employeeId: user.employeeId,
//           projectName: currentRow.projectName,
//           activityName: currentRow.activityName,
//           weekStartDate: formattedWeekStartDate,
//           hours: currentRow.hours,
//           loginTimes: currentRow.loginTimes,
//           logoutTimes: currentRow.logoutTimes,
//         },
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         }
//       );
//     } catch (error) {
//       console.error('Error handling time slot click:', error);
//       Alert.alert('Error', 'Failed to process time: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // Handle time update
//   const handleTimeUpdate = async () => {
//     if (selectedTaskIndex !== null && selectedDayIndex !== null) {
//       const formattedWeekStartDate = weekStartDate
//         ? moment(weekStartDate).format('YYYY-MM-DD')
//         : moment().startOf('isoWeek').format('YYYY-MM-DD');

//       if (moment(formattedWeekStartDate).day() !== 1) {
//         Alert.alert('Error', 'Week start date must be a Monday');
//         return;
//       }

//       const newTableData = [...tableData];
//       newTableData[selectedTaskIndex].hours[selectedDayIndex] = selectedTime || '00:00';
//       setTableData(newTableData);
//       calculateTotalWeeklyHours(newTableData);

//       try {
//         await axios.post(
//           `${API_URL}/api/timesheet`,
//           {
//             employeeId: user.employeeId,
//             projectName: newTableData[selectedTaskIndex].projectName,
//             activityName: newTableData[selectedTaskIndex].activityName,
//             weekStartDate: formattedWeekStartDate,
//             hours: newTableData[selectedTaskIndex].hours,
//             loginTimes: newTableData[selectedTaskIndex].loginTimes,
//             logoutTimes: newTableData[selectedTaskIndex].logoutTimes,
//           },
//           {
//             headers: { Authorization: `Bearer ${user.token}` },
//           }
//         );
//       } catch (error) {
//         console.error('Error updating timesheet:', error);
//         Alert.alert(
//           'Error',
//           'Failed to update timesheet data: ' + (error.response?.data?.message || error.message)
//         );
//       }
//     }
//     setTimeModalVisible(false);
//     setSelectedTaskIndex(null);
//     setSelectedDayIndex(null);
//     setSelectedTime('');
//   };

//   // Initialize component and handle tab focus
//   useEffect(() => {
//     updateWeekDates(currentDate);
//     if (user) {
//       fetchTasks();
//     }
//     const interval = setInterval(() => {
//       const newDate = new Date();
//       setCurrentDate(newDate);
//       setCurrentTime(newDate.toLocaleTimeString('en-US', { hour12: true }));
//       if (newDate.getDay() === 1 && newDate.getHours() === 0 && newDate.getMinutes() === 0) {
//         console.log(
//           'Week reset triggered, new weekStartDate:',
//           moment(newDate).startOf('isoWeek').format('YYYY-MM-DD')
//         );
//         updateWeekDates(newDate);
//         setTableData([]);
//         setTasks([]);
//         setTotalWeeklyHours(0);
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [user]);

//   // Refetch data when screen comes into focus
//   useFocusEffect(
//     React.useCallback(() => {
//       if (user) {
//         fetchTasks();
//       }
//     }, [user, weekStartDate])
//   );

//   // Render if not logged in
//   if (!user) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <LinearGradient
//           colors={['#002343', '#4c87ba', '#002343']}
//           start={{ x: 0.1, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.gradient}
//         >
//           <View style={styles.innerContainer}>
//             <Text style={styles.title}>Please Log In</Text>
//             <Text style={styles.subtitle}>You need to be logged in to view the Timesheet.</Text>
//           </View>
//         </LinearGradient>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient
//         colors={['#002343', '#4c87ba', '#002343']}
//         start={{ x: 0.1, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.gradient}
//       >
//         <ScrollView style={styles.innerContainer}>
//           <View style={styles.header}>
//             <Text style={styles.title}>Timesheet</Text>
//             <View>
//               <Text style={styles.weekInfoText}>Date: {moment(currentDate).format('YYYY-MM-DD')}</Text>
//               <Text style={styles.weekInfoText}>Time: {currentTime}</Text>
//             </View>
//           </View>
//           <View style={styles.weekInfo}>
//             <Text style={styles.weekInfoText}>
//               Week: {moment(weekStartDate).format('YYYY-MM-DD')} to{' '}
//               {moment(weekEndDate).format('YYYY-MM-DD')}
//             </Text>
//             <TouchableOpacity
//               style={styles.addTaskButton}
//               onPress={() => setAddTaskModalVisible(true)}
//             >
//               <Text style={styles.buttonText}>Add Task</Text>
//             </TouchableOpacity>
//           </View>
//           <View style={styles.table}>
//             <ScrollView horizontal showsHorizontalScrollIndicator={true}>
//               <View style={styles.tableContent}>
//                 <View style={styles.tableRow}>
//                   <Text style={[styles.tableHeader, { width: 120 }]}>Project Name</Text>
//                   <Text style={[styles.tableHeader, { width: 120 }]}>Activity Name</Text>
//                   {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
//                     <Text key={index} style={[styles.tableHeader, { width: 80 }]}>
//                       {day}
//                     </Text>
//                   ))}
//                 </View>
//                 <FlatList
//                   data={tableData}
//                   keyExtractor={(_, index) => index.toString()}
//                   renderItem={({ item, index: taskIndex }) => (
//                     <View style={styles.tableRow}>
//                       <Text
//                         style={[styles.tableCell, { width: 120 }]}
//                         numberOfLines={1}
//                         ellipsizeMode="tail"
//                       >
//                         {item.projectName}
//                       </Text>
//                       <Text
//                         style={[styles.tableCell, { width: 120 }]}
//                         numberOfLines={1}
//                         ellipsizeMode="tail"
//                       >
//                         {item.activityName}
//                       </Text>
//                       {item.hours.map((hours, dayIndex) => (
//                         <TouchableOpacity
//                           key={dayIndex}
//                           style={[
//                             styles.tableCell,
//                             { width: 80, minHeight: 60 },
//                             isDaySelectable(dayIndex) && styles.selectableCell,
//                           ]}
//                           onPress={() => handleTimeSlotClick(taskIndex, dayIndex)}
//                           disabled={!isDaySelectable(dayIndex)}
//                         >
//                           <Text numberOfLines={2}>
//                             {item.loginTimes[dayIndex]
//                               ? `Login: ${item.loginTimes[dayIndex]}${
//                                   item.logoutTimes[dayIndex] ? `\nLogout: ${item.logoutTimes[dayIndex]}` : ''
//                                 }`
//                               : hours}
//                           </Text>
//                         </TouchableOpacity>
//                       ))}
//                     </View>
//                   )}
//                 />
//               </View>
//             </ScrollView>
//           </View>
//           <Text style={styles.totalHours}>Total Weekly Hours: {totalWeeklyHours}</Text>

//           {/* Add Task Modal */}
//           <Modal visible={addTaskModalVisible} animationType="slide" transparent>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>Add Task</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Project Name"
//                   value={taskCategory}
//                   onChangeText={setTaskCategory}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Activity Name"
//                   value={taskTitle}
//                   onChangeText={setTaskTitle}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Task Description"
//                   value={taskDescription}
//                   onChangeText={setTaskDescription}
//                   multiline
//                   numberOfLines={3}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Percent Complete"
//                   value={percentComplete}
//                   onChangeText={setPercentComplete}
//                   keyboardType="numeric"
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Assigned By"
//                   value={assignedBy}
//                   onChangeText={setAssignedBy}
//                 />
//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity style={styles.button} onPress={handleAddTask}>
//                     <Text style={styles.buttonText}>Save</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.button, styles.cancelButton]}
//                     onPress={() => {
//                       setTaskCategory('');
//                       setTaskTitle('');
//                       setTaskDescription('');
//                       setPercentComplete('0');
//                       setAssignedBy('');
//                       setAddTaskModalVisible(false);
//                     }}
//                   >
//                     <Text style={styles.buttonText}>Cancel</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </Modal>

//           {/* Time Update Modal */}
//           <Modal visible={timeModalVisible} animationType="slide" transparent>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>Update Hours</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Hours (e.g., 08:00)"
//                   value={selectedTime}
//                   onChangeText={setSelectedTime}
//                 />
//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity style={styles.button} onPress={handleTimeUpdate}>
//                     <Text style={styles.buttonText}>Update</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.button, styles.cancelButton]}
//                     onPress={() => {
//                       setTimeModalVisible(false);
//                       setSelectedTaskIndex(null);
//                       setSelectedDayIndex(null);
//                       setSelectedTime('');
//                     }}
//                   >
//                     <Text style={styles.buttonText}>Cancel</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </Modal>
//         </ScrollView>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: 15,
//     padding: 20,
//   },
//   innerContainer: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 20,
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#002343',
//     letterSpacing: 0.5,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#4b5563',
//     textAlign: 'center',
//     marginTop: 12,
//   },
//   weekInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   weekInfoText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#1f2937',
//   },
//   table: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//     marginBottom: 20,
//   },
//   tableContent: {
//     minWidth: 800,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor: '#e5e7eb',
//     backgroundColor: '#fff',
//   },
//   tableHeader: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#fff',
//     textAlign: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//     borderRightWidth: 1,
//     borderColor: '#e5e7eb',
//     backgroundColor: '#4c87ba',
//   },
//   tableCell: {
//     fontSize: 13,
//     color: '#1f2937',
//     textAlign: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//     borderRightWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   selectableCell: {
//     backgroundColor: '#e6f0ff',
//   },
//   totalHours: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//     textAlign: 'center',
//     padding: 16,
//     borderRadius: 12,
//     backgroundColor: '#002343',
//     marginBottom: 20,
//   },
//   addTaskButton: {
//     backgroundColor: '#22c55e',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 35, 67, 0.7)',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     padding: 24,
//     borderRadius: 16,
//     width: '90%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 8,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#002343',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 14,
//     marginBottom: 16,
//     fontSize: 16,
//     color: '#1f2937',
//     backgroundColor: '#f9fafb',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   button: {
//     backgroundColor: '#002343',
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     flex: 1,
//     alignItems: 'center',
//     marginHorizontal: 8,
//   },
//   cancelButton: {
//     backgroundColor: '#ef4444',
//   },
//   gradient: {
//     ...StyleSheet.absoluteFillObject,
//     zIndex: -1,
//   },
// });

// export default Timesheet;


// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import axios from 'axios';
// import moment from 'moment-timezone';
// import ipfront from '../constants/ipadd';
// import { useUser } from '../contexts/UserContext';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useFocusEffect } from '@react-navigation/native';

// const API_URL = ipfront;

// const Timesheet = () => {
//   const { user } = useUser();
//   const [tasks, setTasks] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [currentTime, setCurrentTime] = useState(
//     new Date().toLocaleTimeString('en-US', { hour12: true })
//   );
//   const [weekStartDate, setWeekStartDate] = useState(null);
//   const [weekEndDate, setWeekEndDate] = useState(null);
//   const [totalWeeklyHours, setTotalWeeklyHours] = useState(0);
//   const [taskCategory, setTaskCategory] = useState('');
//   const [taskTitle, setTaskTitle] = useState('');
//   const [taskDescription, setTaskDescription] = useState('');
//   const [percentComplete, setPercentComplete] = useState('0');
//   const [assignedBy, setAssignedBy] = useState('');
//   const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
//   const [timeModalVisible, setTimeModalVisible] = useState(false);
//   const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
//   const [selectedDayIndex, setSelectedDayIndex] = useState(null);
//   const [selectedTime, setSelectedTime] = useState('');

//   // Initialize week dates
//   const updateWeekDates = (date) => {
//     const momentDate = moment(date).tz('Asia/Kolkata');
//     const start = momentDate.startOf('isoWeek').toDate(); // Ensures Monday
//     const end = moment(start).add(6, 'days').endOf('day').toDate();
//     setWeekStartDate(start);
//     setWeekEndDate(end);
//     console.log('weekStartDate set to:', moment(start).format('YYYY-MM-DD'));
//   };

//   // Calculate hours difference
//   const calculateHoursDifference = (login, logout) => {
//     if (!login || !logout) return '00:00';
//     const loginTime = moment(login, 'hh:mm:ss A');
//     const logoutTime = moment(logout, 'hh:mm:ss A');
//     const diff = logoutTime.diff(loginTime, 'hours', true);
//     return diff.toFixed(2).replace('.', ':');
//   };

//   // Calculate total weekly hours
//   const calculateTotalWeeklyHours = (data) => {
//     let total = 0;
//     data.forEach((row) => {
//       row.hours.forEach((hour) => {
//         if (hour && hour !== '00:00') {
//           const [hours, minutes] = hour.split(':').map(Number);
//           total += hours + minutes / 60;
//         }
//       });
//     });
//     setTotalWeeklyHours(total.toFixed(2));
//   };

//   // Check if day is selectable (today only)
//   const isDaySelectable = (dayIndex) => {
//     const today = moment().tz('Asia/Kolkata');
//     const selectedDate = moment(weekStartDate).add(dayIndex, 'days');
//     return selectedDate.isSame(today, 'day');
//   };

//   // Fetch tasks and timesheets
//   const fetchTasks = async () => {
//     if (!user || !user.token) return;
//     try {
//       // Fetch tasks
//       const taskResponse = await axios.get(`${API_URL}/api/tasks`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       const tasks = taskResponse.data.tasks;

//       // Fetch timesheets for the current week
//       const formattedWeekStartDate = weekStartDate
//         ? moment(weekStartDate).format('YYYY-MM-DD')
//         : moment().startOf('isoWeek').format('YYYY-MM-DD');
//       const timesheetResponse = await axios.get(`${API_URL}/api/timesheet`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//         params: {
//           employeeId: user.employeeId,
//           weekStartDate: formattedWeekStartDate,
//         },
//       });
//       const timesheets = timesheetResponse.data.timesheets || [];

//       // Merge tasks with timesheet data
//       const mergedData = tasks.map((task) => {
//         const timesheet = timesheets.find(
//           (ts) =>
//             ts.projectName === task.projectName &&
//             ts.activityName === task.activityName &&
//             ts.weekStartDate === formattedWeekStartDate
//         );
//         return {
//           projectName: task.projectName,
//           activityName: task.activityName,
//           hours: timesheet?.hours || Array(7).fill('00:00'),
//           loginTimes: timesheet?.loginTimes || Array(7).fill(null),
//           logoutTimes: timesheet?.logoutTimes || Array(7).fill(null),
//         };
//       });

//       setTasks(tasks);
//       setTableData(mergedData);
//       calculateTotalWeeklyHours(mergedData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       Alert.alert('Error', 'Failed to fetch data: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // Handle add task
//   const handleAddTask = async () => {
//     if (!taskCategory || !taskTitle) {
//       Alert.alert('Error', 'Project name and activity name are required');
//       return;
//     }

//     const formattedWeekStartDate = weekStartDate
//       ? moment(weekStartDate).format('YYYY-MM-DD')
//       : moment().startOf('isoWeek').format('YYYY-MM-DD');

//     if (moment(formattedWeekStartDate).day() !== 1) {
//       Alert.alert('Error', 'Week start date must be a Monday');
//       return;
//     }

//     const hours = Array(7).fill('00:00');
//     const loginTimes = Array(7).fill(null);
//     const logoutTimes = Array(7).fill(null);

//     const taskPayload = {
//       employeeId: user.employeeId,
//       projectName: taskCategory.trim(),
//       activityName: taskTitle.trim(),
//       taskDescription: taskDescription ? taskDescription.trim() : '',
//       percentComplete: parseFloat(percentComplete) || 0,
//       assignedBy: assignedBy ? assignedBy.trim() : '',
//     };

//     try {
//       // Add task
//       const taskResponse = await axios.post(`${API_URL}/api/tasks`, taskPayload, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       const newTask = taskResponse.data.task;
//       setTasks([...tasks, newTask]);

//       // Add timesheet
//       const newTimesheet = {
//         projectName: taskCategory.trim(),
//         activityName: taskTitle.trim(),
//         hours,
//         loginTimes,
//         logoutTimes,
//       };
//       setTableData([...tableData, newTimesheet]);

//       await axios.post(
//         `${API_URL}/api/timesheet`,
//         {
//           employeeId: user.employeeId,
//           projectName: taskCategory.trim(),
//           activityName: taskTitle.trim(),
//           weekStartDate: formattedWeekStartDate,
//           hours,
//           loginTimes,
//           logoutTimes,
//         },
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         }
//       );

//       setTaskCategory('');
//       setTaskTitle('');
//       setTaskDescription('');
//       setPercentComplete('0');
//       setAssignedBy('');
//       setAddTaskModalVisible(false);
//       Alert.alert('Success', 'Task added successfully');
//     } catch (error) {
//       console.error('Error adding task:', error);
//       Alert.alert('Error', 'Failed to add task: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // Handle time slot click
//   const handleTimeSlotClick = async (taskIndex, dayIndex) => {
//     if (!isDaySelectable(dayIndex)) {
//       Alert.alert('Error', 'You can only record time for today.');
//       return;
//     }

//     const formattedWeekStartDate = moment(weekStartDate).format('YYYY-MM-DD');
//     if (moment(formattedWeekStartDate).day() !== 1) {
//       Alert.alert('Error', 'Week start date must be a Monday');
//       return;
//     }

//     const currentRow = tableData[taskIndex];
//     const newTableData = [...tableData];

//     try {
//       // Fetch the latest timesheet data to ensure we have the most recent state
//       const timesheetResponse = await axios.get(`${API_URL}/api/timesheet`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//         params: {
//           employeeId: user.employeeId,
//           weekStartDate: formattedWeekStartDate,
//           projectName: currentRow.projectName,
//           activityName: currentRow.activityName,
//         },
//       });

//       const timesheet = timesheetResponse.data.timesheets?.[0] || {
//         hours: Array(7).fill('00:00'),
//         loginTimes: Array(7).fill(null),
//         logoutTimes: Array(7).fill(null),
//       };

//       // Update local state with fetched data
//       newTableData[taskIndex] = {
//         ...currentRow,
//         hours: timesheet.hours,
//         loginTimes: timesheet.loginTimes,
//         logoutTimes: timesheet.logoutTimes,
//       };

//       // Handle login/logout logic
//       if (!newTableData[taskIndex].loginTimes[dayIndex]) {
//         // Record login time
//         newTableData[taskIndex].loginTimes[dayIndex] = currentTime;
//         newTableData[taskIndex].hours[dayIndex] = '00:00'; // Reset hours until logout
//         Alert.alert('Success', `Login time recorded: ${currentTime}`);
//       } else if (!newTableData[taskIndex].logoutTimes[dayIndex]) {
//         // Record logout time
//         newTableData[taskIndex].logoutTimes[dayIndex] = currentTime;
//         const hoursWorked = calculateHoursDifference(
//           newTableData[taskIndex].loginTimes[dayIndex],
//           newTableData[taskIndex].logoutTimes[dayIndex]
//         );
//         newTableData[taskIndex].hours[dayIndex] = hoursWorked;
//         Alert.alert('Success', `Logout time recorded: ${currentTime}. Hours: ${hoursWorked}`);
//       } else {
//         // Both login and logout recorded; open edit modal
//         setSelectedTaskIndex(taskIndex);
//         setSelectedDayIndex(dayIndex);
//         setSelectedTime(newTableData[taskIndex].hours[dayIndex]);
//         setTimeModalVisible(true);
//         return;
//       }

//       // Save updated timesheet to backend
//       await axios.post(
//         `${API_URL}/api/timesheet`,
//         {
//           employeeId: user.employeeId,
//           projectName: currentRow.projectName,
//           activityName: currentRow.activityName,
//           weekStartDate: formattedWeekStartDate,
//           hours: newTableData[taskIndex].hours,
//           loginTimes: newTableData[taskIndex].loginTimes,
//           logoutTimes: newTableData[taskIndex].logoutTimes,
//         },
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         }
//       );

//       // Update local state and recalculate total hours
//       setTableData(newTableData);
//       calculateTotalWeeklyHours(newTableData);
//     } catch (error) {
//       console.error('Error handling time slot click:', error);
//       Alert.alert('Error', 'Failed to process time: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // Handle time update
//   const handleTimeUpdate = async () => {
//     if (selectedTaskIndex === null || selectedDayIndex === null) return;

//     const formattedWeekStartDate = moment(weekStartDate).format('YYYY-MM-DD');
//     if (moment(formattedWeekStartDate).day() !== 1) {
//       Alert.alert('Error', 'Week start date must be a Monday');
//       return;
//     }

//     const newTableData = [...tableData];
//     newTableData[selectedTaskIndex].hours[selectedDayIndex] = selectedTime || '00:00';

//     try {
//       await axios.post(
//         `${API_URL}/api/timesheet`,
//         {
//           employeeId: user.employeeId,
//           projectName: newTableData[selectedTaskIndex].projectName,
//           activityName: newTableData[selectedTaskIndex].activityName,
//           weekStartDate: formattedWeekStartDate,
//           hours: newTableData[selectedTaskIndex].hours,
//           loginTimes: newTableData[selectedTaskIndex].loginTimes,
//           logoutTimes: newTableData[selectedTaskIndex].logoutTimes,
//         },
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         }
//       );

//       setTableData(newTableData);
//       calculateTotalWeeklyHours(newTableData);
//       Alert.alert('Success', 'Hours updated successfully');
//     } catch (error) {
//       console.error('Error updating timesheet:', error);
//       Alert.alert('Error', 'Failed to update timesheet: ' + (error.response?.data?.message || error.message));
//     }

//     setTimeModalVisible(false);
//     setSelectedTaskIndex(null);
//     setSelectedDayIndex(null);
//     setSelectedTime('');
//   };

//   // Initialize component and handle tab focus
//   useEffect(() => {
//     updateWeekDates(currentDate);
//     if (user) {
//       fetchTasks();
//     }
//     const interval = setInterval(() => {
//       const newDate = new Date();
//       setCurrentDate(newDate);
//       setCurrentTime(newDate.toLocaleTimeString('en-US', { hour12: true }));
//       if (newDate.getDay() === 1 && newDate.getHours() === 0 && newDate.getMinutes() === 0) {
//         updateWeekDates(newDate);
//         setTableData([]);
//         setTasks([]);
//         setTotalWeeklyHours(0);
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [user]);

//   // Refetch data when screen comes into focus
//   useFocusEffect(
//     useCallback(() => {
//       if (user) {
//         fetchTasks();
//       }
//     }, [user, weekStartDate])
//   );

//   // Render if not logged in
//   if (!user) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <LinearGradient
//           colors={['#002343', '#4c87ba', '#002343']}
//           start={{ x: 0.1, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.gradient}
//         >
//           <View style={styles.innerContainer}>
//             <Text style={styles.title}>Please Log In</Text>
//             <Text style={styles.subtitle}>You need to be logged in to view the Timesheet.</Text>
//           </View>
//         </LinearGradient>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient
//         colors={['#002343', '#4c87ba', '#002343']}
//         start={{ x: 0.1, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.gradient}
//       >
//         <ScrollView style={styles.innerContainer}>
//           <View style={styles.header}>
//             <Text style={styles.title}>Timesheet</Text>
//             <View>
//               <Text style={styles.weekInfoText}>Date: {moment(currentDate).format('YYYY-MM-DD')}</Text>
//               <Text style={styles.weekInfoText}>Time: {currentTime}</Text>
//             </View>
//           </View>
//           <View style={styles.weekInfo}>
//             <Text style={styles.weekInfoText}>
//               Week: {moment(weekStartDate).format('YYYY-MM-DD')} to{' '}
//               {moment(weekEndDate).format('YYYY-MM-DD')}
//             </Text>
//             <TouchableOpacity
//               style={styles.addTaskButton}
//               onPress={() => setAddTaskModalVisible(true)}
//             >
//               <Text style={styles.buttonText}>Add Task</Text>
//             </TouchableOpacity>
//           </View>
//           <View style={styles.table}>
//             <ScrollView horizontal showsHorizontalScrollIndicator={true}>
//               <View style={styles.tableContent}>
//                 <View style={styles.tableRow}>
//                   <Text style={[styles.tableHeader, { width: 120 }]}>Project Name</Text>
//                   <Text style={[styles.tableHeader, { width: 120 }]}>Activity Name</Text>
//                   {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
//                     <Text key={index} style={[styles.tableHeader, { width: 80 }]}>
//                       {day}
//                     </Text>
//                   ))}
//                 </View>
//                 <FlatList
//                   data={tableData}
//                   keyExtractor={(_, index) => index.toString()}
//                   renderItem={({ item, index: taskIndex }) => (
//                     <View style={styles.tableRow}>
//                       <Text
//                         style={[styles.tableCell, { width: 120 }]}
//                         numberOfLines={1}
//                         ellipsizeMode="tail"
//                       >
//                         {item.projectName}
//                       </Text>
//                       <Text
//                         style={[styles.tableCell, { width: 120 }]}
//                         numberOfLines={1}
//                         ellipsizeMode="tail"
//                       >
//                         {item.activityName}
//                       </Text>
//                       {item.hours.map((hours, dayIndex) => (
//                         <TouchableOpacity
//                           key={dayIndex}
//                           style={[
//                             styles.tableCell,
//                             { width: 80, minHeight: 60 },
//                             isDaySelectable(dayIndex) && styles.selectableCell,
//                           ]}
//                           onPress={() => handleTimeSlotClick(taskIndex, dayIndex)}
//                           disabled={!isDaySelectable(dayIndex)}
//                         >
//                           <Text numberOfLines={2}>
//                             {item.loginTimes[dayIndex]
//                               ? `In: ${item.loginTimes[dayIndex]}\n${
//                                   item.logoutTimes[dayIndex] ? `Out: ${item.logoutTimes[dayIndex]}` : 'Pending'
//                                 }`
//                               : 'Click to Log In'}
//                           </Text>
//                         </TouchableOpacity>
//                       ))}
//                     </View>
//                   )}
//                 />
//               </View>
//             </ScrollView>
//           </View>
//           <Text style={styles.totalHours}>Total Weekly Hours: {totalWeeklyHours}</Text>

//           {/* Add Task Modal */}
//           <Modal visible={addTaskModalVisible} animationType="slide" transparent>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>Add Task</Text>
//                 <Text>Project Name</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Project Name"
//                   value={taskCategory}
//                   onChangeText={setTaskCategory}
//                 />
//                 <Text>Activity Name</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Activity Name"
//                   value={taskTitle}
//                   onChangeText={setTaskTitle}
//                 />
//                 <Text>Task Description</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Task Description"
//                   value={taskDescription}
//                   onChangeText={setTaskDescription}
//                   multiline
//                   numberOfLines={3}
//                 />
//                 <Text>Percent Complete</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Percent Complete"
//                   value={percentComplete}
//                   onChangeText={setPercentComplete}
//                   keyboardType="numeric"
//                 />
//                 <Text>Assigned By</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Assigned By"
//                   value={assignedBy}
//                   onChangeText={setAssignedBy}
//                 />
//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity style={styles.button} onPress={handleAddTask}>
//                     <Text style={styles.buttonText}>Save</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.button, styles.cancelButton]}
//                     onPress={() => {
//                       setTaskCategory('');
//                       setTaskTitle('');
//                       setTaskDescription('');
//                       setPercentComplete('0');
//                       setAssignedBy('');
//                       setAddTaskModalVisible(false);
//                     }}
//                   >
//                     <Text style={styles.buttonText}>Cancel</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </Modal>

//           {/* Time Update Modal */}
//           <Modal visible={timeModalVisible} animationType="slide" transparent>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}> Hours Worked</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Hours (e.g., 08:00)"
//                   value={selectedTime}
//                   editable={false}
//                   onChangeText={setSelectedTime}
//                 />
//                 <View style={styles.modalButtons}>
//                   {/* <TouchableOpacity style={styles.button} onPress={handleTimeUpdate}>
//                     <Text style={styles.buttonText}>Update</Text>
//                   </TouchableOpacity> */}
//                   <TouchableOpacity
//                     style={[styles.button, styles.cancelButton]}
//                     onPress={() => {
//                       setTimeModalVisible(false);
//                       setSelectedTaskIndex(null);
//                       setSelectedDayIndex(null);
//                       setSelectedTime('');
//                     }}
//                   >
//                     <Text style={styles.buttonText}>Cancel</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </Modal>
//         </ScrollView>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: 15,
//     padding: 20,
//   },
//   innerContainer: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 20,
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#002343',
//     letterSpacing: 0.5,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#4b5563',
//     textAlign: 'center',
//     marginTop: 12,
//   },
//   weekInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   weekInfoText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#1f2937',
//   },
//   table: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//     marginBottom: 20,
//   },
//   tableContent: {
//     minWidth: 800,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor: '#e5e7eb',
//     backgroundColor: '#fff',
//   },
//   tableHeader: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#fff',
//     textAlign: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//     borderRightWidth: 1,
//     borderColor: '#e5e7eb',
//     backgroundColor: '#4c87ba',
//   },
//   tableCell: {
//     fontSize: 13,
//     color: '#1f2937',
//     textAlign: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//     borderRightWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   selectableCell: {
//     backgroundColor: '#e6f0ff',
//   },
//   totalHours: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//     textAlign: 'center',
//     padding: 16,
//     borderRadius: 12,
//     backgroundColor: '#002343',
//     marginBottom: 20,
//   },
//   addTaskButton: {
//     backgroundColor: '#22c55e',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 35, 67, 0.7)',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     padding: 24,
//     borderRadius: 16,
//     width: '90%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 8,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#002343',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 14,
//     marginBottom: 16,
//     fontSize: 16,
//     color: '#1f2937',
//     backgroundColor: '#f9fafb',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   button: {
//     backgroundColor: '#002343',
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     flex: 1,
//     alignItems: 'center',
//     marginHorizontal: 8,
//   },
//   cancelButton: {
//     backgroundColor: '#ef4444',
//   },
//   gradient: {
//     ...StyleSheet.absoluteFillObject,
//     zIndex: -1,
//   },
// });

// export default Timesheet;

// //  worjing new

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import axios from 'axios';
// import moment from 'moment-timezone';
// import ipfront from '../constants/ipadd';
// import { useUser } from '../contexts/UserContext';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useFocusEffect } from '@react-navigation/native';

// const API_URL = ipfront;

// const Timesheet = () => {
//   const { user } = useUser();
//   const [tasks, setTasks] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [currentTime, setCurrentTime] = useState(
//     new Date().toLocaleTimeString('en-US', { hour12: true })
//   );
//   const [weekStartDate, setWeekStartDate] = useState(null);
//   const [weekEndDate, setWeekEndDate] = useState(null);
//   const [totalWeeklyHours, setTotalWeeklyHours] = useState(0);
//   const [taskCategory, setTaskCategory] = useState('');
//   const [taskTitle, setTaskTitle] = useState('');
//   const [taskDescription, setTaskDescription] = useState('');
//   const [percentComplete, setPercentComplete] = useState('0');
//   const [assignedBy, setAssignedBy] = useState('');
//   const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
//   const [timeModalVisible, setTimeModalVisible] = useState(false);
//   const [percentModalVisible, setPercentModalVisible] = useState(false);
//   const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
//   const [selectedDayIndex, setSelectedDayIndex] = useState(null);
//   const [selectedTime, setSelectedTime] = useState('');
//   const [selectedPercent, setSelectedPercent] = useState('');

//   // Initialize week dates
//   const updateWeekDates = (date) => {
//     const momentDate = moment(date).tz('Asia/Kolkata');
//     const start = momentDate.startOf('isoWeek').toDate(); // Ensures Monday
//     const end = moment(start).add(6, 'days').endOf('day').toDate();
//     setWeekStartDate(start);
//     setWeekEndDate(end);
//     console.log('weekStartDate set to:', moment(start).format('YYYY-MM-DD'));
//   };

//   // Calculate hours difference
//   const calculateHoursDifference = (login, logout) => {
//     if (!login || !logout) return '00:00';
//     try {
//       const loginTime = moment(login, 'hh:mm:ss A', true);
//       const logoutTime = moment(logout, 'hh:mm:ss A', true);
//       if (!loginTime.isValid() || !logoutTime.isValid()) return '00:00';
//       const diff = logoutTime.diff(loginTime, 'hours', true);
//       if (diff < 0) return '00:00'; // Handle same-day requirement
//       const hours = Math.floor(diff);
//       const minutes = Math.round((diff - hours) * 60);
//       return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
//     } catch (error) {
//       console.error('Error calculating hours:', error);
//       return '00:00';
//     }
//   };

//   // Calculate total weekly hours
//   const calculateTotalWeeklyHours = (data) => {
//     let total = 0;
//     data.forEach((row) => {
//       row.hours.forEach((hour) => {
//         if (hour && hour !== '00:00') {
//           const [hours, minutes] = hour.split(':').map(Number);
//           total += hours + minutes / 60;
//         }
//       });
//     });
//     setTotalWeeklyHours(total.toFixed(2));
//   };

//   // Check if day is selectable (today only)
//   const isDaySelectable = (dayIndex) => {
//     const today = moment().tz('Asia/Kolkata');
//     const selectedDate = moment(weekStartDate).add(dayIndex, 'days');
//     return selectedDate.isSame(today, 'day');
//   };

//   // Fetch tasks and timesheets
//   const fetchTasks = async () => {
//     if (!user || !user.token) return;
//     try {
//       // Fetch tasks
//       const taskResponse = await axios.get(`${API_URL}/api/tasks`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       const tasks = taskResponse.data.tasks;

//       // Fetch timesheets for the current week
//       const formattedWeekStartDate = weekStartDate
//         ? moment(weekStartDate).format('YYYY-MM-DD')
//         : moment().startOf('isoWeek').format('YYYY-MM-DD');
//       const timesheetResponse = await axios.get(`${API_URL}/api/timesheet`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//         params: {
//           employeeId: user.employeeId,
//           weekStartDate: formattedWeekStartDate,
//         },
//       });
//       const timesheets = timesheetResponse.data.timesheets || [];

//       // Merge tasks with timesheet data
//       const mergedData = tasks.map((task) => {
//         const timesheet = timesheets.find(
//           (ts) =>
//             ts.projectName === task.projectName &&
//             ts.activityName === task.activityName &&
//             ts.weekStartDate === formattedWeekStartDate
//         );
//         return {
//           projectName: task.projectName,
//           activityName: task.activityName,
//           percentComplete: task.percentComplete,
//           hours: timesheet?.hours || Array(7).fill('00:00'),
//           loginTimes: timesheet?.loginTimes || Array(7).fill(null),
//           logoutTimes: timesheet?.logoutTimes || Array(7).fill(null),
//         };
//       });

//       setTasks(tasks);
//       setTableData(mergedData);
//       calculateTotalWeeklyHours(mergedData);
//     } catch (error) {
//       console.error('Error fetching data:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//       });
//       Alert.alert('Error', 'Failed to fetch data: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // Handle add task
//   const handleAddTask = async () => {
//     if (!taskTitle || !taskCategory) {
//       Alert.alert('Error', 'Project name and activityName are required');
//       return;
//     }

//     const formattedWeekStartDate = weekStartDate
//       ? moment(weekStartDate).format('YYYY-MM-DD')
//       : moment().startOf('isoWeek').format('YYYY-MM-DD');

//     if (moment(formattedWeekStartDate).day() !== 1) {
//       Alert.alert('Error', 'Week start date must be a Monday');
//       return;
//     }

//     const hours = new Array(7).fill('00:00');
//     const loginTimes = Array(7).fill(null);
//     const logoutTimes = Array(7).fill(null);

//     const taskPayload = {
//       employeeId: user.employeeId,
//       projectName: taskCategory.trim(),
//       activityName: taskTitle.trim(),
//       taskDescription: taskDescription ? taskDescription.trim() : '',
//       percentComplete: parseFloat(percentComplete) || 0,
//       assignedBy: assignedBy ? assignedBy.trim() : '',
//     };

//     try {
//       // Add task
//       const taskResponse = await axios.post(
//         `${API_URL}/api/tasks`,
//         taskPayload,
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         }
//       );
//       const newTask = taskResponse.data.task;
//       setTasks([...tasks, newTask]);

//       // Add timesheet
//       const newTimesheet = {
//         projectName: taskCategory.trim(),
//         activityName: taskTitle.trim(),
//         hours,
//         loginTimes: loginTimes,
//         logoutTimes: logoutTimes,
//       };
//       setTableData([...tableData, newTimesheet]);

//       await axios.post(
//         `${API_URL}/api/timesheet`,
//         {
//           employeeId: user.employeeId,
//           projectName: taskCategory.trim(),
//           activityName: taskTitle.trim(),
//           weekStartDate: formattedWeekStartDate,
//           hours,
//           loginTimes,
//           logoutTimes,
//         },
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         }
//       );

//       setTaskCategory('');
//       setTaskTitle('');
//       setTaskDescription('');
//       setPercentComplete('0');
//       setAssignedBy('');
//       setAddTaskModalVisible(false);
//       Alert.alert('Success', 'Task added successfully');
//     } catch (error) {
//       console.error('Error adding task:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//       });
//       Alert.alert('Error', 'Failed to add task: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // Handle time slot click
//   const handleTimeSlotClick = async (taskIndex, dayIndex) => {
//     if (!isDaySelectable(dayIndex)) {
//       Alert.alert('Error', 'You can only record time for today.');
//       return;
//     }

//     const formattedWeekStartDate = moment(weekStartDate).format('YYYY-MM-DD');
//     if (moment(formattedWeekStartDate).day() !== 1) {
//       Alert.alert('Error', 'Week start date must be a Monday');
//       return;
//     }

//     const currentRow = tableData[taskIndex];
//     const newTableData = [...tableData];

//     try {
//       // Fetch the latest timesheet data
//       const timesheetResponse = await axios.get(`${API_URL}/api/timesheet`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//         params: {
//           employeeId: user.employeeId,
//           weekStartDate: formattedWeekStartDate,
//           projectName: currentRow.projectName,
//           activityName: currentRow.activityName,
//         },
//       });

//       const timesheet = timesheetResponse.data.timesheets?.[0] || {
//         hours: Array(7).fill('00:00'),
//         loginTimes: Array(7).fill(null),
//         logoutTimes: Array(7).fill(null),
//       };

//       newTableData[taskIndex] = {
//         ...currentRow,
//         hours: timesheet.hours,
//         loginTimes: timesheet.loginTimes,
//         logoutTimes: timesheet.logoutTimes,
//       };

//       // Ensure currentTime is in the correct format
//       const formattedCurrentTime = moment().format('hh:mm:ss A');

//       if (!newTableData[taskIndex].loginTimes[dayIndex]) {
//         newTableData[taskIndex].loginTimes[dayIndex] = formattedCurrentTime;
//         newTableData[taskIndex].hours[dayIndex] = '00:00';
//         Alert.alert('Success', `Login time recorded: ${formattedCurrentTime}`);
//       } else if (!newTableData[taskIndex].logoutTimes[dayIndex]) {
//         newTableData[taskIndex].logoutTimes[dayIndex] = formattedCurrentTime;
//         const hoursWorked = calculateHoursDifference(
//           newTableData[taskIndex].loginTimes[dayIndex],
//           newTableData[taskIndex].logoutTimes[dayIndex]
//         );
//         newTableData[taskIndex].hours[dayIndex] = hoursWorked;
//         Alert.alert('Success', `Logout time recorded: ${formattedCurrentTime}. Hours: ${hoursWorked}`);
//       } else {
//         setSelectedTaskIndex(taskIndex);
//         setSelectedDayIndex(dayIndex);
//         setSelectedTime(newTableData[taskIndex].hours[dayIndex]);
//         setTimeModalVisible(true);
//         return;
//       }

//       // Save updated timesheet
//       await axios.post(
//         `${API_URL}/api/timesheet`,
//         {
//           employeeId: user.employeeId,
//           projectName: currentRow.projectName,
//           activityName: currentRow.activityName,
//           weekStartDate: formattedWeekStartDate,
//           hours: newTableData[taskIndex].hours,
//           loginTimes: newTableData[taskIndex].loginTimes,
//           logoutTimes: newTableData[taskIndex].logoutTimes,
//         },
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         }
//       );

//       setTableData(newTableData);
//       calculateTotalWeeklyHours(newTableData);
//     } catch (error) {
//       console.error('Error handling time slot click:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//       });
//       Alert.alert(
//         'Error',
//         `Failed to process time: ${error.response?.data?.message || error.message}`
//       );
//     }
//   };

//   // Handle percent complete click
//   const handlePercentClick = (taskIndex) => {
//     setSelectedTaskIndex(taskIndex);
//     setSelectedPercent(tableData[taskIndex].percentComplete.toString());
//     setPercentModalVisible(true);
//   };

//   // Handle percent update
//   const handlePercentUpdate = async () => {
//     if (selectedTaskIndex === null) {
//       Alert.alert('Error', 'No task selected');
//       return;
//     }

//     const newPercent = parseFloat(selectedPercent) || 0;
//     if (newPercent < 0 || newPercent > 100) {
//       Alert.alert('Error', 'Percent complete must be between 0 and 100');
//       return;
//     }

//     const currentRow = tableData[selectedTaskIndex];
//     const newTableData = [...tableData];
//     newTableData[selectedTaskIndex].percentComplete = newPercent;

//     try {
//       const response = await axios.put(
//         `${API_URL}/api/tasks`,
//         {
//           employeeId: user.employeeId,
//           projectName: currentRow.projectName,
//           activityName: currentRow.activityName,
//           percentComplete: newPercent,
//         },
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         }
//       );

//       // Update tasks state to reflect the updated percentComplete
//       const updatedTasks = tasks.map((task, index) =>
//         index === selectedTaskIndex ? { ...task, percentComplete: newPercent } : task
//       );
//       setTasks(updatedTasks);
//       setTableData(newTableData);

//       Alert.alert('Success', 'Percent complete updated successfully');
//     } catch (error) {
//       console.error('Error updating percent complete:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//       });
//       Alert.alert(
//         'Error',
//         `Failed to update percent complete: ${
//           error.response?.data?.message || error.message
//         }`
//       );
//     } finally {
//       setPercentModalVisible(false);
//       setSelectedTaskIndex(null);
//       setSelectedPercent('');
//     }
//   };

//   // Handle time update
//   const handleTimeUpdate = async () => {
//     if (selectedTaskIndex === null || selectedDayIndex === null) return;

//     const formattedWeekStartDate = moment(weekStartDate).format('YYYY-MM-DD');
//     if (moment(formattedWeekStartDate).day() !== 1) {
//       Alert.alert('Error', 'Week start date must be a Monday');
//       return;
//     }

//     const newTableData = [...tableData];
//     newTableData[selectedTaskIndex].hours[selectedDayIndex] = selectedTime || '00:00';

//     try {
//       await axios.post(
//         `${API_URL}/api/timesheet`,
//         {
//           employeeId: user.employeeId,
//           projectName: newTableData[selectedTaskIndex].projectName,
//           activityName: newTableData[selectedTaskIndex].activityName,
//           weekStartDate: formattedWeekStartDate,
//           hours: newTableData[selectedTaskIndex].hours,
//           loginTimes: newTableData[selectedTaskIndex].loginTimes,
//           logoutTimes: newTableData[selectedTaskIndex].logoutTimes,
//         },
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         }
//       );

//       setTableData(newTableData);
//       calculateTotalWeeklyHours(newTableData);
//       Alert.alert('Success', 'Hours updated successfully');
//     } catch (error) {
//       console.error('Error updating timesheet:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//       });
//       Alert.alert(
//         'Error',
//         `Failed to update timesheet: ${error.response?.data?.message || error.message}`
//       );
//     }

//     setTimeModalVisible(false);
//     setSelectedTaskIndex(null);
//     setSelectedDayIndex(null);
//     setSelectedTime('');
//   };

//   // Initialize component and handle tab focus
//   useEffect(() => {
//     updateWeekDates(currentDate);
//     if (user) {
//       fetchTasks();
//     }
//     const interval = setInterval(() => {
//       const newDate = new Date();
//       setCurrentDate(newDate);
//       setCurrentTime(newDate.toLocaleTimeString('en-US', { hour12: true }));
//       if (newDate.getDay() === 1 && newDate.getHours() === 0 && newDate.getMinutes() === 0) {
//         updateWeekDates(newDate);
//         setTableData([]);
//         setTasks([]);
//         setTotalWeeklyHours(0);
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [user]);

//   // Refetch data when screen comes into focus
//   useFocusEffect(
//     useCallback(() => {
//       if (user) {
//         fetchTasks();
//       }
//     }, [user, weekStartDate])
//   );

//   // Render if not logged in
//   if (!user) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <LinearGradient
//           colors={['#002343', '#4c87ba', '#002343']}
//           start={{ x: 0.1, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.gradient}
//         >
//           <View style={styles.innerContainer}>
//             <Text style={styles.title}>Please Log In</Text>
//             <Text style={styles.subtitle}>You need to be logged in to view the Timesheet.</Text>
//           </View>
//         </LinearGradient>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient
//         colors={['#002343', '#4c87ba', '#002343']}
//         start={{ x: 0.1, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.gradient}
//       >
//         <ScrollView style={styles.innerContainer}>
//           <View style={styles.header}>
//             <Text style={styles.title}>Timesheet</Text>
//             <View>
//               <Text style={styles.weekInfoText}>Date: {moment(currentDate).format('YYYY-MM-DD')}</Text>
//               <Text style={styles.weekInfoText}>Time: {currentTime}</Text>
//             </View>
//           </View>
//           <View style={styles.weekInfo}>
//             <Text style={styles.weekInfoText}>
//               Week: {moment(weekStartDate).format('YYYY-MM-DD')} to{' '}
//               {moment(weekEndDate).format('YYYY-MM-DD')}
//             </Text>
//             <TouchableOpacity
//               style={styles.addTaskButton}
//               onPress={() => setAddTaskModalVisible(true)}
//             >
//               <Text style={styles.buttonText}>Add Task</Text>
//             </TouchableOpacity>
//           </View>
//           <View style={styles.table}>
//             <ScrollView horizontal showsHorizontalScrollIndicator={true}>
//               <View style={styles.tableContent}>
//                 <View style={styles.tableRow}>
//                   <Text style={[styles.tableHeader, { width: 120 }]}>Project Name</Text>
//                   <Text style={[styles.tableHeader, { width: 120 }]}>Activity Name</Text>
//                   <Text style={[styles.tableHeader, { width: 100 }]}>% Complete</Text>
//                   {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
//                     <Text key={index} style={[styles.tableHeader, { width: 80 }]}>
//                       {day}
//                     </Text>
//                   ))}
//                 </View>
//                 <FlatList
//                   data={tableData}
//                   keyExtractor={(_, index) => index.toString()}
//                   renderItem={({ item, index: taskIndex }) => (
//                     <View style={styles.tableRow}>
//                       <Text
//                         style={[styles.tableCell, { width: 120 }]}
//                         numberOfLines={1}
//                         ellipsizeMode="tail"
//                       >
//                         {item.projectName}
//                       </Text>
//                       <Text
//                         style={[styles.tableCell, { width: 120 }]}
//                         numberOfLines={1}
//                         ellipsizeMode="tail"
//                       >
//                         {item.activityName}
//                       </Text>
//                       <TouchableOpacity
//                         style={[styles.tableCell, { width: 100 }]}
//                         onPress={() => handlePercentClick(taskIndex)}
//                       >
//                         <Text style={styles.selectableCellText}>{item.percentComplete}%</Text>
//                       </TouchableOpacity>
//                       {item.hours.map((hours, dayIndex) => (
//                         <TouchableOpacity
//                           key={dayIndex}
//                           style={[
//                             styles.tableCell,
//                             { width: 80, minHeight: 60 },
//                             isDaySelectable(dayIndex) && styles.selectableCell,
//                           ]}
//                           onPress={() => handleTimeSlotClick(taskIndex, dayIndex)}
//                           disabled={!isDaySelectable(dayIndex)}
//                         >
//                           <Text numberOfLines={2}>
//                             {item.loginTimes[dayIndex]
//                               ? `In: ${item.loginTimes[dayIndex]}\n${
//                                   item.logoutTimes[dayIndex] ? `Out: ${item.logoutTimes[dayIndex]}` : 'Pending'
//                                 }`
//                               : 'Click to Log In'}
//                           </Text>
//                         </TouchableOpacity>
//                       ))}
//                     </View>
//                   )}
//                 />
//               </View>
//             </ScrollView>
//           </View>
//           <Text style={styles.totalHours}>Total Weekly Hours: {totalWeeklyHours}</Text>

//           {/* Add Task Modal */}
//           <Modal visible={addTaskModalVisible} animationType="slide" transparent>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>Add Task</Text>
//                 <Text>Project Name</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Project Name"
//                   value={taskCategory}
//                   onChangeText={setTaskCategory}
//                 />
//                 <Text>Activity Name</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Activity Name"
//                   value={taskTitle}
//                   onChangeText={setTaskTitle}
//                 />
//                 <Text>Task Description</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Task Description"
//                   value={taskDescription}
//                   onChangeText={setTaskDescription}
//                   multiline
//                   numberOfLines={3}
//                 />
//                 <Text>Percent Complete</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Percent Complete"
//                   value={percentComplete}
//                   onChangeText={setPercentComplete}
//                   keyboardType="numeric"
//                 />
//                 <Text>Assigned By</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Assigned By"
//                   value={assignedBy}
//                   onChangeText={setAssignedBy}
//                 />
//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity style={styles.button} onPress={handleAddTask}>
//                     <Text style={styles.buttonText}>Save</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.button, styles.cancelButton]}
//                     onPress={() => {
//                       setTaskCategory('');
//                       setTaskTitle('');
//                       setTaskDescription('');
//                       setPercentComplete('0');
//                       setAssignedBy('');
//                       setAddTaskModalVisible(false);
//                     }}
//                   >
//                     <Text style={styles.buttonText}>Cancel</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </Modal>

//           {/* Time Update Modal */}
//           <Modal visible={timeModalVisible} animationType="slide" transparent>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>Update Hours</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Hours (e.g., 08:00)"
//                   value={selectedTime}
//                   onChangeText={setSelectedTime}
//                 />
//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity style={styles.button} onPress={handleTimeUpdate}>
//                     <Text style={styles.buttonText}>Update</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.button, styles.cancelButton]}
//                     onPress={() => {
//                       setTimeModalVisible(false);
//                       setSelectedTaskIndex(null);
//                       setSelectedDayIndex(null);
//                       setSelectedTime('');
//                     }}
//                   >
//                     <Text style={styles.buttonText}>Cancel</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </Modal>

//           {/* Percent Update Modal */}
//           <Modal visible={percentModalVisible} animationType="slide" transparent>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>Update Percent Complete</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Percent Complete (0-100)"
//                   value={selectedPercent}
//                   onChangeText={setSelectedPercent}
//                   keyboardType="numeric"
//                 />
//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity style={styles.button} onPress={handlePercentUpdate}>
//                     <Text style={styles.buttonText}>Update</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.button, styles.cancelButton]}
//                     onPress={() => {
//                       setPercentModalVisible(false);
//                       setSelectedTaskIndex(null);
//                       setSelectedPercent('');
//                     }}
//                   >
//                     <Text style={styles.buttonText}>Cancel</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </Modal>
//         </ScrollView>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: 15,
//     padding: 20,
//   },
//   innerContainer: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 20,
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#002343',
//     letterSpacing: 0.5,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#4b5563',
//     textAlign: 'center',
//     marginTop: 12,
//   },
//   weekInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   weekInfoText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#1f2937',
//   },
//   table: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//     marginBottom: 20,
//   },
//   tableContent: {
//     minWidth: 900,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor: '#e5e7eb',
//     backgroundColor: '#fff',
//   },
//   tableHeader: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#fff',
//     textAlign: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//     borderRightWidth: 1,
//     borderColor: '#e5e7eb',
//     backgroundColor: '#4c87ba',
//   },
//   tableCell: {
//     fontSize: 13,
//     color: '#1f2937',
//     textAlign: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//     borderRightWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   selectableCell: {
//     backgroundColor: '#e6f0ff',
//   },
//   selectableCellText: {
//     color: '#1f2937',
//     fontWeight: '500',
//   },
//   totalHours: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//     textAlign: 'center',
//     padding: 16,
//     borderRadius: 12,
//     backgroundColor: '#002343',
//     marginBottom: 20,
//   },
//   addTaskButton: {
//     backgroundColor: '#22c55e',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 35, 67, 0.7)',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     padding: 24,
//     borderRadius: 16,
//     width: '90%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 8,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#002343',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 14,
//     marginBottom: 16,
//     fontSize: 16,
//     color: '#1f2937',
//     backgroundColor: '#f9fafb',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   button: {
//     backgroundColor: '#002343',
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     flex: 1,
//     alignItems: 'center',
//     marginHorizontal: 8,
//   },
//   cancelButton: {
//     backgroundColor: '#ef4444',
//   },
//   gradient: {
//     ...StyleSheet.absoluteFillObject,
//     zIndex: -1,
//   },
// });

// export default Timesheet;


// // working

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import moment from 'moment-timezone';
import ipfront from '../constants/ipadd';
import { useUser } from '../contexts/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = ipfront;

const Timesheet = () => {
  const { user } = useUser();
  const [tasks, setTasks] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('en-US', { hour12: true })
  );
  const [weekStartDate, setWeekStartDate] = useState(null);
  const [weekEndDate, setWeekEndDate] = useState(null);
  const [totalWeeklyHours, setTotalWeeklyHours] = useState(0);
  const [taskCategory, setTaskCategory] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [percentComplete, setPercentComplete] = useState('0');
  const [assignedBy, setAssignedBy] = useState('');
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [percentModalVisible, setPercentModalVisible] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPercent, setSelectedPercent] = useState('');

  // Initialize week dates to the latest (current) week
  const updateWeekDates = (date) => {
    const momentDate = moment(date).tz('Asia/Kolkata');
    const start = momentDate.startOf('isoWeek').toDate(); // Ensures Monday
    const end = moment(start).add(4, 'days').endOf('day').toDate(); // Friday
    setWeekStartDate(start);
    setWeekEndDate(end);
    console.log('weekStartDate set to:', moment(start).format('YYYY-MM-DD'));
  };

  // Navigate to previous week
  const handlePreviousWeek = () => {
    const newStart = moment(weekStartDate).subtract(1, 'week').toDate();
    updateWeekDates(newStart);
  };

  // Navigate to next week
  const handleNextWeek = () => {
    const newStart = moment(weekStartDate).add(1, 'week').toDate();
    updateWeekDates(newStart);
  };

  // Navigate to latest (current) week
  const handleLatestWeek = () => {
    updateWeekDates(new Date());
  };

  // Calculate hours difference
  const calculateHoursDifference = (login, logout) => {
    if (!login || !logout) return '00:00';
    try {
      const loginTime = moment(login, 'hh:mm:ss A', true);
      const logoutTime = moment(logout, 'hh:mm:ss A', true);
      if (!loginTime.isValid() || !logoutTime.isValid()) return '00:00';
      const diff = logoutTime.diff(loginTime, 'hours', true);
      if (diff < 0) return '00:00';
      const hours = Math.floor(diff);
      const minutes = Math.round((diff - hours) * 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('Error calculating hours:', error);
      return '00:00';
    }
  };

  // Calculate total weekly hours
  const calculateTotalWeeklyHours = (data) => {
    let total = 0;
    data.forEach((row) => {
      row.hours.slice(0, 5).forEach((hour) => { // Only Monday to Friday
        if (hour && hour !== '00:00') {
          const [hours, minutes] = hour.split(':').map(Number);
          total += hours + minutes / 60;
        }
      });
    });
    setTotalWeeklyHours(total.toFixed(2));
  };

  // Check if day is selectable (today only)
  const isDaySelectable = (dayIndex) => {
    const today = moment().tz('Asia/Kolkata');
    const selectedDate = moment(weekStartDate).add(dayIndex, 'days');
    return selectedDate.isSame(today, 'day');
  };

  // Fetch tasks and timesheets
  const fetchTasks = async () => {
    if (!user || !user.token) return;
    try {
      const taskResponse = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const tasks = taskResponse.data.tasks;

      const formattedWeekStartDate = weekStartDate
        ? moment(weekStartDate).format('YYYY-MM-DD')
        : moment().startOf('isoWeek').format('YYYY-MM-DD');
      const timesheetResponse = await axios.get(`${API_URL}/api/timesheet`, {
        headers: { Authorization: `Bearer ${user.token}` },
        params: {
          employeeId: user.employeeId,
          weekStartDate: formattedWeekStartDate,
        },
      });
      const timesheets = timesheetResponse.data.timesheets || [];

      const mergedData = tasks.map((task) => {
        const timesheet = timesheets.find(
          (ts) =>
            ts.projectName === task.projectName &&
            ts.activityName === task.activityName &&
            ts.weekStartDate === formattedWeekStartDate
        );
        return {
          projectName: task.projectName,
          activityName: task.activityName,
          percentComplete: task.percentComplete,
          hours: timesheet?.hours.slice(0, 5) || Array(5).fill('00:00'), // Only Monday to Friday
          loginTimes: timesheet?.loginTimes.slice(0, 5) || Array(5).fill(null),
          logoutTimes: timesheet?.logoutTimes.slice(0, 5) || Array(5).fill(null),
        };
      });

      setTasks(tasks);
      setTableData(mergedData);
      calculateTotalWeeklyHours(mergedData);
    } catch (error) {
      console.error('Error fetching data:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Alert.alert('Error', 'Failed to fetch data: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle add task
  const handleAddTask = async () => {
    if (!taskTitle || !taskCategory) {
      Alert.alert('Error', 'Project name and activityName are required');
      return;
    }

    const formattedWeekStartDate = weekStartDate
      ? moment(weekStartDate).format('YYYY-MM-DD')
      : moment().startOf('isoWeek').format('YYYY-MM-DD');

    if (moment(formattedWeekStartDate).day() !== 1) {
      Alert.alert('Error', 'Week start date must be a Monday');
      return;
    }

    const hours = new Array(5).fill('00:00'); // Only Monday to Friday
    const loginTimes = Array(5).fill(null);
    const logoutTimes = Array(5).fill(null);

    const taskPayload = {
      employeeId: user.employeeId,
      projectName: taskCategory.trim(),
      activityName: taskTitle.trim(),
      taskDescription: taskDescription ? taskDescription.trim() : '',
      percentComplete: parseFloat(percentComplete) || 0,
      assignedBy: assignedBy ? assignedBy.trim() : '',
    };

    try {
      const taskResponse = await axios.post(
        `${API_URL}/api/tasks`,
        taskPayload,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const newTask = taskResponse.data.task;
      setTasks([...tasks, newTask]);

      const newTimesheet = {
        projectName: taskCategory.trim(),
        activityName: taskTitle.trim(),
        hours,
        loginTimes: loginTimes,
        logoutTimes: logoutTimes,
      };
      setTableData([...tableData, newTimesheet]);

      await axios.post(
        `${API_URL}/api/timesheet`,
        {
          employeeId: user.employeeId,
          projectName: taskCategory.trim(),
          activityName: taskTitle.trim(),
          weekStartDate: formattedWeekStartDate,
          hours,
          loginTimes,
          logoutTimes,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setTaskCategory('');
      setTaskTitle('');
      setTaskDescription('');
      setPercentComplete('0');
      setAssignedBy('');
      setAddTaskModalVisible(false);
      Alert.alert('Success', 'Task added successfully');
    } catch (error) {
      console.error('Error adding task:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Alert.alert('Error', 'Failed to add task: ' + (error.response?.data?.message || error.message));
    }
  };



const handleTimeSlotClick = async (taskIndex, dayIndex) => {
  if (!isDaySelectable(dayIndex)) {
    Alert.alert('Error', 'You can only record time for today.');
    return;
  }

  const formattedWeekStartDate = moment(weekStartDate).format('YYYY-MM-DD');
  if (moment(formattedWeekStartDate).day() !== 1) {
    Alert.alert('Error', 'Week start date must be a Monday');
    return;
  }

  const currentRow = tableData[taskIndex];
  const newTableData = [...tableData];

  try {
    const timesheetResponse = await axios.get(`${API_URL}/api/timesheet`, {
      headers: { Authorization: `Bearer ${user.token}` },
      params: {
        employeeId: user.employeeId,
        weekStartDate: formattedWeekStartDate,
        projectName: currentRow.projectName,
        activityName: currentRow.activityName,
      },
    });

    const timesheet = timesheetResponse.data.timesheets?.[0] || {
      hours: Array(5).fill('00:00'),
      loginTimes: Array(5).fill(null),
      logoutTimes: Array(5).fill(null),
    };

    newTableData[taskIndex] = {
      ...currentRow,
      hours: timesheet.hours.slice(0, 5),
      loginTimes: timesheet.loginTimes.slice(0, 5),
      logoutTimes: timesheet.logoutTimes.slice(0, 5),
    };

    const formattedCurrentTime = moment().format('hh:mm:ss A');

    if (!newTableData[taskIndex].loginTimes[dayIndex]) {
      newTableData[taskIndex].loginTimes[dayIndex] = formattedCurrentTime;
      newTableData[taskIndex].hours[dayIndex] = '00:00';
      Alert.alert('Success', `Login time recorded: ${formattedCurrentTime}`);
    } else if (!newTableData[taskIndex].logoutTimes[dayIndex]) {
      newTableData[taskIndex].logoutTimes[dayIndex] = formattedCurrentTime;
      const hillsWorked = calculateHoursDifference(
        newTableData[taskIndex].loginTimes[dayIndex],
        newTableData[taskIndex].logoutTimes[dayIndex]
      );
      newTableData[taskIndex].hours[dayIndex] = hillsWorked; // Fixed typo
      Alert.alert('Success', `Logout time recorded: ${formattedCurrentTime}. Hours: ${hillsWorked}`); // Fixed typo
    } else {
      setSelectedTaskIndex(taskIndex);
      setSelectedDayIndex(dayIndex);
      setSelectedTime(newTableData[taskIndex].hours[dayIndex]);
      setTimeModalVisible(true);
      return;
    }

    await axios.post(
      `${API_URL}/api/timesheet`,
      {
        employeeId: user.employeeId,
        projectName: currentRow.projectName,
        activityName: currentRow.activityName,
        weekStartDate: formattedWeekStartDate,
        hours: newTableData[taskIndex].hours,
        loginTimes: newTableData[taskIndex].loginTimes,
        logoutTimes: newTableData[taskIndex].logoutTimes,
      },
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    setTableData(newTableData);
    calculateTotalWeeklyHours(newTableData);
  } catch (error) {
    console.error('Error handling time slot click:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    Alert.alert(
      'Error',
      `Failed to process time: ${error.response?.data?.message || error.message}`
    );
  }
};

  // Handle percent complete click
  const handlePercentClick = (taskIndex) => {
    setSelectedTaskIndex(taskIndex);
    setSelectedPercent(tableData[taskIndex].percentComplete.toString());
    setPercentModalVisible(true);
  };

  // Handle percent update
  const handlePercentUpdate = async () => {
    if (selectedTaskIndex === null) {
      Alert.alert('Error', 'No task selected');
      return;
    }

    const newPercent = parseFloat(selectedPercent) || 0;
    if (newPercent < 0 || newPercent > 100) {
      Alert.alert('Error', 'Percent complete must be between 0 and 100');
      return;
    }

    const currentRow = tableData[selectedTaskIndex];
    const newTableData = [...tableData];
    newTableData[selectedTaskIndex].percentComplete = newPercent;

    try {
      const response = await axios.put(
        `${API_URL}/api/tasks`,
        {
          employeeId: user.employeeId,
          projectName: currentRow.projectName,
          activityName: currentRow.activityName,
          percentComplete: newPercent,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const updatedTasks = tasks.map((task, index) =>
        index === selectedTaskIndex ? { ...task, percentComplete: newPercent } : task
      );
      setTasks(updatedTasks);
      setTableData(newTableData);

      Alert.alert('Success', 'Percent complete updated successfully');
    } catch (error) {
      console.error('Error updating percent complete:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Alert.alert(
        'Error',
        `Failed to update percent complete: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setPercentModalVisible(false);
      setSelectedTaskIndex(null);
      setSelectedPercent('');
    }
  };

  // Handle time update
  const handleTimeUpdate = async () => {
    if (selectedTaskIndex === null || selectedDayIndex === null) return;

    const formattedWeekStartDate = moment(weekStartDate).format('YYYY-MM-DD');
    if (moment(formattedWeekStartDate).day() !== 1) {
      Alert.alert('Error', 'Week start date must be a Monday');
      return;
    }

    const newTableData = [...tableData];
    newTableData[selectedTaskIndex].hours[selectedDayIndex] = selectedTime || '00:00';

    try {
      await axios.post(
        `${API_URL}/api/timesheet`,
        {
          employeeId: user.employeeId,
          projectName: newTableData[selectedTaskIndex].projectName,
          activityName: newTableData[selectedTaskIndex].activityName,
          weekStartDate: formattedWeekStartDate,
          hours: newTableData[selectedTaskIndex].hours,
          loginTimes: newTableData[selectedTaskIndex].loginTimes,
          logoutTimes: newTableData[selectedTaskIndex].logoutTimes,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setTableData(newTableData);
      calculateTotalWeeklyHours(newTableData);
      Alert.alert('Success', 'Hours updated successfully');
    } catch (error) {
      console.error('Error updating timesheet:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Alert.alert(
        'Error',
        `Failed to update timesheet: ${error.response?.data?.message || error.message}`
      );
    }

    setTimeModalVisible(false);
    setSelectedTaskIndex(null);
    setSelectedDayIndex(null);
    setSelectedTime('');
  };

  // Initialize component and handle tab focus
  useEffect(() => {
    updateWeekDates(new Date()); // Start with current week
    if (user) {
      fetchTasks();
    }
    const interval = setInterval(() => {
      const newDate = new Date();
      setCurrentDate(newDate);
      setCurrentTime(newDate.toLocaleTimeString('en-US', { hour12: true }));
      if (newDate.getDay() === 1 && newDate.getHours() === 0 && newDate.getMinutes() === 0) {
        updateWeekDates(newDate);
        setTableData([]);
        setTasks([]);
        setTotalWeeklyHours(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  // Refetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchTasks();
      }
    }, [user, weekStartDate])
  );

  // Render if not logged in
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#002343', '#4c87ba', '#002343']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Please Log In</Text>
            <Text style={styles.subtitle}>You need to be logged in to view the Timesheet.</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Check if current week is the latest week
  const isLatestWeek = moment(weekStartDate).isSame(moment().startOf('isoWeek'), 'day');

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#002343', '#4c87ba', '#002343']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView style={styles.innerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Timesheet</Text>
            <View>
              <Text style={styles.weekInfoText}>Date: {moment(currentDate).format('YYYY-MM-DD')}</Text>
              <Text style={styles.weekInfoText}>Time: {currentTime}</Text>
            </View>
          </View>
          <View style={styles.weekInfo}>
            <View>
              <Text style={styles.weekInfoText}>
                Week: {moment(weekStartDate).format('YYYY-MM-DD')} to{' '}
                {moment(weekEndDate).format('YYYY-MM-DD')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addTaskButton}
              onPress={() => setAddTaskModalVisible(true)}
            >
              <Text style={styles.buttonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.table}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View style={styles.tableContent}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableHeader, { width: 120 }]}>Project Name</Text>
                  <Text style={[styles.tableHeader, { width: 120 }]}>Activity Name</Text>
                  <Text style={[styles.tableHeader, { width: 100 }]}>% Complete</Text>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                    <Text key={index} style={[styles.tableHeader, { width: 120 }]}>
                      {day}
                    </Text>
                  ))}
                </View>
                <FlatList
                  data={tableData}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item, index: taskIndex }) => (
                    <View style={styles.tableRow}>
                      <Text
                        style={[styles.tableCell, { width: 120 }]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.projectName}
                      </Text>
                      <Text
                        style={[styles.tableCell, { width: 120 }]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.activityName}
                      </Text>
                      <TouchableOpacity
                        style={[styles.tableCell, { width: 100 }]}
                        onPress={() => handlePercentClick(taskIndex)}
                      >
                        <Text style={styles.selectableCellText}>{item.percentComplete}%</Text>
                      </TouchableOpacity>
                      {item.hours.map((hours, dayIndex) => (
                        <TouchableOpacity
                          key={dayIndex}
                          style={[
                            styles.tableCell,
                            { width: 120, minHeight: 80 },
                            isDaySelectable(dayIndex) && styles.selectableCell,
                          ]}
                          onPress={() => handleTimeSlotClick(taskIndex, dayIndex)}
                          disabled={!isDaySelectable(dayIndex)}
                        >
                          <Text numberOfLines={2}>
                            {item.loginTimes[dayIndex]
                              ? `In: ${item.loginTimes[dayIndex]}\n${
                                  item.logoutTimes[dayIndex] ? `Out: ${item.logoutTimes[dayIndex]}` : 'Pending'
                                }`
                              : 'Click to Log In'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                />
              </View>
            </ScrollView>
          </View>
          <Text style={styles.totalHours}>Total Weekly Hours: {totalWeeklyHours}</Text>
          <View style={styles.weekNavigation}>
            <TouchableOpacity
              style={[styles.navButton, { marginRight: 8 }]}
              onPress={handlePreviousWeek}
            >
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, { marginRight: 8 }]}
              onPress={handleNextWeek}
              disabled={isLatestWeek}
            >
              <Text style={[styles.buttonText, isLatestWeek && styles.disabledText]}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleLatestWeek}
              disabled={isLatestWeek}
            >
              <Text style={[styles.buttonText, isLatestWeek && styles.disabledText]}>Latest</Text>
            </TouchableOpacity>
          </View>

          {/* Add Task Modal */}
          <Modal visible={addTaskModalVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Task</Text>
                <Text>Project Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Project Name"
                  value={taskCategory}
                  onChangeText={setTaskCategory}
                />
                <Text>Activity Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Activity Name"
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                />
                <Text>Task Description</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Task Description"
                  value={taskDescription}
                  onChangeText={setTaskDescription}
                  multiline
                  numberOfLines={3}
                />
                <Text>Percent Complete</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Percent Complete"
                  value={percentComplete}
                  onChangeText={setPercentComplete}
                  keyboardType="numeric"
                />
                <Text>Assigned By</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Assigned By"
                  value={assignedBy}
                  onChangeText={setAssignedBy}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.button} onPress={handleAddTask}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => {
                      setTaskCategory('');
                      setTaskTitle('');
                      setTaskDescription('');
                      setPercentComplete('0');
                      setAssignedBy('');
                      setAddTaskModalVisible(false);
                    }}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Time Update Modal */}
          <Modal visible={timeModalVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Update Hours</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Hours (e.g., 08:00)"
                  value={selectedTime}
                  onChangeText={setSelectedTime}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.button} onPress={handleTimeUpdate}>
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => {
                      setTimeModalVisible(false);
                      setSelectedTaskIndex(null);
                      setSelectedDayIndex(null);
                      setSelectedTime('');
                    }}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Percent Update Modal */}
          <Modal visible={percentModalVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Update Percent Complete</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Percent Complete (0-100)"
                  value={selectedPercent}
                  onChangeText={setSelectedPercent}
                  keyboardType="numeric"
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.button} onPress={handlePercentUpdate}>
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => {
                      setPercentModalVisible(false);
                      setSelectedTaskIndex(null);
                      setSelectedPercent('');
                    }}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#002343',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 12,
  },
  weekInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  weekInfoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
 popular: true,
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  navButton: {
    backgroundColor: '#4c87ba',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4},
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  tableContent: {
    minWidth: 600, // Adjusted for 5 days
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  tableHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#4c87ba',
  },
  tableCell: {
    fontSize: 13,
    color: '#1f2937',
    textAlign: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectableCell: {
    backgroundColor: '#e6f0ff',
  },
  selectableCellText: {
    color: '#1f2937',
    fontWeight: '500',
  },
  totalHours: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#002343',
    marginBottom: 20,
  },
  addTaskButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledText: {
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 35, 67, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#002343',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#002343',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#ef4444',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});

export default Timesheet;
