import React, { useState } from "react";
import "../app/global.css";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import Scan from "./Scan";
import userAuthStore from "@/utils/store";

const CheckOut = () => {
  const [Toscan, setToscan] = useState(false);
  const [tokenId, settokenId] = useState("");
  const { checkOut } = userAuthStore();

  const handleSubmit = async () => {
    if (!tokenId) {
      Alert.alert("Enter the Token Id");
      return;
    }

    const result = await checkOut(tokenId);

    if (!result.success) {
      Alert.alert("Error", result.error || "Check-in failed");
      return;
    }

    Alert.alert("✅ Success", "Vehicle checked Out");
  };

  return (
    <View className="gap-5">
      <Text className="text-2xl">Check Out</Text>
      <View className="py-2 bg-white flex-row rounded-sm justify-center items-center">
        <TextInput
          placeholder="Vehicle No"
          value={tokenId}
          onChangeText={(text) => settokenId(text)}
          className="rounded-sm text-xl px-2 h-14 flex-1 bg-blue-100"
        />

        <Ionicons
          onPress={() => {
            setToscan(!Toscan);
          }}
          className="px-4 py-3.5 "
          name="scan-outline"
          size={25}
        />
      </View>
      <View className=" items-center">
        {Toscan ? (
          <Scan
            onScanned={(data) => {
              settokenId(data);
              setToscan(!Toscan);
            }}
          />
        ) : null}
      </View>
      <View className="justify-center items-center">
        <TouchableOpacity
          className="bg-green-500 p-3 px-10"
          onPress={handleSubmit}
        >
          <Text className="text-xl">Enter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckOut;
