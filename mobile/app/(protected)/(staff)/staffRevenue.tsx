import {
  Dimensions,
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ProgressChart } from "react-native-chart-kit";
import userAuthStore from "@/utils/store"; // ✅ Zustand

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

const ChartSection = ({ title, data }: any) => {
  const types = Object.keys(data || {});
  const counts = Object.values(data || {}) as number[];
  const labels = types.map((type, i) => `${counts[i]} ${type}`);
  const max = Math.max(...counts, 1);
  const normalizedData = counts.map((count) => count / max);

  return (
    <View style={{ width: screenWidth, alignItems: "center", paddingVertical: 10 }}>
      <Text className="text-lg font-semibold mb-4">{title}</Text>
      <View className="rounded-md shadow-green-200 shadow-md">
        <ProgressChart
          data={{ labels, data: normalizedData }}
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
};

const TodayReport = () => {
  const { report, fetchRevenueReport } = userAuthStore(); // ✅ use Zustand
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchRevenueReport();
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="green" />
        <Text className="mt-2 text-gray-500">Loading today's report...</Text>
      </View>
    );
  }

  const vehicleList = report?.vehicles || [];
  const revenue = report?.revenue || "₹0.00";
  const totalVehicles = report?.totalVehicles || 0;
  const role = report?.role || "N/A";

  return (
    <View className="flex-1 bg-[#F3F4F6]">
      <View className="my-4 mx-4 bg-white justify-center items-center py-4 shadow-sm">
        <Text className="text-xl font-semibold">Today Report</Text>
        <Text className="text-gray-500">Role: {role}</Text>
        <Text className="text-green-600 font-semibold">
          Revenue: {revenue} | Vehicles: {totalVehicles}
        </Text>
      </View>

      <ScrollView>
        <View className="bg-white mx-4 mb-6 rounded-md shadow">
          <View className="p-2 flex-1 justify-center items-center">
            <Text className=" text-lg font-semibold mb-4">Vehicles</Text>
          </View>
          <FlatList
            data={vehicleList}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => (
              <View className="flex-row justify-around bg-green-300 py-2 border-b border-gray-200">
                <Text className="w-1/5 text-center font-bold">Vehicle</Text>
                <Text className="w-1/5 text-center font-bold">Type</Text>
                <Text className="w-1/5 text-center font-bold">Amount</Text>
                <Text className="w-1/5 text-center font-bold">By</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View className="flex-row justify-around py-2 border-b border-gray-100">
                <Text className="w-1/5 text-center">{item.numberPlate}</Text>
                <Text className="w-1/5 text-center">{item.vehicleType}</Text>
                <Text className="w-1/5 text-center">{item.amount}</Text>
                <Text className="w-1/5 text-center">{item.createdBy}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-center p-4 text-gray-500">
                No vehicle data available
              </Text>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default TodayReport;
