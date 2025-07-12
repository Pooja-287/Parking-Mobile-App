import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const URL = "https://kj8cjmpw-5000.inc1.devtunnels.ms/";

interface VehicleData{
  checkins: any[];
  checkouts: any[];
  allData: any[];
  fullData: any[];
   PaymentMethod: any[];
  VehicleTotalMoney: any[];
}
interface ApiResponse<T = any>  {
  success: boolean;
  error?: string;
  staff?: T;
};

type VehicleType = "cycle" | "bike" | "car" | "van" | "lorry" | "bus";

type PriceForm = {
  [key in VehicleType]: string;
};

interface UserAuthState extends Partial<VehicleData>  {
  user: any;
  token: string | null;
  prices: Partial<PriceForm>;
  VehicleListData: any[];
  Reciept: object;
  isLoading: boolean;
  isLogged: boolean;
  staffs: any[];
  permissions: string[];
   // ✅ Add missing VehicleData fields to the user type
  // allData: any[];
  // fullData: any[];
  // PaymentMethod: any[];
  // VehicleTotalMoney: any[];
  // checkins: any[];
  // checkouts: any[];



  fetchCheckins: (vehicle: string) => Promise<void>;
  fetchCheckouts: (vehicle: string) => Promise<void>;

  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: any }>;
  logOut: () => void;

  addPrice: (vehicle: PriceForm) => Promise<{ success: boolean; error?: any }>;
  updatePrice: (vehicle: PriceForm) => Promise<{ success: boolean; error?: any }>;
  getPrices: () => Promise<{ success: boolean; error?: any }>;
  loadPricesIfNotSet: () => Promise<void>;
    getTodayVehicles: () => Promise<void>;
  checkIn: (
    name: string,
    vehicleNo: string,
    vehicleType: string,
    mobile: string,
    paymentMethod: string,
    days: string,
    amount: number
  ) => Promise<{ success: boolean; error?: any }>;

  checkOut: (tokenId: string) => Promise<{ success: boolean; error?: any }>;

  vehicleList: (vehicle: string, checkType: string) => Promise<{ success: boolean; error?: any }>;

  getAllStaffs: () => Promise<{ success: boolean; staffs?: any[]; error?: any }>;
  getStaffTodayVehicles: () => Promise<void>;
  getStaffTodayRevenue: () => Promise<void>;

  updateProfile: (
    id: string,
    username: string,
    newPassword?: string,
    avatar?: string,
    oldPassword?: string
  ) => Promise<{ success: boolean; error?: any }>;

  createStaff: (username: string, password: string) => Promise<{ success: boolean; error?: any }>;
  updateStaff: (staffId: string, updates: any) => Promise<ApiResponse>;
  deleteStaff: (staffId: string) => Promise<{ success: boolean; error?: string }>;
};

