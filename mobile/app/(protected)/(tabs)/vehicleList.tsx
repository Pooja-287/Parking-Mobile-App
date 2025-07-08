import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import CheckIn from "@/components/CheckIn";
import userAuthStore from "@/utils/store";
import { format } from "date-fns";

type Vehicle = {
  name: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const CheckinCard = ({ item }: any) => {
  const formattedDate = format(
    new Date(item.entryDateTime),
    "MMM d, yyyy - h:mm a"
  );

  return (
    <View className="bg-white shadow-lg rounded-md p-3 mx-4 mb-4 space-y-2">
      <View className="flex-row justify-between items-center">
        <View className="flex-row gap-2  justify-center items-center">
          <Text className="text-lg items-center justify-center font-semibold text-gray-900">
            {item.name}
          </Text>
          <Text
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              item.isCheckedOut
                ? " bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {item.isCheckedOut ? "Checked Out" : "Active"}
          </Text>
        </View>
        <Text className="text-xs text-gray-500">{item.vehicleNo}</Text>
      </View>

      <View className="bg-gray-100 p-1 rounded-sm">
        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-700 capitalize">
            {item.vehicleType}
          </Text>
          <Text className="text-sm text-gray-500">{formattedDate}</Text>
        </View>
        <View className="mt-1 space-y-1">
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-700">Paid Days</Text>
            <Text className="text-sm font-medium text-gray-800">
              {item.paidDays}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-700">Rate</Text>
            <Text className="text-sm font-medium text-gray-800">
              ₹{(+item.perDayRate / +item.paidDays).toFixed(2)}/day
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-700">Total Paid</Text>
            <Text className="text-sm font-semibold text-green-600">
              ₹{item.amount}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
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

  const [checkType, setCheckType] = useState("checkins");
  const { vehicleList, VehicleListData } = userAuthStore();
  const [selected, setSelected] = useState("all");

  const handleList = async (vehicle: string, type = checkType) => {
    const result = await vehicleList(vehicle, type);
    if (!result.success) Alert.alert("Error", result.error);
  };

  useEffect(() => {
    handleList("all");
  }, []);

  useEffect(() => {
    handleList(selected, checkType);
  }, [checkType]);

  return (
    <View className="flex-1 bg-[#F3F4F6] px-4 py-4 gap-3">
      <View className=" bg-white justify-center items-center w-full shadow-md  rounded-sm p-2 flex-wrap overflow-scroll">
        <Text className="flex-1 justify-center items-center text-2xl font-semibold mb-2">
          Vehicles
        </Text>
        <FlatList
          data={Vehicles}
          horizontal
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => {
            const isSelected = selected === item.value;

            return (
              <TouchableOpacity
                className={`mx-2 items-center justify-center px-3 py-1 rounded-lg ${
                  isSelected ? "bg-green-600" : "bg-green-400"
                }`}
                onPress={() => {
                  setSelected(item.value);
                  handleList(item.value);
                }}
              >
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={isSelected ? "#fff" : "#000"}
                />
                <Text
                  className={`text-base ${isSelected ? "text-white" : "text-black"}`}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
          showsHorizontalScrollIndicator={false}
          overScrollMode="always"
        />
      </View>
      <View className=" flex-1 gap-5">
        <View>
          <Picker
            selectedValue={checkType}
            onValueChange={setCheckType}
            className="h-14 bg-blue-100 shadow-md rounded-sm outline-none"
          >
            <Picker.Item label="Check In" value="checkins" />
            <Picker.Item label="Check Out" value="checkouts" />
          </Picker>
        </View>
        <View className="flex-1 bg-white overflow-y-scroll">
          {VehicleListData && VehicleListData.length > 0 ? (
            <FlatList
              data={VehicleListData}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <CheckinCard item={item} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 12 }}
            />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-500 text-base">
                No vehicle data found
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default VehicleList;
