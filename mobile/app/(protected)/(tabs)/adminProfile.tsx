




import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userAuthStore from "../../../utils/store";

const Profile = () => {
  const { user, logOut, updateProfile } = userAuthStore();
  const router = useRouter();

  const parsedUser = typeof user === "string" ? JSON.parse(user) : user;

  const [avatar, setAvatar] = useState(parsedUser?.avatar || null);

  // ✅ Block if not admin
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
        Alert.alert("Success", "Profile image updated successfully");
      } else {
        Alert.alert("Error", res.error || "Failed to update image");
      }
    }
  };

  const initial =
    parsedUser?.username?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-10">
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
          <Text className="text-base text-gray-500 mt-2 text-center">
            Manage your account settings and preferences
          </Text>
        </View>

        {/* Details Card */}
        <View className="bg-white p-6 rounded-3xl shadow-lg">
          {/* Username */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Username
            </Text>
            <View className="rounded-sm px-4 bg-blue-100 h-14 py-4">
              <Text className="text-gray-900 text-base">
                {parsedUser?.username || "john_doe"}
              </Text>
            </View>
          </View>

          {/* Email */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Email Address
            </Text>
            <View className="rounded-sm px-4 bg-blue-100 h-14 py-4">
              <Text className="text-gray-900 text-base">
                {parsedUser?.email || "john.doe@example.com"}
              </Text>
            </View>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity
            onPress={() => router.push("/updateProfile")}
            className="bg-green-500 py-3 rounded-sm items-center self-center w-36 mb-4"
          >
            <Text className="text-black text-lg font-medium">Edit Profile</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 py-3 rounded-sm self-center w-36 items-center"
          >
            <Text className="text-black text-lg font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
