// routes/APIRouter.js

import express from 'express';
const router = express.Router(); // ✅ You missed this line

import userController from '../controller/userController.js';
import { verifyToken, verifyStaff } from '../middleware/verifyToken.js';
import staffController from '../controller/staffController.js';

// Admin-only
router.post('/api/create/:id', verifyToken, staffController.createStaff);
router.get('/api/all', verifyToken, staffController.getAllStaffs);
router.put('/api/update/:staffId', verifyToken, staffController.updateStaff);
router.delete('/api/delete/:staffId', verifyToken, staffController.deleteStaff);

// Staff-only
router.get('/api/today-checkins', verifyStaff, staffController.getStaffTodayVehicles);
router.get('/api/today-revenue', verifyStaff, staffController.getStaffTodayRevenue);
router.post('/api/staff/login', staffController.staffLogin);

// Admin auth
router.post('/api/register', userController.registerAdmin);
router.post('/api/loginAdmin', verifyToken, userController.loginAdmin);
router.get('/api/getAllAdmins', verifyToken, userController.getAllAdmins);
router.get('/api/getAdminById/:id', verifyToken, userController.getAdminById);
router.put('/api/updateAdmin/:id', verifyToken, userController.updateAdmin);

export default router;
