// import {
//   Dimensions,
//   ImageBackground,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Platform,
//   TextInput,
//   Alert,
//   KeyboardAvoidingView,
// } from "react-native";
// import React, { useState } from "react";
// import { useRouter } from "expo-router";
// import Colors from "../constants/Colors";
// import axios from "axios";
// import { useUser } from "../contexts/UserContext";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ipfront from '../constants/ipadd';
// import { LinearGradient } from 'expo-linear-gradient'; // ✅ Import this

// const API_URL = ipfront;
// const { height, width } = Dimensions.get("window");

// const LoginScreen = () => {
//   const { setUser } = useUser();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const validateForm = () => {
//     if (!email || !password) {
//       Alert.alert("Error", "Email and password are required");
//       return false;
//     }
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       Alert.alert("Error", "Invalid email format");
//       return false;
//     }
//     return true;
//   };

//   const handleLogin = async () => {
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const response = await axios.post(`${API_URL}/api/login`, {
//         email,
//         password,
//       });

//       const { employeeId, roleType, token } = response.data;
//       const userData = { employeeId, roleType, email, token };
//       setUser(userData);
//       await AsyncStorage.setItem('user', JSON.stringify(userData));

//       if (roleType === "Employee") {
//         router.push("/dashboard");
//       } else if (roleType === "Manager") {
//         router.push("/managerdashboard");
//       } else if (roleType === "Admin") {
//         router.push("/admindashboard");
//       } else {
//         Alert.alert("Error", "Invalid role type received");
//       }
//     } catch (error) {
//       console.error("Login error:", error.response?.data || error.message);
//       Alert.alert("Error", error.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <LinearGradient
//       colors={["#002343", "#002343", "#4c87ba", "#002343"]}
//       start={{ x: 0.1, y: 0 }}
//       end={{ x: 0.9, y: 1 }}
//       style={styles.gradientBackground}
//     >
//       <SafeAreaView style={styles.safeArea}>
//         <KeyboardAvoidingView
//           style={styles.keyboardAvoidingView}
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
//         >
//           <View style={styles.formContainer}>
//             <ImageBackground
//               style={styles.logo}
//               resizeMode="contain"
//               source={require("../assets/images/logo.png")}
//             />
//             <Text style={styles.subHeader}>IIPMS Login</Text>
//             <TextInput
//               style={styles.input}
//               value={email}
//               onChangeText={setEmail}
//               placeholder="Your Email"
//               placeholderTextColor="#a0a0a0"
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//             <TextInput
//               style={styles.input}
//               value={password}
//               onChangeText={setPassword}
//               placeholder="Enter Password"
//               placeholderTextColor="#a0a0a0"
//               secureTextEntry
//             />
//             <TouchableOpacity
//               onPress={handleLogin}
//               style={[styles.loginButton, loading && styles.loginButtonDisabled]}
//               disabled={loading}
//             >
//               <Text style={styles.loginButtonText}>
//                 {loading ? "Logging in..." : "Login"}
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => router.push("/forget")}>
//               <Text style={styles.forgetPassword}>Forgot Password?</Text>
//             </TouchableOpacity>
// {/* 
//                         <TouchableOpacity onPress={() => router.push("/employeeregister")}>
//               <Text style={styles.forgetPassword}>Register</Text>
//             </TouchableOpacity> */}
//           </View>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradientBackground: {
//     flex: 1,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   keyboardAvoidingView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   formContainer: {
//     width: width * 0.85,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     paddingHorizontal: 20,
//     paddingVertical: 30,
//     alignItems: "center",
//     ...Platform.select({
//       ios: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 8,
//       },
//     }),
//   },
//   logo: {
//     height: height / 6,
//     width: 180,
//     marginBottom: 20,
//   },
//   subHeader: {
//     color: "#002444",
//     fontSize: 24,
//     fontWeight: "bold",
//     fontStyle: "italic",
//     marginBottom: 20,
//     textAlign: "center",
//     fontFamily: Platform.OS === "ios" ? "Avenir-Heavy" : "Roboto",
//   },
//   input: {
//     backgroundColor: "#FFFFFF",
//     width: "100%",
//     padding: 12,
//     marginBottom: 10,
//     borderRadius: 10,
//     fontSize: 15,
//     color: "#333",
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//     ...Platform.select({
//       ios: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   loginButton: {
//     backgroundColor: "#FFFFFF",
//     width: "100%",
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//     ...Platform.select({
//       ios: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 6,
//       },
//       android: {
//         elevation: 6,
//       },
//     }),
//   },
//   loginButtonDisabled: {
//     backgroundColor: "#F5F5F5",
//     opacity: 0.7,
//   },
//   loginButtonText: {
//     color: "#1890ff",
//     fontSize: 16,
//     fontWeight: "600",
//     fontFamily: Platform.OS === "ios" ? "Avenir-Medium" : "Roboto",
//   },
//   forgetPassword: {
//     color: "#40c4ff",
//     fontSize: 12,
//     textAlign: "center",
//     textDecorationLine: "underline",
//     marginTop: 8,
//     marginBottom: 10,
//     fontFamily: Platform.OS === "ios" ? "Avenir-Medium" : "Roboto",
//   },
// });

// export default LoginScreen;


import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Colors from "../constants/Colors";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipfront from '../constants/ipadd';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = ipfront;
const { height } = Dimensions.get("window");

const LoginScreen = () => {
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Invalid email format");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password,
      });

      const { employeeId, roleType, token } = response.data;
      const userData = { employeeId, roleType, email, token };
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      if (roleType === "Employee") {
        router.push("/dashboard");
      } else if (roleType === "Manager") {
        router.push("/managerdashboard");
      } else if (roleType === "Admin") {
        router.push("/admindashboard");
      } else {
        Alert.alert("Error", "Invalid role type received");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#002343", "#002343", "#4c87ba", "#002343"]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View style={styles.formContainer}>
            <ImageBackground
              style={styles.logo}
              resizeMode="contain"
              source={require("../assets/images/logo.png")}
            />
            <Text style={styles.subHeader}>IIPMS Login</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Your Email"
              placeholderTextColor="#a0a0a0"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter Password"
              placeholderTextColor="#a0a0a0"
              secureTextEntry
            />
            <TouchableOpacity
              onPress={handleLogin}
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/forget")}>
              <Text style={styles.forgetPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Uncomment this for registration */}
            {/* <TouchableOpacity onPress={() => router.push("/employeeregister")}>
              <Text style={styles.forgetPassword}>Register</Text>
            </TouchableOpacity> */}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      },
    }),
  },
  logo: {
    height: height / 6,
    width: 180,
    marginBottom: 20,
  },
  subHeader: {
    color: "#002444",
    fontSize: Platform.OS === "web" ? 30 : 24,
    fontWeight: "bold",
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Avenir-Heavy" : "Roboto",
  },
  input: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 15,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  loginButton: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  loginButtonDisabled: {
    backgroundColor: "#F5F5F5",
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#1890ff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Avenir-Medium" : "Roboto",
  },
  forgetPassword: {
    color: "#40c4ff",
    fontSize: 12,
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 8,
    marginBottom: 10,
    fontFamily: Platform.OS === "ios" ? "Avenir-Medium" : "Roboto",
  },
});

export default LoginScreen;
