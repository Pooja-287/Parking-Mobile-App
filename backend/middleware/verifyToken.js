// ✅ ES Module imports
import jwt from 'jsonwebtoken';
import Staff from '../model/staff.js';
import Admin from '../model/admin.js';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// ✅ verifyStaff middleware
export const verifyStaff = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const staff = await Staff.findById(decoded.id || decoded._id);
    if (!staff) return res.status(403).json({ message: 'Unauthorized Staff' });

    req.user = { _id: staff._id, role: staff.role };
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// ✅ verifyToken middleware
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded._id || decoded.id;

    let user = await Admin.findById(userId);
    if (!user) {
      user = await Staff.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
