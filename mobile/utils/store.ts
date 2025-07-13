import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://q8dcnx0t-5000.inc1.devtunnels.ms/";

interface FormData {
  name: string;
  vehicleNo: string;
  mobile: string;
  vehicleType: string;
  duration: string;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  amount?: number;
  transactionId?: string;
}

interface VehicleData {
  checkins: any[];
  checkouts: any[];
  allData: any[];
  fullData: any[];
  PaymentMethod: any[];
  VehicleTotalMoney: any[];
}

interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  staff?: T;
}

interface UserAuthState extends VehicleData {
  user: any;
  token: string | null;
  prices: Record<string, any>;
  VehicleListData: any[];
  Reciept: Record<string, any>;
  isLoading: boolean;
  isLogged: boolean;
  staffs: any[];
  monthlyPassActive: any[] | null;
  monthlyPassExpired: any[] | null;

  signup: (
    username: string,
    email: string,
    password: string
  ) => Promise<ApiResponse>;
  login: (username: string, password: string) => Promise<ApiResponse>;
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
  vehicleList: (vehicle: string, checkType: string) => Promise<ApiResponse>;
  getAllStaffs: () => Promise<ApiResponse>;
  getTodayVehicles: () => Promise<void>;
  getStaffTodayRevenue: () => Promise<void>;
  updateStaff: (
    staffId: string,
    updates: { username?: string; password?: string }
  ) => Promise<ApiResponse>;
  deleteStaff: (staffId: string) => Promise<ApiResponse>;
  MonthlyPassPrices: Record<string, number>;
  createMonthlyPass: (formData: FormData) => Promise<ApiResponse>;
  getMonthlyPass: (param: any) => Promise<ApiResponse>;
  extendMonthlyPass: (passId: string, months: number) => Promise<ApiResponse>;
}

const userAuthStore = create<UserAuthState>((set, get) => ({
  user: null,
  MonthlyPassPrices: {
    "0": 0,
    "3": 300,
    "6": 550,
    "9": 800,
    "12": 1000,
  },
  token: null,
  prices: {},
  VehicleListData: [],
  Reciept: {},
  isLoading: false,
  isLogged: false,
  staffs: [],
  checkins: [],
  checkouts: [],
  allData: [],
  fullData: [],
  VehicleTotalMoney: [],
  PaymentMethod: [],
  monthlyPassActive: [],
  monthlyPassExpired: [],

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

  login: async (username, password) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${BASE_URL}api/loginUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const correctedUser = {
        ...data.user,
        _id: data.user._id || data.user.id,
        role: data.user.role || "user",
      };

      const priceRes = await fetch(`${BASE_URL}api/getPrices`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      });
      const priceData = await priceRes.json();

      await AsyncStorage.setItem("user", JSON.stringify(correctedUser));
      await AsyncStorage.setItem("token", data.token);
      get().getTodayVehicles();
      set({
        user: correctedUser,
        token: data.token,
        prices: priceData.vehicle,
        isLoading: false,
        isLogged: true,
      });

      return { success: true };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
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
    amount
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

  vehicleList: async (vehicle, checkType) => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}api/${checkType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vehicle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      set({ VehicleListData: data.vehicle });
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
      const res = await fetch(`${BASE_URL}api/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      set({ staffs: data.staffs, isLoading: false });
      return { success: true, staffs: data.staffs };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  getStaffTodayRevenue: async () => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const res = await fetch(`${BASE_URL}api/today-revenue`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      console.log("Today's revenue:", data.revenue);
    } catch (err: any) {
      console.error("Revenue error:", err.message);
    }
  },

  updateStaff: async (staffId, updates) => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const res = await fetch(`${BASE_URL}api/update/${staffId}`, {
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
      const res = await fetch(`${BASE_URL}api/delete/${staffId}`, {
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
  createMonthlyPass: async (formData) => {
    set({ isLoading: true });
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");

      const res = await fetch(`${BASE_URL}api/createMonthlyPass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          vehicleNo: formData.vehicleNo,
          mobile: formData.mobile,
          startDate: formData.startDate,
          duration: formData.duration,
          endDate: formData.endDate,
          amount:
            formData.amount || get().MonthlyPassPrices[formData.duration] || 0,
          paymentMode: formData.paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to create monthly pass");

      set({ isLoading: false });
      return { success: true, pass: data.pass, qrCode: data.qrCode };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },
  getMonthlyPass: async (param) => {
    set({ isLoading: true });
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");

      const res = await fetch(`${BASE_URL}api/getMontlyPass/${param}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to create monthly pass");

      set({ isLoading: false });

      if (param == "active") {
        set({ monthlyPassActive: data });
      } else if (param == "expired") {
        set({ monthlyPassExpired: data });
      }
      return { success: true };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },
  extendMonthlyPass: async (passId: string, months: number) => {
    const setState = set;
    setState({ isLoading: true });

    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");

      const res = await fetch(`${BASE_URL}api/extendPass/${passId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ months }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to extend pass");
      }

      // Refresh active passes
      await get().getMonthlyPass("active");

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setState({ isLoading: false });
    }
  },
}));

export default userAuthStore;
