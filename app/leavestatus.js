import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ImageBackground, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row } from 'react-native-table-component';
import * as Animatable from 'react-native-animatable';
import { router } from 'expo-router';
import { useUser } from '../contexts/UserContext';
import ipfront from '../constants/ipadd';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = ipfront;

const LeaveStatus = () => {
  const { user, setUser } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const tableHead = ['#', 'Leave Type', 'From', 'To', 'Reason', 'Status', 'Applied On', 'Action'];
  const columnWidths = [50, 150, 100, 100, 200, 100, 150, 100];

  // Check authentication
  useEffect(() => {
    if (!user || !user.token || user.roleType !== 'Employee') {
      console.log('LeaveStatus.js - User not authenticated or not an employee, redirecting to login');
      router.push('/');
      return;
    }
    fetchLeaveRequests();
  }, [user]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/leave/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('LeaveStatus.js - Non-JSON response:', text.slice(0, 100));
        throw new Error(`Expected JSON, received ${contentType || 'unknown content type'}`);
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch leave requests');
      }
      setLeaveRequests(data.leaveRequests || []);
    } catch (error) {
      console.error('LeaveStatus.js - Fetch error:', error.message);
      Alert.alert('Error', error.message || 'Failed to fetch leave requests');
      if (error.message.includes('Token')) {
        setUser(null);
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

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

  // Filter and format table data
  const filteredData = leaveRequests
    .filter((request) => {
      const query = searchQuery.toLowerCase();
      return (
        formatLeaveType(request.leaveType).toLowerCase().includes(query) ||
        request.reason.toLowerCase().includes(query) ||
        request.status.toLowerCase().includes(query)
      );
    })
    .map((request, index) => [
      (index + 1).toString(),
      formatLeaveType(request.leaveType),
      request.fromDate,
      request.toDate,
      request.reason,
      request.status.charAt(0).toUpperCase() + request.status.slice(1),
      request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-GB') + ' ' + new Date(request.createdAt).toLocaleTimeString('en-US', { hour12: true }) : 'N/A',
      request._id, // Store ID for action
    ]);

  // Handle Excel download
  const handleDownloadExcel = async () => {
    try {
      const excelData = [
        tableHead,
        ...filteredData.map(row => row.slice(0, 7)), // Exclude Action column
      ];
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'LeaveStatus');
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

      const fileUri = `${FileSystem.documentDirectory}LeaveStatus_${new Date().toISOString()}.xlsx`;
      await FileSystem.writeAsStringAsync(fileUri, wbout, { encoding: FileSystem.EncodingType.Base64 });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Success', `Excel file saved to ${fileUri}`);
      }
    } catch (error) {
      console.error('LeaveStatus.js - Excel download error:', error.message);
      Alert.alert('Error', 'Failed to download Excel file');
    }
  };

  // Handle view details action
  const handleViewDetails = (leaveId) => {
    Alert.alert('View Details', `Leave ID: ${leaveId}\nDetails not implemented yet.`);
    // Future: Navigate to a details screen or show a modal
  };

  return (
          <LinearGradient
        colors={['#002343', '#4c87ba', '#002343']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.innerContainer}>
            {/* Header */}
            <Animatable.View animation="fadeInDown" style={styles.header}>
              <View style={styles.headerCenter}>
                <ImageBackground
                  style={styles.logo}
                  resizeMode="contain"
                  source={require('../assets/images/logo.png')}
                />
                <Text style={styles.headerSubLogo}>IIPMS</Text>
              </View>
              <View style={styles.headerRight}>
                <Text style={styles.time}>{currentTime}</Text>
              </View>
            </Animatable.View>

            {/* Navigation Tabs */}
            <View style={styles.navTabs}>
              <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.tab}>
                <Text style={styles.tabText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                <Text style={[styles.tabText, styles.activeTabText]}>My Workspace</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab} onPress={() => router.push('/dashboard')}>
                <Text style={styles.tabText}>My Hours Dashboard</Text>
              </TouchableOpacity>
            </View>

            {/* Button Section */}
            <View style={styles.buttonSection}>
              {['MY TIMESHEET', 'APPLY LEAVE', 'VIEW LEAVE STATUS'].map((label, index) => (
                <Animatable.View key={index} animation="bounceIn" delay={index * 100}>
                  <TouchableOpacity
                    style={[styles.button, label === 'VIEW LEAVE STATUS' && styles.activeButton]}
                    onPress={() => {
                      if (label === 'MY TIMESHEET') router.push('/timesheet');
                      if (label === 'APPLY LEAVE') router.push('/leave');
                      if (label === 'VIEW LEAVE STATUS') router.push('/leavestatus');
                    }}
                  >
                    <Text style={styles.buttonText}>{label}</Text>
                  </TouchableOpacity>
                </Animatable.View>
              ))}
            </View>

            {/* Title and Search Bar */}
            <View style={styles.headerSection}>
              <Text style={styles.title}>My Leave Applications</Text>
              <TextInput
                style={styles.searchBar}
                placeholder="Search by leave type, reason, or status"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Table */}
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
                      widthArr={[950]}
                    />
                  ) : filteredData.length > 0 ? (
                    filteredData.map((rowData, rowIndex) => (
                      <Row
                        key={rowIndex}
                        data={rowData.map((cell, cellIndex) => {
                          if (cellIndex === 5) {
                            const status = cell.trim();
                            let statusStyle;
                            if (status === 'Approved') {
                              statusStyle = styles.statusCellApproved;
                            } else if (status === 'Rejected') {
                              statusStyle = styles.statusCellRejected;
                            } else {
                              statusStyle = styles.statusCellDefault;
                            }
                            return (
                              <View
                                style={[
                                  styles.cell,
                                  statusStyle,
                                  rowIndex % 2 === 0 && styles.altRow,
                                ]}
                              >
                                <Text style={styles.statusText}>{cell}</Text>
                              </View>
                            );
                          }
                          if (cellIndex === 7) {
                            return (
                              <View style={[styles.cell, rowIndex % 2 === 0 && styles.altRow]}>
                                <TouchableOpacity
                                  style={styles.actionButton}
                                  onPress={() => handleViewDetails(rowData[7])}
                                >
                                  <Text style={styles.actionButtonText}>View</Text>
                                </TouchableOpacity>
                              </View>
                            );
                          }
                          return (
                            <View style={[styles.cell, rowIndex % 2 === 0 && styles.altRow]}>
                              <Text style={styles.tableText}>{cell}</Text>
                            </View>
                          );
                        })}
                        style={styles.tableRow}
                        textStyle={styles.tableText}
                        widthArr={columnWidths}
                        flexArr={Array(tableHead.length).fill(1)}
                      />
                    ))
                  ) : (
                    <Row
                      data={[<Text style={styles.noDataText}>No leave requests found</Text>]}
                      style={styles.tableRow}
                      textStyle={styles.tableText}
                      widthArr={[950]}
                    />
                  )}
                </Table>
              </View>
            </ScrollView>

            {/* Pagination Indicator */}
            <Text style={styles.paginationText}>
              SHOWING 1 to {filteredData.length} of {leaveRequests.length} rows
            </Text>

            {/* Download Excel Button */}
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadExcel}>
              <Text style={styles.downloadButtonText}>Download Excel</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>© 2025 Intellisurge Technologies. All Rights Reserved.</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    height: 120,
    width: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSubLogo: {
    fontSize: 16,
    color: '#ff0000',
    fontWeight: 'bold',
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
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  button: {
    backgroundColor: '#003087',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  activeButton: {
    backgroundColor: '#ff0000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSection: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  tableWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 15,
  },
  tableHead: {
    backgroundColor: '#003087',
  },
  tableHeadText: {
    fontSize: 12,
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
  statusCellApproved: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusCellRejected: {
    backgroundColor: '#ff0000',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusCellDefault: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusText: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#003087',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  paginationText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  downloadButton: {
    backgroundColor: '#003087',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#003087',
    padding: 12,
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  footerText: {
    color: '#fff',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default LeaveStatus;