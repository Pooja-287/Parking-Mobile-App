import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import userAuthStore from "../utils/store";
import { Link } from "expo-router";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = userAuthStore();

  const screenWidth = Dimensions.get("window").width;

  const handleLogin = async () => {
    const result = await login(userName, password);
    if (!result.success) Alert.alert("Error", result.error);
  };

  const LoginForm = () => (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        source={require("../assets/login.png")}
        style={{
          width: screenWidth * 0.85,
          height: screenWidth * 0.9,
        }}
        resizeMode="cover"
      />
      <View className="items-center gap-1">
        <Text className="text-4xl mb-3">Parkingz</Text>
      </View>
      <View className="w-full bg-white p-4 pt-5 rounded-2xl gap-8 shadow-md mt-5">
        <View className="items-center justify-center">
          <Text className="text-2xl">Login</Text>
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

        {/* Password */}
        <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
          <Text className="absolute transform -translate-y-8 text-lg bg-white translate-x-3">
            Password
          </Text>
          <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            className="flex-1 py-4 px-2 text-lg text-gray-800"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        {/* Signup Link */}
        <View className="items-center justify-center">
          <Text className="underline">
            <Link href="/signUp">Don’t have an Account? signup</Link>
          </Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className="bg-[#4CAF50] py-4 rounded-xl"
          onPress={handleLogin}
        >
          <Text className="text-center text-xl text-white font-semibold">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-green-100">
      {Platform.OS !== "web" ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          >
            {LoginForm()}
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      ) : (
        <View style={{ flex: 1 }}>{LoginForm()}</View>
      )}
    </SafeAreaView>
  );
};

export default Login;
