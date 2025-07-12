import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
type ApiResponse<T = any> = {
  success: boolean;
  error?: string;
  staff?: T;
};
type user = {
  user: string | null;
  token: string | null;
  prices: object | undefined;
  VehicleListData: ArrayLike<any> | null | undefined;
  Reciept: object;
  isLoading: boolean;
  isLogged: boolean;
  staffs: any[];
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
  ) => Promise<ApiResponse>;
  createStaff: (username: string, password: string) => Promise<ApiResponse>;
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
  ) => Promise<ApiResponse>;
  checkOut: (tokenId: string) => Promise<ApiResponse>;
  loadPricesIfNotSet: () => Promise<void>;

  vehicleList: (
    vehicle: string,
    checkType: string
  ) => Promise<{ success: boolean; error?: any }>;
  getAllStaffs: () => Promise<{
    success: boolean;
    staffs?: any[];
    error?: any;
  }>;
  getStaffTodayVehicles: () => Promise<void>;
  getStaffTodayRevenue: () => Promise<void>;
  updateStaff: (
    staffId: string,
    updates: { username?: string; password?: string }
  ) => Promise<ApiResponse>;
  deleteStaff: (
    staffId: string
  ) => Promise<{ success: boolean; error?: string }>;
};

const URL = "https://q8dcnx0t-5000.inc1.devtunnels.ms/";

