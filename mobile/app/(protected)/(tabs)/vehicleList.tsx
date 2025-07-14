import {
  Dimensions,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ProgressChart } from "react-native-chart-kit";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

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

const Dashboard = () => {
  // Sample data for charts
  const sampleData = {
    checkins: {
      Car: 15,
      Bike: 25,
      Truck: 5,
    },
    checkouts: {
      Car: 12,
      Bike: 20,
      Truck: 3,
    },
    staffData: {
      "Morning Shift": 8,
      "Evening Shift": 6,
      "Night Shift": 4,
    },
    revenueData: {
      Parking: 12000,
      MonthlyPass: 5000,
      Fines: 2000,
    },
    monthlyPassData: {
      Active: 30,
      Expired: 5,
      Pending: 10,
    },
    vehicleTypes: {
      Car: 50,
      Bike: 80,
      Truck: 15,
      Van: 10,
    },
  };

  // State for date picker and income data
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [vehicleList, setVehicleList] = useState<
    { vehicle: string; count: number }[]
  >([]);
  const [incomeData, setIncomeData] = useState<{
    today: number;
    yesterday: number;
    monthly: number;
  }>({ today: 15000, yesterday: 12000, monthly: 350000 });

  // Function to generate sample income based on selected date
  const generateIncomeData = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    // Sample logic: Vary income based on day and month
    const baseTodayIncome = 15000;
    const baseYesterdayIncome = 12000;
    const baseMonthlyIncome = 350000;

    // Adjust income based on day and month for variation
    const todayIncome = Math.round(baseTodayIncome + day * 150 - month * 200);
    const yesterdayIncome = Math.round(
      baseYesterdayIncome + (day - 1) * 150 - month * 200
    );
    const monthlyIncome = Math.round(
      baseMonthlyIncome + month * 12000 - day * 1000
    );

    return {
      today: Math.max(0, todayIncome),
      yesterday: Math.max(0, yesterdayIncome),
      monthly: Math.max(0, monthlyIncome),
    };
  };

  useEffect(() => {
    // Process vehicle types
    const uniqueVehicleTypes = Array.from(
      new Set([
        ...Object.keys(sampleData.checkins),
        ...Object.keys(sampleData.checkouts),
        ...Object.keys(sampleData.vehicleTypes),
      ])
    );

    const vehicleList = uniqueVehicleTypes.map((type: any) => ({
      vehicle: type,
      count: sampleData.vehicleTypes[type] || 0,
    }));

    // Update income data based on selected date
    const income = generateIncomeData(selectedDate);

    setVehicleList(vehicleList);
    setIncomeData(income);
  }, [selectedDate]);

  return (
    <View className="flex-1 bg-[#F3F4F6]">
      <View className="my-4 mx-4 bg-white justify-center items-center py-4 shadow-sm">
        <Text className="text-xl font-semibold">Dashboard</Text>
      </View>
      <ScrollView>
        {/* Date Picker Section */}
        <View className="bg-white mx-4 mb-4">
          <View className="p-2 flex-1 justify-center items-center">
            <Text className="text-lg font-semibold mb-4">Select Date</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="bg-green-100 px-3 py-2 rounded shadow-sm mx-4"
          >
            <Text className="text-sm text-center">
              {format(selectedDate, "MMM dd, yyyy")}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(event, newDate) => {
                setShowDatePicker(false);
                if (event.type === "set" && newDate) {
                  setSelectedDate(newDate);
                }
              }}
            />
          )}
        </View>

        {/* Chart Section */}
        <View className="pb-4">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            <ChartSection
              title="Check In/Out"
              data={{ ...sampleData.checkins, ...sampleData.checkouts }}
            />
            <ChartSection title="Staff Activity" data={sampleData.staffData} />
            <ChartSection title="Revenue" data={sampleData.revenueData} />
            <ChartSection
              title="Monthly Pass"
              data={sampleData.monthlyPassData}
            />
          </ScrollView>
        </View>

        {/* Vehicle Information */}
        <View className="bg-white mx-4 mb-4">
          <View className="p-2 flex-1 justify-center items-center">
            <Text className="text-lg font-semibold mb-4">
              Vehicle Information
            </Text>
          </View>
          <View className="pb-4">
            {Array.isArray(vehicleList) && vehicleList.length > 0 ? (
              <FlatList
                data={vehicleList}
                keyExtractor={(item) => item.vehicle}
                ListHeaderComponent={() => (
                  <View className="flex-row justify-around bg-green-300 py-2 border-b border-gray-200">
                    <Text className="w-1/2 text-center font-bold">
                      Vehicle Type
                    </Text>
                    <Text className="w-1/2 text-center font-bold">Count</Text>
                  </View>
                )}
                renderItem={({ item }) => (
                  <View className="flex-row justify-around py-2 border-b border-gray-100">
                    <Text className="w-1/2 text-center">{item.vehicle}</Text>
                    <Text className="w-1/2 text-center">{item.count}</Text>
                  </View>
                )}
              />
            ) : (
              <Text className="text-center p-4 text-gray-500">
                No vehicle data available
              </Text>
            )}
          </View>
        </View>

        {/* Income Information */}
        <View className="bg-white mx-4">
          <View className="p-2 flex-1 justify-center items-center">
            <Text className="text-lg font-semibold mb-4">Income Summary</Text>
          </View>
          <View className="pb-4">
            <View className="flex-row justify-around bg-green-300 py-2 border-b border-gray-200">
              <Text className="w-1/3 text-center font-bold">Period</Text>
              <Text className="w-1/3 text-center font-bold">Amount</Text>
            </View>
            <View className="flex-row justify-around py-2 border-b border-gray-100">
              <Text className="w-1/3 text-center">Today</Text>
              <Text className="w-1/3 text-center">₹{incomeData.today}</Text>
            </View>
            <View className="flex-row justify-around py-2 border-b border-gray-100">
              <Text className="w-1/3 text-center">Yesterday</Text>
              <Text className="w-1/3 text-center">₹{incomeData.yesterday}</Text>
            </View>
            <View className="flex-row justify-around py-2 border-b border-gray-100">
              <Text className="w-1/3 text-center">Monthly</Text>
              <Text className="w-1/3 text-center">₹{incomeData.monthly}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;
