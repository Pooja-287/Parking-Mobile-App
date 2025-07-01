// import React, { useState, useEffect } from "react";
// import {
//   View,
//   ScrollView,
//   Alert,
//   Modal,
//   useColorScheme,
// } from "react-native";
// import {
//   TextInput,
//   Button,
//   Text,
//   Card,
//   IconButton,
//   ActivityIndicator,
//   useTheme,
//   Provider as PaperProvider,
//   DefaultTheme,
//   MD3DarkTheme,
//   Portal,
// } from "react-native-paper";
// import axios from "axios";
// import * as SecureStore from "expo-secure-store";
// import { decode as atob } from "base-64";
// import Animated, { FadeInUp, FadeOut } from "react-native-reanimated";

// // Your backend URL
// const BASE_URL = "http://192.168.29.198:5000";

// const Profile = () => {
//   const scheme = useColorScheme();
//   const dark = scheme === "dark";
//   const theme = dark ? MD3DarkTheme : DefaultTheme;

//   const [authMode, setAuthMode] = useState("login");
//   const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });
//   const [allAdmins, setAllAdmins] = useState([]);
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [editForm, setEditForm] = useState({
//     id: "",
//     username: "",
//     password: "",
//   });

//   const handleInputChange = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const saveToken = async (token) => {
//     await SecureStore.setItemAsync("admin_token", token);
//   };

//   const getToken = async () => {
//     return await SecureStore.getItemAsync("admin_token");
//   };

//   const decodeToken = (token) => {
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return payload?.id;
//     } catch (err) {
//       console.error("Token decode failed:", err);
//       return null;
//     }
//   };

//   const register = async () => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("username", form.username);
//       formData.append("email", form.email);
//       formData.append("password", form.password);

//       const res = await axios.post(`${BASE_URL}/api/register`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (!res.data.token) {
//         throw new Error("No token returned from register.");
//       }

//       await saveToken(res.data.token);
//       await fetchProfile();
//       setAuthMode("profile");
//       Alert.alert("Success", "Admin registered successfully!");
//     } catch (err) {
//       Alert.alert(
//         "Register Failed",
//         err?.response?.data?.message || "Unknown error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${BASE_URL}/api/loginAdmin`,
//         {
//           username: form.username,
//           password: form.password,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const token = res.data.token;
//       if (!token) {
//         throw new Error("No token returned from login.");
//       }

//       await saveToken(token);
//       await fetchProfile();
//       setAuthMode("profile");

//       Alert.alert("Success", "Login successful!");
//     } catch (err) {
//       Alert.alert(
//         "Login Failed",
//         err?.response?.data?.message || "Unknown error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProfile = async () => {
//     setLoading(true);
//     try {
//       const token = await getToken();
//       if (!token) return;

//       const id = decodeToken(token);
//       if (!id) return;

//       const res = await axios.get(`${BASE_URL}/api/getAdminById/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setAdmin(res.data);
//     } catch (err) {
//       console.error("Fetch profile error:", err);
//       Alert.alert(
//         "Fetch Failed",
//         err?.response?.data?.message || "Unknown error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllAdmins = async () => {
//     setLoading(true);
//     try {
//       const token = await getToken();
//       if (!token) return;

//       const res = await axios.get(`${BASE_URL}/api/getAllAdmins`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setAllAdmins(res.data);
//     } catch (err) {
//       Alert.alert(
//         "Fetch Failed",
//         err?.response?.data?.message || "Unknown error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openEditModal = (adminData) => {
//     setEditForm({
//       id: adminData._id,
//       username: adminData.username,
//       password: "",
//     });
//     setEditModalVisible(true);
//   };

//   const handleEditSubmit = async () => {
//     setLoading(true);
//     try {
//       const token = await getToken();
//       const payload = {
//         username: editForm.username,
//       };
//       if (editForm.password) {
//         payload.password = editForm.password;
//       }

//       await axios.put(
//         `${BASE_URL}/api/updateAdmin/${editForm.id}`,
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       Alert.alert("Success", "Admin updated successfully!");
//       setEditModalVisible(false);
//       fetchAllAdmins();
//     } catch (err) {
//       Alert.alert(
//         "Update Failed",
//         err?.response?.data?.message || "Unknown error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteAdmin = async (id) => {
//     Alert.alert("Confirm", "Are you sure you want to delete this admin?", [
//       {
//         text: "Cancel",
//         style: "cancel",
//       },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: async () => {
//           setLoading(true);
//           try {
//             const token = await getToken();
//             await axios.delete(`${BASE_URL}/api/deleteAdmin/delete/${id}`, {
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             Alert.alert("Deleted", "Admin deleted successfully.");
//             fetchAllAdmins();
//           } catch (err) {
//             Alert.alert(
//               "Delete Failed",
//               err?.response?.data?.message || "Unknown error"
//             );
//           } finally {
//             setLoading(false);
//           }
//         },
//       },
//     ]);
//   };

//   const logout = async () => {
//     await SecureStore.deleteItemAsync("admin_token");
//     setAuthMode("login");
//     setAdmin(null);
//     setAllAdmins([]);
//     Alert.alert("Logged out successfully.");
//   };

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-white dark:bg-black">
//         <ActivityIndicator animating color={theme.colors.primary} size="large" />
//         <Text className="mt-4 text-gray-700 dark:text-gray-200">
//           Processing...
//         </Text>
//       </View>
//     );
//   }

//   if (authMode !== "profile") {
//     return (
//       <PaperProvider theme={theme}>
//         <ScrollView
//           className="flex-1 bg-gray-50 dark:bg-black"
//           contentContainerStyle={{ justifyContent: "center", flexGrow: 1 }}
//         >
//           <Animated.View
//             entering={FadeInUp}
//             className="mx-6 p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-lg"
//           >
//             <Text className="text-3xl font-bold text-center mb-6 text-blue-700 dark:text-blue-300">
//               {authMode === "login" ? "Admin Login" : "Admin Register"}
//             </Text>

//             <TextInput
//               label="Username"
//               value={form.username}
//               onChangeText={(val) => handleInputChange("username", val)}
//               left={<TextInput.Icon icon="account" />}
//               mode="outlined"
//               className="mb-4"
//             />

//             {authMode === "register" && (
//               <TextInput
//                 label="Email"
//                 value={form.email}
//                 onChangeText={(val) => handleInputChange("email", val)}
//                 keyboardType="email-address"
//                 left={<TextInput.Icon icon="email" />}
//                 mode="outlined"
//                 className="mb-4"
//               />
//             )}

//             <TextInput
//               label="Password"
//               value={form.password}
//               onChangeText={(val) => handleInputChange("password", val)}
//               secureTextEntry
//               left={<TextInput.Icon icon="lock" />}
//               mode="outlined"
//               className="mb-4"
//             />

//             <Button
//               mode="contained"
//               onPress={authMode === "login" ? login : register}
//               className="mb-4 py-1"
//               contentStyle={{ paddingVertical: 8 }}
//             >
//               {authMode === "login" ? "Login" : "Register"}
//             </Button>

//             <Button
//               mode="text"
//               onPress={() =>
//                 setAuthMode(authMode === "login" ? "register" : "login")
//               }
//               labelStyle={{ textDecorationLine: "underline" }}
//             >
//               {authMode === "login"
//                 ? "Don't have an account? Register"
//                 : "Already have an account? Login"}
//             </Button>
//           </Animated.View>
//         </ScrollView>
//       </PaperProvider>
//     );
//   }

//   return (
//     <PaperProvider theme={theme}>
//       <ScrollView className="p-4 bg-gray-50 dark:bg-black">
//         {admin && (
//           <Animated.View entering={FadeInUp} exiting={FadeOut}>
//             <Card className="mb-4">
//               <Card.Title
//                 title={admin.username}
//                 subtitle={admin.email}
//               />
//               <Card.Content>
//                 <Text className="text-gray-700 dark:text-gray-300">
//                   Role: {admin.role}
//                 </Text>
//               </Card.Content>
//             </Card>
//           </Animated.View>
//         )}

//         <Button
//           mode="contained"
//           onPress={fetchAllAdmins}
//           className="mb-3"
//         >
//           Load All Admins
//         </Button>

//         <Button
//           mode="outlined"
//           onPress={logout}
//           className="mb-5"
//         >
//           Logout
//         </Button>

//         {allAdmins.map((a) => (
//           <Animated.View key={a._id} entering={FadeInUp} exiting={FadeOut}>
//             <Card className="mb-4">
//               <Card.Title
//                 title={a.username}
//                 subtitle={a.email}
//                 right={(props) => (
//                   <View className="flex-row">
//                     <IconButton
//                       {...props}
//                       icon="pencil"
//                       onPress={() => openEditModal(a)}
//                     />
//                     <IconButton
//                       {...props}
//                       icon="delete"
//                       iconColor={theme.colors.error}
//                       onPress={() => deleteAdmin(a._id)}
//                     />
//                   </View>
//                 )}
//               />
//               <Card.Content>
//                 <Text className="text-gray-600 dark:text-gray-300">
//                   Role: {a.role}
//                 </Text>
//               </Card.Content>
//             </Card>
//           </Animated.View>
//         ))}

//         <Portal>
//           <Modal
//             visible={editModalVisible}
//             onDismiss={() => setEditModalVisible(false)}
//             transparent
//           >
//             <View className="bg-white dark:bg-gray-800 mx-8 p-6 rounded-xl">
//               <Text className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
//                 Edit Admin
//               </Text>

//               <TextInput
//                 label="Username"
//                 value={editForm.username}
//                 onChangeText={(val) =>
//                   setEditForm((prev) => ({ ...prev, username: val }))
//                 }
//                 className="mb-4"
//               />

//               <TextInput
//                 label="New Password (optional)"
//                 value={editForm.password}
//                 secureTextEntry
//                 onChangeText={(val) =>
//                   setEditForm((prev) => ({ ...prev, password: val }))
//                 }
//                 className="mb-4"
//               />

//               <Button
//                 mode="contained"
//                 onPress={handleEditSubmit}
//                 className="mb-3"
//               >
//                 Save
//               </Button>
//               <Button onPress={() => setEditModalVisible(false)}>
//                 Cancel
//               </Button>
//             </View>
//           </Modal>
//         </Portal>
//       </ScrollView>
//     </PaperProvider>
//   );
// };

// export default Profile;















import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import tw from "twrnc";

const SERVER_URL = "http://localhost:5000"; // change to your LAN IP if testing on device

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const stored = await AsyncStorage.getItem("admin");
        if (stored) {
          const parsed = JSON.parse(stored);
          setAdmin(parsed);
          setNewUsername(parsed.username);
        }
      } catch (error) {
        console.log("Error loading admin:", error);
      }
    };
    loadAdmin();
  }, []);

  const handleUpdateAdmin = async () => {
    try {
      const payload = {};

      if (newUsername && newUsername !== admin.username) {
        payload.username = newUsername;
      }

      if (newPassword) {
        payload.password = newPassword;
      }

      if (Object.keys(payload).length === 0) {
        Alert.alert("Nothing to update");
        return;
      }

      const res = await axios.put(
        `${SERVER_URL}/api/updateuser/${admin._id}`,
        payload
      );

      Alert.alert("Success", "Admin updated successfully");

      // Save updated admin in storage
      await AsyncStorage.setItem("admin", JSON.stringify(res.data.admin));
      setAdmin(res.data.admin);

      setNewPassword("");
    } catch (err) {
      console.log(err.response?.data || err.message);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to update"
      );
    }
  };

  if (!admin) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-green-100`}>
        <Text style={tw`text-lg text-gray-700`}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-green-100`}>
      <ScrollView contentContainerStyle={tw`p-5`}>
        <Text style={tw`text-2xl font-bold text-center mb-6 text-green-800`}>
          Profile
        </Text>

        {/* Username */}
        <Text style={tw`text-lg mb-2`}>Username:</Text>
        <TextInput
          placeholder="Enter username"
          value={newUsername}
          onChangeText={setNewUsername}
          style={tw`border border-gray-300 rounded-xl px-4 py-3 mb-4 bg-white`}
        />

        {/* Email (non-editable) */}
        <Text style={tw`text-lg mb-2`}>Email:</Text>
        <Text style={tw`text-lg mb-6`}>{admin.email}</Text>

        {/* Change password */}
        <Text style={tw`text-lg mb-2`}>Change Password:</Text>
        <TextInput
          placeholder="Enter new password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          style={tw`border border-gray-300 rounded-xl px-4 py-3 mb-4 bg-white`}
        />

        <TouchableOpacity
          style={tw`bg-green-600 py-3 rounded-xl`}
          onPress={handleUpdateAdmin}
        >
          <Text style={tw`text-center text-white text-lg font-semibold`}>
            Save Changes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