const userAuthStore = create<UserAuthState>((set, get) => ({
  user: null,
  token: null,
  Reciept: {},
  prices: {},
  VehicleListData: [],
  Reciept: {},
  isLoading: false,
  isLogged: false,
  staffs: [],
  loadPricesIfNotSet: async () => {
    const stored = get().prices;
    if (!stored || Object.keys(stored).length === 0) {
      const prices = await AsyncStorage.getItem("prices");
      if (prices) set({ prices: JSON.parse(prices) });
    }
  },

  getTodayVehicles: async () => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const res = await fetch(`${BASE_URL}api/getTodayVehicle`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fetch error");
      set({
        checkins: data.checkinsCount,
        checkouts: data.checkoutsCount,
        allData: data.allDataCount,
        VehicleTotalMoney: data.money,
        PaymentMethod: data.PaymentMethod,
        fullData: data.fullData,
      });
    } catch (err: any) {
      console.error("Today vehicle error:", err.message);
    }
  },

  signup: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${BASE_URL}api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      set({ isLoading: false });
      return { success: true };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  // login: async (username: string, password: string) => {
  //   set({ isLoading: true });
  //   try {
  //     const response = await fetch(`${URL}api/loginUser`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         username,
  //         password,
  //       }),
  //     });
  //     const data = await response.json();
  //     if (!response.ok) throw new Error(data.message || "Login failed");

  //     const correctedUser = {
  //       ...data.user,
  //       _id: data.user._id || data.user.id,
  //       role: data.user.role || "user",
  //     };

  //     const responsePrice = await fetch(`${URL}api/getPrices`, {
  //       method: "get",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${data.token}`,
  //       },
  //     });

  //     const data1 = await responsePrice.json();

  //     await AsyncStorage.setItem("user", JSON.stringify(correctedUser));
  //     await AsyncStorage.setItem("token", data.token);

  //     set({
  //       user: correctedUser,
  //       token: data.token,
  //       prices: data1.vehicle,
  //       isLoading: false,
  //       isLogged: true,
  //     });

  //     return { success: true };
  //   } catch (error: any) {
  //     set({ isLoading: false });
  //     return { success: false, error: error.message };
  //   }
  // },

  
//   login: async (username: string, password: string) => {
//   set({ isLoading: true });
//   try {
//     const response = await fetch(`${URL}api/loginUser`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username, password }),
//     });

//     const data = await response.json();
//     if (!response.ok) throw new Error(data.message || "Login failed");

//     const correctedUser = {
//       ...data.user,
//       _id: data.user._id || data.user.id,
//       role: data.user.role || "user",
//     };

//     await AsyncStorage.setItem("user", JSON.stringify(correctedUser));
//     await AsyncStorage.setItem("token", data.token);

//     set({
//       user: correctedUser,
//       token: data.token,
//       isLoading: false,
//       isLogged: true,
//     });

//     console.log("Login success for:", correctedUser.role);

//     return { success: true };
//   } catch (error: any) {
//     set({ isLoading: false });
//     return { success: false, error: error.message };
//   }
// },

  login: async (username: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${URL}api/loginUser`, {
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
      if (!response.ok) throw new Error(data.message || "Login failed");

      const correctedUser = {
        ...data.user,
        _id: data.user._id || data.user.id,
        role: data.user.role || "user",
      };

      const responsePrice = await fetch(`${URL}api/getPrices`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      });

      const data1 = await responsePrice.json();

      await AsyncStorage.setItem("user", JSON.stringify(correctedUser));
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

  updateProfile: async (id, username, newPassword, avatar, oldPassword) => {
    set({ isLoading: true });
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const body: any = { username, oldPassword };
      if (newPassword) body.password = newPassword;
      if (avatar) body.avatar = avatar;

      const res = await fetch(`${BASE_URL}api/updateAdmin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      await AsyncStorage.setItem("user", JSON.stringify(data.admin));
      set({ user: data.admin, isLoading: false });
      return { success: true };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  createStaff: async (username, password) => {
    set({ isLoading: true });
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const user =
        get().user || JSON.parse((await AsyncStorage.getItem("user")) || "{}");
      const adminId = user?._id;
      const res = await fetch(`${BASE_URL}api/create/${adminId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      set({ isLoading: false });
      return { success: true };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  getAllStaffs: async () => {
    set({ isLoading: true });
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const response = await fetch(
        "https://kj8cjmpw-5000.inc1.devtunnels.ms/api/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch staff list");

      set({ staffs: data.staffs, isLoading: false });
      return { success: true, staffs: data.staffs };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
    getStaffTodayVehicles: async()=>{
    try{
      const token = get().token || (await AsyncStorage.getItem("token"));
      const response = await fetch(`https://kj8cjmpw-5000.inc1.devtunnels.ms/api/today-checkins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if(!response.ok) throw new Error(data.message || "Failed to fetch vehicles");
      console.log("Today's Vehicles:", data.vehicles);
    } catch (error: any) {
      console.log("Error getting today's vehicles:", error.message);
    }
  },

  getStaffTodayRevenue: async() => {
    try{
      const token = get().token || (await AsyncStorage.getItem("token"));
      const response = await fetch('https://kj8cjmpw-5000.inc1.devtunnels.ms/api/today-revenue', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if(response.ok) throw new Error(data.message || "Failed to fetch revenue");
      console.log("Today's revenue:", data.revenue);
    }catch (error: any) {
      console.log("Error getting revenue:", error.message);
    }
  },



  updateStaff: async (staffId: string, updates: any): Promise<ApiResponse> => {
  try {
    const token = get().token || (await AsyncStorage.getItem("token"));
    const response = await fetch(`https://kj8cjmpw-5000.inc1.devtunnels.ms/api/update/${staffId}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update staff");

    console.log("Staff updated:", data.staff);
    return { success: true, staff: data.staff };
  } catch (error: any) {
    console.log("Error updating staff:", error.message);
    return { success: false, error: error.message };
  }
},

  
  deleteStaff: async(staffId) =>{
    try{
      const token = get().token || (await AsyncStorage.getItem("token"));
      const response = await fetch(`https://kj8cjmpw-5000.inc1.devtunnels.ms/api/delete/${staffId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

       const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to delete staff");
    
    console.log("Staff deleted successfully");
    return { success: true };
  } catch (error: any) {
    console.log("Error deleting staff:", error.message);
    return { success: false, error: error.message };
  }
  },

  

  
  logOut: async () => {
    await AsyncStorage.multiRemove(["user", "token", "prices"]);
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
  ) => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem("token");
      const user = JSON.parse((await AsyncStorage.getItem("user")) || "{}");

      const res = await fetch(`${BASE_URL}api/checkin`, {
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
          user,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return { success: true };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  checkOut: async (tokenId) => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem("token");
      const user = JSON.parse((await AsyncStorage.getItem("user")) || "{}");
      const res = await fetch(`${BASE_URL}api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tokenId, user }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      set({ prices: data });
      return { success: true };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },
  vehicleList: async (vehicle: string, checkType: string) => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${URL}api/${checkType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicle,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Something went wrong!!");
      set({ VehicleListData: data.vehicle });
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

 fetchCheckins: async (vehicle = "all", staffId = "") => {
  try {
    set({ isLoading: true });
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const response = await fetch(`${URL}api/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch staff list");

      set({ staffs: data.staffs, isLoading: false });
      return { success: true, staffs: data.staffs };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
  getStaffTodayVehicles: async () => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const response = await fetch(`${URL}api/today-checkins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch vehicles");
      console.log("Today's Vehicles:", data.vehicles);
    } catch (error: any) {
      console.log("Error getting today's vehicles:", error.message);
    }
  },

  getStaffTodayRevenue: async () => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const response = await fetch(`${URL}api/today-revenue`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok)
        throw new Error(data.message || "Failed to fetch revenue");
      console.log("Today's revenue:", data.revenue);
    } catch (error: any) {
      console.log("Error getting revenue:", error.message);
    }
  },

  updateStaff: async (staffId: string, updates: any): Promise<ApiResponse> => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const response = await fetch(`${URL}api/update/${staffId}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update staff");

      console.log("Staff updated:", data.staff);
      return { success: true, staff: data.staff };
    } catch (error: any) {
      console.log("Error updating staff:", error.message);
      return { success: false, error: error.message };
    }
  },

  deleteStaff: async (staffId) => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const response = await fetch(`${URL}api/delete/${staffId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to delete staff");

      console.log("Staff deleted successfully");
      return { success: true };
    } catch (error: any) {
      console.log("Error deleting staff:", error.message);
      return { success: false, error: error.message };
    }
  },
}));

export default userAuthStore;
