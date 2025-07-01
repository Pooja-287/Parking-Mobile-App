import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type user = {
  user: string | null;
  token: string | null;
  isLoading: boolean;
  // login:
  logOut: () => void;
};

const userAuthStore = create<user>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  login: async () => {},
  logOut: async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    set({ token: null, user: null });
  },
}));

export default userAuthStore;
