import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import * as Keychain from 'react-native-keychain';
import DatePicker from 'react-native-date-picker';
import debounce from 'lodash.debounce';
import ipfront from '../constants/ipadd';

const API_URL = ipfront; // Ensure this points to your backend URL (e.g., http://192.168.x.x:5001)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

const AdminEmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editForm, setEditForm] = useState({
    initial: '',
    name: '',
    employeeId: '',
    role: '',
    department: '',
    roleType: '',
    phoneNo: '',
    email: '',
    createdAt: null,
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ roleType: '', department: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
  const checkAuth = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log('Credentials found:', credentials); // Debug: Log credentials
        setIsAuthenticated(true);
        fetchEmployees();
      } else {
        console.log('No credentials found');
        setIsAuthenticated(false);
        Alert.alert('Error', 'Please log in to access employee details.', [
          { text: 'OK', onPress: () => router.push('/login') },
        ]);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      Alert.alert('Error', 'Failed to check authentication. Please try again.');
    }
  };

  // Fetch employees
  const fetchEmployees = async (pageNum = 1, append = false) => {
    setIsLoading(true);
    try {
      const credentials = await Keychain.getGenericPassword();
      if (!credentials) {
        console.log('No credentials for fetching employees');
        setIsAuthenticated(false);
        Alert.alert('Error', 'Please log in to continue.', [
          { text: 'OK', onPress: () => router.push('/login') },
        ]);
        return;
      }

      const queryParams = new URLSearchParams({
        page: pageNum,
        limit: 10,
        ...(filters.roleType && { roleType: filters.roleType }),
        ...(filters.department && { department: filters.department }),
      }).toString();

      console.log('Fetching employees with URL:', `${API_URL}/api/admin/employees?${queryParams}`); // Debug: Log URL

      const response = await fetch(`${API_URL}/api/admin/employees?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${credentials.password}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('API response:', data); // Debug: Log response

      if (response.ok) {
        setEmployees(append ? [...employees, ...data.employees] : data.employees);
        setTotalPages(data.pages);
        setPage(data.page);
      } else {
        handleApiError(response.status, data.message);
      }
    } catch (error) {
      console.error('Fetch employees error:', error);
      Alert.alert('Error', 'Unable to connect to the server. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle API errors
  const handleApiError = (status, message) => {
    console.log('API error:', { status, message }); // Debug: Log error details
    if (status === 401) {
      Keychain.resetGenericPassword();
      setIsAuthenticated(false);
      Alert.alert('Session Expired', 'Please log in again.', [
        { text: 'OK', onPress: () => router.push('/login') },
      ]);
    } else if (status === 403) {
      Alert.alert('Access Denied', 'Only admins can view employee details.');
    } else {
      Alert.alert('Error', message || 'An error occurred while fetching employees.');
    }
  };

  // Debounced filter change
  const debouncedFetchEmployees = useCallback(debounce(() => fetchEmployees(1, false), 500), [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (page < totalPages && !isLoading) {
      fetchEmployees(page + 1, true);
    }
  };

  // Handle edit
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      initial: employee.initial,
      name: employee.name,
      employeeId: employee.employeeId,
      role: employee.role,
      department: employee.department,
      roleType: employee.roleType,
      phoneNo: employee.phoneNo,
      email: employee.email,
      createdAt: employee.createdAt ? new Date(employee.createdAt) : null,
      address: employee.address || '',
    });
    setModalVisible(true);
  };

  // Validate form
  const validateForm = () => {
    if (!editForm.initial || !editForm.name || !editForm.employeeId || !editForm.role || !editForm.department || !editForm.roleType || !editForm.phoneNo || !editForm.email) {
      Alert.alert('Error', 'All fields except address are required.');
      return false;
    }
    if (!EMAIL_REGEX.test(editForm.email)) {
      Alert.alert('Error', 'Invalid email format.');
      return false;
    }
    if (!PHONE_REGEX.test(editForm.phoneNo)) {
      Alert.alert('Error', 'Phone number must be 10 digits.');
      return false;
    }
    const prefix = editForm.roleType === 'Employee' ? 'E' : editForm.roleType === 'Manager' ? 'M' : 'A';
    if (!editForm.employeeId.startsWith(prefix)) {
      Alert.alert('Error', `Employee ID must start with '${prefix}'.`);
      return false;
    }
    return true;
  };

  // Handle update
  const handleUpdate = async () => {
    if (!validateForm()) return;

    setIsUpdating(true);
    try {
      const credentials = await Keychain.getGenericPassword();
      if (!credentials) {
        setIsAuthenticated(false);
        Alert.alert('Error', 'Please log in to continue.', [
          { text: 'OK', onPress: () => router.push('/login') },
        ]);
        return;
      }

      const response = await fetch(`${API_URL}/api/admin/employees/${editForm.employeeId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${credentials.password}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...editForm, createdAt: editForm.createdAt ? editForm.createdAt.toISOString() : undefined }),
      });

      const data = await response.json();
      console.log('Update response:', data); // Debug: Log update response
      if (response.ok) {
        setEmployees(
          employees.map((emp) =>
            emp.employeeId === selectedEmployee.employeeId ? { ...emp, ...data.employee } : emp
          )
        );
        setModalVisible(false);
        setSelectedEmployee(null);
        Alert.alert('Success', 'Employee updated successfully.');
      } else {
        handleApiError(response.status, data.message);
      }
    } catch (error) {
      console.error('Update employee error:', error);
      Alert.alert('Error', 'Unable to connect to the server.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete with confirmation
  const handleDelete = (employeeId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this employee?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const credentials = await Keychain.getGenericPassword();
              if (!credentials) {
                setIsAuthenticated(false);
                Alert.alert('Error', 'Please log in to continue.', [
                  { text: 'OK', onPress: () => router.push('/login') },
                ]);
                return;
              }

              const response = await fetch(`${API_URL}/api/admin/employees/${employeeId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${credentials.password}`,
                  'Content-Type': 'application/json',
                },
              });

              const data = await response.json();
              console.log('Delete response:', data); // Debug: Log delete response
              if (response.ok) {
                setEmployees(employees.filter((emp) => emp.employeeId !== employeeId));
                Alert.alert('Success', 'Employee deleted successfully.');
              } else {
                handleApiError(response.status, data.message);
              }
            } catch (error) {
              console.error('Delete employee error:', error);
              Alert.alert('Error', 'Unable to connect to the server.');
            }
          },
        },
      ]
    );
  };

  // Handle input changes
  const handleInputChange = (key, value) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  // Effects
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      debouncedFetchEmployees();
    }
    return () => debouncedFetchEmployees.cancel();
  }, [filters, isAuthenticated]);

  // Render employee card
  const renderEmployee = ({ item }) => (
    <View style={styles.employeeCard}>
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{item.name} ({item.initial})</Text>
        <Text style={styles.employeeDetail}>ID: {item.employeeId}</Text>
        <Text style={styles.employeeDetail}>Role: {item.role}</Text>
        <Text style={styles.employeeDetail}>Department: {item.department}</Text>
        <Text style={styles.employeeDetail}>Type: {item.roleType}</Text>
        <Text style={styles.employeeDetail}>Phone: {item.phoneNo}</Text>
        <Text style={styles.employeeDetail}>Email: {item.email}</Text>
        <Text style={styles.employeeDetail}>Hire date: {new Date(item.createdAt).toLocaleDateString()}</Text>
        <Text style={styles.employeeDetail}>Address: {item.address || 'N/A'}</Text>
      </View>
      <View style={styles.employeeActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(item)}
          accessibilityLabel="Edit employee"
        >
          <Icon name="edit" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ff0000' }]}
          onPress={() => handleDelete(item.employeeId)}
          accessibilityLabel="Delete employee"
        >
          <Icon name="trash-2" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render unauthenticated state
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.errorText}>Please log in to view employee details.</Text>
          <TouchableOpacity
            style={styles.actionButtonLarge}
            onPress={() => router.push('/login')}
            accessibilityLabel="Go to login"
          >
            <Text style={styles.actionButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
            <Icon name="arrow-left" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Employee and Manager Details</Text>
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <View style={styles.filterContainer}>
            <Text style={styles.label}>Role Type</Text>
            <Picker
              selectedValue={filters.roleType}
              style={styles.picker}
              onValueChange={(value) => handleFilterChange('roleType', value)}
              accessibilityLabel="Select role type"
            >
              <Picker.Item label="All" value="" />
              <Picker.Item label="Employee" value="Employee" />
              <Picker.Item label="Manager" value="Manager" />
              <Picker.Item label="Admin" value="Admin" />
            </Picker>
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.label}>Department</Text>
            <TextInput
              style={styles.input}
              value={filters.department}
              onChangeText={(text) => handleFilterChange('department', text)}
              placeholder="e.g., Operations"
              accessibilityLabel="Filter by department"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.actionButtonLarge}
            onPress={() => router.push('/employeeregister')}
            accessibilityLabel="Add new employee"
          >
            <Text style={styles.actionButtonText}>Add New Employee</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButtonLarge}
            onPress={() => router.push('/employeeattend')}
            accessibilityLabel="View attendance reports"
          >
            <Text style={styles.actionButtonText}>View Attendance Reports</Text>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {isLoading && <ActivityIndicator size="large" color="#2a3eb1" style={styles.loading} />}

        {/* Employee List */}
        {employees.length === 0 && !isLoading ? (
          <Text style={styles.errorText}>No employees found.</Text>
        ) : (
          <FlatList
            data={employees}
            renderItem={renderEmployee}
            keyExtractor={(item) => item.employeeId}
            contentContainerStyle={styles.listContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            windowSize={21}
            ListFooterComponent={isLoading && page < totalPages ? <ActivityIndicator size="small" color="#2a3eb1" /> : null}
          />
        )}

        {/* Edit Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Employee/Manager</Text>

              <Text style={styles.label}>Initial</Text>
              <TextInput
                style={styles.input}
                value={editForm.initial}
                onChangeText={(text) => handleInputChange('initial', text)}
                placeholder="e.g., R"
                accessibilityLabel="Employee initial"
              />

              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="e.g., Robert Brown"
                accessibilityLabel="Employee full name"
              />

              <Text style={styles.label}>Employee ID</Text>
              <TextInput
                style={styles.input}
                value={editForm.employeeId}
                onChangeText={(text) => handleInputChange('employeeId', text)}
                placeholder={`e.g., ${editForm.roleType === 'Employee' ? 'E103' : editForm.roleType === 'Manager' ? 'M103' : 'A103'}`}
                accessibilityLabel="Employee ID"
              />

              <Text style={styles.label}>Role</Text>
              <TextInput
                style={styles.input}
                value={editForm.role}
                onChangeText={(text) => handleInputChange('role', text)}
                placeholder="e.g., software_engineer"
                accessibilityLabel="Employee role"
              />

              <Text style={styles.label}>Department</Text>
              <TextInput
                style={styles.input}
                value={editForm.department}
                onChangeText={(text) => handleInputChange('department', text)}
                placeholder="e.g., Operations"
                accessibilityLabel="Employee department"
              />

              <Text style={styles.label}>Role Type</Text>
              <Picker
                selectedValue={editForm.roleType}
                style={styles.picker}
                onValueChange={(itemValue) => handleInputChange('roleType', itemValue)}
                accessibilityLabel="Select employee role type"
              >
                <Picker.Item label="Employee" value="Employee" />
                <Picker.Item label="Manager" value="Manager" />
                <Picker.Item label="Admin" value="Admin" />
              </Picker>

              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={editForm.phoneNo}
                onChangeText={(text) => handleInputChange('phoneNo', text)}
                placeholder="e.g., 6543210987"
                keyboardType="phone-pad"
                accessibilityLabel="Employee phone number"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={editForm.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="e.g., employee@example.com"
                keyboardType="email-address"
                accessibilityLabel="Employee email"
              />

              <Text style={styles.label}>Hire Date</Text>
              <DatePicker
                date={editForm.createdAt || new Date()}
                onDateChange={(date) => handleInputChange('createdAt', date)}
                mode="date"
                style={styles.datePicker}
                accessibilityLabel="Select hire date"
              />

              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={editForm.address}
                onChangeText={(text) => handleInputChange('address', text)}
                placeholder="e.g., 123 Main St"
                accessibilityLabel="Employee address"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, isUpdating && { opacity: 0.6 }]}
                  onPress={handleUpdate}
                  disabled={isUpdating}
                  accessibilityLabel="Save employee changes"
                >
                  {isUpdating ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.modalButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#cccccc' }]}
                  onPress={() => setModalVisible(false)}
                  accessibilityLabel="Cancel edit"
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  innerContainer: { flex: 1, paddingHorizontal: 15, justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: { padding: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#003087', marginLeft: 10 },
  filterSection: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  filterContainer: { flex: 1, marginHorizontal: 5 },
  actionSection: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15 },
  actionButtonLarge: {
    backgroundColor: '#2a3eb1',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  listContainer: { paddingBottom: 20 },
  employeeCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  employeeInfo: { flex: 3 },
  employeeName: { fontSize: 16, fontWeight: 'bold', color: '#003087', marginBottom: 5 },
  employeeDetail: { fontSize: 14, color: '#333', marginBottom: 3 },
  employeeActions: { flex: 1, justifyContent: 'center', alignItems: 'flex-end' },
  actionButton: {
    backgroundColor: '#2a3eb1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    width: 50,
  },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: '#fff', marginHorizontal: 20, padding: 20, borderRadius: 10, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#003087', marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: '#003087', marginBottom: 5 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  datePicker: { marginBottom: 15 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: {
    backgroundColor: '#2a3eb1',
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loading: { marginVertical: 20 },
  errorText: { fontSize: 18, color: '#ff0000', textAlign: 'center', marginBottom: 20 },
});

export default AdminEmployeeDetails;