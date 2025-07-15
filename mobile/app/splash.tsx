import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  StatusBar,
  Animated,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const ParkingSplashScreen = () => {
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-30)).current;

  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    require("../assets/images/Parking-amico.png"),
    require("../assets/images/Parking-rafiki.png"),
    require("../assets/images/bike parking-amico.png"),
  ];

  const imageContents = [
    {
      title: "Start with Sign Up / Login",
      description:
        "If you’re a new user, create your account. Existing users can log in and manage their parking.",
    },
    {
      title: "Checkin and Checkout Process",
      description:
        "Add price details, then smoothly check-in and check-out your vehicles with ease.",
    },
    {
      title: "Manage Monthly Pass & Staff",
      description:
        "Create and extend monthly passes. Admins can also create multiple staff accounts.",
    },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 5000,
        useNativeDriver: true,
      }),
    ]).start();

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-green-400">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 px-6 pt-16 justify-between items-center">
        {/* Top Content */}
        <View className="items-center">
          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
             className="mt-6 px-2"
          >
            <Text className="text-4xl text-black font-bold mb-2 text-center">
              Welcome to ParkEase
            </Text>
            <Text className="text-xl text-white mb-8 opacity-90 text-center">
              Your Smart Parking Assistant
            </Text>
          </Animated.View>

          {/* Image */}
          <Animated.Image
            source={images[currentImage]}
            className="w-80 h-80"
            resizeMode="contain"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          />

          {/* Description */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="mt-6 px-4"
          >
            <Text className="text-black text-xl font-bold text-center mb-2">
              {imageContents[currentImage].title}
            </Text>
            <Text className="text-white mt-6 text-lg text-center opacity-90">
              {imageContents[currentImage].description}
            </Text>
          </Animated.View>
        </View>

       {/* Sign up Link with Icon and Outer Wrapper */}
<View className="btn-outer w-full mb-10 border border-white px-6 py-3 rounded-full">
  <Pressable
    onPress={() => navigation.navigate("login")}
    className="flex-row items-center justify-center"
  >
    <Ionicons
      name="person-add"
      size={22}
      color="#fff"
      style={{ marginRight: 8 }}
    />
    <Text className="text-white text-lg font-bold">Sign up</Text>
  </Pressable>
</View>

      </View>
    </SafeAreaView>
  );
};

export default ParkingSplashScreen;
