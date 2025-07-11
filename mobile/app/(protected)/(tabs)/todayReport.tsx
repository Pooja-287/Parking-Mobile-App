import { Dimensions, Text, View, ScrollView } from "react-native";
import React from "react";
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

const prepareChartData = (dataObject) => {
  const types = Object.keys(dataObject);
  const counts = Object.values(dataObject);

  // Label with count: e.g., "bike (2)"
  const labels = types.map((type, i) => `${counts[i]} ${type}`);

  const max = Math.max(...counts, 1); // Prevent divide-by-zero
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
  const { checkins, checkouts, allData } = userAuthStore();

  return (
    <View className="flex-1 bg-[#F3F4F6]">
      <View className="my-4 mx-4 bg-white justify-center items-center py-4 shadow-sm">
        <Text className="text-xl font-semibold">Today Report</Text>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <ChartSection title="All Vehicles" data={allData} />
        <ChartSection title="Check In" data={checkins} />
        <ChartSection title="Check Out" data={checkouts} />
      </ScrollView>
    </View>
  );
};

export default TodayReport;
