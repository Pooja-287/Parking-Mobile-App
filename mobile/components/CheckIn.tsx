import React, { useEffect, useMemo, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import useAuthStore from "../utils/store";
import ToastManager, { Toast } from "toastify-react-native";

// Types
type VehiclePrices = {
  [key: string]: number;
};

const CheckIn = () => {
  const [name, setName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState("cycle");
  const [mobile, setMobile] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [days, setDays] = useState("1");

  const { prices, checkIn, loadPricesIfNotSet } = useAuthStore();

  const typedPrices = useMemo(() => {
    return (prices || {}) as VehiclePrices;
  }, [prices]);

  const [amount, setAmount] = useState(0);

  useEffect(() => {
    loadPricesIfNotSet();
  }, [loadPricesIfNotSet]);

  useEffect(() => {
    const rate = typedPrices[vehicleType] || 0;
    setAmount(rate * Number(days));
  }, [days, vehicleType, typedPrices]);

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
        text1: "Error",
        text2: "All fields are required",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
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
      Number(days),
      amount,
      typedPrices[vehicleType]
    );
    setIsLoading(false);
    if (!result.success) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: result.error || "Check In Failed",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Check In Success",
      position: "top",
      visibilityTime: 2000,
      autoHide: true,
    });

    clearForm();
  };

  return (
    <View className="gap-5 p-4">
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
          onChangeText={(text) => setVehicleNo(text.toUpperCase())}
          className="rounded text-xl px-3 h-12 bg-blue-100"
        />

        <Picker
          selectedValue={vehicleType}
          onValueChange={setVehicleType}
          style={{ height: 52, backgroundColor: "#DBEAFE" }}
        >
          <Picker.Item label="Cycle" value="cycle" />
          <Picker.Item label="Bike" value="bike" />
          <Picker.Item label="Car" value="car" />
          <Picker.Item label="Van" value="van" />
        </Picker>

        <TextInput
          placeholder="Mobile Number"
          maxLength={10}
          value={mobile}
          onChangeText={setMobile}
          keyboardType="number-pad"
          className="rounded text-xl px-3 h-12 bg-blue-100"
        />

        <Picker
          style={{ height: 52, backgroundColor: "#DBEAFE" }}
          selectedValue={days}
          onValueChange={(val) => setDays(val)}
        >
          {[...Array(7)].map((_, i) => (
            <Picker.Item
              key={i + 1}
              label={`${i + 1} Day`}
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
          {isLoading ? (
            <View className="bg-white p-2 rounded-full">
              <ActivityIndicator size="small" color="#10B981" />
            </View>
          ) : (
            <Text className="text-center text-xl text-white font-semibold">
              Enter
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <ToastManager showCloseIcon={false} />
    </View>
  );
};

export default CheckIn;
