import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://kj8cjmpw-5000.inc1.devtunnels.ms/";

interface User {
  _id: string;
  username: string;
  email?: string;
  role: string;
  avatar?: string;
}

interface MonthlyPass {
  _id: string;
  code: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  status: "active" | "expired";
}

interface Staff {
  _id: string;
  username: string;
  role: string;
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
  data?: T;
}

type VehicleType = "cycle" | "bike" | "car" | "van" | "lorry" | "bus";

type PriceForm = {
  [key in VehicleType]: string;
};

interface UserAuthState extends Partial<VehicleData> {
  user: User | null;
  token: string | null;
  prices: Partial<PriceForm>;
  VehicleListData: any[];
  Reciept: object;
  isLoading: boolean;
  isLogged: boolean;
  staffs: Staff[];
  monthlyPassActive: MonthlyPass[] | null;
  monthlyPassExpired: MonthlyPass[] | null;
  permissions: string[];
  MonthlyPassPrices: Record<string, number>;

  fetchCheckins: (vehicle?: string, staffId?: string) => Promise<ApiResponse>;
  fetchCheckouts: (vehicle?: string, staffId?: string) => Promise<ApiResponse>;
  signup: (
    username: string,
    email: string,
    password: string
  ) => Promise<ApiResponse>;
  login: (username: string, password: string) => Promise<ApiResponse>;
  logOut: () => Promise<void>;
  addPrice: (vehicle: PriceForm) => Promise<ApiResponse>;
  updatePrice: (vehicle: PriceForm) => Promise<ApiResponse>;
  getPrices: () => Promise<ApiResponse>;
  loadPricesIfNotSet: () => Promise<void>;
  getTodayVehicles: () => Promise<ApiResponse>;
  checkIn: (
    name: string,
    vehicleNo: string,
    vehicleType: string,
    mobile: string,
    paymentMethod: string,
    days: string,
    amount: number
  ) => Promise<ApiResponse>;
  checkOut: (tokenId: string) => Promise<ApiResponse>;
  vehicleList: (
    vehicle: string,
    checkType: string,
    staffId?: string
  ) => Promise<ApiResponse>;
  getAllStaffs: () => Promise<ApiResponse<Staff[]>>;
  getStaffTodayVehicles: () => Promise<ApiResponse>;
  getStaffTodayRevenue: () => Promise<ApiResponse>;
  updateStaff: (
    staffId: string,
    updates: { username?: string; password?: string }
  ) => Promise<ApiResponse<Staff>>;
  deleteStaff: (staffId: string) => Promise<ApiResponse>;
  createMonthlyPass: (formData: FormData) => Promise<ApiResponse>;
  getMonthlyPass: (
    status: "active" | "expired"
  ) => Promise<ApiResponse<MonthlyPass[]>>;
  extendMonthlyPass: (passId: string, months: number) => Promise<ApiResponse>;
  updateProfile: (
    id: string,
    username: string,
    newPassword?: string,
    avatar?: string,
    oldPassword?: string
  ) => Promise<ApiResponse>;
  createStaff: (username: string, password: string) => Promise<ApiResponse>;
}

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
  monthlyPassActive: null,
  monthlyPassExpired: null,
  checkins: [],
  checkouts: [],
  MonthlyPassPrices: {
    "0": 0,
    "3": 300,
    "6": 550,
    "9": 800,
    "12": 1000,
  },

  /**
   * Loads prices from AsyncStorage if not already set in state.
   */
  loadPricesIfNotSet: async () => {
    const currentPrices = get().prices;
    if (!currentPrices || Object.keys(currentPrices).length === 0) {
      try {
        const storedPrices = await AsyncStorage.getItem("prices");
        if (storedPrices) {
          set({ prices: JSON.parse(storedPrices) });
        }
      } catch (error) {
        console.error("Failed to load prices from AsyncStorage:", error);
      }
    }
  },

  /**
   * Fetches check-in data for a vehicle type.
   */
  fetchCheckins: async (vehicle = "all", staffId = "") => {
    try {
      set({ isLoading: true });
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
      const query = `vehicle=${vehicle}${staffId ? `&staffId=${staffId}` : ""}`;
      const res = await fetch(`${BASE_URL}api/checkins?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch checkins");
      set({ checkins: data.vehicle || [] });
      return { success: true, data: data.vehicle || [] };
    } catch (err: any) {
      set({ checkins: [] });
      return { success: false, error: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Fetches check-out data for a vehicle type.
   */
  fetchCheckouts: async (vehicle = "all", staffId = "") => {
    try {
      set({ isLoading: true });
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
      const query = `vehicle=${vehicle}${staffId ? `&staffId=${staffId}` : ""}`;
      const res = await fetch(`${BASE_URL}api/checkouts?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch checkouts");
      set({ checkouts: data.vehicle || [] });
      return { success: true, data: data.vehicle || [] };
    } catch (err: any) {
      set({ checkouts: [] });
      return { success: false, error: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Signs up a new user.
   */
  signup: async (username, email, password) => {
    if (!username || !email || !password) {
      return { success: false, error: "All fields are required" };
    }
    try {
      set({ isLoading: true });
      const res = await fetch(`${BASE_URL}api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      set({ isLoading: false });
      return { success: true };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  /**
   * Logs in a user and fetches initial data.
   */
  login: async (username, password) => {
    if (!username || !password) {
      return { success: false, error: "Username and password are required" };
    }
    try {
      set({ isLoading: true });
      const res = await fetch(`${BASE_URL}api/loginUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      const correctedUser: User = {
        _id: data.user._id || data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role || "user",
        avatar: data.user.avatar,
      };

      await AsyncStorage.setItem("user", JSON.stringify(correctedUser));
      await AsyncStorage.setItem("token", data.token);

      await Promise.all([get().getTodayVehicles(), get().getPrices()]);

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

  /**
   * Fetches vehicle prices.
   */
  getPrices: async () => {
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
      const res = await fetch(`${BASE_URL}api/getPrices`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch prices");
      await AsyncStorage.setItem("prices", JSON.stringify(data.vehicle));
      set({ prices: data.vehicle });
      return { success: true, data: data.vehicle };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Adds new vehicle prices.
   */
  addPrice: async (vehicle) => {
    if (!vehicle) {
      return { success: false, error: "Vehicle prices are required" };
    }
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
      const res = await fetch(`${BASE_URL}api/addPrice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vehicle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add price");
      await AsyncStorage.setItem("prices", JSON.stringify(data.price.vehicle));
      set({ prices: data.price.vehicle });
      return { success: true, data: data.price.vehicle };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Updates vehicle prices.
   */
  updatePrice: async (vehicle) => {
    if (!vehicle) {
      return { success: false, error: "Vehicle prices are required" };
    }
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
      const res = await fetch(`${BASE_URL}api/updatePrice`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vehicle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update price");
      await AsyncStorage.setItem("prices", JSON.stringify(data.price.vehicle));
      set({ prices: data.price.vehicle });
      return { success: true, data: data.price.vehicle };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Fetches today's vehicle data.
   */
  getTodayVehicles: async () => {
    try {
      set({ isLoading: true });
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
      const res = await fetch(`${BASE_URL}api/getTodayVehicle`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch today's vehicles");
      set({
        checkins: data.checkinsCount || [],
        checkouts: data.checkoutsCount || [],
        allData: data.allDataCount || [],
        VehicleTotalMoney: data.money || [],
        PaymentMethod: data.PaymentMethod || [],
        fullData: data.fullData || [],
      });
      return { success: true, data: data };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  /**
   * Performs a vehicle check-in.
   */
  checkIn: async (
    name,
    vehicleNo,
    vehicleType,
    mobile,
    paymentMethod,
    days,
    amount
  ) => {
    if (
      !name ||
      !vehicleNo ||
      !vehicleType ||
      !mobile ||
      !paymentMethod ||
      !days
    ) {
      return { success: false, error: "All fields are required" };
    }
    try {
      set({ isLoading: true });
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
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
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Check-in failed");
      set({ isLoading: false });
      return { success: true, data: { tokenId: data.tokenId } };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  /**
   * Performs a vehicle check-out.
   */
  checkOut: async (tokenId) => {
    if (!tokenId) {
      return { success: false, error: "Token ID is required" };
    }
    try {
      set({ isLoading: true });
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
      const res = await fetch(`${BASE_URL}api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tokenId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Check-out failed");
      set({ isLoading: false, Reciept: data.receipt });
      return { success: true, data: { receipt: data.receipt } };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  /**
   * Fetches vehicle list for a specific check type.
   */
  vehicleList: async (vehicle, checkType, staffId = "") => {
    if (!vehicle || !checkType) {
      return { success: false, error: "Vehicle and check type are required" };
    }
    try {
      set({ isLoading: true });
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
      const query = `vehicle=${vehicle}${staffId ? `&staffId=${staffId}` : ""}`;
      const res = await fetch(`${BASE_URL}api/${checkType}?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch vehicle list");
      set({ VehicleListData: data.vehicle || data.vehicles || [] });
      return { success: true, data: data.vehicle || data.vehicles };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  /**
   * Fetches all staff members.
   */
  getAllStaffs: async () => {
    try {
      set({ isLoading: true });
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
      const res = await fetch(`${BASE_URL}api/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch staffs");
      set({ staffs: data.staffs || [] });
      return { success: true, data: data.staffs };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  /**
   * Fetches today's vehicles for staff.
   */
  getStaffTodayVehicles: async () => {
    try {
      set({ isLoading: true });
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
      const res = await fetch(`${BASE_URL}api/today-checkins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch today's vehicles");
      return { success: true, data: data.vehicles };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Fetches today's revenue for staff.
   */
  getStaffTodayRevenue: async () => {
    try {
      set({ isLoading: true });
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
      const res = await fetch(`${BASE_URL}api/today-revenue`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch today's revenue");
      return { success: true, data: data.revenue };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Updates user profile.
   */
  updateProfile: async (id, username, newPassword, avatar, oldPassword) => {
    if (!id || !username) {
      return { success: false, error: "ID and username are required" };
    }
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
      const updateBody: any = { username, oldPassword };
      if (newPassword) updateBody.password = newPassword;
      if (avatar) updateBody.avatar = avatar;
      const res = await fetch(`${BASE_URL}api/updateAdmin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateBody),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      const updatedUser: User = {
        _id: data.admin._id,
        username: data.admin.username,
        email: data.admin.email,
        role: data.admin.role || "user",
        avatar: data.admin.avatar,
      };
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser });
      return { success: true, data: updatedUser };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Creates a new staff member.
   */
  createStaff: async (username, password) => {
    if (!username || !password) {
      return { success: false, error: "Username and password are required" };
    }
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
      const admin =
        get().user || JSON.parse((await AsyncStorage.getItem("user")) || "{}");
      const adminId = admin?._id;
      if (!adminId) throw new Error("Admin ID not found");
      const res = await fetch(`${BASE_URL}api/create/${adminId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create staff");
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Updates a staff member.
   */
  updateStaff: async (staffId, updates) => {
    if (!staffId || !updates) {
      return { success: false, error: "Staff ID and updates are required" };
    }
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
      const res = await fetch(`${BASE_URL}api/update/${staffId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update staff");
      return { success: true, data: data.staff };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Deletes a staff member.
   */
  deleteStaff: async (staffId) => {
    if (!staffId) {
      return { success: false, error: "Staff ID is required" };
    }
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
      const res = await fetch(`${BASE_URL}api/delete/${staffId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete staff");
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Creates a monthly pass.
   */
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
          vehicleType: formData.vehicleType,
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
      return { success: true, data: { pass: data.pass, qrCode: data.qrCode } };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  /**
   * Fetches monthly passes by status (active or expired).
   */
  getMonthlyPass: async (status) => {
    if (!["active", "expired"].includes(status)) {
      return { success: false, error: "Status must be 'active' or 'expired'" };
    }
    try {
      set({ isLoading: true });
      const token = get().token || (await AsyncStorage.getItem("token"));
      if (!token) throw new Error("No token found");
      const res = await fetch(`${BASE_URL}api/passes/${status}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch monthly passes");
      const passes = Array.isArray(data.data) ? data.data : [];
      set({
        isLoading: false,
        ...(status === "active"
          ? { monthlyPassActive: passes }
          : { monthlyPassExpired: passes }),
      });
      return { success: true, data: passes };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  /**
   * Extends a monthly pass by a specified number of months.
   */
  extendMonthlyPass: async (passId, months) => {
    if (!passId || !months || months <= 0) {
      return { success: false, error: "Pass ID and valid months are required" };
    }
    try {
      set({ isLoading: true });
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
      if (!res.ok) throw new Error(data.message || "Failed to extend pass");
      await get().getMonthlyPass("active");
      set({ isLoading: false });
      return { success: true };
    } catch (err: any) {
      set({ isLoading: false });
      return { success: false, error: err.message };
    }
  },

  /**
   * Logs out the user and clears storage.
   */
  logOut: async () => {
    try {
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
    } catch (err: any) {
      console.error("Logout error:", err.message);
    }
  },
}));

export default userAuthStore;
