import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type user = {
  user: string | null;
  token: string | null;
  prices: object;
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
  updateProfile: (
    id: string,
    username: string,
    newPassword?: string,
    avatar?: string,
    oldPassword?: string
  ) => Promise<{success: boolean; error?: any} >;
 createStaff: (
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
    amount: number
  ) => Promise<{ success: boolean; error?: any }>;
};

const userAuthStore = create<user>((set, get) => ({
  user: null,
  token: null,
  prices: {},
  isLogged: false,
  isLoading: false,
  signup: async (username: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        "https://kj8cjmpw-5000.inc1.devtunnels.ms/api/register",
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
        "https://kj8cjmpw-5000.inc1.devtunnels.ms/api/loginUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });
        const data = await response.json();
        if(!response.ok) throw new Error(data.message || "Login failed");

        const correctedUser = {
          ...data.user,
          _id: data.user._id || data.user.id,
          role: data.user.role || "user",
        };

      

      const responsePrice = await fetch(
        "https://kj8cjmpw-5000.inc1.devtunnels.ms/api/getPrices",
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const data1 = await responsePrice.json();

      await AsyncStorage.setItem("user", JSON.stringify(correctedUser));
      await AsyncStorage.setItem("prices", JSON.stringify(data1.vehicle));
      await AsyncStorage.setItem("token", data.token);

      set({
        user: correctedUser,
        token: data.token,
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

  
updateProfile: async (id:string, username:string, newPassword:string, avatar:string, oldPassword:string) => {
    set({ isLoading: true });
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));

      const updateBody: any = { username, oldPassword };
      if (newPassword) updateBody.password = newPassword;
      if (avatar) updateBody.avatar = avatar;

      const response = await fetch(
        `https://kj8cjmpw-5000.inc1.devtunnels.ms/api/updateAdmin/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateBody),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");

      await AsyncStorage.setItem("user", JSON.stringify(data.admin));
      set({ user: data.admin, isLoading: false });

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  createStaff: async (username:string, password:string) => {
    set({ isLoading: true });
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const currentUser = get().user || JSON.parse(await AsyncStorage.getItem("user") || "{}");

      const adminId = (currentUser as any)?._id;
      if (!adminId) throw new Error("Admin ID not found");

      const response = await fetch(
        `https://kj8cjmpw-5000.inc1.devtunnels.ms/api/create/${adminId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Staff creation failed");

      set({ isLoading: false });
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
    set({ token: null, user: null, prices: {}, isLogged: false });
  },
 
}));

export default userAuthStore;
