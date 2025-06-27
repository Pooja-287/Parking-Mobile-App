import express from 'express';
import vehicleController from '../controller/vehicleController.js';
import userController from '../controller/userController.js';
import { verifyToken, verifyStaff } from '../middleware/verifyToken.js';
import staffController from '../controller/staffController.js';


const router = express.Router();

// POST: Scan QR and perform checkout
router.post('/api/checkin', verifyToken, vehicleController.Checkin);
router.post('/api/checkout', verifyToken, vehicleController.Checkout);
router.get('/api/checkins', verifyToken, vehicleController.getCheckins);
router.get('/api/checkouts', verifyToken, vehicleController.getCheckouts);

// New routes
router.get('/api/vehicle/:id', verifyToken, vehicleController.getVehicleByNumberPlate);
router.get('/api/vehiclelist', verifyToken, vehicleController.getVehicleList);
router.get('/api/getVehicleById/:id', verifyToken, vehicleController.getVehicleById);
router.get('/api/getVehicleByToken/:id', verifyToken, vehicleController.getVehicleByToken);
router.get('/api/getRevenueReport', verifyToken, vehicleController.getRevenueReport);

// Admin-only
router.post('/api/create/:id', verifyToken, staffController.createStaff);
router.get('/api/all', verifyToken, staffController.getAllStaffs);
router.put('/api/update/:staffId', verifyToken, staffController.updateStaff);
router.delete('/api/delete/:staffId', verifyToken, staffController.deleteStaff);

// Staff-only
router.get('/api/today-checkins', verifyStaff, staffController.getStaffTodayVehicles);
router.get('/api/today-revenue', verifyStaff, staffController.getStaffTodayRevenue);
router.post('/api/staff/login', staffController.staffLogin);

// Admin management
router.post('/api/register', userController.registerAdmin);
router.post('/api/loginAdmin', verifyToken, userController.loginAdmin);
router.get('/api/getAllAdmins', verifyToken, userController.getAllAdmins);
router.get('/api/getAdminById/:id', verifyToken, userController.getAdminById);
router.put('/api/updateAdmin/:id', verifyToken, userController.updateAdmin);
router.delete('/api/deleteAdmin/delete/:id', verifyToken, userController.deleteAdmin);
router.post('/api/addPrice/:adminId/price', verifyToken, userController.addPrice);
router.put('/api/updatePrice/:adminId/price/:priceId', verifyToken, userController.updatePrice);



export default router;
