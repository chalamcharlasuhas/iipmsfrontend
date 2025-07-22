import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { useUser } from '../contexts/UserContext';
import ipfront from '../constants/ipadd';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = ipfront;

const ManageAssignments = () => {
  const { user } = useUser();
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch pending assignments
  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      if (!user || !user.token) {
        Alert.alert('Error', 'Please log in to continue.', [
          { text: 'OK', onPress: () => router.push('/login') },
        ]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/manager/assignments`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setAssignments(data.assignments);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch assignments.');
      }
    } catch (error) {
      console.error('Fetch assignments error:', error);
      Alert.alert('Error', 'Unable to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle accept/reject
  const handleAssignmentAction = async (assignmentId, status) => {
    try {
      if (!user || !user.token) {
        Alert.alert('Error', 'Please log in to continue.', [
          { text: 'OK', onPress: () => router.push('/login') },
        ]);
        return;
      }

      const response = await fetch(`${API_URL}/api/manager/assignments/${assignmentId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (response.ok) {
        setAssignments(assignments.filter((assignment) => assignment._id !== assignmentId));
        Alert.alert('Success', `Assignment ${status.toLowerCase()} successfully.`);
      } else {
        Alert.alert('Error', data.message || `Failed to ${status.toLowerCase()} assignment.`);
      }
    } catch (error) {
      console.error('Assignment action error:', error);
      Alert.alert('Error', 'Unable to connect to the server.');
    }
  };

  // Confirm action
  const confirmAction = (assignmentId, status) => {
    Alert.alert(
      `Confirm ${status}`,
      `Are you sure you want to ${status.toLowerCase()} this assignment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: status,
          onPress: () => handleAssignmentAction(assignmentId, status),
        },
      ]
    );
  };

  useEffect(() => {
    fetchAssignments();
  }, [user]); // Refetch when user changes

  const renderAssignment = ({ item }) => (
    <View style={styles.assignmentCard}>
      <View style={styles.assignmentInfo}>
        <Text style={styles.assignmentText}>
          Employee:{' '}
          {item.employeeId && typeof item.employeeId === 'object'
            ? `${item.employeeId.name || 'Unknown'} (${item.employeeId.employeeId || 'N/A'})`
            : 'Unknown (N/A)'}
        </Text>
        <Text style={styles.assignmentText}>
          Assigned By:{' '}
          {item.assignedBy && typeof item.assignedBy === 'object'
            ? item.assignedBy.name || 'Unknown'
            : 'Unknown'}
        </Text>
        <Text style={styles.assignmentText}>
          Date: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.assignmentActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => confirmAction(item._id, 'Accepted')}
        >
          <Icon name="check" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ff0000' }]}
          onPress={() => confirmAction(item._id, 'Rejected')}
        >
          <Icon name="x" size={20} color="#fff" />
        </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Manage Assignments</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#2a3eb1" style={styles.loading} />
        ) : (
          <FlatList
            data={assignments}
            renderItem={renderAssignment}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<Text style={styles.emptyText}>No pending assignments.</Text>}
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
  container: { flex: 1, },
  innerContainer: { flex: 1, paddingHorizontal: 15 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    borderRadius : 10,
    marginBottom: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: { padding: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#003087', marginLeft: 10 },
  listContainer: { paddingBottom: 20 },
  assignmentCard: {
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
  assignmentInfo: { flex: 3 },
  assignmentText: { fontSize: 14, color: '#333', marginBottom: 3 },
  assignmentActions: { flex: 1, justifyContent: 'center', alignItems: 'flex-end' },
  actionButton: {
    backgroundColor: '#2a3eb1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    width: 50,
  },
  loading: { marginVertical: 20 },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#333', marginTop: 20 },
});

export default ManageAssignments;