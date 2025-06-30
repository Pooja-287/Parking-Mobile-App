import { FlatList, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

type Vehicle = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const VehicleList = () => {
  const Vehicles: Vehicle[] = [
    { name: "Cycle", icon: "bicycle-outline" },
    { name: "Bike", icon: "car-sport-outline" },
    { name: "Car", icon: "car-outline" },
    { name: "Van", icon: "bus-outline" },
    { name: "Bus", icon: "bus-outline" },
  ];

  const [Vehicle, setVehicle] = useState("Cycle");

  return (
    <View className="flex-1 bg-[#F3F4F6] px-4 py-4 gap-3">
      <View className="bg-white justify-center items-center p-2">
        <Text className="text-2xl font-semibold mb-2">Vehicles</Text>

        <FlatList
          data={Vehicles}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-green-400 mx-2 px-4 py-2 rounded-lg"
              onPress={() => setVehicle(item.name)}
            >
              <Ionicons name={item.icon} size={24} color="#000" />
              <Text className="text-base">{item.name}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          overScrollMode="auto"
        />
      </View>
      <View className="p-2 flex-1 bg-white">
        <Text>{Vehicle}</Text>
      </View>
    </View>
  );
};

export default VehicleList;
