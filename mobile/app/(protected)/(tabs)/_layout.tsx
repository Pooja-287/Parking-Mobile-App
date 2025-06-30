import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, Link } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function TopBar() {
  return (
    <View className="flex-row items-center justify-between">
      <View className="bg-white flex-1 flex-row items-center justify-between my-5 p-2.5 rounded-sm">
        <Text className="text-xl font-extrabold">Parking App</Text>
        <Link href="/profile">
          <Ionicons name="person-circle-outline" size={40} />
        </Link>
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaView className="bg-[#3CDF70]" style={{ flex: 1 }}>
      <View className="px-4">
        <TopBar />
      </View>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#3CDF70",
          tabBarStyle: {
            backgroundColor: "#ffffff",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="vehicleList"
          options={{
            title: "Vehicles",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bicycle" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="todayReport"
          options={{
            title: "Today",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="monthlyPlan"
          options={{
            title: "Pass",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="card" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen name="profile" options={{ href: null }} />
        <Tabs.Screen name="staffs" options={{ href: null }} />
        <Tabs.Screen name="dashboard" options={{ href: null }} />
      </Tabs>
    </SafeAreaView>
  );
}
