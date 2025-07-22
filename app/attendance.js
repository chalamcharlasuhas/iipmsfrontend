// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Table, Row, Rows } from 'react-native-table-component';
// import * as Animatable from 'react-native-animatable';
// import { router } from 'expo-router';
// import { Feather } from '@expo/vector-icons';
// import { useUser } from '../contexts/UserContext';
// import Profile from './profile';
// import ipfront from '../constants/ipadd';

// const API_URL = ipfront;

// const AttendanceReport = () => {
//   const { user, setUser } = useUser();
//   const [profileVisible, setProfileVisible] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
//   const [tableData, setTableData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { height } = Dimensions.get("window");

//   // Define table headers
//   const tableHead = ['#', 'Login', 'Logout', 'Total Worked Time'];
//   const columnWidths = [50, 150, 150, 150];

//   // Redirect to login if user is not authenticated or not an employee
//   useEffect(() => {
//     if (!user || !user.token) {
//       console.log('AttendanceReport.js - User not authenticated, redirecting to login');
//       router.push('/login');
//       return;
//     }
//     if (user.roleType !== 'Employee') {
//       console.log('AttendanceReport.js - User is not an employee, redirecting to login');
//       router.push('/login');
//     }
//   }, [user]);

//   // Fetch attendance data
//   useEffect(() => {
//     const fetchAttendance = async () => {
//       if (!user || !user.token || user.roleType !== 'Employee') return;

//       try {
//         setLoading(true);
//         setError(null);
//         const response = await fetch(`${API_URL}/api/employee/attendance`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         const data = await response.json();

//         if (response.ok) {
//           const formattedData = data.attendance.map((record, index) => [
//             (index + 1).toString(), // #
//             `${record.date} ${record.login}`, // Login
//             record.logout, // Logout
//             record.totalWorkedTime, // Total Worked Time
//           ]);
//           setTableData(formattedData);
//           console.log('AttendanceReport.js - Fetched attendance:', formattedData);
//         } else {
//           console.error('AttendanceReport.js - Failed to fetch attendance:', data.message);
//           setError(data.message || 'Failed to fetch attendance data');
//           if (response.status === 401) {
//             console.log('AttendanceReport.js - Token expired, redirecting to login');
//             setUser(null);
//             router.push('/login');
//           }
//         }
//       } catch (error) {
//         console.error('AttendanceReport.js - Fetch attendance error:', error.message);
//         setError('Unable to connect to the server');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user && user.token) {
//       fetchAttendance();
//     }
//   }, [user, setUser]);

//   // Update current time every second
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

//   // If user is not authenticated, don't render the component
//   if (!user || !user.token || user.roleType !== 'Employee') {
//     return null;
//   }

//   return (
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
//           <TouchableOpacity onPress={() => router.push('/dashboard')} style={[styles.tab]}>
//             <Text style={[styles.tabText]}>Home</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => router.push('/timesheet')} style={styles.tab}>
//             <Text style={styles.tabText}>My Workspace</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={[styles.tab, styles.activeTab]}>
//             <Text style={[styles.tabText, styles.activeTabText]}>My Hours Dashboard</Text>
//           </TouchableOpacity>
//         </View>

//         <Animatable.View animation="fadeInDown" style={styles.header}>
//           <Text style={styles.headerText}>My Attendance Report</Text>
//         </Animatable.View>

