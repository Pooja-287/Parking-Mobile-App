import Staff  from '../model/staff.js';
import VehicleCheckin from '../model/checkin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'

// 🔐 Create a staff (by admin)

// const createStaff = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const adminId = req.user._id; // assuming admin is logged in

//     if (!username || !password) {
//       return res.status(400).json({ message: "Username and password are required" });
//     }

//     const existing = await Staff.findOne({ username });
//     if (existing) {
//       return res.status(400).json({ message: "Username already exists" });
//     }

//     // ✅ Hash the password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newStaff = new Staff({
//       username,
//       password: hashedPassword,
//       role: 'staff', // Optional but useful
//       createdBy: adminId
//     });

//     await newStaff.save();

//     res.status(201).json({ message: "Staff created successfully", staff: newStaff });

//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new Staff({
      username,
      password,                // ✅ Store plain text (optional)
      hashedPassword,          // ✅ Store hash for login
      role: 'staff',
      createdBy: adminId
    });

    await newStaff.save();

    res.status(201).json({
      message: "Staff created successfully",
      staff: {
        _id: newStaff._id,
        username: newStaff.username,
        password: newStaff.password  // ✅ Send plain password if needed
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// 👀 Admin: View all staff
const getAllStaffs = async (req, res) => {
  try {
    const staffs = await Staff.find({ createdBy: req.user._id }).select("+password"); 
    res.status(200).json({ staffs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch staffs", error: error.message });
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





// ✅ Export all as ES module default
export default {
  createStaff,
  // staffLogin,
  getAllStaffs,
  getStaffTodayVehicles,
  getStaffTodayRevenue,
  updateStaff,
  deleteStaff
};