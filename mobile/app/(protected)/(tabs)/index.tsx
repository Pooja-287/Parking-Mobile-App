import React, { useEffect, useState } from "react";
import "../../global.css";
import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import CheckIn from "@/components/CheckIn";
import CheckOut from "@/components/CheckOut";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Index = () => {
  const [isCheck, setIsCheck] = useState(true);
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />
      <View className="bg-green-100 py-4 flex-1 px-4">
        <View className="">
          <View className="border border-white shadow-md  rounded-sm bg-white p-2">
            <Text className="text-2xl mb-5 text-[#111827]">
              hey {user?.username}
            </Text>

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
        <View className="pt-5 flex-1 h-screen">
          <ScrollView showsVerticalScrollIndicator={false}>
            {isCheck ? <CheckIn /> : <CheckOut />}
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default Index;
