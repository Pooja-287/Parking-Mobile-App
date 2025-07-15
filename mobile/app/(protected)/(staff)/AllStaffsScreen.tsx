
// import { Clipboard, ToastAndroid } from "react-native";


// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   SafeAreaView,
//   TouchableOpacity,
//   Alert,
//   Modal,
//   TextInput,
//   Pressable,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import Toast from "react-native-toast-message";
// import { BlurView } from "expo-blur"; 
// import userAuthStore from "@/utils/store";
// import { useNavigation } from "@react-navigation/native";


// const AllStaffs = () => {
//   const { getAllStaffs, staffs, isLoading, deleteStaff, updateStaff } = userAuthStore();

//   const [isModalVisible, setModalVisible] = useState(false);
//   const [editStaffId, setEditStaffId] = useState<string | null>(null);
//   const [editUsername, setEditUsername] = useState("");
//   const [editPassword, setEditPassword] = useState("");
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [selectedStaff, setSelectedStaff] = useState<any>(null);
//   const navigation = useNavigation();


//   useEffect(() => {
//     fetchStaffs();
//   }, []);

//   const fetchStaffs = async () => {
//     const res = await getAllStaffs();
//     if (!res.success) {
//       Toast.show({
//         type: "error",
//         text1: "Failed to fetch staff list",
//         text2: res.error || "",
//       });
//     }
//   };

//   const handleDelete = (staffId: string) => {
//     Alert.alert("Delete Staff", "Are you sure?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Delete",
//         onPress: async () => {
//           const result = await deleteStaff(staffId);
//           if (!result.success) {
//             Toast.show({
//               type: "error",
//               text1: "Delete Failed",
//               text2: result.error || "Failed to delete staff",
//             });
//           } else {
//             Toast.show({
//               type: "success",
//               text1: "Deleted Successfully",
//               visibilityTime: 2000,
//             });
//             await fetchStaffs();
//           }
//         },
//         style: "destructive",
//       },
//     ]);
//   };

//   const handleEditPress = (staff: any) => {
//     setEditStaffId(staff._id);
//     setEditUsername(staff.username);
//     setEditPassword("");
//     setPasswordVisible(false);
//     setModalVisible(true);
//   };

//   const handleSaveUpdate = async () => {
//     if (!editStaffId || !editUsername) {
//       Toast.show({
//         type: "error",
//         text1: "Validation Error",
//         text2: "Username is required.",
//       });
//       return;
//     }

//     const updates: any = { username: editUsername };
//     if (editPassword) updates.password = editPassword;

//     const result = await updateStaff(editStaffId, updates);
//     if (!result.success) {
//       Toast.show({
//         type: "error",
//         text1: "Update Failed",
//         text2: result.error || "Failed to update staff",
//       });
//     } else {
//       Toast.show({
//         type: "success",
//         text1: "Staff Updated ✅",
//         text2: "Changes saved successfully.",
//         visibilityTime: 3000,
//       });

//       setTimeout(() => {
//         setModalVisible(false);
//       }, 2000);

//       await fetchStaffs();
//     }
//   };

//   const renderItem = ({ item }: any) => (
//     <View className="bg-white p-4 mb-3 rounded-lg shadow">
//       <View className="flex-row justify-between items-center mb-1">
//         <Text className="text-lg font-bold">{item.username}</Text>
//         <View className="flex-row gap-6">
//           <TouchableOpacity onPress={() => setSelectedStaff(item)}>
//             <Ionicons name="eye-outline" size={22} color="gray" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => handleEditPress(item)}>
//             <Ionicons name="create-outline" size={22} color="blue" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => handleDelete(item._id)}>
//             <Ionicons name="trash-outline" size={22} color="red" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   // Fallback blur for Android < 12
//   const renderBlurWrapper = (children: React.ReactNode) => {
//     return Platform.OS === "android" ? (
//       <View className="flex-1 justify-center items-center bg-blue-100 bg-opacity-50 px-4">
//         {children}
//       </View>
//     ) : (
//       <BlurView intensity={80} tint="light" className="flex-1 justify-center items-center px-4">
//         {children}
//       </BlurView>
//     );
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-100 px-4 mt-6 py-6">
//    <View className="flex-row items-center mb-6">
//     <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
//       <Ionicons name="arrow-back" size={28} color="#1F2937" />
//     </TouchableOpacity>
//     <Text className="text-2xl font-bold text-gray-800 " > Staff Details</Text>
//   </View>

