import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useUser } from '../contexts/UserContext';
import { router } from 'expo-router';
import ipfront from '../constants/ipadd';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const API_URL = ipfront;

const Profile = ({ visible = false, onClose, onLogout }) => {
  const { user, setUser } = useUser();
  const [userDetails, setUserDetails] = useState(user);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user || !user.token || !user.employeeId) {
        router.push('/index');
        return;
      }

      if (!user.initial || !user.name || !user.role || !user.department || !user.phoneNo) {
        try {
          const response = await fetch(`${API_URL}/api/user/${user.employeeId}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          const data = await response.json();

          if (response.ok) {
            const updatedUser = { ...user, ...data.user };
            setUserDetails(updatedUser);
            setUser(updatedUser);
          } else if (response.status === 401) {
            setUser(null);
            router.push('/login');
          }
        } catch (error) {
          console.error('Fetch error:', error.message);
        }
      } else {
        setUserDetails(user);
      }
    };

    if (visible) fetchUserDetails();
  }, [user, visible, setUser]);

  const handleLogout = () => {
    setUser(null);
    onLogout();
    router.push('/index');
  };

  if (!user || !user.token) return null;

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <LinearGradient
        colors={['#002343', '#002343', '#4c87ba', '#002343']}
        locations={[0.04, 0.19, 0.41, 0.67]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.15 }}
        style={styles.modalContainer}
      >
        <Animatable.View
          animation="fadeInUp"
          duration={600}
          easing="ease-out"
          style={styles.modalContent}
        >
          <TouchableOpacity onPress={onClose} style={styles.profileLogoButton}>
            <View style={styles.profileLogo}>
              <Icon name="user" size={24} color="#003087" />
            </View>
          </TouchableOpacity>

          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>
              {userDetails.name ? userDetails.name.charAt(0).toUpperCase() : 'N/A'}
            </Text>
          </View>

          <Text style={styles.profileName}>{userDetails.name || 'N/A'}</Text>

          <View style={styles.detailRow}>
            <Icon name="user" size={18} color="#fff" style={styles.detailIcon} />
            <Text style={styles.detailText}>Employee ID: {userDetails.employeeId || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="briefcase" size={18} color="#fff" style={styles.detailIcon} />
            <Text style={styles.detailText}>Role: {userDetails.role || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="grid" size={18} color="#fff" style={styles.detailIcon} />
            <Text style={styles.detailText}>Department: {userDetails.department || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="users" size={18} color="#fff" style={styles.detailIcon} />
            <Text style={styles.detailText}>RoleType: {userDetails.roleType || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="phone" size={18} color="#fff" style={styles.detailIcon} />
            <Text style={styles.detailText}>PhoneNo: {userDetails.phoneNo || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="mail" size={18} color="#fff" style={styles.detailIcon} />
            <Text style={styles.detailText}>Email: {userDetails.email || 'N/A'}</Text>
          </View>

{/* <TouchableOpacity style={styles.logoutButton} onPress={() => router.push('/EditProfile')}>
  <Icon name="edit" size={18} color="#003087" style={styles.logoutIcon} />
  <Text style={styles.logoutButtonText}>Edit Profile</Text>
</TouchableOpacity> */}

{['Admin', 'Manager'].includes(userDetails.roleType) && (
  <TouchableOpacity style={styles.logoutButton} onPress={() => router.push('/EditProfile')}>
    <Icon name="edit" size={18} color="#003087" style={styles.logoutIcon} />
    <Text style={styles.logoutButtonText}>Edit Profile</Text>
  </TouchableOpacity>
)}




        </Animatable.View>


      </LinearGradient>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  profileLogoButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  profileLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInitial: {
    fontSize: 40,
    color: '#003087',
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  detailIcon: {
    width: 26,
    textAlign: 'center',
  },
  detailText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    textAlign: 'left',
    paddingLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutButtonText: {
    color: '#003087',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;


// working
// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import { useUser } from '../contexts/UserContext';
// import { router } from 'expo-router';
// import ipfront from '../constants/ipadd';
// import { LinearGradient } from 'expo-linear-gradient';
// import PropTypes from 'prop-types';

// const API_URL = ipfront;

// const Profile = ({ visible = false, onClose, onLogout }) => {
//   const { user, setUser } = useUser();
//   const [userDetails, setUserDetails] = useState(user || {});
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [editForm, setEditForm] = useState({
//     name: '',
//     phoneNo: '',
//     email: '',
//     role: '',
//     department: '',
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     console.log('Profile.js - User state from context:', user);
//     console.log('Profile modal visible:', visible);
//     console.log('User details:', JSON.stringify(userDetails, null, 2));
//     console.log('User role:', userDetails.role);
//     console.log('Can edit profile:', canEditProfile);
//   }, [user, visible, userDetails, canEditProfile]);

//   const canEditProfile = ['Admin', 'Manager'];

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       if (!user || !user.token || !user.employeeId) {
//         console.log('User not authenticated, redirecting to login');
//         router.push('/index');
//         setIsLoading(false);
//         return;
//       }

//       if (!user.initial || !user.name || !user.role || !user.department || !user.phoneNo) {
//         try {
//           setIsLoading(true);
//           console.log('Fetching user details for employeeId:', user.employeeId);
//           const response = await fetch(`${API_URL}/api/user/${user.employeeId}`, {
//             headers: { Authorization: `Bearer ${user.token}` },
//           });
//           const data = await response.json();
//           console.log('API Response:', JSON.stringify(data, null, 2));

//           if (response.ok) {
//             const updatedUser = {
//               ...user,
//               ...data.user,
//               role: data.user.role || 'employee', // Default role if missing
//             };
//             setUserDetails(updatedUser);
//             setUser(updatedUser);
//             console.log('Fetched full user data:', updatedUser);
//           } else {
//             console.error('Failed to fetch user details:', data.message);
//             Alert.alert('Error', data.message || 'Failed to fetch user details');
//             if (response.status === 401) {
//               setUser(null);
//               router.push('/login');
//             }
//           }
//         } catch (error) {
//           console.error('Fetch error:', error.message);
//           Alert.alert('Error', 'Failed to fetch user details');
//         } finally {
//           setIsLoading(false);
//         }
//       } else {
//         setUserDetails(user);
//         setIsLoading(false);
//       }
//     };

//     if (visible) fetchUserDetails();
//   }, [user, visible, setUser]);

//   const handleEditProfile = () => {
//     setEditForm({
//       name: userDetails.name || '',
//       phoneNo: userDetails.phoneNo || '',
//       email: userDetails.email || '',
//     });
//     setEditModalVisible(true);
//   };

//   const handleSaveChanges = async () => {
//     if (!editForm.name || !editForm.phoneNo || !editForm.email) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/api/user/${user.employeeId}`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(editForm),
//       });

//       const data = await response.json();
//       console.log('Update API Response:', JSON.stringify(data, null, 2));

//       if (response.ok) {
//         const updatedUser = { ...user, ...editForm, initial: editForm.name.charAt(0).toUpperCase() };
//         setUser(updatedUser);
//         setUserDetails(updatedUser);
//         setEditModalVisible(false);
//         Alert.alert('Success', 'Profile updated successfully');
//       } else {
//         Alert.alert('Error', data.message || 'Failed to update profile');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred while updating profile');
//       console.error('Update error:', error.message);
//     }
//   };

//   const handleLogout = () => {
//     setUser(null);
//     onLogout();
//     router.push('/index');
//   };

//   if (!user || !user.token || isLoading) {
//     return (
//       <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
//         <View style={styles.modalContainer}>
//           <Text style={styles.loadingText}>Loading...</Text>
//         </View>
//       </Modal>
//     );
//   }

//   return (
//     <>
//       <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
//         <LinearGradient
//           colors={['#002343', '#002343', '#4c87ba', '#002343']}
//           locations={[0.04, 0.19, 0.41, 0.67]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0.15 }}
//           style={styles.modalContainer}
//         >
//           <LinearGradient
//             colors={['#002343', '#002343', '#4c87ba', '#002343']}
//             locations={[0.04, 0.19, 0.41, 0.67]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0.15 }}
//             style={styles.modalContent}
//           >
//             <TouchableOpacity onPress={onClose} style={styles.profileLogoButton}>
//               <View style={styles.profileLogo}>
//                 <Icon name="user" size={24} color="#003087" />
//               </View>
//             </TouchableOpacity>

//             <View style={styles.profileImage}>
//               <Text style={styles.profileInitial}>
//                 {typeof userDetails.initial === 'string' ? userDetails.initial : 'N/A'}
//               </Text>
//             </View>

//             <Text style={styles.profileName}>
//               {typeof userDetails.name === 'string' ? userDetails.name : 'N/A'}
//             </Text>

//             <View style={styles.detailRow}>
//               <Icon name="user" size={18} color="#fff" style={styles.detailIcon} />
//               <Text style={styles.detailText}>
//                 Employee ID: {typeof userDetails.employeeId === 'string' ? userDetails.employeeId : 'N/A'}
//               </Text>
//             </View>

//             <View style={styles.detailRow}>
//               <Icon name="briefcase" size={18} color="#fff" style={styles.detailIcon} />
//               <Text style={styles.detailText}>
//                 Role: {typeof userDetails.role === 'string' ? userDetails.role : 'N/A'}
//               </Text>
//             </View>

//             <View style={styles.detailRow}>
//               <Icon name="grid" size={18} color="#fff" style={styles.detailIcon} />
//               <Text style={styles.detailText}>
//                 Department: {typeof userDetails.department === 'string' ? userDetails.department : 'N/A'}
//               </Text>
//             </View>

//             <View style={styles.detailRow}>
//               <Icon name="users" size={18} color="#fff" style={styles.detailIcon} />
//               <Text style={styles.detailText}>
//                 RoleType: {typeof userDetails.roleType === 'string' ? userDetails.roleType : 'N/A'}
//               </Text>
//             </View>

//             <View style={styles.detailRow}>
//               <Icon name="phone" size={18} color="#fff" style={styles.detailIcon} />
//               <Text style={styles.detailText}>
//                 Phone: {typeof userDetails.phoneNo === 'string' ? userDetails.phoneNo : 'N/A'}
//               </Text>
//             </View>

//             <View style={styles.detailRow}>
//               <Icon name="mail" size={18} color="#fff" style={styles.detailIcon} />
//               <Text style={styles.emailText}>
//                 Email: {typeof userDetails.email === 'string' ? userDetails.email : 'N/A'}
//               </Text>
//             </View>

//             {canEditProfile && (
//               <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
//                 <Icon name="edit" size={18} color="#fff" style={styles.editIcon} />
//                 <Text style={styles.editButtonText}>Edit Profile</Text>
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//               <Icon name="log-out" size={18} color="#fff" style={styles.logoutIcon} />
//               <Text style={styles.logoutButtonText}>Logout</Text>
//             </TouchableOpacity>
//           </LinearGradient>
//         </LinearGradient>
//       </Modal>

//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={editModalVisible}
//         onRequest={() => setEditModalVisible(false)}
//       >
//         <View style={styles.editModalContainer}>
//           <View style={styles.editModalContent}>
//             <Text style={styles.editModalTitle}>Edit Profile</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Name"
//               value={editForm.name}
//               onChangeText={(text) => setEditForm({ ...editForm, name: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Phone Number"
//               value={editForm.phoneNo}
//               onChangeText={(text) => setEditForm({ ...editForm, phoneNo: text })}
//               keyboardType="phone-pad"
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Email"
//               value={editForm.email}
//               onChangeText={(text) => setEditForm({ ...editForm, email: text })}
//               keyboardType="email-address"
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Role"
//               value={editForm.role}
//               onChangeText={(text) => setEditForm({ ...editForm, role: text })}
//               keyboardType="email-address"
//             />

//                         <TextInput
//               style={styles.input}
//               placeholder="Role"
//               value={editForm.department}
//               onChangeText={(text) => setEditForm({ ...editForm, department: text })}
//               keyboardType="email-address"
//             />
//             <View style={styles.buttonContainer}>
//               <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
//                 <Text style={styles.buttonText}>Save</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => setEditModalVisible(false)}
//               >
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// Profile.propTypes = {
//   visible: PropTypes.bool,
//   onClose: PropTypes.func.isRequired,
//   onLogout: PropTypes.func.isRequired,
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '85%',
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 5,
//   },
//   profileLogoButton: {
//     alignSelf: 'flex-end',
//     padding: 10,
//   },
//   profileLogo: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   profileInitial: {
//     fontSize: 40,
//     color: '#003087',
//     fontWeight: 'bold',
//   },
//   profileName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 20,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   detailIcon: {
//     marginRight: 10,
//   },
//   detailText: {
//     fontSize: 16,
//     color: '#fff',
//   },
//   editButton: {
//     flexDirection: 'row',
//     backgroundColor: '#007bff',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//     borderWidth: 2, // Added for visibility check
//     borderColor: '#ff0', // Bright border to confirm rendering
//   },
//   editIcon: {
//     marginRight: 10,
//   },
//   editButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     backgroundColor: '#ff0000',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   logoutIcon: {
//     marginRight: 10,
//   },
//   logoutButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   loadingText: {
//     fontSize: 18,
//     color: '#fff',
//   },
//   editModalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   editModalContent: {
//     width: '80%',
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   editModalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   saveButton: {
//     backgroundColor: '#007bff',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     flex: 1,
//     marginRight: 10,
//     alignItems: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#6c757d',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     flex: 1,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default Profile;
