import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const URL = "https://kj8cjmpw-5000.inc1.devtunnels.ms/";

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

interface VehicleReport {
  name: string;
  numberPlate: string;
  vehicleType: string;
  amount: string;
  createdBy: string;
}

interface MonthlyPass {
  _id: string;
  name: string;
  vehicleNo: string;
  mobile: string;
  startDate: string;
  endDate: string;
  amount: number;
  duration: number;
  vehicleType: string;
  paymentMode: string;
  isExpired: boolean;
}
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
interface Staff {
  _id: string;
  username: string;
  buildingId?: {
    name: string;
  };
}

interface Report {
  role: string;
  totalVehicles: number;
  revenue: number;
  vehicles: {
    type: string;
    count: number;
    amount: number;
  }[];
}

type VehicleType = "cycle" | "bike" | "car" | "van" | "lorry" | "bus";

type PriceForm = {
  [key in VehicleType]: {
    daily: string;
    monthly: string;
  };
};

interface UserAuthState extends Partial<VehicleData> {
  user: any;
  token: string | null;
  prices: Partial<PriceForm>;
  priceData?: {
    dailyPrices?: { [key in VehicleType]?: string };
    monthlyPrices?: { [key in VehicleType]?: string };
  };
  VehicleListData: any[];
  Reciept: object;
  isLoading: boolean;
  isLogged: boolean;
  staffs: Staff[];
  permissions: string[];
  report: Report | null;
  monthlyPassActive: MonthlyPass[] | null;
  monthlyPassExpired: MonthlyPass[] | null;

  fetchRevenueReport: () => Promise<void>;

  fetchCheckins: (vehicle: string, staffId?: string) => Promise<void>;
  fetchCheckouts: (vehicle: string, staffId?: string) => Promise<void>;
  vehicleList: (
    vehicle: string,
    checkType: string,
    staffId?: string
  ) => Promise<{ success: boolean; error?: any }>;

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

  fetchPrices: (adminId: string, token: string) => Promise<void>;
  addDailyPrices: (
    adminId: string,
    dailyPrices: any,
    token: string
  ) => Promise<string>;
  addMonthlyPrices: (
    adminId: string,
    monthlyPrices: any,
    token: string
  ) => Promise<string>;
  updateDailyPrices: (
    adminId: string,
    dailyPrices: any,
    token: string
  ) => Promise<string>;
  updateMonthlyPrices: (
    adminId: string,
    monthlyPrices: any,
    token: string
  ) => Promise<string>;

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

  // vehicleList: (vehicle: string, checkType: string) => Promise<{ success: boolean; error?: any }>;
  getAllStaffs: () => Promise<{
    success: boolean;
    staffs?: Staff[];
    error?: any;
  }>;
  getStaffTodayVehicles: () => Promise<void>;
  getStaffTodayRevenue: () => Promise<void>;

  updateProfile: (
    id: string,
    username: string,
    newPassword?: string,
    avatar?: string,
    oldPassword?: string
  ) => Promise<{ success: boolean; error?: any }>;

  createStaff: (
    username: string,
    password: string,
    building: { name: string; location: string }
  ) => Promise<{ success: boolean; staff?: any; error?: any }>;

  // createStaff: (username: string, password: string) => Promise<{ success: boolean; error?: any }>;
  updateStaff: (staffId: string, updates: any) => Promise<ApiResponse>;
  deleteStaff: (
    staffId: string
  ) => Promise<{ success: boolean; error?: string }>;
  createMonthlyPass: (
    formData: FormData
  ) => Promise<{ success: boolean; error?: string; data?: any }>;
  getMonthlyPass: (
    status: "active" | "expired"
  ) => Promise<{ success: boolean; error?: string; data?: any }>;
  extendMonthlyPass: (
    passId: string,
    months: number
  ) => Promise<{ success: boolean; error?: string; data?: any }>;
}

