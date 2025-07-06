import React, { useState } from "react";
import "../app/global.css";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import Scan from "./Scan";

const CheckOut = () => {
  const [Toscan, setToscan] = useState(false);
  const [TId, setTId] = useState("");
  return (
    <View className="gap-5">
      <Text className="text-2xl">Check Out</Text>
      <View className="py-2 bg-white flex-row rounded-sm justify-center items-center">
        <TextInput
          placeholder="Vehicle No"
          value={TId}
          onChangeText={(text) => setTId(text)}
          className="rounded-sm px-2 h-14 flex-1 bg-blue-100"
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
              setTId(data);
              setToscan(!Toscan);
            }}
          />
        ) : null}
      </View>
      <View className="justify-center items-center">
        <TouchableOpacity className="bg-green-500 p-3 px-10">
          <Text className="text-xl">Enter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckOut;