//         <View style={styles.tableContainer}>
//           <View style={styles.searchContainer}>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search"
//               placeholderTextColor="#999"
//             />
//             <View style={styles.actionButtons}>
//               <View style={styles.actionButton}>
//                 <Text style={styles.actionButtonText}>⋮</Text>
//               </View>
//               <View style={styles.actionButton}>
//                 <Text style={styles.actionButtonText}>↓</Text>
//               </View>
//             </View>
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
//                     widthArr={[450]}
//                   />
//                 ) : error ? (
//                   <Row
//                     data={[<Text style={styles.noDataText}>{error}</Text>]}
//                     style={styles.tableRow}
//                     textStyle={styles.tableText}
//                     widthArr={[450]}
//                   />
//                 ) : tableData.length > 0 ? (
//                   tableData.map((rowData, rowIndex) => (
//                     <Row
//                       key={rowIndex}
//                       data={rowData.map((cell) => (
//                         <View style={[styles.cell, rowIndex % 2 === 0 && styles.altRow]}>
//                           <Text style={styles.tableText}>{cell}</Text>
//                         </View>
//                       ))}
//                       style={styles.tableRow}
//                       textStyle={styles.tableText}
//                       widthArr={columnWidths}
//                       flexArr={Array(tableHead.length).fill(1)}
//                     />
//                   ))
//                 ) : (
//                   <Row
//                     data={[<Text style={styles.noDataText}>No attendance data available</Text>]}
//                     style={styles.tableRow}
//                     textStyle={styles.tableText}
//                     widthArr={[450]}
//                   />
//                 )}
//               </Table>
//             </View>
//           </ScrollView>

//           <Text style={styles.footerText}>
//             Showing {tableData.length} to {tableData.length} of {tableData.length} rows
//           </Text>
//         </View>

//         <Profile
//           visible={profileVisible}
//           onClose={toggleProfile}
//           onLogout={handleLogout}
//         />
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
//     color: '#003087',
//     textAlign: 'center',
//   },
//   tableContainer: {
//     flex: 1,
//     padding: 15,
//   },
//   searchContainer: {
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
//   actionButtons: {
//     flexDirection: 'row',
//     marginLeft: 10,
//   },
//   actionButton: {
//     backgroundColor: '#003087',
//     padding: 8,
//     borderRadius: 5,
//     marginLeft: 5,
//   },
//   actionButtonText: {
//     color: '#fff',
//     fontSize: 14,
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

// export default AttendanceReport;


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row, Rows } from 'react-native-table-component';
import * as Animatable from 'react-native-animatable';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import Profile from './profile';
import ipfront from '../constants/ipadd';

const API_URL = ipfront;

