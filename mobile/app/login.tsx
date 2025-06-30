import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
// import useLogin from "@/utils/store";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const screenWidth = Dimensions.get("window").width;
  // const isLogin = useLogin((state) => state.isLogin);

  return (
    <SafeAreaView className="flex-1 bg-green-100 justify-center items-center px-5 font-sans">
      <View>
        <Image
          source={require("../assets/login.png")}
          style={{
            width: screenWidth * 0.85,
            height: screenWidth * 1,
          }}
          resizeMode="cover"
        />
      </View>

      <View className="w-full bg-white p-4 pt-10 rounded-2xl gap-8 shadow-md ">
        <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
          <Text className="absolute transform -translate-y-8 text-xl bg-white translate-x-3 font-sans">
            Email
          </Text>
          <Ionicons name="mail-outline" size={20} color="#6B7280" />
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            className="flex-1 py-4 px-2 text-lg text-gray-800 outline-none"
            keyboardType="email-address"
          />
        </View>

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
            className="flex-1 py-4 px-2 text-lg text-gray-800 outline-none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-[#4CAF50] py-4 rounded-xl"
          // onPress={isLogin}
        >
          <Text className="text-center text-xl text-white font-semibold ">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;
