import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import userAuthStore from "../../../utils/store";
import ToastManager from "toastify-react-native/components/ToastManager";

const Profile = () => {
  const { user, logOut, updateProfile } = userAuthStore();
  const router = useRouter();

  const parsedUser = typeof user === "string" ? JSON.parse(user) : user;

  const [avatar, setAvatar] = useState(parsedUser?.avatar || null);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState(parsedUser?.username || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (parsedUser?.avatar) {
      setAvatar(parsedUser.avatar);
    }
  }, [parsedUser]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logOut();
          router.replace("/login");
        },
      },
    ]);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Toast.show({
        type: "error",
        text1: "Permission required",
        text2: "Please allow access to your media library",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setAvatar(selectedImage);

      const res = await updateProfile(
        parsedUser._id,
        parsedUser.username,
        "",
        selectedImage
      );

      if (res.success) {
        Toast.show({
          type: "success",
          text1: "Profile image updated",
          position: "top",
          visibilityTime: 2000,
          autoHide: true,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Image update failed",
          text2: res.error || "Try again later",
          position: "top",
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    }
  };

  const handleUpdate = async () => {
    if (updating) return;
    setUpdating(true);

    if (!username.trim() || !oldPassword || !newPassword) {
      Toast.show({
        type: "error",
        text1: "All fields are required",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
      });
      setUpdating(false);
      return;
    }

    if (oldPassword === newPassword) {
      Toast.show({
        type: "error",
        text1: "New password must be different",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
      });
      setUpdating(false);
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: "error",
        text1: "Password too short",
        text2: "New password must be at least 6 characters",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
      });
      setUpdating(false);
      return;
    }

    const result = await updateProfile(
      parsedUser._id,
      username,
      newPassword,
      avatar,
      oldPassword
    );

    if (result?.success) {
      Toast.show({
        type: "success",
        text1: "Profile updated successfully",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
      });
      setShowModal(false);
    } else {
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: result?.error || "Try again later",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
      });
    }

    setUpdating(false);
    setOldPassword("");
    setNewPassword("");
  };

  const initial = parsedUser?.username?.trim()?.charAt(0)?.toUpperCase() || "U";

  if (!parsedUser || parsedUser.role !== "admin") {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-red-500 text-xl font-bold">Access Denied</Text>
        <Text className="text-gray-600 mt-2 text-center">
          You are not authorized to view this page.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F3F4F6]">
      <View className="m-4 gap-3">
        <View className=" bg-white justify-center items-center py-4 rounded-sm shadow-sm">
          <Text className="text-xl font-semibold">Profile Settings</Text>
        </View>
        <View className="">
          <View className="items-center py-2 mb-2">
            <TouchableOpacity onPress={pickImage} className="items-center">
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <View className="w-32 h-32 rounded-full bg-green-400 border-4 border-white shadow-lg items-center justify-center">
                  <Text className="text-4xl font-bold text-white">
                    {initial}
                  </Text>
                </View>
              )}
              <Text className="text-sm text-gray-500 mt-2">
                Click to upload a new photo
              </Text>
            </TouchableOpacity>
          </View>
          {/* User Info */}
          <View className="bg-white p-6 rounded-sm shadow-lg">
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Username
              </Text>
              <View className="rounded-sm px-4 bg-blue-100 h-14 py-4">
                <Text className="text-gray-900 text-base">
                  {parsedUser?.username}
                </Text>
              </View>
            </View>
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Email
              </Text>
              <View className="rounded-sm px-4 bg-blue-100 h-14 py-4">
                <Text className="text-gray-900 text-base">
                  {parsedUser?.email}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              className="bg-green-500 py-3 rounded-sm items-center self-center w-full mb-4"
            >
              <Text className="text-black text-lg font-medium">
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-500 py-3 rounded-sm self-center w-full items-center"
            >
              <Text className="text-black text-lg font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showModal && (
        <Modal visible={showModal} animationType="fade" transparent>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-5 gap-3 rounded-sm w-4/5">
              <Text className="text-lg font-semibold mb-4 text-center">
                Update Profile
              </Text>

              <TextInput
                value={username}
                onChangeText={setUsername}
                className="border border-gray-200 bg-blue-100 rounded-sm p-3 text-base"
                placeholder="Enter new username"
              />

              <TextInput
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
                className="border border-gray-200 bg-blue-100 rounded-sm p-3 text-base"
                placeholder="Enter old password"
              />

              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                className="border border-gray-200 bg-blue-100 rounded-sm p-3 text-base"
                placeholder="Enter new password"
              />

              <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                  className="bg-red-500 py-3 px-4 rounded-sm flex-1 mr-2"
                  onPress={() => setShowModal(false)}
                >
                  <Text className="text-white text-base font-medium text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`bg-green-600 py-3 px-4 justify-center items-center rounded-sm flex-1 ml-2 ${updating && "opacity-60"}`}
                  disabled={updating}
                  onPress={handleUpdate}
                >
                  {updating ? (
                    <View className="bg-white p-2 rounded-full">
                      <ActivityIndicator size="small" color="#10B981" />
                    </View>
                  ) : (
                    <Text className="text-center text-xl text-white font-semibold">
                      Update
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <ToastManager showCloseIcon={false} />
    </View>
  );
};

export default Profile;
