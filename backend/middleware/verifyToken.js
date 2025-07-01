// import jwt from 'jsonwebtoken';
// import Staff from '../model/staff.js';
// import Admin from '../model/admin.js';

// const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// // Middleware for Staff
// const verifyStaff = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     const staff = await Staff.findById(decoded.id);
//     if (!staff) return res.status(403).json({ message: 'Unauthorized Staff' });

//     req.user = { _id: staff._id, role: staff.role }; // ✅ Attach to req.user
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: 'Invalid or expired token' }); 
//   }
// };





// // General JWT Verification Middleware (for Admin & Staff)
// const verifyToken = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, SECRET_KEY);
//     const userId = decoded._id || decoded.id;

//     let user = await Admin.findById(userId); // Try Admin
//     if (user) {
//       req.user = {
//         _id: user._id,
//         role: user.role || 'admin',
//       };
//       return next();
//     }

//     user = await Staff.findById(userId); // Try Staff
//     if (user) {
//       req.user = {
//         _id: user._id,
//         role: user.role || 'staff',
//       };
//       return next();
//     }

//     return res.status(404).json({ message: 'User not found' });
//   } catch (err) {
//     return res.status(403).json({ message: 'Invalid or expired token', error: err.message });
//   }
// };


// export {
//   verifyStaff,
//   verifyToken
// }









import jwt from 'jsonwebtoken';
import Staff from '../model/staff.js';
import Admin from '../model/admin.js';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

/**
 * Middleware: Verify JWT token for both Admin and Staff
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded._id || decoded.id;

    let user = await Admin.findById(userId);
    if (user) {
      req.user = {
        _id: user._id,
        role: user.role || 'admin',
        username: user.username,
      };
      return next();
    }

    user = await Staff.findById(userId);
    if (user) {
      req.user = {
        _id: user._id,
        role: user.role || 'staff',
        username: user.username,
      };
      return next();
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token', error: error.message });
  }
};

/**
 * Middleware: Only allow Admin users
 */
const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

/**
 * Middleware: Only allow Staff users
 */
const verifyStaff = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const staff = await Staff.findById(decoded._id || decoded.id);
    if (!staff) {
      return res.status(403).json({ message: 'Unauthorized Staff' });
    }

    req.user = {
      _id: staff._id,
      role: staff.role || 'staff',
      username: staff.username,
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token', error: error.message });
  }
};

export {
  verifyToken,
  verifyStaff,
  isAdmin
};