//       {isLoading ? (
//         <ActivityIndicator size="large" color="#4F46E5" />
//       ) : staffs.length === 0 ? (
//         <Text className="text-center text-gray-500">No staff found</Text>
//       ) : (
//         <FlatList data={staffs} keyExtractor={(item) => item._id} renderItem={renderItem} />
//       )}

//      {/* ✏️ Enhanced Edit Modal */}
// <Modal
//   visible={isModalVisible}
//   animationType="slide"
//   transparent={true}
//   onRequestClose={() => setModalVisible(false)}
// >
//   {renderBlurWrapper(
//     <View className="bg-white w-11/12 rounded-xl p-5 shadow-xl">
//       <Text className="text-xl font-bold mb-4 text-center text-green-700">
//          Edit Staff Details
//       </Text>

//       <View className="mb-3">
//         <Text className="text-sm font-medium text-gray-700 mb-1">Username</Text>
//         <TextInput
//           value={editUsername}
//           onChangeText={setEditUsername}
//           placeholder="Enter new username"
//           className="border px-4 py-2 rounded bg-blue-100 text-base"
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-medium text-gray-700 mb-1">New Password</Text>
//         <View className="relative">
//           <TextInput
//             value={editPassword}
//             onChangeText={setEditPassword}
//             placeholder="Enter new password (optional)"
//             secureTextEntry={!passwordVisible}
//             className="border px-4 py-2 rounded-sm bg-blue-100  text-base"

//           />
//           <TouchableOpacity
//             onPress={() => setPasswordVisible(!passwordVisible)}
//             style={{ position: "absolute", right: 10, top: 8 }}
//           >
//             <Ionicons
//               name={passwordVisible ? "eye-outline" : "eye-off-outline"}
//               size={20}
//               color="gray"
//             />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View className="flex-row justify-end gap-3 mt-6">
//         <Pressable
//           onPress={() => setModalVisible(false)}
//           className="px-5 py-2 rounded bg-gray-200"
//         >
//           <Text className="text-gray-800 font-medium">Cancel</Text>
//         </Pressable>
//         <Pressable
//           onPress={handleSaveUpdate}
//           className="px-5 py-2 rounded bg-green-500"
//         >
//           <Text className="text-white font-semibold">Save Changes</Text>
//         </Pressable>
//       </View>
//     </View>
//   )}
// </Modal>


//      <Modal
//   visible={!!selectedStaff}
//   animationType="fade"
//   transparent={true}
//   onRequestClose={() => setSelectedStaff(null)}
// >
//   {renderBlurWrapper(
//     <View className="bg-white  w-full rounded-xl p-6 shadow-xl">
//       <Text className="text-2xl font-bold mb-6 text-center text-indigo-700">
//         👤 Staff Details
//       </Text>

//       <View className="space-y-4">
//         {/* Username */}
//         <View className="mb-3 border bg-blue-100 rounded-sm px-4 py-2 flex-row items-center gap-3 text-base">
//           {/* border px-4 py-2 rounded bg-blue-100 text-base */}
//           <Ionicons name="person-circle-outline" size={24} color="#4B5563" />
//           <View>
//             <Text className="text-xs text-gray-500 uppercase tracking-wider">Username</Text>
//             <Text className="text-lg text-gray-800 font-semibold">
//               {selectedStaff?.username}
//             </Text>
//           </View>
//         </View>

//         {/* Password */}
//         <View className="border bg-blue-100 rounded-sm px-4 py-2 flex-row items-center justify-between text-base">
//           <View className="flex-row items-center gap-3">
//             <Ionicons name="key-outline" size={24} color="#4B5563" />
//             <View>
//               <Text className="text-xs text-gray-500 uppercase tracking-wider">Password</Text>
//               <Text className="text-lg text-gray-800 font-semibold">
//                 {passwordVisible ? selectedStaff?.password : "••••••••"}
//               </Text>
//             </View>
//           </View>

