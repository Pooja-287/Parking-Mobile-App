import Staff  from '../model/staff.js';
import VehicleCheckin from '../model/checkin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'



const createStaff = async (req, res) => {
  try {
    const { username, password, permissions = [] } = req.body;
    const adminId = req.user._id; // ✅ Extracting admin ID from logged-in admin

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check for existing username
    const existing = await Staff.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new staff document
    const newStaff = new Staff({
      username,
      password,                // Only for development/debug; remove in production
      hashedPassword,
      role: "staff",
      adminId,        
      permissions
    });

    await newStaff.save();

    res.status(201).json({
      message: "Staff created successfully",
      staff: {
        _id: newStaff._id,
        username: newStaff.username,
        password: newStaff.password,
        permissions: newStaff.permissions
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};









const getAllStaffs = async (req, res) => {
  try {
    const adminId = req.user._id; // Logged-in admin's ID

    const staffs = await Staff.find({ adminId }).select('-hashedPassword');

    res.status(200).json({ staffs });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch staff users', error: error.message });
  }
};





// 👨‍🔧 Staff: View today’s check-in/checkout
const getStaffTodayVehicles = async (req, res) => {
  try {
    const staffId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const vehicles = await VehicleCheckin.find({
      staffId,
      entryDateTime: { $gte: today }
    });

    res.status(200).json({ vehicles });

  } catch (error) {
    res.status(500).json({ message: "Failed to get vehicle list", error: error.message });
  }
};

// 💰 Staff: Get today’s revenue
const getStaffTodayRevenue = async (req, res) => {
  try {
    const staffId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkouts = await VehicleCheckin.find({
      staffId,
      isCheckedOut: true,
      exitDateTime: { $gte: today }
    });

    const revenue = checkouts.reduce((sum, v) => sum + (v.totalAmount || 0), 0);

    res.status(200).json({ revenue: `₹${revenue.toFixed(2)}` });

  } catch (error) {
    res.status(500).json({ message: "Failed to calculate revenue", error: error.message });
  }
};

// 🛠️ Update staff info (admin only)
// const updateStaff = async (req, res) => {
//   try {
//     const { staffId } = req.params;
//     const { username, password } = req.body;

//     const staff = await Staff.findById(staffId);
//     if (!staff) return res.status(404).json({ message: "Staff not found" });

//     if (username) staff.username = username;
//     if (password) staff.password = password; // Add hash here if using bcrypt

//     await staff.save();
//     res.status(200).json({ message: "Staff updated successfully", staff });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update staff", error: error.message });
//   }
// };






const updateStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { username, password } = req.body;

    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    if (username) staff.username = username;
    if (password) {
      staff.password = password; // plain text – only for display
      staff.hashedPassword = await bcrypt.hash(password, 10); // hashed for login
    }

    await staff.save();
    res.status(200).json({ message: "Updated", staff });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};


    
const deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.params;

    const staff = await Staff.findByIdAndDelete(staffId);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete staff", error: error.message });
  }
};


 const smartGetStaffPermissions = async (req, res) => {
  const { role, _id } = req.user;
  const { staffId } = req.params;

  if (role === "staff" && !staffId) {
    const staff = await Staff.findById(_id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    return res.status(200).json({ staffId: staff._id, username: staff.username, permissions: staff.permissions });
  }

  if (role === "admin" && staffId) {
    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    return res.status(200).json({ staffId: staff._id, username: staff.username, permissions: staff.permissions });
  }

  return res.status(403).json({ message: "Access denied" });
};



const setStaffPermissions = async (req, res) => {
  try {
    const { staffId, permissions } = req.body;

    if (!staffId || !Array.isArray(permissions)) {
      return res.status(400).json({ message: "Staff ID and permissions array are required" });
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    staff.permissions = permissions;
    await staff.save();

    res.status(200).json({
      message: "Permissions set successfully",
      staff: {
        _id: staff._id,
        username: staff.username,
        permissions: staff.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error setting permissions", error: error.message });
  }
};

const updateStaffPermissions = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: "Permissions must be an array" });
    }

    const staff = await Staff.findByIdAndUpdate(
      staffId,
      { permissions },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({
      message: "Permissions updated successfully",
      staff: {
        _id: staff._id,
        username: staff.username,
        permissions: staff.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating permissions", error: error.message });
  }
};





// ✅ Export all as ES module default
export default {
  createStaff,
  // staffLogin,
  getAllStaffs,
  getStaffTodayVehicles,
  getStaffTodayRevenue,
  updateStaff,
  deleteStaff,
smartGetStaffPermissions,
  setStaffPermissions,
  updateStaffPermissions,
};