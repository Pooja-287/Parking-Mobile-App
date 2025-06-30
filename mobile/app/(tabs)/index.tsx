import React, { useState } from "react";
import "../global.css";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StatusBar,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Scan from "../../components/Scan";

const Index = () => {
  const [isCheck, setIsCheck] = useState(true);
  const [Toscan, setToscan] = useState(false);
  const [TId, setTId] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  // const [Money, setMoney] = useState("");

  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />
      <View className="bg-[#F3F4F6] py-4 flex-1 px-4">
        <View className="">
          <View className="border border-white  rounded-sm bg-white p-2">
            <Text className="text-2xl mb-5 text-[#111827]">Hey, Gowtham</Text>

            <View className="flex-row justify-around ">
              <TouchableOpacity
                className="bg-green-400 items-center justify-center px-6 py-2 rounded-sm"
                onPress={() => setIsCheck(true)}
              >
                <Text className="text-2xl text-[#111827]">Check In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-[#EF4444] items-center justify-center px-6 py-2 rounded-sm"
                onPress={() => setIsCheck(false)}
              >
                <Text className="text-2xl text-[#111827]">Check Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="pt-5">
          {isCheck ? (
            <View className="gap-5">
              <Text className="text-2xl">Check In</Text>
              <View className="bg-white">
                <View className="p-2 gap-3">
                  <View className="flex-row justify-between items-center gap-2">
                    <TextInput
                      placeholder="Vehicle No"
                      className="rounded-sm px-1.5  h-14 flex-1 bg-blue-100"
                    />
                  </View>
                  <View className="flex-row items-center justify-between gap-2">
                    <Picker
                      className="rounded-sm"
                      selectedValue={selectedValue}
                      onValueChange={(itemValue) => setSelectedValue(itemValue)}
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
                  </View>
                  <View className="flex-row  justify-between items-center gap-2">
                    <TextInput
                      placeholder="Mobile"
                      keyboardType="number-pad"
                      className="rounded-sm px-1.5 bg-blue-100 h-14 flex-1"
                    />
                  </View>
                  <View className="flex-row items-center justify-between gap-2">
                    <Picker
                      className="rounded-sm"
                      selectedValue={selectedValue}
                      onValueChange={(itemValue) => setSelectedValue(itemValue)}
                      style={{
                        height: 52,
                        flex: 1,
                        fontSize: 14,
                        backgroundColor: "#DBEAFE",
                      }}
                    >
                      <Picker.Item label="Cash" value="cash" />
                      <Picker.Item label="Gpay" value="gpay" />
                      <Picker.Item label="phonepe" value="phonepe" />
                      <Picker.Item label="Paytm" value="paytm" />
                    </Picker>
                  </View>
                  <View className="justify-center items-center py-4">
                    <Text>{}</Text>
                  </View>
                  <View className="justify-center items-center">
                    <TouchableOpacity className="bg-green-500 p-3 px-10">
                      <Text className="text-xl">Enter</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View className="gap-5">
              <Text className="text-2xl">Check Out</Text>
              <View className=" flex-row rounded-sm justify-center items-center">
                <TextInput
                  placeholder="Vehicle No"
                  value={TId}
                  onChangeText={(text) => setTId(text)}
                  className="rounded-sm px-2 h-14 flex-1 bg-[#DBEAFE]"
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
          )}
        </View>
      </View>
    </>
  );
};

export default Index;
