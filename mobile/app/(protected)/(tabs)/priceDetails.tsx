import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import userAuthStore from "@/utils/store";

type VehicleType = "cycle" | "bike" | "car" | "van" | "lorry" | "bus";

type PriceForm = {
  [key in VehicleType]: string;
};

const vehicleTypes: VehicleType[] = [
  "cycle",
  "bike",
  "car",
  "van",
  "lorry",
  "bus",
];

const PriceDetails = () => {
  const navigation = useNavigation();
  const { prices, addPrice, updatePrice } = userAuthStore();

  const [form, setForm] = useState<PriceForm>({
    cycle: "",
    bike: "",
    car: "",
    van: "",
    lorry: "",
    bus: "",
  });

  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    if (prices && typeof prices === "object") {
      const updated: Partial<PriceForm> = {};
      for (const key of vehicleTypes) {
        // @ts-ignore
        updated[key] = prices?.[key]?.toString() || "";
      }
      setForm((prev) => ({ ...prev, ...updated }));
      setIsExisting(false);
    }
  }, [prices]);

  const handleChange = (key: VehicleType, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid = () =>
    vehicleTypes.every((type) => form[type]?.trim() !== "");

  const handleAdd = async () => {
    if (!isFormValid()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "All fields are required ❌",
      });
      return;
    }

    const result = await addPrice(form); // ✅ you are sending "vehicle" inside zustand
    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Prices added successfully ✅",
      });
      setIsExisting(true);
      setTimeout(() => navigation.goBack(), 1200);
    } else {
      Toast.show({
        type: "error",
        text1: "Add Failed",
        text2: result.error || "Something went wrong ❌",
      });
    }
  };

  const handleUpdate = async () => {
    if (!isFormValid()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "All fields are required ❌",
      });
      return;
    }

    const result = await updatePrice(form); // This must follow same pattern
    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Prices updated successfully ✅",
      });
      setTimeout(() => navigation.goBack(), 1200);
    } else {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: result.error || "Something went wrong ❌",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-green-100"
    >
      <ScrollView className="p-4">
        <Text className="text-3xl font-extrabold mb-6 text-green-800 text-center">
          Manage Price List
        </Text>

        <View className="bg-white shadow rounded-xl px-4 py-2 mb-4">
          {vehicleTypes.map((type) => (
            <View key={type} className="mb-2">
              <Text className="text-base font-semibold mb-1 text-gray-700 capitalize">
                {type} Price
              </Text>
              <TextInput
                value={form[type]}
                onChangeText={(val) => handleChange(type, val)}
                placeholder={`Enter ${type} price`}
                keyboardType="numeric"
                className="border border-gray-300 rounded-sm px-4 py-3 text-base bg-blue-100"
              />
            </View>
          ))}
        </View>

        {!isExisting ? (
          <TouchableOpacity
            className={`bg-green-600 py-4 rounded-sm mb-4 ${
              !isFormValid() ? "opacity-50" : ""
            }`}
            onPress={handleAdd}
            disabled={!isFormValid()}
          >
            <Text className="text-center text-white font-semibold text-lg">
              Add Price
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className={`bg-green-500 py-4 rounded-sm ${
              !isFormValid() ? "opacity-50" : ""
            }`}
            onPress={handleUpdate}
            disabled={!isFormValid()}
          >
            <Text className="text-center text-white font-semibold text-lg">
              Update Price
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default PriceDetails;
