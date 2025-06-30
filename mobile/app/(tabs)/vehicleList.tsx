import { FlatList, Text, View } from "react-native";
import React from "react";

const vehicleList = () => {
  const Vehicles = ["Cycle", "Bike", "Car", "Van", "Bus", "Lorry"];

  return (
    <View className="flex-1 bg-[#F3F4F6] px-4 py-4">
      <View className="bg-white justify-center items-center p-2">
        <Text className="text-2xl font-semibold mb-2">Vehicles</Text>

        <FlatList
          data={Vehicles}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="bg-blue-100 mx-2 px-4 py-2 rounded-lg">
              <Text className="text-base">{item}</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          overScrollMode="auto"
        />
      </View>
    </View>
  );
};

export default vehicleList;
