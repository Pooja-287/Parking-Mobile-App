import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";


// ✅ Generic API response type
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
  ) => Promise<{ success: boolean; error?: any }>;
  createStaff: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: any }>;
  getAllStaffs: () => Promise<{ success: boolean; staffs?: any[]; error?: any }>;
   getStaffTodayVehicles: () => Promise<void>;
  getStaffTodayRevenue: () => Promise<void>;
  updateStaff: (
    staffId: string,
    updates: {username?: string; 
     password?: string 
    }
  ) => Promise<ApiResponse>; // ✅ Corrected this line
  deleteStaff: (staffId: string) => Promise<{ success: boolean; error?: string }>;

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
  loadPricesIfNotSet: () => Promise<void>;
  vehicleList: (
    vehicle: string,
    checkType: string
  ) => Promise<{ success: boolean; error?: any }>;
};

const URL = "https://q8dcnx0t-5000.inc1.devtunnels.ms/";

const userAuthStore = create<user>((set, get) => ({
  user: null,
  token: null,
  prices: {},
  Reciept: {},

  VehicleListData:[],
  isLogged: false,
  isLoading: false,
  
  staffs: [],

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
      if (!response.ok) throw new Error(data.message || "Something went wrong!");
      set({ isLoading: false });
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  login: async (username, password) => {
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
      if (!response.ok) throw new Error(data.message || "Login failed");

      // const correctedUser = {
      //   ...data.user,
      //   _id: data.user._id || data.user.id,
      //   role: data.user.role || "user",
      // };
      const correctedUser = {
  ...data.user,
  _id: data.user._id || data.user.id,
  role: (data.user.role || "user").toLowerCase(), // admin / staff
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


      await AsyncStorage.setItem("user", JSON.stringify(correctedUser));
      await AsyncStorage.setItem("token", data.token);
    const priceData = await responsePrice.json();
      set({
        user: correctedUser,
        token: data.token,
        prices: priceData.vehicle,
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

      const updateBody: any = { username, oldPassword };
      if (newPassword) updateBody.password = newPassword;
      if (avatar) updateBody.avatar = avatar;

      const response = await fetch(`${URL}api/updateAdmin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateBody),
      });

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

  createStaff: async (username, password) => {
    set({ isLoading: true });
    try {
      const token = get().token || (await AsyncStorage.getItem("token"));
      const currentUser =
        get().user || JSON.parse((await AsyncStorage.getItem("user")) || "{}");

      const adminId = (currentUser as any)?._id;
      if (!adminId) throw new Error("Admin ID not found");

      const response = await fetch(`${URL}api/create/${adminId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Staff creation failed");

      set({ isLoading: false });
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
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
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("prices");
    set({ token: null, user: null, prices: {}, isLogged: false, staffs: [] });
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
      const user = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        "https://kj8cjmpw-5000.inc1.devtunnels.ms/api/checkin",
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
            user: JSON.parse(user || ""),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Check-in failed");

      set({ isLoading: false });
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  checkOut: async (tokenId) => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        "https://kj8cjmpw-5000.inc1.devtunnels.ms/api/checkout",
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
      if (!response.ok)
        throw new Error(data.message || "Check-out failed");

      set({ prices: data, isLoading: false });
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
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
}));

export default userAuthStore;