const userAuthStore = create<UserAuthState>((set, get) => ({
  user: null,
  token: null,
  prices: {},
  VehicleListData: [],
  Reciept: {},  
  isLoading: false,
  isLogged: false,
  staffs: [],
  permissions: [],
  allData: [],
  fullData: [],
  VehicleTotalMoney: [],
  PaymentMethod: [],
  checkins: [],
  checkouts: [],

  loadPricesIfNotSet: async () => {
    const currentPrices = get().prices;
    if (!currentPrices || Object.keys(currentPrices).length === 0) {
      const storedPrices = await AsyncStorage.getItem("prices");
      if (storedPrices) {
        set({ prices: JSON.parse(storedPrices) });
      }
    }
  },

  signup: async (username, email, password) => {
    try {
      set({ isLoading: true });
      const res = await fetch(`${URL}api/register`, {
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

  // login: async (username, password) => {
  //   try {
  //     set({ isLoading: true });
  //     const res = await fetch(`${URL}api/loginUser`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ username, password }),
  //     });
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message);

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
  //       permissions: data.permissions,
  //     });

  //     await get().getPrices();

  //     return { success: true };
  //   } catch (err: any) {
  //     set({ isLoading: false });
  //     return { success: false, error: err.message };
  //   }
  // },

  // getPrices: async () => {
  //   try {
  //     const token = get().token || (await AsyncStorage.getItem("token"));
  //     const res = await fetch(`${URL}api/getPrices`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message);
  //     set({ prices: data.vehicle });
  //     return { success: true };
  //   } catch (err: any) {
  //     return { success: false, error: err.message };
  //   }
  // },

  
  
  
//   login: async (username, password) => {
//   try {
//     set({ isLoading: true });

//     // Step 1: Authenticate user
//     const res = await fetch(`${URL}api/loginUser`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, password }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);

//     // Step 2: Structure user object
//     const correctedUser = {
//       ...data.user,
//       _id: data.user._id || data.user.id,
//       role: data.user.role || "user",
//     };

//     // Step 3: Save user/token locally
//     await AsyncStorage.setItem("user", JSON.stringify(correctedUser));
//     await AsyncStorage.setItem("token", data.token);

//     // Step 4: Get today's vehicle count
//     get().getTodayVehicles();

//     // Step 5: Get vehicle prices (calls the function below)
//     await get().getPrices();

//     // Step 6: Update Zustand state
//     set({
//       user: correctedUser,
//       token: data.token,
//       isLoading: false,
//       isLogged: true,
//       permissions: data.permissions || [],
//     });

//     return { success: true };
//   } catch (err: any) {
//     set({ isLoading: false });
//     return { success: false, error: err.message };
//   }
// },
// getPrices: async () => {
//   try {
//     const token = get().token || (await AsyncStorage.getItem("token"));

//     const res = await fetch(`${URL}api/getPrices`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);

//     set({ prices: data.vehicle });
//     return { success: true };
//   } catch (err: any) {
//     return { success: false, error: err.message };
//   }
// },


  login: async (username, password) => {
  try {
    set({ isLoading: true });

    // Step 1: Authenticate user
    const res = await fetch(`${URL}api/loginUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    // Step 2: Structure user object
    const correctedUser = {
      ...data.user,
      _id: data.user._id || data.user.id,
      role: data.user.role || "user",
    };

    // Step 3: Save user/token locally
    await AsyncStorage.setItem("user", JSON.stringify(correctedUser));
    await AsyncStorage.setItem("token", data.token);

    // Step 4: Call other data fetching methods
    get().getTodayVehicles();
    await get().getPrices(); // separate function

    // Step 5: Update Zustand state
    set({
      user: correctedUser,
      token: data.token,
      isLoading: false,
      isLogged: true,
      permissions: data.permissions || [],
    });

    return { success: true };
  } catch (err: any) {
    set({ isLoading: false });
    return { success: false, error: err.message };
  }
},

getPrices: async () => {
  try {
    const token = get().token || (await AsyncStorage.getItem("token"));
    const res = await fetch(`${URL}api/getPrices`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    set({ prices: data.vehicle });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
},

  
  addPrice: async (vehicle) => {
    const token = get().token;
    try {
      const res = await fetch(`${URL}api/addPrice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vehicle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      set({ prices: data.price.vehicle });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  updatePrice: async (vehicle) => {
    const token = get().token;
    try {
      const res = await fetch(`${URL}api/updatePrice`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vehicle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      set({ prices: data.price.vehicle });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },



fetchCheckins: async (vehicle = "all", staffId = "") => {
  try {
    set({ isLoading: true });
    const token = get().token || (await AsyncStorage.getItem("token"));

    const query = `vehicle=${vehicle}${staffId ? `&staffId=${staffId}` : ""}`;

    const res = await axios.get(`${URL}api/checkins?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    set({ checkins: res.data.vehicle });
  } catch (error) {
    set({ checkins: [] });
  } finally {
    set({ isLoading: false });
  }
},


fetchCheckouts: async (vehicle = "all", staffId = "") => {
  try {
    set({ isLoading: true });
    const token = get().token || (await AsyncStorage.getItem("token"));

    const query = `vehicle=${vehicle}${staffId ? `&staffId=${staffId}` : ""}`;

    const res = await axios.get(`${URL}api/checkouts?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    set({ checkouts: res.data.vehicle });
  } catch (error) {
    set({ checkouts: [] });
  } finally {
    set({ isLoading: false });
  }
},




// vehicleList: async (vehicle, checkType, staffId) => {
//   try {
//     set({ isLoading: true });
//     const token = await AsyncStorage.getItem("token");

//     const res = await fetch(`${URL}api/${checkType}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ vehicle, staffId }), // ✅ send staffId
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);

//     set({ VehicleListData: data.vehicle });
//     return { success: true };
//   } catch (err: any) {
//     return { success: false, error: err.message };
//   } finally {
//     set({ isLoading: false });
//   }
// },



  // fetchCheckins: async (vehicle = "all") => {
  //   try {
  //     set({ isLoading: true });
  //     const token = get().token || (await AsyncStorage.getItem("token"));
  //     const res = await axios.get(`${URL}api/checkins?vehicle=${vehicle}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     set({ checkins: res.data.vehicle });
  //   } catch {
  //     set({ checkins: [] });
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },

  // fetchCheckouts: async (vehicle = "all") => {
  //   try {
  //     set({ isLoading: true });
  //     const token = get().token || (await AsyncStorage.getItem("token"));
  //     const res = await axios.get(`${URL}api/checkouts?vehicle=${vehicle}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     set({ checkouts: res.data.vehicle });
  //   } catch {
  //     set({ checkouts: [] });
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },

 vehicleList: async (vehicle: string, checkType: string, staffId = "") => {
  set({ isLoading: true });
  try {
    const token = await AsyncStorage.getItem("token");

    let url = `${URL}api/${checkType}`;
    const query = `vehicle=${vehicle}${staffId ? `&staffId=${staffId}` : ""}`;
    url += `?${query}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Something went wrong!");

    set({ VehicleListData: data.vehicle || data.vehicles });
    return { success: true };
  } catch (error: any) {
    set({ isLoading: false });
    return { success: false, error: error.message };
  }
},


  checkIn: async (name, vehicleNo, vehicleType, mobile, paymentMethod, days, amount) => {
    try {
      set({ isLoading: true });
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");
      const res = await fetch(`${URL}api/checkin`, {
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
          user: JSON.parse(user || ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  checkOut: async (tokenId) => {
    try {
      set({ isLoading: true });
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");
      const res = await fetch(`${URL}api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tokenId, user: JSON.parse(user || "") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  getAllStaffs: async () => {
    try {
      set({ isLoading: true });
      const token = get().token || (await AsyncStorage.getItem("token"));
      const res = await fetch(`${URL}api/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      set({ staffs: data.staffs });
      return { success: true, staffs: data.staffs };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  getStaffTodayVehicles: async () => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const res = await fetch(`${URL}api/today-checkins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      console.log("Today's Vehicles:", data.vehicles);
    } catch (err: any) {
      console.log("Error:", err.message);
    }
  },

  getStaffTodayRevenue: async () => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const res = await fetch(`${URL}api/today-revenue`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      console.log("Today's revenue:", data.revenue);
    } catch (err: any) {
      console.log("Error:", err.message);
    }
  },
 getTodayVehicles: async () => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const res = await fetch(`${URL}api/getTodayVehicle`, {
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
  updateProfile: async (id, username, newPassword, avatar, oldPassword) => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const updateBody: any = { username, oldPassword };
      if (newPassword) updateBody.password = newPassword;
      if (avatar) updateBody.avatar = avatar;

      const res = await fetch(`${URL}api/updateAdmin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateBody),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      await AsyncStorage.setItem("user", JSON.stringify(data.admin));
      set({ user: data.admin });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  createStaff: async (username, password) => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const admin = get().user || JSON.parse((await AsyncStorage.getItem("user")) || "{}");
      const adminId = admin?._id;
      if (!adminId) throw new Error("Admin ID not found");
      const res = await fetch(`${URL}api/create/${adminId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
  

  updateStaff: async (staffId, updates) => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const res = await fetch(`${URL}api/update/${staffId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return { success: true, staff: data.staff };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  deleteStaff: async (staffId) => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const res = await fetch(`${URL}api/delete/${staffId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  logOut: async () => {
    await AsyncStorage.multiRemove(["user", "token", "prices"]);
    set({ token: null, user: null, isLogged: false, prices: {} });
  },
}));

export default userAuthStore;













