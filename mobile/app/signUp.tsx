import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  // Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Redirect } from "expo-router";
import userAuthStore from "../utils/store";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signup } = userAuthStore();

  const handleSignup = async () => {
    const result = await signup(userName, email, password);
    if (!result.success) {
      Alert.alert("Error", result.error);
    } else {
      return <Redirect href={"/login"} />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-green-100">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="mb-5 items-center gap-1 ">
              <Text className="text-4xl mb-3">Parkingz</Text>
              <Text className="text-2xl">Let&apos;s get Started.</Text>
            </View>
            <View className="w-full bg-white p-4 pt-5 rounded-2xl gap-8 shadow-md">
              <View className="items-center justify-center">
                <Text className="text-2xl">SignUp</Text>
              </View>

              {/* Username */}
              <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
                <Text className="absolute transform -translate-y-8 text-xl bg-white translate-x-3 font-sans">
                  Username
                </Text>
                <Ionicons name="person-outline" size={20} color="#6B7280" />
                <TextInput
                  placeholder="Username"
                  value={userName}
                  onChangeText={setUserName}
                  className="flex-1 py-4 px-2 text-lg text-gray-800"
                />
              </View>

              {/* Email */}
              <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
                <Text className="absolute transform -translate-y-8 text-xl bg-white translate-x-3 font-sans">
                  Email
                </Text>
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 py-4 px-2 text-lg text-gray-800"
                />
              </View>

              {/* Password */}
              <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
                <Text className="absolute transform -translate-y-8 text-lg bg-white translate-x-3">
                  Password
                </Text>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6B7280"
                />
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  className="flex-1 py-4 px-2 text-lg text-gray-800"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
                <Text className="absolute transform -translate-y-8 text-lg bg-white translate-x-3">
                  Confirm Password
                </Text>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6B7280"
                />
                <TextInput
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  className="flex-1 py-4 px-2 text-lg text-gray-800"
                />
              </View>
              <View className="items-center justify-center">
                <Text className="underline">
                  <Link href={"/login"}>Already have an Account? Login</Link>
                </Text>
              </View>

              {/* Signup Button */}
              <TouchableOpacity
                className="bg-[#4CAF50] py-4 rounded-xl"
                onPress={handleSignup}
              >
                <Text className="text-center text-xl text-white font-semibold">
                  Signup
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Signup;
