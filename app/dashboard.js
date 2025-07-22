import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon1 from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import Profile from './profile';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

const App = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('en-US', { hour12: true })
  );
  const [profileVisible, setProfileVisible] = useState(false);

  const fadeAnim1 = useState(new Animated.Value(0))[0];
  const fadeAnim2 = useState(new Animated.Value(0))[0];
  const fadeAnim3 = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Animated.stagger(300, [
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim3, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleProfile = () => {
    setProfileVisible(!profileVisible);
  };

  const handleLogout = () => {
    setProfileVisible(false);
    // Add logout logic
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#002343', '#4c87ba', '#002343']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleProfile} style={styles.menuButton}>
            <Icon name="user" size={20} color="#fff" onLayout={() => console.log('Bars icon rendered')} />
          </TouchableOpacity>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require('../assets/images/logo.png')}
          />
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{currentTime}</Text>
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.navTabs}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>My Workspace</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => router.push('/attendance')}
          >
            <Text style={styles.tabText}>My Hours Dashboard</Text>
          </TouchableOpacity>
        </View>

        {/* Animated Button Section */}
        <View style={styles.buttonSection}>
          <Animated.View style={{ opacity: fadeAnim1, width: '100%' }}>
            <TouchableOpacity
              onPress={() => router.push('/timesheet')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>MY TIMESHEET</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim2, width: '100%', marginTop: 15 }}>
            <TouchableOpacity
              onPress={() => router.push('/leave')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>APPLY LEAVE</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim3, width: '100%', marginTop: 15 }}>
            <TouchableOpacity
              onPress={() => router.push('/leavestatus')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>VIEW LEAVE STATUS</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Profile Modal */}
        <Profile
          visible={profileVisible}
          onClose={toggleProfile}
          onLogout={handleLogout}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuButton: {
    padding: 5,
  },
  logo: {
    height: 190,
    width: 190,
  },
  timeContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  time: {
    fontSize: 12,
    color: '#002343',
    fontWeight: 'bold',
  },
  navTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#003c6e',
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tabText: {
    color: '#fff',
    fontWeight: '600',
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  activeTabText: {
    color: '#002343',
  },
  buttonSection: {
    marginTop: 30,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#002343',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
