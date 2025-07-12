import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import userAuthStore from "@/utils/store"; 
import { useNavigation } from "@react-navigation/native";

const CreateStaff = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const navigation = useNavigation();

  const { createStaff, getAllStaffs, isLoading } = userAuthStore();

  const handleCreateStaff = async () => {
    if (!username || !password) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Username and password are required.",
        position: "top",
      });
      return;
    }

    const result = await createStaff(username, password);

    if (result.success) {
      await getAllStaffs(); // ✅ Refresh staff list
      Toast.show({
        type: "success",
        text1: "Staff Created ✅",
        text2: "The new staff has been added.",
        position: "top",
        visibilityTime: 2500,
      });

      setUsername("");
      setPassword("");
    } else {
      Toast.show({
        type: "error",
        text1: "Failed to Create",
        text2: result.error || "Something went wrong.",
        position: "top",
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 px-5 pt-10"
        >
          <View className="flex-row items-center mb-8">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <Ionicons name="arrow-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">Create Staff</Text>
      </View>

          <Text className="text-lg text-gray-700 mb-2">Username</Text>
          <TextInput
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            className="border border-blue-100 bg-blue-100 rounded-sm px-4 py-3 text-base mb-4"
          />

          <Text className="text-lg text-gray-700 mb-2">Password</Text>
          <View className="flex-row items-center border border-gray-300 px-3 bg-blue-100 rounded-sm mb-4">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              className="flex-1 text-base"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleCreateStaff}
            disabled={isLoading}
            className="bg-green-500 py-3 rounded-sm shadow-md w-full self-center items-center"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-black text-lg font-bold">Create Staff</Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>

      <Toast />
    </SafeAreaView>
  );
};

export default CreateStaff;
