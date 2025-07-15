import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Scan from "./Scan";
import userAuthStore from "@/utils/store";
import ToastManager, { Toast } from "toastify-react-native";

const CheckOut = () => {
  const [Toscan, setToscan] = useState(false);
  const [tokenId, settokenId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { checkOut } = userAuthStore();

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!tokenId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Enter the Token ID",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
      });
      setIsLoading(false);
      return;
    }

    const result = await checkOut(tokenId);
    setIsLoading(false);
    if (!result.success) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: result.error || "Check-out failed",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }
    Toast.show({
      type: "success",
      text1: "Vehicle Checked out",
      position: "top",
      visibilityTime: 2000,
      autoHide: true,
    });

    settokenId("");
  };

  return (
    <View className="gap-5 p-4">
      <Text className="text-2xl font-bold">Check Out</Text>
      <View className="bg-white rounded-lg shadow-md p-4 gap-4 space-y-4">
        <View className="flex-row items-center">
          <TextInput
            placeholder="Enter Token ID"
            value={tokenId}
            onChangeText={settokenId}
            className="rounded text-xl px-3 h-12 bg-blue-100 flex-1"
          />
          <TouchableOpacity onPress={() => setToscan(!Toscan)} className="ml-2">
            <Ionicons name="scan-outline" size={28} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {Toscan && (
          <View className="items-center">
            <Scan
              onScanned={(data) => {
                settokenId(data);
                setToscan(false);
              }}
            />
          </View>
        )}

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

export default CheckOut;
