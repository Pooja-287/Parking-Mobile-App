<<<<<<< HEAD
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
=======
import { Dimensions, Text, View, ScrollView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { ProgressChart } from "react-native-chart-kit";
import userAuthStore from "@/utils/store";

const screenWidth = Dimensions.get("window").width;
const chartWidth = screenWidth * 0.93;

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(0, 200, 83, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0,
  useShadowColorFromDataset: false,
  propsForBackgroundLines: {
    stroke: "#e0e0e0",
  },
};

const prepareChartData = (dataObject: any) => {
  const types = Object.keys(dataObject);
  const counts = Object.values(dataObject) as number[];

  const labels = types.map((type, i) => `${counts[i]} ${type}`);

  const max = Math.max(...counts, 1);
  const normalizedData = counts.map((count) => count / max);

  return {
    labels,
    data: normalizedData,
  };
};

const ChartSection = ({ title, data }: any) => (
  <View
    style={{
      width: screenWidth,
      alignItems: "center",
      paddingVertical: 10,
    }}
  >
    <Text className="text-lg font-semibold mb-4">{title}</Text>
    <View className="rounded-md shadow-green-200 shadow-md">
      <ProgressChart
        data={prepareChartData(data)}
        width={chartWidth}
        height={220}
        strokeWidth={13}
        radius={30}
        chartConfig={chartConfig}
        hideLegend={false}
      />
    </View>
  </View>
);

const TodayReport = () => {
  const { checkins, checkouts, allData, VehicleTotalMoney, PaymentMethod } =
    userAuthStore();
  const [vehicleList, setVehicleList] = useState<
    {
      vehicle: string;
      checkin: number;
      checkout: number;
      total: number;
      money: number;
    }[]
  >([]);
  const [paymentMethod, setPaymentMethod] = useState<
    { method: string; amount: number }[]
  >([]);
  useEffect(() => {
    const vehicleTypes = Array.from(
      new Set([
        ...Object.keys(checkins || {}),
        ...Object.keys(checkouts || {}),
        ...Object.keys(allData || {}),
        ...Object.keys(VehicleTotalMoney || {}),
      ])
    );
    const vehicleList = vehicleTypes.map((type: any) => ({
      vehicle: type,
      checkin: checkins?.[type] || 0,
      checkout: checkouts?.[type] || 0,
      total: allData?.[type] || 0,
      money: VehicleTotalMoney?.[type] || 0,
    }));
    const paymentList = Object.entries(PaymentMethod || {}).map(
      ([method, amount]) => ({
        method,
        amount,
      })
    );
    setPaymentMethod(paymentList);
    setVehicleList(vehicleList);
    console.log(PaymentMethod);
  }, []);
>>>>>>> 85595f2549757111d0e84c417625275ed4d70655

  return (
<<<<<<< HEAD
    <View>
      <Text>todayReport</Text>
=======
    <View className="flex-1 bg-[#F3F4F6]">
      <View className="my-4 mx-4 bg-white justify-center items-center py-4 shadow-sm">
        <Text className="text-xl font-semibold">Today Report</Text>
      </View>
      <ScrollView>
        <View className="pb-4">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            <ChartSection title="All Vehicles" data={allData} />
            <ChartSection title="Check In" data={checkins} />
            <ChartSection title="Check Out" data={checkouts} />
          </ScrollView>
        </View>

        <View className="bg-white mx-4">
          <View className="p-2 flex-1 justify-center items-center">
            <Text className=" text-lg font-semibold mb-4">Vehicles</Text>
          </View>
          <View className="pb-4">
            {Array.isArray(vehicleList) && vehicleList.length > 0 ? (
              <FlatList
                data={vehicleList}
                keyExtractor={(item) => item.vehicle}
                ListHeaderComponent={() => (
                  <View className="flex-row justify-around py-2 border-b border-gray-200">
                    <Text className="w-1/5 text-center font-bold">Vehicle</Text>
                    <Text className="w-1/5 text-center font-bold">IN</Text>
                    <Text className="w-1/5 text-center font-bold">Out</Text>
                    <Text className="w-1/5 text-center font-bold">All</Text>
                    <Text className="w-1/5 text-center font-bold">Money</Text>
                  </View>
                )}
                renderItem={({ item }) => (
                  <View className="flex-row justify-around py-2 border-b border-gray-100">
                    <Text className="w-1/5 text-center">{item.vehicle}</Text>
                    <Text className="w-1/5 text-center">{item.checkin}</Text>
                    <Text className="w-1/5 text-center">{item.checkout}</Text>
                    <Text className="w-1/5 text-center">{item.total}</Text>
                    <Text className="w-1/5 text-center">₹{item.money}</Text>
                  </View>
                )}
              />
            ) : (
              <Text className="text-center p-4 text-gray-500">
                No vehicle data available
              </Text>
            )}
          </View>
          <View>
            <View className="p-2 flex-1 justify-center items-center">
              <Text className=" text-lg font-semibold mb-4">
                Payment Methods
              </Text>
            </View>

            {Array.isArray(paymentMethod) && paymentMethod.length > 0 ? (
              <FlatList
                data={paymentMethod}
                keyExtractor={(item) => item.method}
                ListHeaderComponent={() => (
                  <View className="flex-row justify-around py-2 border-b border-gray-200">
                    <Text className="w-1/5 text-center font-bold">Payment</Text>
                    <Text className="w-1/5 text-center font-bold">Money</Text>
                  </View>
                )}
                renderItem={({ item }) => (
                  <View className="flex-row justify-around py-2 border-b border-gray-100">
                    <Text className="w-1/5 text-center">{item.method}</Text>
                    <Text className="w-1/5 text-center">{item.amount}</Text>
                  </View>
                )}
              />
            ) : (
              <Text className="text-center p-4 text-gray-500">
                No payment data
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
>>>>>>> 85595f2549757111d0e84c417625275ed4d70655
    </View>
  )
}

<<<<<<< HEAD
export default todayReport

const styles = StyleSheet.create({})
=======
export default TodayReport;
>>>>>>> 85595f2549757111d0e84c417625275ed4d70655
