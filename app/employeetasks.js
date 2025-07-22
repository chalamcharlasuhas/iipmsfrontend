// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Table, Row } from 'react-native-table-component';
// import { Picker } from '@react-native-picker/picker';
// import { Feather } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import { useUser } from '../contexts/UserContext';
// import Profile from './profile';
// import ipfront from '../constants/ipadd';
// import { LinearGradient } from 'expo-linear-gradient';

// const API_URL = ipfront;

// const EmployeeTasks = () => {
//   const { user, setUser } = useUser();
//   const [profileVisible, setProfileVisible] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
//   const [taskData, setTaskData] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 5;
//   const { height } = Dimensions.get('window');

//   const toggleProfile = () => {
//     setProfileVisible(!profileVisible);
//   };

//   const handleLogout = () => {
//     setProfileVisible(false);
//     setUser(null);
//     router.push('/login');
//   };

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Fetch assigned employees and their tasks
//   const fetchAssignedEmployeesTasks = async () => {
//     try {
//       if (!user || !user.token) {
//         alert('Please log in to continue.');
//         router.push('/login');
//         return;
//       }

//       // Fetch assigned employees
//       const employeesResponse = await fetch(`${API_URL}/api/manager/employees`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       const employeesData = await employeesResponse.json();
//       if (!employeesResponse.ok) {
//         alert(employeesData.message || 'Failed to fetch assigned employees.');
//         return;
//       }

//       const employeesList = employeesData.employees || [];
//       setEmployees([{ employeeId: 'all', name: 'All Employees' }, ...employeesList]);

//       let allTasks = [];
//       // Fetch tasks for each employee
//       for (const employee of employeesList) {
//         const tasksResponse = await fetch(`${API_URL}/api/tasks/${employee.employeeId}`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         const tasksData = await tasksResponse.json();
//         if (tasksResponse.ok) {
//           const tasks = tasksData.tasks.map((task, index) => ({
//             rowIndex: allTasks.length + index,
//             employeeId: employee.employeeId,
//             name: employee.name,
//             projectName: task.projectName,
//             activityName: task.activityName,
//             taskDescription: task.taskDescription || 'N/A',
//             percentComplete: task.percentComplete || '0%',
//             assignedBy: task.assignedBy || 'Unknown',
//             taskId: task._id,
//           }));
//           allTasks = [...allTasks, ...tasks];
//         }
//       }

//       setTaskData(allTasks);
//     } catch (error) {
//       console.error('Fetch tasks error:', error);
//       alert('Unable to connect to the server.');
//     }
//   };

//   useEffect(() => {
//     if (user && user.token) {
//       fetchAssignedEmployeesTasks();
//     }
//   }, [user]);

//   // Filter tasks based on selected employee
//   const filteredTasks = selectedEmployee === 'all'
//     ? taskData
//     : taskData.filter(task => task.employeeId === selectedEmployee);

//   // Pagination logic
//   const totalPages = Math.ceil(filteredTasks.length / rowsPerPage);
//   const paginatedTasks = filteredTasks.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   // Define table headers (removed Status and Action)
//   const tableHead = ['#', 'Employee ID', 'Name', 'Project Name', 'Activity Name', 'Task Description', 'Percent Complete', 'Assigned By'];
//   const columnWidths = [50, 100, 150, 150, 150, 200, 100, 100]; // Removed widths for Status and Action

//   return (
//          <LinearGradient
//           colors={["#002343", "#002343", "#4c87ba", "#002343"]}
//           start={{ x: 0.1, y: 0 }}
//           end={{ x: 0.9, y: 1 }}
//           style={styles.gradientBackground}
//         >
//     <SafeAreaView style={styles.container}>
//       <View style={styles.innerContainer}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={toggleProfile} style={styles.menuButton}>
//             <Feather name="menu" size={20} color="#000" />
//           </TouchableOpacity>
//           <View style={styles.headerCenter}>
//             <ImageBackground
//               style={{
//                 height: height / 5,
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

//         {/* Navigation Tabs */}
//         <View style={styles.navTabs}>
//           <TouchableOpacity style={styles.tab} onPress={() => router.push('/managerdashboard')}>
//             <Text style={styles.tabText}>Home</Text>

//           </TouchableOpacity>
//           <TouchableOpacity style={styles.tab}>
//             <Text style={styles.tabText}>My Workspace</Text>
//           </TouchableOpacity>
//           {/* <TouchableOpacity style={styles.tab}>
//             <Text style={styles.tabText}>My Hours Dashboard</Text>
//           </TouchableOpacity> */}
//           <TouchableOpacity style={styles.tab} onPress={() => router.push('/leavedecisions')}>
//             <Text style={styles.tabText}>Leave Decisions</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={[styles.tab, styles.activeTab]}>
//             <Text style={styles.tabText}>Employee Tasks</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Main Content */}
//         <View style={styles.contentContainer}>
//           <Text style={styles.headerText}>Employee Tasks Details</Text>

