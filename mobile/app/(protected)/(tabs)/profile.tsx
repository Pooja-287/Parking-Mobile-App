// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
//   Image,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import userAuthStore from "../../../utils/store";
// import * as ImagePicker from "expo-image-picker";
// import { useRouter } from "expo-router";

// const Profile = () => {
//   const { user, logOut } = userAuthStore();
//   const router = useRouter();

//   const parsedUser = typeof user === "string" ? JSON.parse(user) : user;

//   const [avatar, setAvatar] = useState(
//     parsedUser?.avatar || "https://i.pravatar.cc/150?img=8"
//   );

//   const handleLogout = () => {
//     Alert.alert("Logout", "Are you sure you want to logout?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Logout",
//         style: "destructive",
//         onPress: () => {
//           logOut();
//           router.replace("/login");
//         },
//       },
//     ]);
//   };

//   const pickImage = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) {
//       return Alert.alert("Permission required", "Please allow gallery access.");
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//       allowsEditing: true,
//     });

//     if (!result.canceled) {
//       const selectedImage = result.assets[0].uri;
//       setAvatar(selectedImage);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-green-100 px-4">
//       <ScrollView contentContainerStyle={{ paddingVertical: 40 }}>
//         <View className="items-center mb-6">
//           <TouchableOpacity onPress={pickImage}>
//             <Image
//               source={{ uri: avatar }}
//               className="w-28 h-28 rounded-full border-4 border-white shadow-md"
//             />
//             <Text className="text-sm text-center text-blue-600 mt-2 underline">
//               Change Photo
//             </Text>
//           </TouchableOpacity>
//           <Text className="text-3xl font-bold mt-4">Welcome,</Text>
//           <Text className="text-2xl text-gray-800">
//             {parsedUser?.username || "Admin"}
//           </Text>
//         </View>

//         <View className="bg-white p-6 rounded-2xl shadow-md">
//           <Text className="text-lg text-gray-700 mb-1">Email</Text>
//           <Text className="text-xl font-semibold text-black mb-5">
//             {parsedUser?.email || "N/A"}
//           </Text>

//           <Text className="text-lg text-gray-700 mb-1">Username</Text>
//           <Text className="text-xl font-semibold text-black mb-5">
//             {parsedUser?.username || "N/A"}
//           </Text>

//           <TouchableOpacity
//             className="bg-blue-500 py-3 rounded-xl mb-3"
//             onPress={() => router.push("/updateProfile")}
//           >
//             <Text className="text-white text-center text-lg font-bold">
//               Edit Profile
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             className="bg-red-500 py-3 rounded-xl"
//             onPress={handleLogout}
//           >
//             <Text className="text-white text-center text-lg font-bold">
//               Logout
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Profile;





import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import userAuthStore from "../../../utils/store";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router"; // ✅ Correct import

const Profile = () => {
  const { user, logOut, updateProfile } = userAuthStore();
  const router = useRouter(); // ✅ Correct usage

  const parsedUser = typeof user === "string" ? JSON.parse(user) : user;

  const [avatar, setAvatar] = useState(
    parsedUser?.avatar || "https://i.pravatar.cc/150?img=8"
  );

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(parsedUser?.username || "");
  const [password, setPassword] = useState("");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logOut();
          router.replace("/login");
        },
      },
    ]);
  };

  const handleUpdate = async () => {
    const result = await updateProfile(parsedUser._id, username, password);
    if (result.success) {
      Alert.alert("Success", "Profile updated");
      setIsEditing(false);
    } else {
      Alert.alert("Error", result.error || "Update failed");
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert("Permission required", "Please allow gallery access.");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setAvatar(selectedImage);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-green-100 px-4">
      <ScrollView contentContainerStyle={{ paddingVertical: 40 }}>
        <View className="items-center mb-6">
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{ uri: avatar }}
              className="w-28 h-28 rounded-full border-4 border-white shadow-md"
            />
            <Text className="text-sm text-center text-blue-600 mt-2 underline">
              Change Photo
            </Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold mt-4">Welcome,</Text>
          <Text className="text-2xl text-gray-800">
            {parsedUser?.username || "Admin"}
          </Text>
        </View>

        <View className="bg-white p-6 rounded-2xl shadow-md">
          {isEditing ? (
            <>
              <Text className="text-lg text-gray-700 mb-1">Username</Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-2 mb-4"
                value={username}
                onChangeText={setUsername}
              />

              <Text className="text-lg text-gray-700 mb-1">New Password</Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-2 mb-6"
                value={password}
                onChangeText={setPassword}
                placeholder="Leave empty to keep old password"
                secureTextEntry
              />

              <TouchableOpacity
                className="bg-green-500 py-3 rounded-xl mb-3"
                onPress={handleUpdate}
              >
                <Text className="text-white text-center text-lg font-bold">
                  Save Changes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-gray-400 py-3 rounded-xl mb-3"
                onPress={() => setIsEditing(false)}
              >
                <Text className="text-white text-center text-lg font-bold">
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text className="text-lg text-gray-700 mb-1">Email</Text>
              <Text className="text-xl font-semibold text-black mb-5">
                {parsedUser?.email || "N/A"}
              </Text>

              <Text className="text-lg text-gray-700 mb-1">Username</Text>
              <Text className="text-xl font-semibold text-black mb-5">
                {parsedUser?.username || "N/A"}
              </Text>

              <TouchableOpacity
                className="bg-blue-500 py-3 rounded-xl mb-3"
                onPress={() => router.push("/updateProfile")}
              >
                <Text className="text-white text-center text-lg font-bold">
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            className="bg-red-500 py-3 rounded-xl"
            onPress={handleLogout}
          >
            <Text className="text-white text-center text-lg font-bold">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
