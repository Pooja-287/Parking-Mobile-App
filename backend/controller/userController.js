// import Admin from '../model/admin'
import Admin from "../model/admin.js";
import Price from "../model/price.js";
import Staff from "../model/staff.js";

import bcrypt from "bcryptjs";
// import Price from '../model/price'
import jwt from "jsonwebtoken";
const SECRET_KEY = "your_secret_key";



//  const addPrice = async (req, res) => {
//   try {
//     const user = req.user;
//     const adminId = user.role === "admin" ? user._id : user.adminId;

//     const { dailyPrices, monthlyPrices } = req.body;

//     if (!dailyPrices && !monthlyPrices) {
//       return res.status(400).json({
//         success: false,
//         message: "At least one of dailyPrices or monthlyPrices is required.",
//       });
//     }

//     const existing = await Price.findOne({ adminId });

//     if (existing) {
//       return res.status(400).json({
//         success: false,
//         message: "Prices already exist. You can update them instead.",
//       });
//     }

//     const newPrice = new Price({
//       adminId,
//       dailyPrices: dailyPrices || {},     // optional
//       monthlyPrices: monthlyPrices || {}, // optional
//     });

//     await newPrice.save();

//     return res.status(201).json({
//       success: true,
//       message: "Prices added successfully",
//       price: newPrice,
//     });
//   } catch (error) {
//     console.error("Add Price Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };


// const updatePrice = async (req, res) => {
//   try {
//     const adminId = req.user?._id;
//     const { vehicle } = req.body;

//     if (!vehicle || typeof vehicle !== "object") {
//       return res.status(400).json({ message: "Vehicle prices are required" });
//     }

//     const updatedPrice = await Price.findOneAndUpdate(
//       { adminId },
//       { $set: { vehicle } },
//       { new: true }
//     );

//     if (!updatedPrice) {
//       return res.status(404).json({ message: "Price not found" });
//     }

//     res.status(200).json({
//       message: "Price updated successfully",
//       price: updatedPrice,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// const getPrice = async (req, res) => {
//   try {
//     const user = req.user;
//     const adminId = user.role === "admin" ? user._id : user.adminId;

//     if (!adminId) {
//       return res.status(400).json({ message: "Admin ID is required" });
//     }

//     const priceDoc = await Price.findOne({ adminId });

//     if (!priceDoc) {
//       return res.status(404).json({ message: "Price not found for the admin" });
//     }

//     res.status(200).json(priceDoc);
//   } catch (error) {
//     console.error("❌ Error in getPrice:", error.message);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };














const addDailyPrices = async (req, res) => {
  try {
    const { adminId, dailyPrices } = req.body;

    let priceDoc = await Price.findOne({ adminId });

    if (!priceDoc) {
      // Create new document with dailyPrices only
      priceDoc = new Price({
        adminId,
        dailyPrices,
      });
      await priceDoc.save();
      return res.status(201).json({ message: "Daily prices added", data: priceDoc });
    } else if (priceDoc.dailyPrices && Object.values(priceDoc.dailyPrices).some(val => val !== "0")) {
      return res.status(400).json({ message: "Daily prices already exist" });
    } else {
      priceDoc.dailyPrices = dailyPrices;
      await priceDoc.save();
      return res.status(200).json({ message: "Daily prices set", data: priceDoc });
    }
  } catch (err) {
    console.error("Add Daily Prices Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

 const addMonthlyPrices = async (req, res) => {
  try {
    const { adminId, monthlyPrices } = req.body;

    let priceDoc = await Price.findOne({ adminId });

    if (!priceDoc) {
      // Create new document with monthlyPrices only
      priceDoc = new Price({
        adminId,
        monthlyPrices,
      });
      await priceDoc.save();
      return res.status(201).json({ message: "Monthly prices added", data: priceDoc });
    } else if (priceDoc.monthlyPrices && Object.values(priceDoc.monthlyPrices).some(val => val !== "0")) {
      return res.status(400).json({ message: "Monthly prices already exist" });
    } else {
      priceDoc.monthlyPrices = monthlyPrices;
      await priceDoc.save();
      return res.status(200).json({ message: "Monthly prices set", data: priceDoc });
    }
  } catch (err) {
    console.error("Add Monthly Prices Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateDailyPrices = async (req, res) => {
  try {
    const { adminId, dailyPrices } = req.body;

    const priceDoc = await Price.findOne({ adminId });

    if (!priceDoc) {
      return res.status(404).json({ message: "Price data not found for this admin" });
    }

    priceDoc.dailyPrices = dailyPrices;
    await priceDoc.save();

    return res.status(200).json({ message: "Daily prices updated", data: priceDoc });
  } catch (error) {
    console.error("Update Daily Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateMonthlyPrices = async (req, res) => {
  try {
    const { adminId, monthlyPrices } = req.body;

    const priceDoc = await Price.findOne({ adminId });

    if (!priceDoc) {
      return res.status(404).json({ message: "Price data not found for this admin" });
    }

    priceDoc.monthlyPrices = monthlyPrices;
    await priceDoc.save();

    return res.status(200).json({ message: "Monthly prices updated", data: priceDoc });
  } catch (error) {
    console.error("Update Monthly Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPrices = async (req, res) => {
  try {
    const { adminId } = req.params;

    const priceDoc = await Price.findOne({ adminId });

    if (!priceDoc) {
      return res.status(404).json({ message: "No price data found for this admin" });
    }

    return res.status(200).json(priceDoc);
  } catch (error) {
    console.error("Get Prices Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const profileImage = req.file ? req.file.path : null; // Optional image

    // Check required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for existing admin
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }],
    });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin with optional image
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      profileImage, // Will be null if not provided
    });

    await newAdmin.save();

    // JWT token
    const token = jwt.sign(
      { id: newAdmin._id, username: newAdmin.username, role: newAdmin.role },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Response
    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
        profileImage: newAdmin.profileImage, // could be null
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    let user = await Admin.findOne({ username });
    let role = "admin";

    if (!user) {
      user = await Staff.findOne({ username });
      role = "staff";
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password (user not found)" });
    }

    // ✅ Compare with correct hashed field
    const hashed = role === "admin" ? user.password : user.hashedPassword;

    const isPasswordValid = await bcrypt.compare(password, hashed);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password (wrong password)" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        role,
        email: user.email || null,
        profileImage: user.profileImage || null,
        // Permissions: user.Permissions || []
         permissions: user.permissions, // ✅ Must be added
      },

    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


const viewProfile = async (req, res) => {
  try {
    const { _id, role } = req.user;
    let user = null;

    if (role === "admin") {
      user = await Admin.findById(_id).select("-password");
    } else if (role === "staff") {
      user = await Staff.findById(_id).select("-password");
    }
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Profile fetched successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, "-password"); // exclude password
    res.status(200).json(admins);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admins", error: error.message });
  }
};

// Get single admin by ID
const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id, "-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json(admin);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admin", error: error.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const updateData = { username };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      message: "Admin updated",
      admin: updatedAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating admin",
      error: error.message,
    });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const deleted = await Admin.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({ message: "Admin deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting admin", error: error.message });
  }
};



export default {
  // addPrice,
  // updatePrice,
  // getPrice,

   addDailyPrices,
  addMonthlyPrices,
  updateDailyPrices,
  updateMonthlyPrices,
  getPrices,
  registerAdmin,
  loginUser,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  viewProfile,
  
};
