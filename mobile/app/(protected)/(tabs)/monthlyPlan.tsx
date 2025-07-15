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

  const data = activeTab === "active" ? monthlyPassActive : monthlyPassExpired;

  return (
    <View className="flex-1 bg-gray-100">
      <View className="p-4 bg-white shadow">
        <Text className="text-xl font-semibold text-center">
          Monthly Passes
        </Text>
      </View>

      <View className="flex-row justify-around mt-4">
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

      {activeTab === "create" && (
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

      {/* Create Modal */}
      <MonthlyPassModal
        isModalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onPassCreated={onCreated}
      />

      {/* Extend Modal */}
      {extendModal && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center">
          <View className="bg-white p-5 w-64 rounded">
            <Text className="text-lg font-semibold mb-2 text-center">
              Extend by
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
