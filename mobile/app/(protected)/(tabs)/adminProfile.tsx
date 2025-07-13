import React, { useState, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import userAuthStore from "../../../utils/store";

const Profile = () => {
  const { user, logOut, updateProfile } = userAuthStore();
  const router = useRouter();

  const parsedUser = typeof user === "string" ? JSON.parse(user) : user;

  const [avatar, setAvatar] = useState(parsedUser?.avatar || null);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState(parsedUser?.username || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (parsedUser?.avatar) {
      setAvatar(parsedUser.avatar);
    }
  }, [parsedUser]);

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

      const res = await updateProfile(
        parsedUser._id,
        parsedUser.username,
        "",
        selectedImage
      );

      if (res.success) {
        Toast.show({
          type: "success",
          text1: "Profile image updated",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Image update failed",
          text2: res.error || "Try again later",
        });
      }
    }
  };

  const handleUpdate = async () => {
    if (updating) return;
    setUpdating(true);

    if (!username.trim() || !oldPassword || !newPassword) {
      Toast.show({
        type: "error",
        text1: "All fields are required",
      });
      setUpdating(false);
      return;
    }

    if (oldPassword === newPassword) {
      Toast.show({
        type: "error",
        text1: "New password must be different",
      });
      setUpdating(false);
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: "error",
        text1: "Password too short",
        text2: "New password must be at least 6 characters",
      });
      setUpdating(false);
      return;
    }

    const result = await updateProfile(
      parsedUser._id,
      username,
      newPassword,
      avatar,
      oldPassword
    );

    if (result?.success) {
      Toast.show({
        type: "success",
        text1: "Profile updated successfully",
      });
      setShowModal(false);
    } else {
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: result?.error || "Try again later",
      });
    }

    setUpdating(false);
    setOldPassword("");
    setNewPassword("");
  };

  const initial =
    parsedUser?.username?.trim()?.charAt(0)?.toUpperCase() || "U";

  if (!parsedUser || parsedUser.role !== "admin") {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-red-500 text-xl font-bold">Access Denied</Text>
        <Text className="text-gray-600 mt-2 text-center">
          You are not authorized to view this page.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-green-100 px-4 pt-10">
      <ScrollView contentContainerStyle={{ paddingVertical: 40 }}>
        <View className="items-center mb-10 mt-2">
          <TouchableOpacity onPress={pickImage} className="items-center">
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
            ) : (
              <View className="w-32 h-32 rounded-full bg-green-500 border-4 border-white shadow-lg items-center justify-center">
                <Text className="text-4xl font-bold text-white">{initial}</Text>
              </View>
            )}
            <Text className="text-sm text-gray-500 mt-2">
              Click to upload a new photo
            </Text>
          </TouchableOpacity>

          <Text className="text-4xl font-bold text-green-500 mt-8">
            Profile Settings
          </Text>
        </View>

        {/* User Info */}
        <View className="bg-white p-6 rounded-3xl shadow-lg">
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-1">Username</Text>
            <View className="rounded-sm px-4 bg-blue-100 h-14 py-4">
              <Text className="text-gray-900 text-base">{parsedUser?.username}</Text>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
            <View className="rounded-sm px-4 bg-blue-100 h-14 py-4">
              <Text className="text-gray-900 text-base">{parsedUser?.email}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setShowModal(true)}
            className="bg-green-500 py-3 rounded-sm items-center self-center w-full mb-4"
          >
            <Text className="text-black text-lg font-medium">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 py-3 rounded-sm self-center w-full items-center"
          >
            <Text className="text-black text-lg font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal */}
      {showModal && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 items-center justify-center z-50">
          <View className="bg-white rounded-xl p-6 w-[90%] shadow-lg">
            <Text className="text-2xl font-bold mb-4 text-center">Update Profile</Text>

            <Text className="text-base mb-1 text-gray-700">Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              className="border border-gray-300 px-3 py-2 rounded-md mb-3"
              placeholder="Enter new username"
            />

            <Text className="text-base mb-1 text-gray-700">Old Password</Text>
            <TextInput
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
              className="border border-gray-300 px-3 py-2 rounded-md mb-3"
              placeholder="Enter old password"
            />

            <Text className="text-base mb-1 text-gray-700">New Password</Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              className="border border-gray-300 px-3 py-2 rounded-md mb-4"
              placeholder="Enter new password"
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-400 px-4 py-2 rounded-md"
                onPress={() => setShowModal(false)}
              >
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`bg-green-500 px-4 py-2 rounded-md ${
                  updating && "opacity-60"
                }`}
                disabled={updating}
                onPress={handleUpdate}
              >
                <Text className="text-white font-semibold">
                  {updating ? "Updating..." : "Update"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <Toast />
    </SafeAreaView>
  );
};

export default Profile;
