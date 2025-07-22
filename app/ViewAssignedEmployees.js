import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { useUser } from '../contexts/UserContext';
import ipfront from '../constants/ipadd';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = ipfront;

const ViewAssignedEmployees = () => {
  const { user } = useUser();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch assigned employees
  const fetchAssignedEmployees = async () => {
    setIsLoading(true);
    try {
      if (!user || !user.token) {
        Alert.alert('Error', 'Please log in to continue.', [
          { text: 'OK', onPress: () => router.push('/login') },
        ]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/manager/employees`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setEmployees(data.employees);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch assigned employees.');
      }
    } catch (error) {
      console.error('Fetch assigned employees error:', error);
      Alert.alert('Error', 'Unable to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedEmployees();
  }, [user]); // Refetch when user changes

  const renderEmployee = ({ item }) => (
    <View style={styles.employeeCard}>
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{item.name} ({item.initial})</Text>
        <Text style={styles.employeeDetail}>ID: {item.employeeId}</Text>
        <Text style={styles.employeeDetail}>Email: {item.email}</Text>
      </View>
    </View>
  );

  return (
         <LinearGradient
      colors={["#002343", "#002343", "#4c87ba", "#002343"]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.gradientBackground}
    >
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Assigned Employees</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#2a3eb1" style={styles.loading} />
        ) : (
          <FlatList
            data={employees}
            renderItem={renderEmployee}
            keyExtractor={(item) => item.employeeId}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<Text style={styles.emptyText}>No assigned employees.</Text>}
          />
        )}
      </View>
    </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
      gradientBackground: {
    flex: 1,
  },
  container: { flex: 1 },
  innerContainer: { flex: 1, paddingHorizontal: 15 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius : 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: { padding: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#003087', marginLeft: 10 },
  listContainer: { paddingBottom: 20 },
  employeeCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  employeeInfo: { flex: 1 },
  employeeName: { fontSize: 16, fontWeight: 'bold', color: '#003087', marginBottom: 5 },
  employeeDetail: { fontSize: 14, color: '#333', marginBottom: 3 },
  loading: { marginVertical: 20 },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#333', marginTop: 20 },
});

export default ViewAssignedEmployees;