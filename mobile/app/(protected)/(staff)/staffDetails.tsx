import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const StaffDetails = () => {
  const { staffId, username } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white px-4 py-6">
      {/* ✅ Staff Name */}
      <Text className="text-2xl font-bold mb-8">👤 {username}</Text>

      {/* ✅ Vehicle List Button */}
      <TouchableOpacity
        className="bg-indigo-600 py-3 px-5 rounded mb-4"
        onPress={() =>
          router.push({
            pathname: "/(protected)/(tabs)/vehicleList",
            params: { staffId, username },
          })
        }
      >
        <Text className="text-white text-center text-lg">🚗 Vehicle List</Text>
      </TouchableOpacity>

      {/* ✅ Today Report Button */}
      <TouchableOpacity
        className="bg-green-600 py-3 px-5 rounded"
        onPress={() =>
          router.push({
            pathname: "/(protected)/(tabs)/todayReport",
            params: { staffId, username },
          })
        }
      >
        <Text className="text-white text-center text-lg">📊 Today Report</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default StaffDetails;
