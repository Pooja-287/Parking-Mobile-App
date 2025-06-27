// import Admin from '../model/admin'
import Admin from '../model/admin.js';
import Price from '../model/price.js';

import bcrypt from 'bcryptjs';
// import Price from '../model/price'
import jwt from 'jsonwebtoken';
const SECRET_KEY = 'your_secret_key'; // ✅ define or use process.env.SECRET_KEY


// Add price for a vehicle (admin only)
const addPrice = async (req, res) => {
  try {
    const adminId = req.params.adminId; // comes from route
    const { vehicleType, priceType, price } = req.body;

    const newPrice = new Price({
      adminId,
      vehicleType,
      priceType,
      price
    });

    await newPrice.save();
    res.status(201).json({ message: 'Price added successfully', price: newPrice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





const updatePrice = async (req, res) => {
  try {
    const { adminId, priceId } = req.params;
    const { vehicleType, priceType, price } = req.body;

    // Validate inputs
    if (!vehicleType || !priceType || typeof price !== 'number') {
      return res.status(400).json({ message: 'vehicleType, priceType and price are required' });
    }

    const updatedPrice = await Price.findOneAndUpdate(
      { _id: priceId, adminId },
      {
        $set: {
          vehicleType,
          priceType,
          price
        }
      },
      { new: true } // return the updated document
    );

    if (!updatedPrice) {
      return res.status(404).json({ message: 'Price not found or not owned by this admin' });
    }

    res.status(200).json({
      message: 'Price updated successfully',
      price: updatedPrice
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// 🔐 Register New Admin
const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({ username, email, password: hashedPassword });
    await newAdmin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newAdmin._id, username: newAdmin.username, role: newAdmin.role },
      SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔐 Login Admin
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// exports.loginAdmin = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     console.log("Login attempt:", username, password);

//     const admin = await Admin.findOne({ username });
//     if (!admin) {
//       console.log("Admin not found in DB");
//       return res.status(400).json({ message: 'Invalid username or password' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, admin.password);
//     if (!isPasswordValid) {
//       console.log("Password does not match");
//       return res.status(400).json({ message: 'Invalid username or password' });
//     }

//     const token = jwt.sign(
//       { id: admin._id, username: admin.username, role: admin.role },
//       SECRET_KEY,
//       { expiresIn: '1d' }
//     );

//     console.log("Login successful");
//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       admin: {
//         id: admin._id,
//         username: admin.username,
//         email: admin.email,
//         role: admin.role
//       }
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, '-password'); // exclude password
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error: error.message });
  }
};

// Get single admin by ID
const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id, '-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin', error: error.message });
  }
};

// Update admin
const updateAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const updateData = { username };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAdmin) return res.status(404).json({ message: 'Admin not found' });

    res.status(200).json({ message: 'Admin updated', admin: updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin', error: error.message });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const deleted = await Admin.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Admin not found' });

    res.status(200).json({ message: 'Admin deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin', error: error.message });
  }
};




export default {

  addPrice,
  updatePrice,
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin
};