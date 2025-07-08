import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import userAuthStore from "../../../utils/store";

const UpdateProfile = () => {
  const { user, updateProfile } = userAuthStore();
  const router = useRouter();

  const scrollViewRef = useRef<ScrollView>(null);

  const [parsedUser, setParsedUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [status, setStatus] = useState<"" | "success" | "error">("");

  useEffect(() => {
    const isMounted = { current: true };

    const loadUser = async () => {
      try {
        let parsed: any = null;
        if (user) {
          parsed = typeof user === "string" ? JSON.parse(user) : user;
        } else {
          const storedUser = await AsyncStorage.getItem("user");
          if (storedUser) parsed = JSON.parse(storedUser);
        }

        if (parsed && isMounted.current) {
          if (parsed?.id && !parsed._id) parsed._id = parsed.id;
          setParsedUser(parsed);
          setUsername(parsed.username || "");
        } else if (isMounted.current) {
          Toast.show({ type: "error", text1: "User not found in storage." });
        }
      } catch (error) {
        if (isMounted.current)
          Toast.show({ type: "error", text1: "Error loading user" });
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    loadUser();

    return () => {
      isMounted.current = false;
    };
  }, [user]);

  const handleUpdate = async () => {
    if (updating) return;
    setUpdating(true);

    if (!parsedUser || !parsedUser._id) {
      setStatus("error");
      Toast.show({ type: "error", text1: "User ID not found" });
      setUpdating(false);
      return;
    }

    if (!username.trim()) {
      setStatus("error");
      Toast.show({ type: "error", text1: "Username is required" });
      setUpdating(false);
      return;
    }

    if (!oldPassword || !newPassword) {
      setStatus("error");
      Toast.show({ type: "error", text1: "Enter both old and new passwords" });
      setUpdating(false);
      return;
    }

    if (oldPassword === newPassword) {
      setStatus("error");
      Toast.show({
        type: "error",
        text1: "New password must be different from old password",
      });
      setUpdating(false);
      return;
    }

    if (newPassword.length < 6) {
      setStatus("error");
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
      undefined,
      oldPassword
    );

    if (result?.success) {
      setStatus("success");
      Toast.show({ type: "success", text1: "Profile updated successfully" });

      // Scroll to top
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });

      // Clear inputs
      setOldPassword("");
      setNewPassword("");

      setTimeout(() => router.replace("/profile"), 1500);
    } else {
      setStatus("error");
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: result?.error || "Something went wrong.",
      });
    }

    setUpdating(false);
    setTimeout(() => setStatus(""), 3000);
  };

  const getAvatarImage = () => {
    switch (status) {
      case "success":
        return require("../../../assets/images/success.jpg");
      case "error":
        return require("../../../assets/images/error.jpg");
      default:
        return require("../../../assets/images/avator.jpg");
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="mt-3">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-green-100">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 100,
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-6">
            <Image
              source={getAvatarImage()}
              className="w-28 h-28 rounded-full border-4 border-white shadow-md"
            />
          </View>

          <View className="bg-white p-6 rounded-2xl shadow-sm">
            <Text className="text-2xl font-bold text-center mb-6">Update Profile</Text>

            <Text className="text-lg text-gray-700 mb-2">Username</Text>
            <TextInput
              placeholder="Enter new username"
              value={username}
              onChangeText={setUsername}
              className="border border-blue-100 bg-blue-100 rounded-sm px-4 py-3 text-base mb-4"
            />

            <Text className="text-lg text-gray-700 mb-2">Old Password</Text>
            <View className="flex-row items-center border border-gray-300  bg-blue-100 rounded-sm mb-4">
              <TextInput
                placeholder="Enter current password"
                secureTextEntry={!showOldPassword}
                value={oldPassword}
                onChangeText={setOldPassword}
                className="flex-1 px-4 py-3 text-base"
              />
              <TouchableOpacity
                onPress={() => setShowOldPassword(!showOldPassword)}
                className="p-2"
              >
                <Ionicons
                  name={showOldPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            <Text className="text-lg text-gray-700 mb-2">New Password</Text>
            <View className="flex-row  items-center border border-gray-300 bg-blue-100 rounded-sm mb-6">
              <TextInput
                placeholder="Enter new password"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                className="flex-1 px-4 py-3 text-base"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                className="p-2"
              >
                <Ionicons
                  name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className={`bg-green-500 py-4 rounded-sm self-center w-36 items-center ${
                updating ? "opacity-60" : ""
              }`}
              onPress={handleUpdate}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text className="text-black text-lg font-bold">Update</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast />
    </SafeAreaView>
  );
};

export default UpdateProfile;