const userAuthStore = create<UserAuthState>((set, get) => ({
  user: null,
  token: null,
  prices: {},
  priceData: {},
  isLoading: false,
  isLogged: false,
  VehicleListData: [],
  Reciept: {},
  staffs: [],
  permissions: [],
  allData: [],
  fullData: [],
  VehicleTotalMoney: [],
  PaymentMethod: [],
  checkins: [],
  checkouts: [],
  report: null,
  monthlyPassActive: null,
  monthlyPassExpired: null,

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

  login: async (username, password) => {
    try {
      set({ isLoading: true });

      console.log("Logging in with:", { username, password });

      const res = await fetch(`${URL}api/loginUser`, {
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

      await AsyncStorage.setItem("user", JSON.stringify(correctedUser));
      await AsyncStorage.setItem("token", data.token);

      get().getTodayVehicles();
      await get().fetchPrices(correctedUser._id, data.token); // ✅ fixed

      set({
        user: correctedUser,
        token: data.token,
        isLoading: false,
        isLogged: true,
        permissions: data.permissions || [],
      });

      return { success: true };
    } catch (err: any) {
      console.error("Login failed:", err.message);
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  // ✅ Fetch Prices by Admin ID
  fetchPrices: async (adminId, token) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${URL}api/getPrices/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ priceData: res.data, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
      });
    }
  },

  // ✅ Add Daily Prices
  addDailyPrices: async (adminId, dailyPrices, token) => {
    try {
      const res = await axios.post(
        `${URL}api/addPrice/daily`,
        { adminId, dailyPrices },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set((state) => ({
        priceData: {
          ...state.priceData,
          dailyPrices: res.data.data.dailyPrices,
        },
      }));
      return res.data.message;
    } catch (err: any) {
      throw err.response?.data?.message || "Failed to add daily prices";
    }
  },

  // ✅ Add Monthly Prices
  addMonthlyPrices: async (adminId, monthlyPrices, token) => {
    try {
      const res = await axios.post(
        `${URL}api/addPrice/monthly`,
        { adminId, monthlyPrices },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set((state) => ({
        priceData: {
          ...state.priceData,
          monthlyPrices: res.data.data.monthlyPrices,
        },
      }));
      return res.data.message;
    } catch (err: any) {
      throw err.response?.data?.message || "Failed to add monthly prices";
    }
  },

  // ✅ Update Daily Prices
  updateDailyPrices: async (adminId, dailyPrices, token) => {
    try {
      const res = await axios.put(
        `${URL}api/updatePrice/daily`,
        { adminId, dailyPrices },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set((state) => ({
        priceData: {
          ...state.priceData,
          dailyPrices: res.data.data.dailyPrices,
        },
      }));
      return res.data.message;
    } catch (err: any) {
      throw err.response?.data?.message || "Failed to update daily prices";
    }
  },

  // ✅ Update Monthly Prices
  updateMonthlyPrices: async (adminId, monthlyPrices, token) => {
    try {
      const res = await axios.put(
        `${URL}api/updatePrice/monthly`,
        { adminId, monthlyPrices },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set((state) => ({
        priceData: {
          ...state.priceData,
          monthlyPrices: res.data.data.monthlyPrices,
        },
      }));
      return res.data.message;
    } catch (err: any) {
      throw err.response?.data?.message || "Failed to update monthly prices";
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

  checkIn: async (
    name,
    vehicleNo,
    vehicleType,
    mobile,
    paymentMethod,
    days
  ) => {
    try {
      set({ isLoading: true });

      const token = await AsyncStorage.getItem("token");

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
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return { success: true, tokenId: data.tokenId };
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

      const res = await fetch(`${URL}api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tokenId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return { success: true, receipt: data.receipt };
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // ✅ Store embedded building info directly
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

  createStaff: async (username, password, building) => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const admin =
        get().user || JSON.parse((await AsyncStorage.getItem("user")) || "{}");
      const adminId = admin?._id;
      if (!adminId) throw new Error("Admin ID not found");

      // Now sending embedded building object
      const res = await fetch(`${URL}api/create/${adminId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          password,
          building, // 👈 should be { name: "...", location: "..." }
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return { success: true, staff: data.staff };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  fetchRevenueReport: async () => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));

      const res = await axios.get(`${URL}api/getRevenueReport`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Directly use res.data
      const report = {
        role: res.data?.role,
        totalVehicles: res.data?.totalVehicles,
        revenue: res.data?.revenue,
        vehicles: res.data?.vehicles,
      };

      console.log("✅ Today Report Fetched:", report);
      set({ report });
    } catch (error: any) {
      console.error("Zustand Revenue Report Error:", error.message);
      set({ report: null });
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
        body: JSON.stringify(updates), // Can include: username, password, permissions, building
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // ✅ Update local staff list if present in Zustand
      set((state) => ({
        staffs: state.staffs.map((staff) =>
          staff._id === staffId ? { ...staff, ...data.staff } : staff
        ),
      }));

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

  createMonthlyPass: async (formData) => {
    if (
      !formData.name ||
      !formData.vehicleNo ||
      !formData.mobile ||
      !formData.vehicleType ||
      !formData.duration ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.paymentMethod
    ) {
      return { success: false, error: "All required fields must be provided" };
    }

    try {
      set({ isLoading: true });
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");

      const res = await fetch(`${URL}api/createMonthlyPass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          vehicleNo: formData.vehicleNo.toUpperCase().replace(/\s/g, ""),
          mobile: formData.mobile,
          vehicleType: formData.vehicleType.toLowerCase(),
          startDate: formData.startDate,
          duration: Number(formData.duration),
          endDate: formData.endDate,
          amount: formData.amount,
          paymentMode: formData.paymentMethod || "cash",
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to create monthly pass");

      set({ isLoading: false });
      return { success: true, data: { pass: data.pass, qrCode: data.qrCode } };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  getMonthlyPass: async (status) => {
    if (!["active", "expired"].includes(status)) {
      return { success: false, error: "Status must be 'active' or 'expired'" };
    }

    try {
      set({ isLoading: true });
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");

      const res = await fetch(`${URL}api/getMontlyPass/${status}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch passes");

      if (status === "active") {
        set({ monthlyPassActive: data });
      } else {
        set({ monthlyPassExpired: data });
      }

      set({ isLoading: false });
      return { success: true, data };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  extendMonthlyPass: async (passId, months) => {
    if (!passId || !months || months <= 0) {
      return { success: false, error: "Pass ID and valid months are required" };
    }

    try {
      set({ isLoading: true });
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");

      const res = await fetch(`${URL}api/extendPass/${passId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ months }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to extend pass");

      await get().getMonthlyPass("active"); // Refresh the active list
      set({ isLoading: false });
      return { success: true, data };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  logOut: async () => {
    await AsyncStorage.multiRemove(["user", "token", "prices"]);
    set({
      token: null,
      user: null,
      isLogged: false,
      prices: {},

      checkins: [],
      checkouts: [],
      VehicleListData: [],
      Reciept: {},
      staffs: [],
      monthlyPassActive: null,
      monthlyPassExpired: null,
    });
  },
}));

export default userAuthStore;
