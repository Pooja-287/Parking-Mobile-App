import React, { useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import userAuthStore from "../../utils/store"; // adjust path if needed

const AllStaffsScreen = () => {
  const { getAllStaffs, staffs } = userAuthStore();

  useEffect(() => {
    getAllStaffs(); // fetch staff data on screen load
  }, []);

  const renderItem = ({ item }) => (
    <View className="bg-green-100 p-4 mb-2 rounded-md">
      <Text className="text-lg font-semibold text-green-800">
        Username: {item.username}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-green-800 mb-4">
        Staff List
      </Text>

     <FlatList
  data={Array.isArray(staffs) ? staffs : []} // ✅ Safe check
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => (
    <View className="bg-green-100 p-4 mb-2 rounded-md">
      <Text className="text-lg font-semibold text-green-800">
        Username: {item.username}
      </Text>
      <Text className="text-gray-600">Created By: {item.createdBy}</Text>
    </View>
  )}
  ListEmptyComponent={
    <Text className="text-center text-gray-600 mt-10">No staff found</Text>
  }
/>

    </SafeAreaView>
  );
};

export default AllStaffsScreen;
