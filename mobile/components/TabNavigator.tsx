// // components/TabNavigator.tsx
// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Ionicons } from "@expo/vector-icons";
// import permissions from "@/utils/permissionStore";

// // Import Screens
// import Checkin from "@/components/CheckIn";
// import Checkout from "@/components/CheckOut";
// import Report from "@/components/Scan";
// import Pass from "@/app/(protected)/(tabs)/todayReport";
// import StaffList from "@/app/(protected)/(tabs)/staffs";
// // import Today from "@/screens/Today";

// const Tab = createBottomTabNavigator();

// const allTabs = [
//   { name: "Checkin", permission: "checkin", icon: "log-in-outline", component: Checkin },
//   { name: "Checkout", permission: "checkout", icon: "log-out-outline", component: Checkout },
//   { name: "Pass", permission: "pass", icon: "card-outline", component: Pass },
// //   { name: "Today", permission: "today", icon: "calendar-outline", component: Today },
//   { name: "Report", permission: "report", icon: "analytics-outline", component: Report },
//   { name: "Staffs", permission: "stafflist", icon: "people-outline", component: StaffList },
// ];

// const TabNavigator = () => {
//   const { user, permissions } = useUserStore();

//   return (
//     <Tab.Navigator screenOptions={{ headerShown: false }}>
//       {allTabs
//         .filter((tab) =>
//           user?.role === "admin" ? true : permissions.includes(tab.permission)
//         )
//         .map((tab) => (
//           <Tab.Screen
//             key={tab.name}
//             name={tab.name}
//             component={tab.component}
//             options={{
//               tabBarIcon: ({ color, size }) => (
//                 <Ionicons name={tab.icon} size={size} color={color} />
//               ),
//             }}
//           />
//         ))}
//     </Tab.Navigator>
//   );
// };

// export default TabNavigator;
 