//           <View className="flex-row gap-4">
//             {/* Toggle eye */}
//             <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
//               <Ionicons
//                 name={passwordVisible ? "eye-outline" : "eye-off-outline"}
//                 size={22}
//                 color="gray"
//               />
//             </TouchableOpacity>

//             {/* Copy password */}
//             <TouchableOpacity
//               onPress={() => {
//                 Clipboard.setString(selectedStaff?.password || "");
//                 if (Platform.OS === "android") {
//                   ToastAndroid.show("Password copied!", ToastAndroid.SHORT);
//                 } else {
//                   Toast.show({
//                     type: "success",
//                     text1: "Password copied to clipboard",
//                   });
//                 }
//               }}
//             >
//               <Ionicons name="copy-outline" size={22} color="gray" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       {/* Close Button */}
//       <Pressable
//         onPress={() => setSelectedStaff(null)}
//         className="mt-8 bg-green-500 px-5 py-3 rounded-sm"
//       >
//         <Text className="text-white text-center text-xl font-semibold">
//           Close
//         </Text>
//       </Pressable>
//     </View>
//   )}
// </Modal>


//       <Toast />
//     </SafeAreaView>
//   );
// };

// export default AllStaffs;






import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Pressable,
  Platform,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { BlurView } from "expo-blur";
import userAuthStore from "@/utils/store";
import { useNavigation } from "@react-navigation/native";
import { Clipboard } from "react-native";

