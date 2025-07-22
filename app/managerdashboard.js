import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome'; // Changed from Feather to FontAwesome
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import { Ionicons } from '@expo/vector-icons';
import Profile from './profile';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const [profileVisible, setProfileVisible] = useState(false);
  const { height } = Dimensions.get('window');

  // Animation refs for each button
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const scaleAnim1 = useRef(new Animated.Value(0.5)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const scaleAnim2 = useRef(new Animated.Value(0.5)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const scaleAnim3 = useRef(new Animated.Value(0.5)).current;
  const fadeAnim4 = useRef(new Animated.Value(0)).current;
  const scaleAnim4 = useRef(new Animated.Value(0.5)).current;
  const fadeAnim5 = useRef(new Animated.Value(0)).current;
  const scaleAnim5 = useRef(new Animated.Value(0.5)).current;
  const fadeAnim6 = useRef(new Animated.Value(0)).current;
  const scaleAnim6 = useRef(new Animated.Value(0.5)).current;
  const fadeAnim7 = useRef(new Animated.Value(0)).current;
  const scaleAnim7 = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);

    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(fadeAnim1, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(scaleAnim1, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim2, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(scaleAnim2, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim3, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(scaleAnim3, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim4, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(scaleAnim4, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim5, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(scaleAnim5, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim6, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(scaleAnim6, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim7, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(scaleAnim7, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();

    return () => clearInterval(timer);
  }, []);

  const toggleProfile = () => {
    setProfileVisible(!profileVisible);
  };

  const handleLogout = () => {
    setProfileVisible(false);
  };

  return (
    <LinearGradient
      colors={['#002343', '#002343', '#4c87ba', '#002343']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={toggleProfile}
              style={styles.menuButton}
              accessible
              accessibilityLabel="Open profile menu"
            >
              <Icon name="user" size={20} color="#fff" onLayout={() => console.log('Bars icon rendered')} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <View style={styles.headerLogo}>
                <ImageBackground
                  style={{
                    height: 100,
                    width: 250,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    borderRadius: 30,
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 8,
                    overflow: 'visible',
                  }}
                  imageStyle={{
                    borderRadius: 30,
                    borderWidth: 1,
                    borderColor: '#e0e0e0',
                  }}
                  resizeMode="contain"
                  source={require('../assets/images/newlogo.png')}
                />
              </View>
              <Text style={styles.headerSubLogo}>IIPMS</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.time}>{currentTime}</Text>
            </View>
          </View>

          {/* Navigation Tabs */}
          <View style={styles.navTabs}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]} accessible accessibilityLabel="Home tab">
              <Text style={[styles.tabText, styles.activeTabText]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/employeedetails')}
              style={styles.tab}
              accessible
              accessibilityLabel="My Workspace tab"
            >
              <Text style={styles.tabText}>My Workspace</Text>
            </TouchableOpacity>
           
          </View>



          {/* Buttons Section */}
          <View style={styles.buttonSection}>
            <Animated.View style={{ opacity: fadeAnim1, transform: [{ scale: scaleAnim1 }] }}>
              <TouchableOpacity
                onPress={() => router.push('/employeedetails')}
                style={styles.button}
                accessible
                accessibilityLabel="Employee Details"
              >
                <Icon name="users" size={20} color="#000" style={styles.buttonIcon} onLayout={() => console.log('Employee Details icon rendered')} />
                <Text style={styles.buttonText}>Employee Details</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* <Animated.View style={{ opacity: fadeAnim2, transform: [{ scale: scaleAnim2 }] }}>
              <TouchableOpacity
                onPress={() => router.push('/employeeattend')}
                style={styles.button}
                accessible
                accessibilityLabel="Daily Attendance"
              >
                <Icon name="calendar" size={20} color="#000" style={styles.buttonIcon} onLayout={() => console.log('Daily Attendance icon rendered')} />
                <Text style={styles.buttonText}>Daily Attendance</Text>
              </TouchableOpacity>
            </Animated.View> */}

            <Animated.View style={{ opacity: fadeAnim3, transform: [{ scale: scaleAnim3 }] }}>
              <TouchableOpacity
                onPress={() => router.push('/employeetasks')}
                style={styles.button}
                accessible
                accessibilityLabel="Employee Tasks"
              >
                <Icon name="check-square" size={20} color="#000" style={styles.buttonIcon} onLayout={() => console.log('Employee Tasks icon rendered')} />
                <Text style={styles.buttonText}>Employee Tasks</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ opacity: fadeAnim4, transform: [{ scale: scaleAnim4 }] }}>
              <TouchableOpacity
                onPress={() => router.push('/leavedecisions')}
                style={styles.button}
                accessible
                accessibilityLabel="Leave Decisions"
              >
                <Icon1 name="file-alt" size={20} color="#000" style={styles.buttonIcon} onLayout={() => console.log('Leave Decisions icon rendered')} />
                <Text style={styles.buttonText}>Leave Decisions</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ opacity: fadeAnim5, transform: [{ scale: scaleAnim5 }] }}>
              <TouchableOpacity
                onPress={() => router.push('/ManageAssignments')}
                style={styles.button}
                accessible
                accessibilityLabel="Manage Assignments"
              >
                <Icon name="link" size={20} color="#000" style={styles.buttonIcon} onLayout={() => console.log('Manage Assignments icon rendered')} />
                <Text style={styles.buttonText}>Manage Assignments</Text>
              </TouchableOpacity>
            </Animated.View>


            <Animated.View style={{ opacity: fadeAnim5, transform: [{ scale: scaleAnim5 }] }}>
              <TouchableOpacity
                onPress={() => router.push('/employeeselect')}
                style={styles.button}
                accessible
                accessibilityLabel="Manage Assignments"
              >
                <Icon name="link" size={20} color="#000" style={styles.buttonIcon} onLayout={() => console.log('Manage Assignments icon rendered')} />
                <Text style={styles.buttonText}>Attendance report</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ opacity: fadeAnim6, transform: [{ scale: scaleAnim6 }] }}>
              <TouchableOpacity
                onPress={() => router.push('/ViewAssignedEmployees')}
                style={styles.button}
                accessible
                accessibilityLabel="View Assignments"
              >
                <Ionicons name="file-tray-stacked" size={20} color="#000" style={styles.buttonIcon} onLayout={() => console.log('View Assignments icon rendered')} />
                <Text style={styles.buttonText}>View Assignments</Text>
              </TouchableOpacity>
            </Animated.View>

          </View>

          {/* Profile Modal */}
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
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 10,
  },
  menuButton: {
    padding: 10,
    color: '#fff',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerSubLogo: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginTop: 5,
  },
  headerRight: {
    position: 'relative',
    right: 10,
    backgroundColor: '#003087',
    padding: 5,
    borderRadius: 5,
  },
  time: {
    color: '#fff',
    fontSize: 14,
  },
  navTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
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
  debugIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  debugText: {
    color: '#fff', // Fixed typo from '#ff' to '#fff'
    fontSize: 16,
    marginRight: 10,
  },
  buttonSection: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: 250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#003087',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
});

export default App;