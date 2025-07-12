import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

import userAuthStore from "@/utils/store";
import { Toast } from "toastify-react-native";

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
        <View className="flex-row gap-2 justify-center items-center">
          <Text className="text-lg font-semibold text-gray-900">
            {item.name}
          </Text>
          <Text
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              item.isCheckedOut
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {item.isCheckedOut ? "Checked Out" : "Active"}
          </Text>
        </View>
        <View className="flex-row justify-center items-center gap-1">
          <Text className="text-md text-gray-500">{item.vehicleNo}</Text>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setStringAsync(item.tokenId);
              Alert.alert("Copied!", `${item.tokenId} copied to clipboard.`);
            }}
          >
            <Text className="text-xs text-green-500">
              <Ionicons name="copy-outline" size={12} /> Token
            </Text>
          </TouchableOpacity>
        </View>
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
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleList = async (vehicle: string, type = checkType) => {
    setLoading(true);
    const result = await vehicleList(vehicle, type);
    if (!result.success) Toast.error("Error in API");
    setLoading(false);
  };

  useEffect(() => {
    handleList("all");
  }, []);

  useEffect(() => {
    handleList(selected, checkType);
  }, [checkType]);

  return (
    <View className="flex-1 bg-[#F3F4F6] px-4 py-4 gap-3">
      <View className="bg-white flex-row px-2 items-center rounded-sm">
        <Ionicons name="search-outline" size={24} />
        <TextInput
          placeholder="Search vehicle"
          value={search}
          onChangeText={setSearch}
          className="rounded text-base flex-1 px-3 h-12 bg-white"
        />
      </View>

      <View className="bg-white justify-center items-center w-full shadow-sm rounded-sm p-2 flex-wrap overflow-scroll">
        <View className="justify-center items-center mb-2">
          <Text className="text-2xl font-semibold">Vehicles</Text>
        </View>

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
                  size={22}
                  color={isSelected ? "#fff" : "#000"}
                />
                <Text
                  className={`text-base ${
                    isSelected ? "text-white" : "text-black"
                  }`}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View className="flex-row items-center gap-2">
        <View className="flex-1">
          <Picker
            selectedValue={checkType}
            onValueChange={setCheckType}
            className="h-14 shadow-sm rounded-sm outline-none"
          >
            <Picker.Item label="Check In" value="checkins" />
            <Picker.Item label="Check Out" value="checkouts" />
          </Picker>
        </View>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="bg-green-100 px-3 py-2 rounded shadow-sm"
        >
          <Text className="text-sm">
            {filterDate ? format(filterDate, "MMM dd, yyyy") : "Pick Date"}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={filterDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (event.type === "set" && selectedDate) {
              setFilterDate(selectedDate);
            }
          }}
        />
      )}

      <View className="flex-1 bg-white">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#10B981" />
            <Text className="mt-2 text-gray-500">Loading Vehicles...</Text>
          </View>
        ) : VehicleListData && VehicleListData.length > 0 ? (
          <FlatList
            data={Array.from(VehicleListData).filter((item) => {
              const matchesSearch =
                item.vehicleNo.toLowerCase().includes(search.toLowerCase()) ||
                item.name.toLowerCase().includes(search.toLowerCase());

              const matchesDate = filterDate
                ? format(new Date(item.entryDateTime), "yyyy-MM-dd") ===
                  format(filterDate, "yyyy-MM-dd")
                : true;

              return matchesSearch && matchesDate;
            })}
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
  );
};

export default VehicleList;
