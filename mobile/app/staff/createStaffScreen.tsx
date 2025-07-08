import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import userAuthStore from "../../utils/store"; // adjust path as needed

const CreateStaffScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // for toggling password

  const { createStaff, isLoading } = userAuthStore();

  const handleCreateStaff = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Username and password are required.");
      return;
    }

    const result = await createStaff(username, password);

    if (result.success) {
      Alert.alert("Success", "Staff created successfully.");
      setUsername("");
      setPassword("");
    } else {
      Alert.alert("Error", result.error || "Something went wrong");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <Text className="text-2xl font-bold mb-6">Create Staff</Text>

          <Text className="text-lg text-gray-700 mb-2">Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            className="flex-row  items-center border border-gray-300 bg-blue-100 rounded-sm mb-6"
            placeholder="Enter username"
          />

          <Text className="text-lg text-gray-700 mb-2">Password</Text>
          <View className="flex-row  items-center border border-gray-300 bg-blue-100 rounded-sm mb-6">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              className="flex-1"
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
            className="bg-green-600 py-3  w-36 self-center items-center"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-black text-lg font-bold">
                Create Staff
              </Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateStaffScreen;
