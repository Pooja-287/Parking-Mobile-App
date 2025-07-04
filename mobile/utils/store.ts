import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type user = {
  user: string | null;
  token: string | null;
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
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: any }>;
};

const userAuthStore = create<user>((set) => ({
  user: null,
  token: null,
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
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Something went wrong!!");
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({
        token: data.token,
        user: data.user,
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
    set({ token: null, user: null, isLogged: false });
  },
  checkIn: async () => {
    
  },
}));

export default userAuthStore;








// import { create } from "zustand";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// type user = {
//   _id: string;
//   username: string;
//   email: string;
//   avatar?: string;
// };

// type AuthStore = {
//   user: user | string | null;
//   token: string | null;
//   isLoading: boolean;
//   isLogged: boolean;
//   signup: (
//     username: string,
//     email: string,
//     password: string
//   ) => Promise<{ success: boolean; error?: any }>;
//   login: (
//     username: string,
//     password: string
//   ) => Promise<{ success: boolean; error?: any }>;
//   updateProfile: (
//     id: string,
//     username: string,
//     password?: string
//   ) => Promise<{ success: boolean; error?: any }>;
//   logOut: () => Promise<void>;
//   checkIn: () => Promise<{ success: boolean; error?: any }>;
// };

// const userAuthStore = create<AuthStore>((set, get) => ({
//   user: null,
//   token: null,
//   isLoading: false,
//   isLogged: false,

//   // ✅ SIGNUP
//   signup: async (username, email, password) => {
//     set({ isLoading: true });
//     try {
//       const res = await fetch("https://kj8cjmpw-5000.inc1.devtunnels.ms/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, email, password }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Signup failed");
//       set({ isLoading: false });
//       return { success: true };
//     } catch (error: any) {
//       set({ isLoading: false });
//       return { success: false, error: error.message };
//     }
//   },

//   // ✅ LOGIN
//   login: async (username, password) => {
//     set({ isLoading: true });
//     try {
//       const res = await fetch("https://kj8cjmpw-5000.inc1.devtunnels.ms/api/loginUser", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Login failed");

//       // ✅ Ensure correct ID format
//       const correctedUser = {
//         ...data.user,
//         _id: data.user._id || data.user.id,
//       };

//       await AsyncStorage.setItem("user", JSON.stringify(correctedUser));
//       await AsyncStorage.setItem("token", data.token);

//       set({
//         user: correctedUser,
//         token: data.token,
//         isLoading: false,
//         isLogged: true,
//       });

//       return { success: true };
//     } catch (error: any) {
//       set({ isLoading: false });
//       return { success: false, error: error.message };
//     }
//   },

//   // ✅ UPDATE PROFILE
//   updateProfile: async (id, username, password) => {
//     set({ isLoading: true });
//     try {
//       let token = get().token || (await AsyncStorage.getItem("token"));

//       const res = await fetch(`https://kj8cjmpw-5000.inc1.devtunnels.ms/api/updateAdmin/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           username,
//           ...(password ? { password } : {}),
//         }),
//       });

//       const data = await res.json();
//       console.log("⬅️ Backend response:", data);

//       if (!res.ok) throw new Error(data.message || "Update failed");

//       await AsyncStorage.setItem("user", JSON.stringify(data.admin));
//       set({ user: data.admin, isLoading: false });

//       return { success: true };
//     } catch (error: any) {
//       set({ isLoading: false });
//       return { success: false, error: error.message };
//     }
//   },

//   // ✅ LOGOUT
//   logOut: async () => {
//     await AsyncStorage.removeItem("user");
//     await AsyncStorage.removeItem("token");
//     set({ user: null, token: null, isLogged: false });
//   },

//   checkIn: async () => {
//     return { success: true };
//   },
// }));

// export default userAuthStore;
