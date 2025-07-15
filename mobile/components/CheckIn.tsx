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
import { Picker } from "@react-native-picker/picker";
import ToastManager, { Toast } from "toastify-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userAuthStore from "@/utils/store";

const vehicleTypes = ["cycle", "bike", "car", "van"];

const CheckIn = () => {
  const [name, setName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState("cycle");
  const [mobile, setMobile] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [days, setDays] = useState("1");
  const [amount, setAmount] = useState(0);

  const { checkIn, fetchPrices, priceData } = userAuthStore();

  useEffect(() => {
    const loadPrices = async () => {
      const token = await AsyncStorage.getItem("token");
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      if (token && user) {
        await fetchPrices(user._id, token);
      }
    };
    loadPrices();
  }, []);

  useEffect(() => {
    const rateStr = priceData?.dailyPrices?.[vehicleType] || "0";
    const rate = Number(rateStr);
    setAmount(rate * Number(days));
  }, [vehicleType, days, priceData]);

  const clearForm = () => {
    setName("");
    setVehicleNo("");
    setVehicleType("cycle");
    setMobile("");
    setPaymentMethod("cash");
    setDays("1");
    setAmount(0);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!vehicleNo || !mobile) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Vehicle number and mobile are required.",
      });
      setIsLoading(false);
      return;
    }
    const result = await checkIn(
      name,
      vehicleNo,
      vehicleType,
      mobile,
      paymentMethod,
      Number(days)
    );
    setIsLoading(false);
    if (!result.success) {
      Toast.show({
        type: "error",
        text1: "Check-In Failed",
        text2: result.error || "Please try again.",
      });
    } else {
      Toast.show({
        type: "success",
        text1: "Success ✅",
        text2: "Vehicle Checked In",
      });
      clearForm();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-blue-50"
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="gap-5 p-0">
          <Text className="text-2xl font-bold">Check In</Text>

          <View className="bg-white rounded-lg shadow-md p-4 gap-3 space-y-4">
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              className="rounded text-xl px-3 h-12 bg-blue-100"
            />

            <TextInput
              placeholder="Vehicle Number"
              value={vehicleNo}
              onChangeText={setVehicleNo}
              autoCapitalize="characters"
              className="rounded text-xl px-3 h-12 bg-blue-100"
            />

            <Picker
              selectedValue={vehicleType}
              onValueChange={setVehicleType}
              style={{ height: 52, backgroundColor: "#DBEAFE" }}
            >
              {vehicleTypes.map((type) => (
                <Picker.Item
                  key={type}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  value={type}
                />
              ))}
            </Picker>

            <TextInput
              placeholder="Mobile Number"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="number-pad"
              className="rounded text-xl px-3 h-12 bg-blue-100"
            />

            <Picker
              selectedValue={days}
              onValueChange={(val) => setDays(val)}
              style={{ height: 52, backgroundColor: "#DBEAFE" }}
            >
              {[...Array(7)].map((_, i) => (
                <Picker.Item
                  key={i + 1}
                  label={`${i + 1} Day${i > 0 ? "s" : ""}`}
                  value={`${i + 1}`}
                />
              ))}
            </Picker>

            <Picker
              selectedValue={paymentMethod}
              onValueChange={setPaymentMethod}
              style={{ height: 52, backgroundColor: "#DBEAFE" }}
            >
              <Picker.Item label="Cash" value="cash" />
              <Picker.Item label="GPay" value="gpay" />
              <Picker.Item label="PhonePe" value="phonepe" />
              <Picker.Item label="Paytm" value="paytm" />
            </Picker>

            <View className="items-center">
              <Text className="text-xl font-semibold">Amount: ₹{amount}</Text>
            </View>

            <TouchableOpacity
              className="bg-green-600 p-3 rounded-lg items-center"
              onPress={handleSubmit}
            >
              <Text className="text-lg text-white">Enter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ToastManager showCloseIcon={false} />
    </KeyboardAvoidingView>
  );
};

export default CheckIn;