const AllStaffs = () => {
  const {
    getAllStaffs,
    staffs,
    isLoading,
    deleteStaff,
    updateStaff,
  } = userAuthStore();

  const [isModalVisible, setModalVisible] = useState(false);
  const [editStaffId, setEditStaffId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [buildingName, setBuildingName] = useState("");
  const [buildingLocation, setBuildingLocation] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const navigation = useNavigation();

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    const res = await getAllStaffs();
    if (!res.success) {
      Toast.show({
        type: "error",
        text1: "Failed to fetch staff list",
        text2: res.error || "",
      });
    }
  };

  const handleDelete = (staffId: string) => {
    Alert.alert("Delete Staff", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const result = await deleteStaff(staffId);
          if (!result.success) {
            Toast.show({
              type: "error",
              text1: "Delete Failed",
              text2: result.error || "Failed to delete staff",
            });
          } else {
            Toast.show({
              type: "success",
              text1: "Deleted Successfully",
              visibilityTime: 2000,
            });
            await fetchStaffs();
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleEditPress = (staff: any) => {
    setEditStaffId(staff._id);
    setEditUsername(staff.username);
    setEditPassword("");
    setPasswordVisible(false);
    setBuildingName(staff?.building?.name || "");
    setBuildingLocation(staff?.building?.location || "");
    setModalVisible(true);
  };

  const handleSaveUpdate = async () => {
    if (!editStaffId || !editUsername) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Username is required.",
      });
      return;
    }

    const updates: any = {
      username: editUsername,
      building: {
        name: buildingName,
        location: buildingLocation,
      },
    };

    if (editPassword) updates.password = editPassword;

    const result = await updateStaff(editStaffId, updates);
    if (!result.success) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: result.error || "Failed to update staff",
      });
    } else {
      Toast.show({
        type: "success",
        text1: "Staff Updated ✅",
        text2: "Changes saved successfully.",
      });
      setModalVisible(false);
      fetchStaffs();
    }
  };

  const renderItem = ({ item }: any) => (
    <View className="bg-white p-4 mb-3 rounded-lg shadow">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-lg font-bold">{item.username}</Text>
        <View className="flex-row gap-6">
          <TouchableOpacity onPress={() => setSelectedStaff(item)}>
            <Ionicons name="eye-outline" size={22} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleEditPress(item)}>
            <Ionicons name="create-outline" size={22} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item._id)}>
            <Ionicons name="trash-outline" size={22} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderBlurWrapper = (children: React.ReactNode) => {
    return Platform.OS === "android" ? (
      <View className="flex-1 justify-center items-center bg-blue-100 bg-opacity-50 px-4">
        {children}
      </View>
    ) : (
      <BlurView intensity={80} tint="light" className="flex-1 justify-center items-center px-4">
        {children}
      </BlurView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-4 mt-6 py-6">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <Ionicons name="arrow-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">Staff Details</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#4F46E5" />
      ) : staffs.length === 0 ? (
        <Text className="text-center text-gray-500">No staff found</Text>
      ) : (
        <FlatList
          data={staffs}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}

      {/* Edit Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        {renderBlurWrapper(
          <View className="bg-white w-11/12 rounded-xl p-5 shadow-xl">
            <Text className="text-xl font-bold mb-4 text-center text-green-700">
              ✏️ Edit Staff Details
            </Text>

            <TextInput
              value={editUsername}
              onChangeText={setEditUsername}
              placeholder="Username"
              className="border px-4 py-2 rounded bg-blue-100 text-base mb-3"
            />

            <View className="relative mb-3">
              <TextInput
                value={editPassword}
                onChangeText={setEditPassword}
                placeholder="New Password (optional)"
                secureTextEntry={!passwordVisible}
                className="border px-4 py-2 rounded bg-blue-100 text-base"
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={{ position: "absolute", right: 10, top: 12 }}
              >
                <Ionicons
                  name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            <TextInput
              value={buildingName}
              onChangeText={setBuildingName}
              placeholder="Building Name"
              className="border px-4 py-2 rounded bg-blue-100 text-base mb-3"
            />

            <TextInput
              value={buildingLocation}
              onChangeText={setBuildingLocation}
              placeholder="Building Location"
              className="border px-4 py-2 rounded bg-blue-100 text-base mb-4"
            />

            <View className="flex-row justify-end gap-3">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="px-5 py-2 rounded bg-gray-200"
              >
                <Text className="text-gray-800 font-medium">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveUpdate}
                className="px-5 py-2 rounded bg-green-500"
              >
                <Text className="text-white font-semibold">Save</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>

      {/* View Staff Modal */}
      <Modal
        visible={!!selectedStaff}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedStaff(null)}
      >
        {renderBlurWrapper(
          <View className="bg-white w-full rounded-xl p-6 shadow-xl">
            <Text className="text-2xl font-bold mb-6 text-center text-indigo-700">
              👤 Staff Details
            </Text>

            <View className="space-y-4">
              <View className="mb-3 border bg-blue-100 rounded-sm px-4 py-2 flex-row items-center gap-3 text-base">
                <Ionicons name="person-circle-outline" size={24} color="#4B5563" />
                <View>
                  <Text className="text-xs text-gray-500 uppercase tracking-wider">Username</Text>
                  <Text className="text-lg text-gray-800 font-semibold">
                    {selectedStaff?.username}
                  </Text>
                </View>
              </View>

              <View className="border bg-blue-100 rounded-sm px-4 py-2 flex-row items-center justify-between text-base">
                <View className="flex-row items-center gap-3">
                  <Ionicons name="key-outline" size={24} color="#4B5563" />
                  <View>
                    <Text className="text-xs text-gray-500 uppercase tracking-wider">Password</Text>
                    <Text className="text-lg text-gray-800 font-semibold">
                      {passwordVisible ? selectedStaff?.password : "••••••••"}
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-4">
                  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Ionicons
                      name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                      size={22}
                      color="gray"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Clipboard.setString(selectedStaff?.password || "");
                      Platform.OS === "android"
                        ? ToastAndroid.show("Password copied!", ToastAndroid.SHORT)
                        : Toast.show({ type: "success", text1: "Password copied!" });
                    }}
                  >
                    <Ionicons name="copy-outline" size={22} color="gray" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Pressable
              onPress={() => setSelectedStaff(null)}
              className="mt-8 bg-green-500 px-5 py-3 rounded-sm"
            >
              <Text className="text-white text-center text-xl font-semibold">
                Close
              </Text>
            </Pressable>
          </View>
        )}
      </Modal>

      <Toast />
    </SafeAreaView>
  );
};

export default AllStaffs;
