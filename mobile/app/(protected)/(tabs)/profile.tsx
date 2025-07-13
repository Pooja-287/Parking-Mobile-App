



import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import userAuthStore from "../../../utils/store"; 

const AccountSettings = () => {
  const router = useRouter();
  const { user } = userAuthStore();
  const parsedUser = typeof user === "string" ? JSON.parse(user) : user;

  // ❌ Block staff users
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
    <SafeAreaView className="flex-1 bg-white px-4 pt-10">
      <Text className="text-2xl font-bold text-green-800 mb-6">
        Account Settings
      </Text>

      {/* Account Button */}
      <TouchableOpacity
        className="flex-row items-center bg-green-100 px-5 py-4 rounded-xl shadow mb-4"
        onPress={() => router.push("/adminProfile")}
      >
        <Ionicons name="person-circle-outline" size={30} color="#2d6a4f" />
        <Text className="ml-3 text-xl font-semibold text-green-800">
          Account
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
  className="flex-row items-center bg-green-100 px-5 py-4 rounded-xl shadow mb-4"
  onPress={() => router.push("/priceDetails")}
>
  <Ionicons name="pricetag-outline" size={30} color="#2d6a4f" />
  <Text className="ml-3 text-xl font-semibold text-green-800">
    Price Details
  </Text>
</TouchableOpacity>


      {/* Staff List Button */}
<TouchableOpacity
  className="flex-row items-center bg-green-100 px-5 py-4 rounded-xl shadow mb-4"
  onPress={() => router.push("/staffPage")} // ✅ correct path
>
  <Ionicons name="people-outline" size={30} color="#2d6a4f" />
  <Text className="ml-3 text-xl font-semibold text-green-800">
    Staff List
  </Text>
</TouchableOpacity>


    </SafeAreaView>
  );
};

export default AccountSettings;
