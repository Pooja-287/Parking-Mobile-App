import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type user = {
  user: string | null;
  token: string | null;
  isLoading: boolean;
  isLogged: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: any }>;
  logOut: () => void;
};

const userAuthStore = create<user>((set) => ({
  user: null,
  token: null,
  isLogged: false,
  isLoading: false,
  login: async (username: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch("http://localhost:5000/api/loginAdmin", {
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

      if (!response.ok)
        throw new Error(data.message || "Something went wrong!!");
      await AsyncStorage.setItem("user", JSON.stringify(data.admin));
      await AsyncStorage.setItem("token", data.token);

      set({
        token: data.token,
        user: data.admin,
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
    set({ token: null, user: null });
  },
}));

export default userAuthStore;
