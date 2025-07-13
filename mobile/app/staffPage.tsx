import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import userAuthStore from "@/utils/store"; 

const AccountSettings = () => {
  const router = useRouter();
  const { user } = userAuthStore();
  const parsedUser = typeof user === "string" ? JSON.parse(user) : user;

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-10">
      <Text className="text-2xl font-bold text-green-800 mb-6">
        Account Settings
      </Text>

      {/* ✅ Staff List Button */}
      <TouchableOpacity
        className="flex-row items-center bg-green-100 px-5 py-4 rounded-xl shadow mb-4"
        onPress={() => router.push("/(protected)/(staff)/AllStaffsScreen")}
      >
        <Ionicons name="people-outline" size={30} color="#2d6a4f" />
        <Text className="ml-3 text-xl font-semibold text-green-800">
          AllStaffsScreen
        </Text>
      </TouchableOpacity>

      {/* ✅ Create Staff Button */}
      <TouchableOpacity
        className="flex-row items-center bg-green-100 px-5 py-4 rounded-xl shadow mb-4"
        onPress={() => router.push("/(protected)/(staff)/create")}
      >
        <Ionicons name="person-add-outline" size={30} color="#2d6a4f" />
        <Text className="ml-3 text-xl font-semibold text-green-800">
          create
        </Text>
      </TouchableOpacity>

      {/* ✅ Today Vehicle Button */}
      <TouchableOpacity
        className="flex-row items-center bg-green-100 px-5 py-4 rounded-xl shadow mb-4"
        onPress={() => router.push("/(protected)/(staff)/todayVehicle")}
      >
        <Ionicons name="car-outline" size={30} color="#2d6a4f" />
        <Text className="ml-3 text-xl font-semibold text-green-800">
          TodayVehicle
        </Text>
      </TouchableOpacity>

      {/* ✅ Today Revenue Button */}
      <TouchableOpacity
        className="flex-row items-center bg-green-100 px-5 py-4 rounded-xl shadow mb-4"
        onPress={() => router.push("/(protected)/(staff)/todayRevenue")}
      >
        <Ionicons name="cash-outline" size={30} color="#2d6a4f" />
        <Text className="ml-3 text-xl font-semibold text-green-800">
          TodayRevenue
        </Text>
      </TouchableOpacity>

      {/* ✅ Update Staff Button */}
      <TouchableOpacity
        className="flex-row items-center bg-green-100 px-5 py-4 rounded-xl shadow mb-4"
        onPress={() => router.push('/(protected)/(staff)/allStaffs')}
      >
        <Ionicons name="create-outline" size={30} color="#2d6a4f" />
        <Text className="ml-3 text-xl font-semibold text-green-800">
       AllStaffs
        </Text>
      </TouchableOpacity>

      {/* ✅ Delete Staff Button */}
      <TouchableOpacity
        className="flex-row items-center bg-green-100 px-5 py-4 rounded-xl shadow mb-4"
        onPress={() => router.push("/(protected)/(staff)/vehicleList")}
      >
        <Ionicons name="trash-outline" size={30} color="#2d6a4f" />
        <Text className="ml-3 text-xl font-semibold text-green-800">
          vehicleList
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AccountSettings;
