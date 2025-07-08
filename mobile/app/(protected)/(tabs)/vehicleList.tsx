import { FlatList, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Vehicle = {
  name: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const VehicleList = () => {
  const Vehicles: Vehicle[] = [
    { name: "All", value: "all", icon: "list-outline" },
    { name: "Cycle", value: "cycle", icon: "bicycle-outline" },
    { name: "Bike", value: "bike", icon: "car-sport-outline" },
    { name: "Car", value: "car", icon: "car-outline" },
    { name: "Van", value: "van", icon: "bus-outline" },
    { name: "Bus", value: "bus", icon: "bus-outline" },
  ];

  const [Vehicle, setVehicle] = useState("Cycle");
  const [Ischeckin, setIsCheckIn] = useState(true);
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

  const handleList = (Vehicle: string) => {};

  return (
    <View className="flex-1 bg-[#F3F4F6] px-4 py-4 gap-3">
      <View className="bg-white justify-center items-center p-2 flex-wrap overflow-scroll">
        <Text className="text-2xl font-semibold mb-2">Vehicles</Text>
        <FlatList
          data={Vehicles}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-green-400 mx-2 items-center justify-center px-4 py-2 rounded-lg"
              onPress={() => setVehicle(item.value)}
            >
              <Ionicons name={item.icon} size={24} color="#000" />
              <Text className="text-base">{item.name}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          overScrollMode="always"
        />
      </View>
      <View className="p-2 flex-1 ">
        {/* <FlatList
          data={Vehicles}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
           <View>

           </View>
          )}
          showsHorizontalScrollIndicator={false}
          overScrollMode="always"
        /> */}
      </View>
    </View>
  );
};

export default VehicleList;
