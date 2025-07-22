import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row } from 'react-native-table-component';
import { Feather } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { router } from 'expo-router';
import Profile from './profile';
import ipfront from '../constants/ipadd';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = ipfront;
const { height } = Dimensions.get('window');

const LeaveDecisions = () => {
  const { user, setUser } = useUser();
  const [profileVisible, setProfileVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const entriesPerPage = 5; // Show 5 entries per page

  // Check authentication
  useEffect(() => {
    if (!user || !user.token || user.roleType !== 'Manager') {
      console.log('LeaveDecisions.js - User not authenticated or not a manager, redirecting to login');
      router.push('/');
      return;
    }
    fetchPendingLeaveRequests();
  }, [user]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch pending leave requests
  const fetchPendingLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/leave/pending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('LeaveDecisions.js - Non-JSON response:', text.slice(0, 100));
        throw new Error(`Expected JSON, received ${contentType || 'unknown content type'}`);
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch leave requests');
      }

      // Sort leave requests by createdAt in descending order (newest first)
      const sortedRequests = (data.leaveRequests || []).sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLeaveRequests(sortedRequests);
    } catch (error) {
      console.error('LeaveDecisions.js - Fetch error:', error.message);
      Alert.alert('Error', error.message || 'Failed to fetch leave requests');
      if (error.message.includes('Token')) {
        setUser(null);
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Approve/Reject actions
  const handleAction = async (leaveId, action) => {
    try {
      const response = await fetch(`${API_URL}/api/leave/update/${leaveId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: action.toLowerCase() }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('LeaveDecisions.js - Non-JSON response for update:', text.slice(0, 100));
        throw new Error(`Expected JSON, received ${contentType || 'unknown content type'}`);
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Failed to ${action} leave request`);
      }

      // Update local state to reflect the new status
      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === leaveId
            ? { ...request, status: action.toLowerCase(), reviewedBy: user.employeeId, reviewedAt: new Date() }
            : request
        )
      );
      Alert.alert('Success', `Leave request ${action.toLowerCase()} successfully`);
    } catch (error) {
      console.error(`LeaveDecisions.js - ${action} error:`, error.message);
      Alert.alert('Error', error.message || `Failed to ${action} leave request`);
      if (error.message.includes('Token')) {
        setUser(null);
        router.push('/');
      }
    }
  };

  const toggleProfile = () => {
    setProfileVisible(!profileVisible);
  };

  const handleLogout = () => {
    setProfileVisible(false);
    setUser(null);
    router.push('/');
  };

  // Pagination Logic
  const totalEntries = leaveRequests.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const paginatedRequests = leaveRequests.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Define table headers
  const tableHead = ['Employee ID', 'Name', 'Leave Type', 'Start Date', 'End Date', 'Reason', 'Applied On', 'Status', 'Action'];
  const columnWidths = [100, 150, 100, 100, 100, 150, 100, 100, 150];

  // Format leave type
  const formatLeaveType = (type) => {
    switch (type) {
      case 'sick':
        return 'Sick Leave';
      case 'casual':
        return 'Casual Leave';
      case 'emergency':
        return 'Emergency Leave';
      default:
        return type;
    }
  };

  // Format table data for the current page
  const tableData = paginatedRequests.map((request) => [
    request.employeeId,
    request.employeeName,
    formatLeaveType(request.leaveType),
    request.fromDate,
    request.toDate,
    request.reason,
    request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-GB') : 'N/A',
    request.status.charAt(0).toUpperCase() + request.status.slice(1),
    'action', // Placeholder for action column
  ]);

  return (
    <LinearGradient
      colors={["#002343", "#002343", "#4c87ba", "#002343"]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.gradientBackground}
    >
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
            <TouchableOpacity style={styles.tab} onPress={() => router.push('/managerdashboard')}>
              <Text style={styles.tabText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab} onPress={() => router.push('/managerdashboard')}>
              <Text style={styles.tabText}>My Workspace</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab} onPress={() => router.push('/managerdashboard')}>
              <Text style={styles.tabText}>My Hours Dashboard</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>Leave Decisions</Text>
            </TouchableOpacity> */}
          </View>

          {/* Main Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.headerText}>Leave Decisions Pending</Text>

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
                      widthArr={[900]}
                    />
                  ) : tableData.length > 0 ? (
                    tableData.map((rowData, rowIndex) => {
                      const request = paginatedRequests[rowIndex];
                      const isPending = request.status === 'pending';
                      return (
                        <Row
                          key={request._id}
                          data={[
                            ...rowData.slice(0, 7),
                            <View style={[styles.cell, rowIndex % 2 === 0 && styles.altRow]}>
                              <Text style={styles.tableText}>{rowData[7]}</Text>
                            </View>,
                            <View style={[styles.cell, rowIndex % 2 === 0 && styles.altRow]}>
                              {isPending ? (
                                <View style={styles.actionButtons}>
                                  <TouchableOpacity
                                    style={[styles.actionButton, styles.approveButton]}
                                    onPress={() => handleAction(request._id, 'Approved')}
                                  >
                                    <Text style={styles.actionButtonText}>Approve</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={[styles.actionButton, styles.rejectButton]}
                                    onPress={() => handleAction(request._id, 'Rejected')}
                                  >
                                    <Text style={styles.actionButtonText}>Reject</Text>
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                <Text style={styles.tableText}>{rowData[7]}</Text>
                              )}
                            </View>,
                          ]}
                          style={styles.tableRow}
                          textStyle={styles.tableText}
                          widthArr={columnWidths}
                          flexArr={Array(tableHead.length).fill(1)}
                        />
                      );
                    })
                  ) : (
                    <Row
                      data={[<Text style={styles.noDataText}>No pending leave decisions</Text>]}
                      style={styles.tableRow}
                      textStyle={styles.tableText}
                      widthArr={[900]}
                    />
                  )}
                </Table>
              </View>
            </ScrollView>

            {/* Pagination Controls */}
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
                onPress={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <Text style={styles.paginationButtonText}>Previous</Text>
              </TouchableOpacity>
              <Text style={styles.pageIndicator}>
                Page {currentPage} of {totalPages}
              </Text>
              <TouchableOpacity
                style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <Text style={styles.paginationButtonText}>Next</Text>
              </TouchableOpacity>
            </View>

            {/* Updated Footer Text */}
            <Text style={styles.footerText}>
              Showing {startIndex + 1} to {endIndex} of {totalEntries} rows
            </Text>
          </View>

          <Profile
            visible={profileVisible}
            onClose={toggleProfile}
            onLogout={handleLogout}
          />
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
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationButton: {
    backgroundColor: '#003087',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  paginationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LeaveDecisions;