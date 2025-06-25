// staffController.js (ES Module version)

import Staff from '../model/staff.js';
import jwt from 'jsonwebtoken';


// 🔐 Create a staff (by admin)
const createStaff = async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminId = req.user._id;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existing = await Staff.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newStaff = new Staff({
      username,
      password,
      createdBy: adminId
    });

    await newStaff.save();
    res.status(201).json({ message: "Staff created successfully", staff: newStaff });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// 🔐 Staff Login
const staffLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const staff = await Staff.findOne({ username });
    if (!staff || staff.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { _id: staff._id, role: 'staff' },
      process.env.SECRET_KEY || 'your_secret_key',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      staff: {
        _id: staff._id,
        username: staff.username,
        password: staff.password,
        role: staff.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// 👀 Admin: View all staff
const getAllStaffs = async (req, res) => {
  try {
    const staffs = await Staff.find().select('-password');
    res.status(200).json({ staffs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff list", error: error.message });
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
const updateStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { username, password } = req.body;

    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    if (username) staff.username = username;
    if (password) staff.password = password;

    await staff.save();
    res.status(200).json({ message: "Staff updated successfully", staff });
  } catch (error) {
    res.status(500).json({ message: "Failed to update staff", error: error.message });
  }
};

// ❌ Delete a staff (admin only)
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

// ✅ Export all functions as default object
export default {
  createStaff,
  staffLogin,
  getAllStaffs,
  getStaffTodayVehicles,
  getStaffTodayRevenue,
  updateStaff,
  deleteStaff
};
