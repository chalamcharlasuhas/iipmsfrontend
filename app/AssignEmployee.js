import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { useUser } from '../contexts/UserContext';
import ipfront from '../constants/ipadd';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = ipfront;

const AssignEmployee = () => {
  const { user } = useUser();
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        if (!user?.token) {
          Alert.alert('Error', 'Please log in to continue.', [
            { text: 'OK', onPress: () => router.push('/login') },
          ]);
          setIsLoading(false);
          return;
        }

        const [employeeResponse, managerResponse] = await Promise.all([
          fetch(`${API_URL}/api/admin/employees?roleType=Employee&limit=1000`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          fetch(`${API_URL}/api/admin/employees?roleType=Manager&limit=1000`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        const employeeData = await employeeResponse.json();
        const managerData = await managerResponse.json();

        if (employeeResponse.ok && managerResponse.ok) {
          setEmployees([
            { label: 'Select an employee', value: null, disabled: true },
            ...employeeData.employees.map((e) => ({
              label: `${e.name} (${e.employeeId})`,
              value: e.employeeId,
            })),
          ]);
          setManagers([
            { label: 'Select a manager', value: null, disabled: true },
            ...managerData.employees.map((m) => ({
              label: `${m.name} (${m.employeeId})`,
              value: m.employeeId,
            })),
          ]);
        } else {
          Alert.alert('Error', employeeData.message || managerData.message || 'Failed to fetch users.');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        Alert.alert('Error', 'Unable to connect to the server.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const handleAssign = async () => {
    if (!selectedEmployee || !selectedManager) {
      Alert.alert('Error', 'Please select both an employee and a manager.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/assign-employee`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          managerId: selectedManager,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Employee assigned successfully.');
        setSelectedEmployee(null);
        setSelectedManager(null);
      } else {
        Alert.alert('Error', data.message || 'Assignment failed.');
      }
    } catch (error) {
      console.error('Assign error:', error);
      Alert.alert('Error', 'Unable to connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={['#002343', '#4c87ba', '#002343']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Icon name="arrow-left" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Assign Employee to Manager</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#2a3eb1" style={styles.loading} />
          ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Select Employee</Text>
                <DropDownPicker
                  open={employeeOpen}
                  value={selectedEmployee}
                  items={employees}
                  setOpen={(open) => {
                    setEmployeeOpen(open);
                    if (open) setManagerOpen(false);
                  }}
                  setValue={setSelectedEmployee}
                  setItems={setEmployees}
                  style={styles.picker}
                  dropDownContainerStyle={styles.dropDownContainer}
                  maxHeight={400}
                  listMode="MODAL"
                  searchable={true}
                  searchPlaceholder="Search employee..."
                  modalTitle="Employees"
                  flatListProps={{
                    initialNumToRender: 20,
                    maxToRenderPerBatch: 30,
                    keyboardShouldPersistTaps: 'handled',
                  }}
                  zIndex={5000}
                  zIndexInverse={1000}
                />
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Select Manager</Text>
                <DropDownPicker
                  open={managerOpen}
                  value={selectedManager}
                  items={managers}
                  setOpen={(open) => {
                    setManagerOpen(open);
                    if (open) setEmployeeOpen(false);
                  }}
                  setValue={setSelectedManager}
                  setItems={setManagers}
                  style={styles.picker}
                  dropDownContainerStyle={styles.dropDownContainer}
                  maxHeight={400}
                  listMode="MODAL"
                  searchable={true}
                  searchPlaceholder="Search manager..."
                  modalTitle="Managers"
                  flatListProps={{
                    initialNumToRender: 20,
                    maxToRenderPerBatch: 30,
                    keyboardShouldPersistTaps: 'handled',
                  }}
                  zIndex={4000}
                  zIndexInverse={2000}
                />
              </View>

              <TouchableOpacity
                style={[styles.assignButton, isSubmitting && { opacity: 0.6 }]}
                onPress={handleAssign}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.assignButtonText}>Assign Employee</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  innerContainer: { flex: 1, paddingHorizontal: 15 },
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
    borderRadius: 10,
    marginBottom: 10,
  },
  backButton: { padding: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#003087', marginLeft: 10 },
  pickerContainer: {
    marginVertical: 10,
    position: 'relative',
  },
  label: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 5 },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 3,
    borderWidth: 0,
    height: 50,
  },
  dropDownContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 3,
    maxHeight: 400,
  },
  assignButton: {
    backgroundColor: '#2a3eb1',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  assignButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loading: { marginVertical: 20 },
});

export default AssignEmployee;
