import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type user = {
  user: string | null;
  token: string | null;
  prices: object;
  isLoading: boolean;
  isLogged: boolean;
   staffs: any[]; // ✅ ADD THIS
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

  getAllStaffs:() => Promise<void>;
  getStaffTodayVehicles: () => Promise<void>;
  getStaffTodayRevenue: () => Promise<void>;
  updateStaff: (
    staffId: string,
    updates: {username?: string; 
     password?: string 
    }
  ) => Promise<void>;
  deleteStaff: (staffId: string) => Promise<void>;
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
  checkIn: async (name:string, vehicleNo:string, vehicleType:string, mobile:string, paymentMethod:string, days:string, amount:number) => {
    set({ isLoading: true });
    try {
      const user = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        "https://q8dcnx0t-5000.inc1.devtunnels.ms/api/checkin",
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
        throw new Error(data.message || "Something went wrong!!");

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  getAllStaffs: async () => {
    try{
      const token = get().token || (await AsyncStorage.getItem("token"));
      const response = await fetch(`https://kj8cjmpw-5000.inc1.devtunnels.ms/api/all`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if(!response.ok) throw new Error(data.message || "Failed to fetch staff list ");
      console.log("All Staffs:", data.staffs);
      set({ staffs: data.staffs});
    }catch (error: any) {
      console.log("Error getting all staffs:", error.message);
    }
  },
  getStaffTodayVehicles: async()=>{
    try{
      const token = get().token || (await AsyncStorage.getItem("token"));
      const response = await fetch(`https://kj8cjmpw-5000.inc1.devtunnels.ms/api/today-checkins`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      const data = await response.json();
      if(response.ok) throw new Error(data.message || "Failed to fetch vehicles");
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
          Authorization: `Bearer ${token}`
        },
      });
      
      const data = await response.json();
      if(response.ok) throw new Error(data.message || "Failed to fetch revenue");
      console.log("Today's revenue:", data.revenue);
    }catch (error: any) {
      console.log("Error getting revenue:", error.message);
    }
  },

  updateStaff: async(staffId, updates) => {
    try{
      const token = get().token || (await AsyncStorage.getItem("token"));
      const response = await fetch(`https://kj8cjmpw-5000.inc1.devtunnels.ms/api/update/:staffId`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if(!response.ok) throw new Error(data.message || "Failed to update staff");
      console.log("Staff updated:", data.staff);
    }catch(error:any) {
      console.log("Error updating staff:", error.message);
    }
  },

  deleteStaff: async(staffId) =>{
    try{
      const token = get().token || (await AsyncStorage.getItem("token"));
      const response = await fetch("https://kj8cjmpw-5000.inc1.devtunnels.ms/api/delete/:staffId", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if(!response.ok) throw new Error(data.message || "Failed to delete staff");
      console.log("Staff deleted successfully"); 
    }catch(error: any) {
      console.log("Error deleting staff:", error.message)
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