//           {/* Employee Selection Dropdown */}
//           <View style={styles.pickerContainer}>
//             <Text style={styles.pickerLabel}>Select Employee:</Text>
//             <Picker
//               selectedValue={selectedEmployee}
//               style={styles.picker}
//               onValueChange={(itemValue) => {
//                 setSelectedEmployee(itemValue);
//                 setCurrentPage(1); // Reset to first page on employee change
//               }}
//             >
//               {employees.map((employee) => (
//                 <Picker.Item
//                   key={employee.employeeId}
//                   label={employee.name}
//                   value={employee.employeeId}
//                 />
//               ))}
//             </Picker>
//           </View>

//           {/* Task Table */}
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
//                 {paginatedTasks.length > 0 ? (
//                   paginatedTasks.map((task, index) => (
//                     <Row
//                       key={task.rowIndex}
//                       data={[
//                         (currentPage - 1) * rowsPerPage + index + 1,
//                         task.employeeId,
//                         task.name,
//                         task.projectName,
//                         task.activityName,
//                         task.taskDescription,
//                         task.percentComplete,
//                         task.assignedBy,
//                       ]}
//                       style={[styles.tableRow, index % 2 === 0 && styles.altRow]}
//                       textStyle={styles.tableText}
//                       widthArr={columnWidths}
//                       flexArr={Array(tableHead.length).fill(1)}
//                     />
//                   ))
//                 ) : (
//                   <Row
//                     data={[<Text style={styles.noDataText}>No tasks available for selected employee</Text>]}
//                     style={styles.tableRow}
//                     textStyle={styles.tableText}
//                     widthArr={[900]} // Adjusted for total column width (sum of columnWidths)
//                   />
//                 )}
//               </Table>
//             </View>
//           </ScrollView>

//           {/* Pagination Controls */}
//           {filteredTasks.length > 0 && (
//             <View style={styles.pagination}>
//               <TouchableOpacity
//                 style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
//                 onPress={handlePreviousPage}
//                 disabled={currentPage === 1}
//               >
//                 <Text style={styles.paginationText}>Previous</Text>
//               </TouchableOpacity>
//               <Text style={styles.paginationText}>
//                 Page {currentPage} of {totalPages}
//               </Text>
//               <TouchableOpacity
//                 style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
//                 onPress={handleNextPage}
//                 disabled={currentPage === totalPages}
//               >
//                 <Text style={styles.paginationText}>Next</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           <Text style={styles.footerText}>
//             Showing {Math.min(filteredTasks.length, rowsPerPage)} of {filteredTasks.length} rows
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

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row } from 'react-native-table-component';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUser } from '../contexts/UserContext';
import Profile from './profile';
import ipfront from '../constants/ipadd';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = ipfront;

