// import React, { useState } from "react";
// import {
//   View,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   Text,
//   Dimensions,
// } from "react-native";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { SafeAreaView } from "react-native-safe-area-context";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const screenWidth = Dimensions.get("window").width;

//   return (
//     <SafeAreaView className="flex-1 bg-green-100 justify-center items-center px-5 font-sans">
//       <View>
//         <Image
//           source={require("../assets/login.png")}
//           style={{
//             width: screenWidth * 0.85,
//             height: screenWidth * 1,
//           }}
//           resizeMode="cover"
//         />
//       </View>

//       <View className="w-full bg-white p-4 pt-10 rounded-2xl gap-8 shadow-md ">
//         <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
//           <Text className="absolute transform -translate-y-8 text-xl bg-white translate-x-3 font-sans">
//             Email
//           </Text>
//           <Ionicons name="mail-outline" size={20} color="#6B7280" />
//           <TextInput
//             placeholder="Enter your email"
//             value={email}
//             onChangeText={setEmail}
//             className="flex-1 py-4 px-2 text-lg text-gray-800 outline-none"
//             keyboardType="email-address"
//           />
//         </View>

//         <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
//           <Text className="absolute transform -translate-y-8 text-lg bg-white translate-x-3">
//             Password
//           </Text>
//           <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
//           <TextInput
//             placeholder="Password"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry={!showPassword}
//             className="flex-1 py-4 px-2 text-lg text-gray-800 outline-none"
//           />
//           <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//             <Ionicons
//               name={showPassword ? "eye-off-outline" : "eye-outline"}
//               size={20}
//               color="#6B7280"
//             />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity className="bg-[#4CAF50] py-4 rounded-xl">
//           <Text className="text-center text-xl text-white font-semibold ">
//             Login
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Login;




import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import tw from "twrnc";
import { SERVER_URL } from "@env";



const screenWidth = Dimensions.get("window").width;

const Login = () => {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      if (mode === "login") {
        const res = await axios.post(
          `${SERVER_URL}/api/loginAdmin`,
          {
            username,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        );
       console.log(SERVER_URL);
       
        console.log("Login Success:", res.data);
        Alert.alert(
          "Login Success",
          `Welcome ${res.data.admin.username}`
        );
      } else {
        const res = await axios.post(
          `${SERVER_URL}/api/register`,
          {
            username,
            email,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        );

        console.log("Register Success:", res.data);
        Alert.alert(
          "Register Success",
          `Welcome ${res.data.admin.username}`
        );
        setMode("login");
      }
    } 
    
    catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data || error.message);
        Alert.alert(
          "Error",
          error.response?.data?.message || error.message
        );
      } 
      else {
  if (error instanceof Error) {
    console.log(error.message);
    Alert.alert("Error", error.message);
  } else {
    console.log(String(error));
    Alert.alert("Error", String(error));
  }
}


    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-green-100`}>
      <ScrollView
        contentContainerStyle={tw`flex-grow justify-center items-center px-5`}
      >
        {/* IMAGE AT TOP */}
        <View style={tw`mb-8`}>
          <Image
            source={require("../assets/login.png")}
            style={{
              width: screenWidth * 0.85,
              height: screenWidth * 0.85,
              resizeMode: "contain",
            }}
          />
        </View>

        <View style={tw`w-full bg-white p-6 rounded-2xl shadow-md`}>
          {/* Mode Toggle */}
          <View style={tw`flex-row justify-center mb-6`}>
            <TouchableOpacity
              onPress={() => setMode("login")}
              style={tw`${mode === "login" ? "bg-green-500" : "bg-gray-300"} px-4 py-2 rounded-l-xl`}
            >
              <Text style={tw`text-white font-bold`}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode("register")}
              style={tw`${mode === "register" ? "bg-green-500" : "bg-gray-300"} px-4 py-2 rounded-r-xl`}
            >
              <Text style={tw`text-white font-bold`}>Register</Text>
            </TouchableOpacity>
          </View>

          {/* Username */}
          <View style={tw`flex-row items-center border border-gray-300 rounded-xl px-3 mb-4`}>
            <Text style={tw`absolute -top-4 left-3 bg-white px-1 text-gray-700 text-sm`}>
              Username
            </Text>
            <Ionicons name="person-outline" size={20} color="#6B7280" />
            <TextInput
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              style={tw`flex-1 py-3 px-2 text-lg text-gray-800`}
            />
          </View>

          {/* Email (register mode only) */}
          {mode === "register" && (
            <View style={tw`flex-row items-center border border-gray-300 rounded-xl px-3 mb-4`}>
              <Text style={tw`absolute -top-4 left-3 bg-white px-1 text-gray-700 text-sm`}>
                Email
              </Text>
              <Ionicons name="mail-outline" size={20} color="#6B7280" />
              <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                style={tw`flex-1 py-3 px-2 text-lg text-gray-800`}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          )}

          {/* Password */}
          <View style={tw`flex-row items-center border border-gray-300 rounded-xl px-3 mb-6`}>
            <Text style={tw`absolute -top-4 left-3 bg-white px-1 text-gray-700 text-sm`}>
              Password
            </Text>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={tw`flex-1 py-3 px-2 text-lg text-gray-800`}
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
            style={tw`bg-green-600 py-4 rounded-xl`}
            onPress={handleSubmit}
          >
            <Text style={tw`text-center text-xl text-white font-semibold`}>
              {mode === "login" ? "Login" : "Register"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

