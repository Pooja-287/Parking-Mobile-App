// src/utils/permissionStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const URL = "https://kj8cjmpw-5000.inc1.devtunnels.ms/";

type PermissionState = {
  getStaffPermissions: (staffId?: string) => Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }>;
  setPermissions: (staffId: string, permissions: string[]) => Promise<{
    success: boolean;
    error?: string;
  }>;
  updatePermissions: (staffId: string, permissions: string[]) => Promise<{
    success: boolean;
    error?: string;
  }>;
};

const permissionStore = create<PermissionState>((set, get) => ({

  
  // getStaffPermissions: async (staffId?: string) => {
  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     let url = `${URL}api/staff/permissions/${staffId}`;
  //     if (staffId) url += `/${staffId}`;

  //     const response = await fetch(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await response.json();
  //     if (!response.ok) throw new Error(data.message || "Failed to fetch permissions");

  //     return { success: true, data };
  //   } catch (error: any) {
  //     return { success: false, error: error.message };
  //   }
  // },


  getStaffPermissions: async (staffId?: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    let url = `${URL}api/staff/permissions`;
    if (staffId) url += `/${staffId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch permissions");

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
},


  setPermissions: async (staffId: string, permissions: string[]) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${URL}api/staff/permissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ staffId, permissions }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to set permissions");

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  updatePermissions: async (staffId: string, permissions: string[]) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${URL}api/updatePermissions/${staffId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ permissions }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update permissions");

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
}));

export default permissionStore;
