const EmployeeTasks = () => {
  const { user, setUser } = useUser();
  const [profileVisible, setProfileVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const [taskData, setTaskData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const { height } = Dimensions.get('window');

  const toggleProfile = () => setProfileVisible(!profileVisible);
  const handleLogout = () => {
    setProfileVisible(false);
    setUser(null);
    router.push('/login');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAssignedEmployeesTasks = async () => {
    try {
      if (!user || !user.token) {
        alert('Please log in to continue.');
        router.push('/login');
        return;
      }

      const employeesResponse = await fetch(`${API_URL}/api/manager/employees`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const employeesData = await employeesResponse.json();
      if (!employeesResponse.ok) {
        alert(employeesData.message || 'Failed to fetch assigned employees.');
        return;
      }

      const employeesList = employeesData.employees || [];
      setEmployees([{ employeeId: 'all', name: 'All Employees' }, ...employeesList]);

      let allTasks = [];
      for (const employee of employeesList) {
        const tasksResponse = await fetch(`${API_URL}/api/tasks/${employee.employeeId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const tasksData = await tasksResponse.json();
        if (tasksResponse.ok) {
          const tasks = tasksData.tasks.map((task, index) => {
            const createdAt = task.createdAt
              ? new Date(task.createdAt)
              : task._id
              ? new Date(parseInt(task._id.substring(0, 8), 16) * 1000)
              : null;

            return {
              rowIndex: allTasks.length + index,
              employeeId: employee.employeeId,
              name: employee.name,
              projectName: task.projectName,
              activityName: task.activityName,
              taskDescription: task.taskDescription || 'N/A',
              percentComplete: task.percentComplete || '0%',
              assignedBy: task.assignedBy || 'Unknown',
              taskId: task._id,
              createdAt,
            };
          });
          allTasks = [...allTasks, ...tasks];
        }
      }

      allTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTaskData(allTasks);
    } catch (error) {
      console.error('Fetch tasks error:', error);
      alert('Unable to connect to the server.');
    }
  };

  useEffect(() => {
    if (user && user.token) fetchAssignedEmployeesTasks();
  }, [user]);

  const filteredTasks = selectedEmployee === 'all'
    ? taskData
    : taskData.filter(task => task.employeeId === selectedEmployee);

  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage);
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const tableHead = ['#', 'Employee ID', 'Name', 'Project Name', 'Activity Name', 'Task Description', 'Percent Complete', 'Assigned By', 'Created At'];
  const columnWidths = [50, 100, 150, 150, 150, 200, 100, 100, 160];

  return (
    <LinearGradient colors={["#002343", "#002343", "#4c87ba", "#002343"]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleProfile} style={styles.menuButton}>
              <Feather name="menu" size={20} color="#000" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <ImageBackground style={{ height: height / 5, width: 200, justifyContent: 'center', alignItems: 'center' }} resizeMode="contain" source={require('../assets/images/logo.png')} />
              <Text style={styles.headerSubLogo}>IIPMS</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.time}>{currentTime}</Text>
            </View>
          </View>

          <View style={styles.navTabs}>
            <TouchableOpacity style={styles.tab} onPress={() => router.push('/managerdashboard')}>
              <Text style={styles.tabText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>My Workspace</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab} onPress={() => router.push('/leavedecisions')}>
              <Text style={styles.tabText}>Leave Decisions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={styles.tabText}>Employee Tasks</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.headerText}>Employee Tasks Details</Text>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Select Employee:</Text>
              <Picker
                selectedValue={selectedEmployee}
                style={styles.picker}
                onValueChange={(itemValue) => {
                  setSelectedEmployee(itemValue);
                  setCurrentPage(1);
                }}
              >
                {employees.map((employee) => (
                  <Picker.Item key={employee.employeeId} label={employee.name} value={employee.employeeId} />
                ))}
              </Picker>
            </View>

            <ScrollView horizontal>
              <View style={styles.tableWrapper}>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd' }}>
                  <Row data={tableHead} style={styles.tableHead} textStyle={styles.tableHeadText} widthArr={columnWidths} flexArr={Array(tableHead.length).fill(1)} />
                  {paginatedTasks.length > 0 ? (
                    paginatedTasks.map((task, index) => (
                      <Row
                        key={task.rowIndex}
                        data={[
                          (currentPage - 1) * rowsPerPage + index + 1,
                          task.employeeId,
                          task.name,
                          task.projectName,
                          task.activityName,
                          task.taskDescription,
                          task.percentComplete,
                          task.assignedBy,
                          task.createdAt && !isNaN(new Date(task.createdAt)) ? new Date(task.createdAt).toLocaleString() : 'N/A',
                        ]}
                        style={[styles.tableRow, index % 2 === 0 && styles.altRow]}
                        textStyle={styles.tableText}
                        widthArr={columnWidths}
                        flexArr={Array(tableHead.length).fill(1)}
                      />
                    ))
                  ) : (
                    <Row
                      data={[<Text style={styles.noDataText}>No tasks available for selected employee</Text>]}
                      style={styles.tableRow}
                      textStyle={styles.tableText}
                      widthArr={[1100]}
                    />
                  )}
                </Table>
              </View>
            </ScrollView>

            {filteredTasks.length > 0 && (
              <View style={styles.pagination}>
                <TouchableOpacity
                  style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
                  onPress={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <Text style={styles.paginationText}>Previous</Text>
                </TouchableOpacity>
                <Text style={styles.paginationText}>Page {currentPage} of {totalPages}</Text>
                <TouchableOpacity
                  style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
                  onPress={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <Text style={styles.paginationText}>Next</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.footerText}>
              Showing {Math.min(filteredTasks.length, rowsPerPage)} of {filteredTasks.length} rows
            </Text>
          </View>

          <Profile visible={profileVisible} onClose={toggleProfile} onLogout={handleLogout} />
        </View>
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
    // backgroundColor: '#f5f5f5',
  },
  innerContainer: {
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
    flexWrap: 'wrap',
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
    color: '#000',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#003087',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#fff',
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#003087',
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  paginationText: {
    fontSize: 14,
    color: '#fff',
  },
});

export default EmployeeTasks;