import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions, Modal, Picker } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row, Rows } from 'react-native-table-component';
import { Feather } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { router } from 'expo-router';
import Profile from './profile';
import ipfront from '../constants/ipadd';

const API_URL = ipfront;

const EmployeeAttendance = () => {
  const { user, setUser } = useUser();
  const [profileVisible, setProfileVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { height } = Dimensions.get('window');

  // State for assignment modal
  const [modalVisible, setModalVisible] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [assignmentError, setAssignmentError] = useState(null);
  const [assignmentSuccess, setAssignmentSuccess] = useState(null);

  const tableHead = ['#', 'Employee ID', 'Name', 'Date', 'Check-In Time', 'Check-Out Time', 'Status'];
  const columnWidths = [50, 100, 150, 100, 150, 150, 100];

  // Authentication and role check
  useEffect(() => {
    if (!user || !user.token) {
      console.log('EmployeeAttendance.js - User not authenticated, redirecting to login');
      router.push('/login');
      return;
    }
    if (user.roleType !== 'Manager' && user.roleType !== 'Admin') {
      console.log('EmployeeAttendance.js - User is not a manager or admin, redirecting to login');
      router.push('/login');
    }
  }, [user]);

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user || !user.token || (user.roleType !== 'Manager' && user.roleType !== 'Admin')) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch employees
        const employeesResponse = await fetch(`${API_URL}/api/manager/employees`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const employeesData = await employeesResponse.json();
        if (!employeesResponse.ok) {
          throw new Error(employeesData.message || 'Failed to fetch employees');
        }
        console.log('EmployeeAttendance.js - Employees:', employeesData.employees);

        // Fetch attendance for today
        const attendanceResponse = await fetch(`${API_URL}/api/manager/attendance`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const attendanceData = await attendanceResponse.json();
        console.log('EmployeeAttendance.js - Attendance:', attendanceData);

        if (attendanceResponse.ok) {
          const employees = employeesData.employees || [];
          const formattedData = employees.map((emp, index) => {
            const attendance = attendanceData.attendance.find(record => record.employeeId === emp.employeeId) || {};
            const checkInTime = attendance.checkInTime || 'N/A';
            const checkOutTime = attendance.checkOutTime || 'N/A';
            const status = checkInTime !== 'N/A' ? 'Present' : 'Absent';
            return [
              (index + 1).toString(),
              emp.employeeId || 'N/A',
              emp.name || 'N/A',
              attendance.date || new Date().toISOString().split('T')[0],
              checkInTime,
              checkOutTime,
              status,
            ];
          });
          console.log('EmployeeAttendance.js - Formatted table data:', formattedData);
          setAttendanceData(formattedData);
        } else {
          console.error('EmployeeAttendance.js - Failed to fetch attendance:', attendanceData.message);
          setError(attendanceData.message || 'Failed to fetch attendance data');
          if (attendanceResponse.status === 401) {
            console.log('EmployeeAttendance.js - Token expired, redirecting to login');
            setUser(null);
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('EmployeeAttendance.js - Fetch error:', error.message);
        setError('Unable to connect to the server');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchAttendance();
    }
  }, [user, setUser]);

  // Fetch employees and managers for assignment (Admin only)
  useEffect(() => {
    const fetchEmployeesAndManagers = async () => {
      if (!user || user.roleType !== 'Admin') return;

      try {
        // Fetch all employees
        const employeesResponse = await fetch(`${API_URL}/api/admin/employees?roleType=Employee`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const employeesData = await employeesResponse.json();
        if (!employeesResponse.ok) {
          throw new Error(employeesData.message || 'Failed to fetch employees');
        }
        setEmployees(employeesData.employees || []);

        // Fetch all managers
        const managersResponse = await fetch(`${API_URL}/api/admin/employees?roleType=Manager`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const managersData = await managersResponse.json();
        if (!managersResponse.ok) {
          throw new Error(managersData.message || 'Failed to fetch managers');
        }
        setManagers(managersData.employees || []);
      } catch (error) {
        console.error('EmployeeAttendance.js - Fetch employees/managers error:', error.message);
        setAssignmentError('Failed to fetch employees or managers');
      }
    };

    if (user && user.token && user.roleType === 'Admin') {
      fetchEmployeesAndManagers();
    }
  }, [user]);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Toggle profile visibility
  const toggleProfile = () => {
    setProfileVisible(!profileVisible);
  };

  // Handle logout
  const handleLogout = () => {
    setProfileVisible(false);
    setUser(null);
    router.push('/login');
  };

  // Handle assignment submission
  const handleAssignEmployee = async () => {
    if (!selectedEmployee || !selectedManager) {
      setAssignmentError('Please select both an employee and a manager');
      return;
    }

    try {
      setAssignmentLoading(true);
      setAssignmentError(null);
      setAssignmentSuccess(null);

      const response = await fetch(`${API_URL}/api/admin/assign-employee`, {
        method: 'POST',
        headers: {
          'Content predominately': 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          managerId: selectedManager,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to assign employee');
      }

      setAssignmentSuccess('Employee assigned to manager successfully');
      setSelectedEmployee('');
      setSelectedManager('');
      setModalVisible(false);
    } catch (error) {
      console.error('EmployeeAttendance.js - Assign employee error:', error.message);
      setAssignmentError(error.message || 'Failed to assign employee');
    } finally {
      setAssignmentLoading(false);
    }
  };

  if (!user || !user.token || (user.roleType !== 'Manager' && user.roleType !== 'Admin')) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
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

        <View style={styles.navTabs}>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>My Workspace</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>My Hours Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Leave Decisions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Employee Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Employee Attendance</Text>
          </TouchableOpacity>
          {user.roleType === 'Admin' && (
            <TouchableOpacity style={styles.tab} onPress={() => setModalVisible(true)}>
              <Text style={styles.tabText}>Assign Employee</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.headerText}>Employee Attendance Details for Today</Text>

          <ScrollView horizontal>
            <View style={styles.tableWrapper}>
              <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd' }}>
                <Row
                  data={tableHead}
                  style={styles.tableHead}
                  textStyle={styles.tableHeadText}
                  widthArr={columnWidths}
                />
                {loading ? (
                  <Row
                    data={['Loading...']}
                    style={styles.tableRow}
                    textStyle={styles.noDataText}
                    widthArr={[700]}
                  />
                ) : error ? (
                  <Row
                    data={[error]}
                    style={styles.tableRow}
                    textStyle={styles.noDataText}
                    widthArr={[700]}
                  />
                ) : attendanceData.length > 0 ? (
                  <Rows
                    data={attendanceData}
                    style={styles.tableRow}
                    textStyle={styles.tableText}
                    widthArr={columnWidths}
                  />
                ) : (
                  <Row
                    data={['No attendance data available for today']}
                    style={styles.tableRow}
                    textStyle={styles.noDataText}
                    widthArr={[700]}
                  />
                )}
              </Table>
            </View>
          </ScrollView>

          <Text style={styles.footerText}>
            Showing {attendanceData.length} to {attendanceData.length} of {attendanceData.length} rows
          </Text>
        </View>

        {/* Assignment Modal */}
        {user.roleType === 'Admin' && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Assign Employee to Manager</Text>

                <Text style={styles.modalLabel}>Select Employee</Text>
                <Picker
                  selectedValue={selectedEmployee}
                  onValueChange={(itemValue) => setSelectedEmployee(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select an employee" value="" />
                  {employees.map((employee) => (
                    <Picker.Item
                      key={employee.employeeId}
                      label={`${employee.name} (${employee.employeeId})`}
                      value={employee.employeeId}
                    />
                  ))}
                </Picker>

                <Text style={styles.modalLabel}>Select Manager</Text>
                <Picker
                  selectedValue={selectedManager}
                  onValueChange={(itemValue) => setSelectedManager(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a manager" value="" />
                  {managers.map((manager) => (
                    <Picker.Item
                      key={manager.employeeId}
                      label={`${manager.name} (${manager.employeeId})`}
                      value={manager.employeeId}
                    />
                  ))}
                </Picker>

                {assignmentError && <Text style={styles.errorText}>{assignmentError}</Text>}
                {assignmentSuccess && <Text style={styles.successText}>{assignmentSuccess}</Text>}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.submitButton]}
                    onPress={handleAssignEmployee}
                    disabled={assignmentLoading}
                  >
                    <Text style={styles.modalButtonText}>
                      {assignmentLoading ? 'Assigning...' : 'Assign'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        <Profile
          visible={profileVisible}
          onClose={toggleProfile}
          onLogout={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
};

// Styles remain unchanged
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
    flexWrap: 'wrap',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#003087',
    margin: 5,
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
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003087',
    textAlign: 'center',
    marginBottom: 20,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003087',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 10,
  },
  successText: {
    fontSize: 12,
    color: '#28a745',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#28a745',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EmployeeAttendance;