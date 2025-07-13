


import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import userAuthStore from "@/utils/store";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
const AllStaffs = () => {
  const { getAllStaffs, staffs, isLoading } = userAuthStore();
  const router = useRouter();
  const navigation = useNavigation();


  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    const res = await getAllStaffs();
    if (!res.success) {
      Toast.show({
        type: "error",
        text1: "Failed to fetch staff list",
        text2: res.error || "",
      });
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(protected)/(staff)/staffVehicleList",
          params: {
            staffId: item._id,
            username: item.username,
          },
        })
      }
    >
      <View className="bg-white p-4 mb-3 rounded-lg shadow">
        <Text className="text-lg font-bold">👤 {item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-4 mt-6 py-6">
        <View className="flex-row items-center mb-6">
    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
      <Ionicons name="arrow-back" size={28} color="#1F2937" />
    </TouchableOpacity>
    <Text className="text-2xl font-bold text-gray-800 "> Staff Lists</Text>
  </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#4F46E5" />
      ) : staffs.length === 0 ? (
        <Text className="text-center text-gray-500">No staff found</Text>
      ) : (
        <FlatList
          data={staffs}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}

      <Toast />
    </SafeAreaView>
  );
};

export default AllStaffs;
