import React, { useState } from "react";
import "../global.css";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StatusBar,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CameraView } from "expo-camera";

const Index = () => {
  const [isCheck, setIsCheck] = useState(true);
  const [selectedValue, setSelectedValue] = useState("");
  return (
    <LinearGradient
      className="flex-1"
      colors={["#22C55E", "#22C55E", "#D1D5DB", "#D1D5DB"]}
      locations={[0, 0.4, 0.4, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />
      <View className=" py-12 px-4">
        <View className="flex-row items-center justify-between ">
          <View className="bg-white flex-1 flex-row items-center justify-between my-5 p-2.5 rounded-sm">
            <Ionicons name="menu" size={30} />
            <Ionicons name="person-circle-outline" size={35} />
          </View>
        </View>
        <View className="">
          <View className="border border-white  rounded-sm bg-[#F9FAFB] p-2">
            <Text className="text-2xl mb-5 text-[#111827]">Hey, Gowtham</Text>

            <View className="flex-row justify-around ">
              <TouchableOpacity
                className="bg-green-400 items-center justify-center px-10 py-2 rounded-sm"
                onPress={() => setIsCheck(true)}
              >
                <Text className="text-2xl text-[#111827]">Check In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-[#EF4444] items-center justify-center px-10 py-2 rounded-sm"
                onPress={() => setIsCheck(false)}
              >
                <Text className="text-2xl text-[#111827]">Check Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="pt-5">
          {isCheck ? (
            <View>
              <Text className="text-2xl">Check In</Text>
              <View className="bg-white">
                <View className="p-2 gap-3">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xl">Vehicle No</Text>
                    <TextInput
                      placeholder="Vehicle No"
                      className="rounded-sm flex-1 h-12 bg-gray-300"
                    />
                  </View>
                  <View className="flex-row items-center justify-between gap-2">
                    <Text className="text-xl">Vehicle Type</Text>
                    <Picker
                      className="rounded-sm"
                      selectedValue={selectedValue}
                      onValueChange={(itemValue) => setSelectedValue(itemValue)}
                      style={{
                        height: 48,
                        width: 200,
                        backgroundColor: "#D1D5DB",
                      }}
                    >
                      <Picker.Item label="Cycle" value="cycle" />
                      <Picker.Item label="Bike" value="bike" />
                      <Picker.Item label="Car" value="car" />
                      <Picker.Item label="Van" value="van" />
                    </Picker>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xl">Mobile No</Text>
                    <TextInput
                      placeholder="Mobile"
                      className="rounded-sm flex-1 bg-gray-300 h-12"
                    />
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xl">Vehicle No</Text>
                    <TextInput
                      placeholder="Enter Vehicle No"
                      className="rounded-sm flex-1 bg-gray-300 h-12"
                    />
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <Text>checkOut</Text>
              <View>
                <CameraView
                  style={{ flex: 1 }}
                  barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                  }}
                ></CameraView>
              </View>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

export default Index;

const styles = StyleSheet.create({
  icons: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
});
