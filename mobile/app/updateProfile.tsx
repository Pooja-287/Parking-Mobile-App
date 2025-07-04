import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userAuthStore from "../utils/store";
import { useRouter } from "expo-router";

const UpdateProfile = () => {
  const { user, updateProfile } = userAuthStore();
  const router = useRouter();

  const [parsedUser, setParsedUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Load user if not in Zustand
  useEffect(() => {
    const loadUser = async () => {
      try {
        let parsed: any = null;

        if (user) {
          parsed = typeof user === "string" ? JSON.parse(user) : user;
        } else {
          const storedUser = await AsyncStorage.getItem("user");
          if (storedUser) {
            parsed = JSON.parse(storedUser);
          }
        }

        if (parsed) {
          if (parsed?.id && !parsed._id) parsed._id = parsed.id;
          setParsedUser(parsed);
          setUsername(parsed.username || "");
        } else {
          Alert.alert("Error", "User not found in storage.");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load user.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [user]);

  // ✅ Handle Profile Update
  const handleUpdate = async () => {
    console.log("👆 Save button clicked");
    if (!parsedUser || !parsedUser._id) {
      Alert.alert("Error", "User ID not found.");
      return;
    }

    const result = await updateProfile(parsedUser._id, username, password);
    console.log("⬅️ Update result:", result);

    if (result?.success) {
      Alert.alert("Success", "Profile updated successfully.", [
        { text: "OK", onPress: () => router.replace("/profile") },
      ]);
    } else {
      Alert.alert("Update Failed", result?.error || "Something went wrong.");
    }
  };

  // ✅ Loading UI
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 12 }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  // ✅ UI Form
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d1fae5", paddingHorizontal: 16 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
          <View style={{ backgroundColor: "white", padding: 24, borderRadius: 16, shadowOpacity: 0.1 }}>
            <Text style={{ fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 24 }}>
              Update Profile
            </Text>

            <Text style={{ fontSize: 18, color: "#4B5563", marginBottom: 8 }}>Username</Text>
            <TextInput
              placeholder="Enter new username"
              value={username}
              onChangeText={setUsername}
              style={{
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                marginBottom: 16,
              }}
            />

            <Text style={{ fontSize: 18, color: "#4B5563", marginBottom: 8 }}>New Password</Text>
            <TextInput
              placeholder="Enter new password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={{
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                marginBottom: 24,
              }}
            />

            <TouchableOpacity
              style={{
                backgroundColor: "#2563EB",
                paddingVertical: 16,
                borderRadius: 12,
              }}
              onPress={handleUpdate}
            >
              <Text style={{ color: "white", textAlign: "center", fontSize: 18, fontWeight: "bold" }}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdateProfile;
