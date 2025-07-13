import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import MonthlyPassModal from "@/components/MonthlyPassModal";
import userAuthStore from "@/utils/store";
import { Toast } from "toastify-react-native";

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

const TABS = ["create", "active", "expired"];

const MonthlyPass: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [editPassId, setEditPassId] = useState<string | null>(null);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<number>(1);

  const {
    getMonthlyPass,
    monthlyPassActive,
    monthlyPassExpired,
    isLoading,
    extendMonthlyPass,
  } = userAuthStore();

  useEffect(() => {
    if (activeTab !== "create") {
      getMonthlyPass(activeTab);
    }
  }, [activeTab]);

  const handlePassCreated = () => {
    setModalVisible(false);
    if (activeTab === "active") {
      getMonthlyPass("active");
    }
  };

  const handleExtend = async () => {
    if (!editPassId) return;

    const result = await extendMonthlyPass(editPassId, selectedMonths);

    if (!result.success) {
      Toast.show({ type: "error", text1: "Something went wrong" });
      return;
    }

    Toast.show({ type: "success", text1: "Duration extended successfully" });
    setTimeout(() => {
      setShowDurationModal(false);
      getMonthlyPass(activeTab); // refresh data
    }, 2000);
  };

  const renderPassItem = ({ item }: { item: Pass }) => {
    const cardBg = item.isExpired ? "bg-gray-300" : "bg-green-500";
    const textColor = item.isExpired ? "text-black" : "text-white";

    return (
      <View
        className={`mx-4 my-3 rounded-2xl ${cardBg} shadow-lg p-5 relative overflow-hidden`}
      >
        <View className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-white/10" />

        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className={`text-xl font-bold ${textColor}`}>{item.name}</Text>
          <MaterialIcons name="directions-car" size={24} color="#fff" />
        </View>

        {/* Details */}
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
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="my-4 mx-4 bg-white justify-center items-center py-4 rounded-sm shadow-sm">
        <Text className="text-xl font-semibold">Monthly Pass</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-around mx-4 mb-4">
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 py-3 items-center rounded-sm mx-1 ${
              activeTab === tab ? "bg-green-600" : "bg-white"
            }`}
            disabled={isLoading}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              className={`text-base font-medium ${
                activeTab === tab ? "text-white" : "text-black"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Body */}
      {activeTab === "create" ? (
        <TouchableOpacity
          className="bg-green-600 mx-4 py-4 rounded-sm items-center"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white text-base font-medium">
            Create New Pass
          </Text>
        </TouchableOpacity>
      ) : isLoading ? (
        <ActivityIndicator size="large" color="#22c55e" className="mt-10" />
      ) : (
        <FlatList
          data={data}
          renderItem={renderPassItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <Text className="text-center mt-5 text-base text-gray-500">
              No {activeTab} passes
            </Text>
          }
        />
      )}

      {/* Duration Extend Modal */}
      {showDurationModal && (
        <View className="absolute inset-0 bg-black/40 justify-center items-center z-50">
          <View className="bg-white p-6 rounded-lg w-72 shadow-lg">
            <Text className="text-lg font-semibold mb-3 text-center">
              Extend Duration
            </Text>

            <View className="flex-row flex-wrap justify-center">
              {[3, 6, 9, 12].map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setSelectedMonths(m)}
                  className={`m-1 px-4 py-2 rounded-full border ${
                    selectedMonths === m
                      ? "bg-green-600 border-green-600"
                      : "bg-gray-200 border-gray-300"
                  }`}
                >
                  <Text
                    className={`${
                      selectedMonths === m ? "text-white" : "text-black"
                    } font-medium`}
                  >
                    {m} mo
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="mt-5 flex-row justify-between">
              <TouchableOpacity
                className="px-4 py-2 bg-gray-300 rounded"
                onPress={() => setShowDurationModal(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 bg-green-600 rounded"
                onPress={handleExtend}
              >
                <Text className="text-white font-medium">Extend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Modal */}
      <MonthlyPassModal
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        onPassCreated={handlePassCreated}
      />
    </View>
  );
};

export default MonthlyPass;