const AttendanceReport = () => {
  const { user, setUser } = useUser();
  const [profileVisible, setProfileVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const { height } = Dimensions.get("window");

  // Define table headers
  const tableHead = ['#', 'Login', 'Logout', 'Total Worked Time'];
  const columnWidths = [50, 150, 150, 150];

  // Redirect to login if user is not authenticated or not an employee
  useEffect(() => {
    if (!user || !user.token) {
      console.log('AttendanceReport.js - User not authenticated, redirecting to login');
      router.push('/login');
      return;
    }
    if (user.roleType !== 'Employee') {
      console.log('AttendanceReport.js - User is not an employee, redirecting to login');
      router.push('/login');
    }
  }, [user]);

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user || !user.token || user.roleType !== 'Employee') return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/employee/attendance`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await response.json();

        if (response.ok) {
          // Sort by date in descending order (latest first)
          const sortedData = data.attendance.sort((a, b) => 
            new Date(b.date) - new Date(a.date)
          );
          const formattedData = sortedData.map((record, index) => [
            (index + 1).toString(), // #
            `${record.date} ${record.login}`, // Login
            record.logout, // Logout
            record.totalWorkedTime, // Total Worked Time
          ]);
          setTableData(formattedData);
          console.log('AttendanceReport.js - Fetched attendance:', formattedData);
        } else {
          console.error('AttendanceReport.js - Failed to fetch attendance:', data.message);
          setError(data.message || 'Failed to fetch attendance data');
          if (response.status === 401) {
            console.log('AttendanceReport.js - Token expired, redirecting to login');
            setUser(null);
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('AttendanceReport.js - Fetch attendance error:', error.message);
        setError('Unable to connect to the server');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchAttendance();
    }
  }, [user, setUser]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleProfile = () => {
    setProfileVisible(!profileVisible);
  };

  const handleLogout = () => {
    setProfileVisible(false);
    setUser(null);
    router.push('/login');
  };

  // Pagination logic
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const paginatedData = tableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // If user is not authenticated, don't render the component
  if (!user || !user.token || user.roleType !== 'Employee') {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleProfile} style={styles.menuButton}>
            <Feather name="menu" size={20} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <ImageBackground
              style={{
                height: height / 5,
                width: 200,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              resizeMode="contain"
              source={require('../assets/images/logo.png')}
            />
            <Text style={styles.headerSubLogo}>IIPMS</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.time}>{currentTime}</Text>
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.navTabs}>
          <TouchableOpacity onPress={() => router.push('/dashboard')} style={[styles.tab]}>
            <Text style={[styles.tabText]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/timesheet')} style={styles.tab}>
            <Text style={styles.tabText}>My Workspace</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>My Hours Dashboard</Text>
          </TouchableOpacity>
        </View>

        <Animatable.View animation="fadeInDown" style={styles.header}>
          <Text style={styles.headerText}>My Attendance Report</Text>
        </Animatable.View>

        <View style={styles.tableContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#999"
            />
            <View style={styles.actionButtons}>
              <View style={styles.actionButton}>
                <Text style={styles.actionButtonText}>⋮</Text>
              </View>
              <View style={styles.actionButton}>
                <Text style={styles.actionButtonText}>↓</Text>
              </View>
            </View>
          </View>

          <ScrollView horizontal>
            <View style={styles.tableWrapper}>
              <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd' }}>
                <Row
                  data={tableHead}
                  style={styles.tableHead}
                  textStyle={styles.tableHeadText}
                  widthArr={columnWidths}
                  flexArr={Array(tableHead.length).fill(1)}
                />
                {loading ? (
                  <Row
                    data={[<Text style={styles.noDataText}>Loading...</Text>]}
                    style={styles.tableRow}
                    textStyle={styles.tableText}
                    widthArr={[450]}
                  />
                ) : error ? (
                  <Row
                    data={[<Text style={styles.noDataText}>{error}</Text>]}
                    style={styles.tableRow}
                    textStyle={styles.tableText}
                    widthArr={[450]}
                  />
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((rowData, rowIndex) => (
                    <Row
                      key={rowIndex}
                      data={rowData.map((cell) => (
                        <View style={[styles.cell, rowIndex % 2 === 0 && styles.altRow]}>
                          <Text style={styles.tableText}>{cell}</Text>
                        </View>
                      ))}
                      style={styles.tableRow}
                      textStyle={styles.tableText}
                      widthArr={columnWidths}
                      flexArr={Array(tableHead.length).fill(1)}
                    />
                  ))
                ) : (
                  <Row
                    data={[<Text style={styles.noDataText}>No attendance data available</Text>]}
                    style={styles.tableRow}
                    textStyle={styles.tableText}
                    widthArr={[450]}
                  />
                )}
              </Table>
            </View>
          </ScrollView>

          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
              onPress={handlePrevious}
              disabled={currentPage === 1}
            >
              <Text style={styles.paginationButtonText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.paginationText}>
              Page {currentPage} of {totalPages}
            </Text>
            <TouchableOpacity
              style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
              onPress={handleNext}
              disabled={currentPage === totalPages}
            >
              <Text style={styles.paginationButtonText}>Next</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, tableData.length)} of {tableData.length} rows
          </Text>
        </View>

        <Profile
          visible={profileVisible}
          onClose={toggleProfile}
          onLogout={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#fff',
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
    color: '#003087',
    textAlign: 'center',
  },
  tableContainer: {
    flex: 1,
    padding: 15,
  },
  searchContainer: {
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
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButton: {
    backgroundColor: '#003087',
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationButton: {
    backgroundColor: '#003087',
    padding: 8,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  paginationButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  paginationText: {
    fontSize: 14,
    color: '#333',
  },
});

export default AttendanceReport;