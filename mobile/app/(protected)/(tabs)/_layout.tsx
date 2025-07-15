// import Ionicons from "@expo/vector-icons/Ionicons";
// import { Tabs, Link, Redirect } from "expo-router";
// import { View, Text, TouchableOpacity } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import userAuthStore from "@/utils/store";
// import React from "react";

// function TopBar() {
//   const { logOut, isLogged } = userAuthStore();
//   const handleLogout = async () => {
//     await logOut();
//     if (!isLogged) {
//       return <Redirect href={"/login"} />;
//     }
//   };
//   return (
//     <View className="flex-row items-center justify-between">
//       <View className="bg-white flex-1 flex-row items-center justify-between my-5 p-2.5 rounded-sm">
//         <View className="flex-row items-center justify-center gap-2">
//           <Link href="/profile">
//             <Ionicons name="person-circle-outline" size={40} />
//           </Link>
//           <Text className="text-xl font-extrabold">Parking App</Text>
//         </View>
//         <TouchableOpacity onPress={handleLogout}>
//           <Ionicons name="log-out-outline" size={20} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// export default function RootLayout() {
//   return (
//     <SafeAreaView className="bg-[#3CDF70]" style={{ flex: 1 }}>
//       <View className="px-4">
//         <TopBar />
//       </View>

//       <Tabs
//         screenOptions={{
//           headerShown: false,
//           tabBarActiveTintColor: "#3CDF70",
//           tabBarStyle: {
//             backgroundColor: "#ffffff",
//           },
//         }}
//       >
//         <Tabs.Screen
//           name="index"
//           options={{
//             title: "Home",
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="home" size={size} color={color} />
//             ),
//           }}
//         />
//         <Tabs.Screen
//           name="vehicleList"
//           options={{
//             title: "Vehicles",
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="bicycle" size={size} color={color} />
//             ),
//           }}
//         />
//         <Tabs.Screen
//           name="todayReport"
//           options={{
//             title: "Today",
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="document" size={size} color={color} />
//             ),
//           }}
//         />
//         <Tabs.Screen
//           name="monthlyPlan"
//           options={{
//             title: "Pass",
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="card" size={size} color={color} />
//             ),
//           }}
//         />
//         <Tabs.Screen name="profile" options={{ href: null }} />
//         <Tabs.Screen name="staffs" options={{ href: null }} />
//         <Tabs.Screen name="dashboard" options={{ href: null }} />
//         <Tabs.Screen name="adminProfile" options={{href: null}} />
//         <Tabs.Screen name="create" options={{href: null}} />
//         {/* <Tabs.Screen name="AllStaffsScreen" options={{href: null}} />
//         <Tabs.Screen name="priceDetails" options={{href: null}} />
//         <Tabs.Screen name="todayVehicle" options={{href: null}} />
//         <Tabs.Screen name="todayRevenue" options={{href: null}} />
//         // <Tabs.Screen name="vehicleList" options={{href: null}} /> */}
//         <Tabs.Screen name="(staff)/priceDetails" options={{ href: null }} />
// <Tabs.Screen name="(staff)/todayRevenue" options={{ href: null }} />
// <Tabs.Screen name="(staff)/todayVehicle" options={{ href: null }} />
// <Tabs.Screen name="(staff)/vehicleList" options={{ href: null }} />
// <Tabs.Screen name="(staff)/AllStaffsScreen" options={{ href: null }} />
// <Tabs.Screen name="(staff)/create" options={{ href: null }} />
// <Tabs.Screen name="updateProfile" options={{ href: null }} />

//       </Tabs>
//     </SafeAreaView>
//   );
// }

// app/(tabs)/_layout.tsx

import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, Link, Redirect } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import userAuthStore from "@/utils/store";
import React from "react";

function TopBar() {
  const { logOut, isLogged } = userAuthStore();

  const handleLogout = async () => {
    await logOut();
    if (!isLogged) {
      return <Redirect href="/login" />;
    }
  };

  return (
    <View className="flex-row items-center justify-between">
      <View className="bg-white flex-1 flex-row items-center justify-between my-5 p-2.5 rounded-sm">
        <View className="flex-row items-center justify-center gap-2">
          <Link href="/profile">
            <Ionicons name="person-circle-outline" size={40} />
          </Link>
          <Text className="text-xl font-extrabold">Parking App</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TabLayout() {
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
        {/* Only include screens from (tabs) */}
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
        <Tabs.Screen name="adminProfile" options={{ href: null }} />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Pass",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="card" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen name="profile" options={{ href: null }} />
        <Tabs.Screen name="staffs" options={{ href: null }} />
        <Tabs.Screen name="updateProfile" options={{ href: null }} />
        <Tabs.Screen name="priceDetails" options={{href: null}} />
        <Tabs.Screen name="splash" options={{href: null}}/>
        {/* <Tabs.Screen name="staffPermissions" options={{href: null}} /> */}
        {/* <Tabs.Screen name="staff" options={{href: null}} /> */}

        {/* ❌ Don't add staff routes like (staff)/create here */}
        {/* Those are handled in (staff)/_layout.tsx */}
      </Tabs>
    </SafeAreaView>
  );
}
