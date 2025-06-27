import jwt from 'jsonwebtoken';
import Staff from '../model/staff.js';
import Admin from '../model/admin.js';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Middleware for Staff
const verifyStaff = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const staff = await Staff.findById(decoded.id);
    if (!staff) return res.status(403).json({ message: 'Unauthorized Staff' });

    req.user = { _id: staff._id, role: staff.role }; // ✅ Attach to req.user
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' }); 
  }
};

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check for token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded token:", decoded);

    // ✅ FIX: Use decoded._id (not decoded.id) based on your token structure
    const userId = decoded._id || decoded.id;

    // 3. Try to find the user in Admin collection
    let user = await Admin.findById(userId);

    // 4. If not found in Admin, check Staff collection
    if (!user) {
      console.log("Checking in staff...");
      user = await Staff.findById(userId);

      if (!user) {
        console.log("User not found in both Admin and Staff collections");
        return res.status(404).json({ message: "User not found" });
      }
    }

    // 5. User found ✅
    console.log("User found:", user.username, user.role);
    req.user = user;
    next();

  } catch (err) {
    console.error("Token verify error:", err);
    return res.status(403).json({ message: "Invalid or expired token", error: err.message });
  }
};


export {
  verifyStaff,
  verifyToken
}