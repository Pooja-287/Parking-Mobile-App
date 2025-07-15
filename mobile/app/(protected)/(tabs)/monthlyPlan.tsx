import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import userAuthStore from "@/utils/store";
import MonthlyPassModal from "@/components/monthlyPassModal";
import { Toast } from "toastify-react-native";

const TABS = ["create", "active", "expired"] as const;

interface Pass {
  _id: string;
  name: string;
  vehicleNo: string;
  mobile: string;
  duration: number;
  startDate: string;
  endDate: string;
  amount: number;
  paymentMode: string;
  isExpired: boolean;
}

const MonthlyPass: React.FC = () => {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("active");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [extendModal, setExtendModal] = useState(false);
  const [months, setMonths] = useState(3);

  const {
    monthlyPassActive,
    monthlyPassExpired,
    isLoading,
    getMonthlyPass,
    extendMonthlyPass,
  } = userAuthStore();

  useEffect(() => {
    if (activeTab !== "create") getMonthlyPass(activeTab);
  }, [activeTab]);

  const onCreated = () => {
    setModalVisible(false);
    if (activeTab === "active") getMonthlyPass("active");
  };

  const onExtend = async () => {
    if (!editingId) return;
    const res = await extendMonthlyPass(editingId, months);
    if (!res.success) {
      Toast.show({ type: "error", text1: res.error || "Failed" });
    } else {
      Toast.show({ type: "success", text1: "Extended!" });
      setExtendModal(false);
      getMonthlyPass(activeTab);
    }
  };

  const renderPassItem = ({ item }: { item: Pass }) => {
    const cardBg = item.isExpired ? "bg-gray-300" : "bg-green-500";
    const textColor = item.isExpired ? "text-black" : "text-white";

    return (
      <View
        className={`mx-4 my-3 rounded-md ${cardBg} shadow-lg p-5 relative overflow-hidden`}
      >
        <View className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-white/10" />
        <View className="flex-row justify-between items-center mb-4">
          <Text className={`text-xl font-bold ${textColor}`}>{item.name}</Text>
          <MaterialIcons name="directions-car" size={24} color="#fff" />
        </View>

        <View className="mb-2">
          <Text className={`text-sm font-medium ${textColor}`}>
            Vehicle No: <Text className="font-bold">{item.vehicleNo}</Text>
          </Text>
          <Text className={`text-sm font-medium ${textColor}`}>
            Mobile: {item.mobile}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mt-2">
          <View>
            <Text className={`text-xs ${textColor}`}>Duration</Text>
            <View className="flex-row items-center">
              <Text className={`text-base font-semibold ${textColor} mr-2`}>
                {item.duration} months
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setEditPassId(item._id);
                  setShowDurationModal(true);
                }}
              >
                <MaterialIcons
                  name="edit"
                  size={18}
                  color={item.isExpired ? "#000" : "#fff"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text className={`text-xs ${textColor}`}>Valid Till</Text>
            <Text className={`text-base font-semibold ${textColor}`}>
              {new Date(item.endDate).toLocaleDateString()}
            </Text>
          </View>
          <View>
            <Text className={`text-xs ${textColor}`}>Payment</Text>
            <Text className={`text-base font-semibold ${textColor}`}>
              {item.paymentMode}
            </Text>
          </View>
        </View>
        <View className="mt-4 border-t border-white/30 pt-2 flex-row justify-between">
          <Text className={`text-xs ${textColor}`}>Pass ID</Text>
          <Text className={`text-xs font-semibold ${textColor}`}>
            #{item._id.slice(-6).toUpperCase()}
          </Text>
        </View>
      </View>
    );
  };

  const data =
    activeTab === "active"
      ? monthlyPassActive
      : activeTab === "expired"
        ? monthlyPassExpired
        : [];

  return (
    <View className="flex-1 bg-[#F3F4F6]">
      <View className="my-4 mx-4 bg-white justify-center items-center py-4 rounded-sm shadow-sm">
        <Text className="text-xl font-semibold">Monthly Pass</Text>
      </View>

      <View className="flex-row justify-around mx-4 mb-4">
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 py-2 mx-1 rounded ${
              activeTab === tab ? "bg-green-600" : "bg-white"
            }`}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              className={`text-center ${
                activeTab === tab ? "text-white" : "text-black"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "create" ? (
        <TouchableOpacity
          className="bg-green-600 m-4 p-4 rounded items-center"
          onPress={() => setModalVisible(true)}
          disabled={isLoading}
        >
          <Text className="text-white font-semibold">Create New Pass</Text>
        </TouchableOpacity>
      )}

      {isLoading && activeTab !== "create" ? (
        <ActivityIndicator className="mt-10" color="#22c55e" size="large" />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              className={`m-4 p-4 rounded shadow ${
                item.isExpired ? "bg-gray-300" : "bg-green-500"
              }`}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-lg font-bold text-white">
                    {item.name}
                  </Text>
                  <Text className="text-white">{item.vehicleNo}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setEditingId(item._id);
                    setExtendModal(true);
                  }}
                  disabled={item.isExpired}
                >
                  <MaterialIcons
                    name="edit"
                    size={24}
                    color={item.isExpired ? "#000" : "#fff"}
                  />
                </TouchableOpacity>
              </View>
              <Text className="text-white mt-2">
                Duration: {item.duration} mo | ₹{item.amount}
              </Text>
              <Text className="text-white mt-1">
                Valid till: {new Date(item.endDate).toLocaleDateString()}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            !isLoading && (
              <Text className="text-center mt-10 text-gray-500">
                No {activeTab} passes
              </Text>
            )
          }
        />
      )}

      {showDurationModal && (
        <View className="absolute inset-0 bg-black/40 justify-center items-center z-50">
          <View className="bg-white p-6 rounded-lg w-72 shadow-lg">
            <Text className="text-lg font-semibold mb-3 text-center">
              Extend Duration
            </Text>
            {[3, 6, 9, 12].map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setMonths(m)}
                className={`p-2 rounded border my-1 ${
                  months === m ? "bg-green-600 border-green-600" : "bg-white"
                }`}
              >
                <Text className={months === m ? "text-white" : ""}>{m} mo</Text>
              </TouchableOpacity>
            ))}
            <View className="flex-row justify-between mt-3">
              <TouchableOpacity
                className="bg-gray-300 p-2 rounded w-1/2 mr-1"
                onPress={() => setExtendModal(false)}
              >
                <Text className="text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-600 p-2 rounded w-1/2 ml-1"
                onPress={onExtend}
              >
                <Text className="text-white text-center">Extend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default MonthlyPass;
