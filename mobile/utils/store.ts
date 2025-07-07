import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type user = {
  user: string | null;
  token: string | null;
  prices: object;
  Reciept: object;
  isLoading: boolean;
  isLogged: boolean;
  signup: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: any }>;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: any }>;
  logOut: () => void;
  checkIn: (
    name: string,
    vehicleNo: string,
    vehicleType: string,
    mobile: string,
    paymentMethod: string,
    days: string,
    amount: number,
    perDayRate: string
  ) => Promise<{ success: boolean; error?: any }>;
  checkOut: (tokenId: string) => Promise<{ success: boolean; error?: any }>;
};

const userAuthStore = create<user>((set) => ({
  user: null,
  token: null,
  Reciept: {},
  prices: {},
  isLogged: false,
  isLoading: false,
  signup: async (username: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        "https://q8dcnx0t-5000.inc1.devtunnels.ms/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Something went wrong!!");

      set({
        isLoading: false,
      });

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
  login: async (username: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        "https://q8dcnx0t-5000.inc1.devtunnels.ms/api/loginUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Something went wrong!!");

      const responsePrice = await fetch(
        "https://q8dcnx0t-5000.inc1.devtunnels.ms/api/getPrices",
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const data1 = await responsePrice.json();

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("prices", JSON.stringify(data1.vehicle));
      await AsyncStorage.setItem("token", data.token);

      set({
        token: data.token,
        user: data.user,
        prices: data1.vehicle,
        isLoading: false,
        isLogged: true,
      });

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  logOut: async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("prices");
    await AsyncStorage.clear();
    set({ token: null, user: null, prices: {}, isLogged: false });
  },

  checkIn: async (
    name,
    vehicleNo,
    vehicleType,
    mobile,
    paymentMethod,
    days,
    amount,
    perDayRate
  ) => {
    set({ isLoading: true });
    try {
      const user = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        "https://q8dcnx0t-5000.inc1.devtunnels.ms/api/checkin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            vehicleNo,
            vehicleType,
            mobile,
            paymentMethod,
            days,
            amount,
            perDayRate,
            user: JSON.parse(user || ""),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Something went wrong!!");

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
  checkOut: async (tokenId: string) => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        "https://q8dcnx0t-5000.inc1.devtunnels.ms/api/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tokenId,
          }),
        }
      );
      const data = await response.json();

      set({ Reciept: data });

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
}));

export default userAuthStore;
