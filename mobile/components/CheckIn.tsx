import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import useAuthStore from "../utils/store";
type VehiclePrices = {
  [key: string]: number;
};

const CheckIn = () => {
  const [name, setName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState("cycle");
  const [mobile, setMobile] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [days, setDays] = useState("1");

  const { prices, checkIn } = useAuthStore();
  const typedPrices = prices as VehiclePrices;
  const [amount, setAmount] = useState(0);

  const clearForm = () => {
    setName("");
    setVehicleNo("");
    setVehicleType("cycle");
    setMobile("");
    setPaymentMethod("cash");
    setDays("1");
    setAmount(0);
  };

  useEffect(() => {
    setAmount(typedPrices[vehicleType] * +days);
  }, [days, typedPrices, vehicleType]);

  const handleSubmit = async () => {
    if (!name || !vehicleNo || !mobile) {
      Alert.alert("Fill all fields");
      return;
    }

    const result = await checkIn(
      name,
      vehicleNo,
      vehicleType,
      mobile,
      paymentMethod,
      days,
      amount
    );
    if (!result.success) {
      Alert.alert("Error", result.error);
      clearForm();
    }
    if (result.success) {
      Alert.alert("success");
      clearForm();
    }
  };

  return (
    <View className="gap-5">
      <Text className="text-2xl">Check In</Text>
      <View className="bg-white ">
        <View className="flex-1 p-2 gap-3">
          {/* Name */}
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            className="rounded-sm px-1.5 h-14 flex-1 bg-blue-100"
          />

          {/* Vehicle No */}
          <TextInput
            placeholder="Vehicle No"
            value={vehicleNo}
            onChangeText={setVehicleNo}
            className="rounded-sm px-1.5 h-14 flex-1 bg-blue-100"
          />

          {/* Vehicle Type */}
          <Picker
            selectedValue={vehicleType}
            onValueChange={(val) => setVehicleType(val)}
            style={{
              height: 52,
              flex: 1,
              fontSize: 14,
              backgroundColor: "#DBEAFE",
            }}
          >
            <Picker.Item label="Cycle" value="cycle" />
            <Picker.Item label="Bike" value="bike" />
            <Picker.Item label="Car" value="car" />
            <Picker.Item label="Van" value="van" />
          </Picker>

          {/* Mobile */}
          <TextInput
            placeholder="Mobile"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="number-pad"
            className="rounded-sm px-1.5 bg-blue-100 h-14 flex-1"
          />

          {/* Days */}
          <Picker
            selectedValue={days}
            onValueChange={(val) => setDays(val)}
            style={{
              height: 52,
              flex: 1,
              fontSize: 14,
              backgroundColor: "#DBEAFE",
            }}
          >
            {[...Array(7)].map((_, i) => (
              <Picker.Item
                key={i + 1}
                label={`${i + 1} Day${i > 0 ? "s" : ""}`}
                value={`${i + 1}`}
              />
            ))}
          </Picker>

          {/* Payment Method */}
          <Picker
            selectedValue={paymentMethod}
            onValueChange={(val) => setPaymentMethod(val)}
            style={{
              height: 52,
              flex: 1,
              fontSize: 14,
              backgroundColor: "#DBEAFE",
            }}
          >
            <Picker.Item label="Cash" value="cash" />
            <Picker.Item label="Gpay" value="gpay" />
            <Picker.Item label="PhonePe" value="phonepe" />
            <Picker.Item label="Paytm" value="paytm" />
          </Picker>

          {/* Amount Display */}
          <View className="justify-center items-center pt-2">
            <Text className="text-xl font-semibold">Amount: ₹{amount}</Text>
          </View>

          {/* Submit */}
          <View className="justify-center items-center pt-4">
            <TouchableOpacity
              className="bg-green-500 p-3 px-10 rounded-md"
              onPress={handleSubmit}
            >
              <Text className="text-xl text-white">Enter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CheckIn;
