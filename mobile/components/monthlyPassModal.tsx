import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "@react-native-community/datetimepicker";
import userAuthStore from "@/utils/store";
import ToastManager, { Toast } from "toastify-react-native";

interface FormData {
  name: string;
  mobile: string;
  vehicleNo: string;
  vehicleType: string;
  duration: string;
  paymentMethod: string;
  startDate: string;
  endDate: string;
  amount?: number;
}

interface MonthlyPassModalProps {
  isModalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  onPassCreated: () => void;
}

const MonthlyPassModal: React.FC<MonthlyPassModalProps> = ({
  isModalVisible,
  setModalVisible,
  onPassCreated,
}) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    vehicleNo: "",
    vehicleType: "",
    duration: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
  });

  const createMonthlyPass = userAuthStore((s) => s.createMonthlyPass);

  useEffect(() => {
    if (formData.startDate && formData.duration) {
      const start = new Date(formData.startDate);
      const months = parseInt(formData.duration, 10);
      const end = new Date(start);
      end.setMonth(end.getMonth() + months);
      setFormData((f) => ({
        ...f,
        endDate: end.toISOString().split("T")[0],
      }));
    }
  }, [formData.startDate, formData.duration]);

  const calculateAmount = () => {
    const d = formData.duration;
    if (d === "3") return 300;
    if (d === "6") return 500;
    if (d === "9") return 700;
    if (d === "12") return 900;
    return 0;
  };

  const handleCreate = async () => {
    if (
      !formData.name ||
      !formData.mobile ||
      !formData.vehicleNo ||
      !formData.vehicleType ||
      !formData.duration ||
      !formData.paymentMethod ||
      !formData.startDate
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
    const amount = calculateAmount();
    const res = await createMonthlyPass({ ...formData, amount });
    if (!res.success) {
      Toast.show({ type: "error", text1: res.error || "Failed to create" });
    } else {
      Toast.show({ type: "success", text1: "Pass Created" });
      setTimeout(() => {
        setModalVisible(false);
        onPassCreated();
      }, 1000);
      setFormData({
        name: "",
        mobile: "",
        vehicleNo: "",
        vehicleType: "",
        duration: "",
        paymentMethod: "",
        startDate: "",
        endDate: "",
      });
    }
  };

  return (
    <Modal visible={isModalVisible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white p-5 w-4/5 rounded-md">
          <Text className="text-xl font-semibold text-center mb-4">
            Create Monthly Pass
          </Text>
          <TextInput
            placeholder="Name"
            value={formData.name}
            onChangeText={(t) => setFormData((f) => ({ ...f, name: t }))}
            className="border p-2 mb-2"
          />
          <TextInput
            placeholder="Mobile"
            value={formData.mobile}
            keyboardType="phone-pad"
            onChangeText={(t) => setFormData((f) => ({ ...f, mobile: t }))}
            className="border p-2 mb-2"
          />
          <TextInput
            placeholder="Vehicle No"
            value={formData.vehicleNo}
            onChangeText={(t) => setFormData((f) => ({ ...f, vehicleNo: t }))}
            className="border p-2 mb-2"
          />

          <Picker
            selectedValue={formData.vehicleType}
            onValueChange={(v) =>
              setFormData((f) => ({ ...f, vehicleType: v }))
            }
            className="border mb-2"
          >
            <Picker.Item label="Select Vehicle Type" value="" />
            {["cycle", "bike", "car", "van", "lorry", "bus"].map((v) => (
              <Picker.Item key={v} label={v} value={v} />
            ))}
          </Picker>

          <Picker
            selectedValue={formData.duration}
            onValueChange={(v) =>
              setFormData((f) => ({ ...f, duration: v }))
            }
            className="border mb-2"
          >
            <Picker.Item label="Select Duration" value="" />
            {[3, 6, 9, 12].map((m) => (
              <Picker.Item key={m} label={`${m} months`} value={`${m}`} />
            ))}
          </Picker>

          <TouchableOpacity
            onPress={() => setDatePickerVisible(true)}
            className="border p-2 mb-2"
          >
            <Text>
              {formData.startDate || "Select Start Date"}
            </Text>
          </TouchableOpacity>
          {isDatePickerVisible && (
            <DatePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={(_, date) => {
                setDatePickerVisible(false);
                if (date) {
                  setFormData((f) => ({
                    ...f,
                    startDate: date.toISOString().split("T")[0],
                  }));
                }
              }}
            />
          )}

          <Picker
            selectedValue={formData.paymentMethod}
            onValueChange={(v) =>
              setFormData((f) => ({ ...f, paymentMethod: v }))
            }
            className="border mb-2"
          >
            <Picker.Item label="Payment Method" value="" />
            {["cash", "gpay", "phonepe", "paytm"].map((v) => (
              <Picker.Item key={v} label={v.toUpperCase()} value={v} />
            ))}
          </Picker>

          <Text className="mb-2">End Date: {formData.endDate}</Text>
          <Text className="mb-4">Amount: ₹{calculateAmount()}</Text>

          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-gray-300 p-3 rounded w-1/2 mr-1"
            >
              <Text className="text-center">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCreate}
              className="bg-green-600 p-3 rounded w-1/2 ml-1"
            >
              <Text className="text-center text-white">Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ToastManager showCloseIcon={false} />
    </Modal>
  );
};

export default MonthlyPassModal;
