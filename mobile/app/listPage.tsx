import React, { useEffect, useState } from "react";
import "../app/global.css";
import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import StaffVehicleList from "@/app/(protected)/(staff)/staffVehicleList";
import StaffRevenue from "@/app/(protected)/(staff)/staffRevenue";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("vehiclelist");
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    fetchUser();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "vehiclelist":
        return <StaffVehicleList />;
      case "revenue":
        return <StaffRevenue />;
      default:
        return <StaffVehicleList />;
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />
      <View className="bg-green-100 py-4 flex-1 px-4">
        {/* Tabs */}
        <View className="border border-white shadow-md rounded-sm bg-white p-2 mb-4">
          <View className="flex-row justify-around gap-2">
            <TouchableOpacity
              className={`px-4 py-2 rounded-sm ${
                activeTab === "vehiclelist" ? "bg-blue-400" : "bg-gray-300"
              }`}
              onPress={() => setActiveTab("vehiclelist")}
            >
              <Text className="text-base text-[#111827]">Vehicle List</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-4 py-2 rounded-sm ${
                activeTab === "revenue" ? "bg-yellow-400" : "bg-gray-300"
              }`}
              onPress={() => setActiveTab("revenue")}
            >
              <Text className="text-base text-[#111827]">Revenue</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="flex-1">
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderTabContent()}
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default Index;
