import express from "express";
import vehicleController from "../controller/vehicleController.js";
import userController from "../controller/userController.js";
import {
  verifyToken,
  verifyStaff,
  isAdmin,
} from "../middleware/verifyToken.js";
import staffController from "../controller/staffController.js";
import passController from "../controller/passController.js";
import upload from "../middleware/upload.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

// POST: Scan QR and perform checkout
// router.post("/api/checkin", verifyToken,checkPermission("checkin"), vehicleController.Checkin);
// router.post("/api/checkout", verifyToken,checkPermission("checkout"), vehicleController.Checkout);
router.post("/api/checkin", verifyToken, vehicleController.Checkin);
router.post("/api/checkout", verifyToken, vehicleController.Checkout);
router.post("/api/checkins", verifyToken, vehicleController.getCheckins);

router.post("/api/checkouts", verifyToken, vehicleController.getCheckouts);
router.get("/api/checkins", verifyToken, vehicleController.getCheckins);
router.get("/api/checkouts", verifyToken, vehicleController.getCheckouts);

router.post("/api/checkouts", verifyToken, vehicleController.getCheckouts);
router.get(
  "/api/getTodayVehicle",
  verifyToken,
  vehicleController.getTodayVehicle
);

// New routes
router.get(
  "/api/vehicle/:id",
  verifyToken,
  vehicleController.getVehicleByNumberPlate
);
router.get("/api/vehiclelist", verifyToken, vehicleController.getVehicleList);
router.get(
  "/api/getVehicleById/:id",
  verifyToken,
  vehicleController.getVehicleById
);
router.get(
  "/api/getVehicleByToken/:tokenId",
  verifyToken,
  vehicleController.getVehicleByToken
);
router.get(
  "/api/getVehicleByPlate/:numberPlate",
  verifyToken,
  vehicleController.getVehicleByPlate
);
router.get(
  "/api/getRevenueReport",
  verifyToken,
  vehicleController.getRevenueReport
);

// Admin-only
router.post("/api/create/:id", verifyToken, staffController.createStaff);
router.get("/api/all", verifyToken, staffController.getAllStaffs);
router.put("/api/update/:staffId", verifyToken, staffController.updateStaff);
router.delete("/api/delete/:staffId", verifyToken, staffController.deleteStaff);
router.get(
  "/api/staff/permissions",
  verifyToken,
  checkPermission("smartGetStaffPermissions"),
  staffController.smartGetStaffPermissions
);
router.get(
  "/api/staff/permissions/:staffId",
  verifyToken,
  checkPermission("smartGetStaffPermissions"),
  isAdmin,
  staffController.smartGetStaffPermissions
);
router.put(
  "/api/updatePermissions/:staffId",
  verifyToken,
  checkPermission("updateStaffPermissions"),
  isAdmin,
  staffController.updateStaffPermissions
);
router.post(
  "/api/setPermissions/:staffId",
  verifyToken,
  checkPermission("setStaffPermissions"),
  isAdmin,
  staffController.setStaffPermissions
);
router.get("/api/profile", verifyToken, userController.viewProfile);

// Staff-only
router.get(
  "/api/today-checkins",
  verifyStaff,
  staffController.getStaffTodayVehicles
);
router.get(
  "/api/today-revenue",
  verifyStaff,
  staffController.getStaffTodayRevenue
);
router.post(
  "/api/register",
  upload.single("profileImage"),
  userController.registerAdmin
);
router.post(
  "/api/loginUser",
  upload.single("profileImage"),
  userController.loginUser
);
router.get("/api/getAllAdmins", verifyToken, userController.getAllAdmins);
router.get("/api/getAdminById/:id", verifyToken, userController.getAdminById);
router.put("/api/updateAdmin/:id", verifyToken, userController.updateAdmin);
router.delete(
  "/api/deleteAdmin/delete/:id",
  verifyToken,
  userController.deleteAdmin
);
router.post("/api/addPrice", verifyToken, userController.addPrice);
router.put("/api/updatePrice", verifyToken, userController.updatePrice);
router.get("/api/getPrices", verifyToken, userController.getPrice);

router.post(
  "/api/createMonthlyPass",
  verifyToken,
  passController.createMonthlyPass
);
router.get("/api/getMontlyPass/:id", verifyToken, passController.getMontlyPass);

router.put("/api/extendPass/:id", verifyToken, passController.extendPass);

export default router;

// import express from "express";
// import vehicleController from "../controller/vehicleController.js";
// import userController from "../controller/userController.js";
// import { verifyToken, verifyStaff, isAdmin } from "../middleware/verifyToken.js";
// import staffController from "../controller/staffController.js";
// import passController from "../controller/passController.js";
// import upload from "../middleware/upload.js";
// import { checkPermission } from "../middleware/checkPermission.js";

// const router = express.Router();

// // -------------------- 🔐 Checkin / Checkout --------------------
// router.post("/api/checkin", verifyToken, checkPermission("checkin"), vehicleController.Checkin);
// router.post("/api/checkout", verifyToken, checkPermission("checkout"), vehicleController.Checkout);
// router.get("/api/checkins", verifyToken, checkPermission("getcheckins"), vehicleController.getCheckins);
// router.get("/api/checkouts", verifyToken, checkPermission("getcheckouts"), vehicleController.getCheckouts);

// // -------------------- 🚘 Vehicle Related --------------------
// router.get("/api/vehicle/:id", verifyToken, checkPermission("getVehicleByNumberPlate"), vehicleController.getVehicleByNumberPlate);
// router.get("/api/vehiclelist", verifyToken, checkPermission("getvehicleList"), vehicleController.getVehicleList);
// router.get("/api/getVehicleById/:id", verifyToken, checkPermission("getVehicleById"), vehicleController.getVehicleById);
// router.get("/api/getVehicleByToken/:tokenId", verifyToken, checkPermission("getVehicleByToken"), vehicleController.getVehicleByToken);
// router.get("/api/getVehicleByPlate/:numberPlate", verifyToken, checkPermission("getVehicleByPlate"), vehicleController.getVehicleByPlate);
// router.get("/api/getRevenueReport", verifyToken, checkPermission("getRevenueReport"), vehicleController.getRevenueReport);

// // -------------------- 👤 Admin-Only: Staff Management --------------------
// router.post("/api/create/:id", verifyToken, checkPermission("createStaff"), staffController.createStaff);
// router.get("/api/all", verifyToken, checkPermission("getAllStaffs"), staffController.getAllStaffs);
// router.put("/api/update/:staffId", verifyToken, checkPermission("updateStaff"), staffController.updateStaff);
// router.delete("/api/delete/:staffId", verifyToken, checkPermission("deleteStaff"), staffController.deleteStaff);
// router.get("/api/staff/permissions", verifyToken, checkPermission("smartGetStaffPermissions"), staffController.smartGetStaffPermissions);
// router.get("/api/staff/permissions/:staffId", verifyToken, checkPermission("smartGetStaffPermissions"), isAdmin, staffController.smartGetStaffPermissions);
// router.put("/api/updatePermissions/:staffId", verifyToken, checkPermission("updateStaffPermissions"), isAdmin, staffController.updateStaffPermissions);
// router.post("/api/setPermissions/:staffId", verifyToken, checkPermission("setStaffPermissions"), isAdmin, staffController.setStaffPermissions);

// // -------------------- 👤 Admin Profile --------------------
// router.get("/api/profile", verifyToken, checkPermission("viewProfile"), userController.viewProfile);
// router.get("/api/getAllAdmins", verifyToken, checkPermission("getAllAdmins"), userController.getAllAdmins);
// router.get("/api/getAdminById/:id", verifyToken, checkPermission("getAdminById"), userController.getAdminById);
// router.put("/api/updateAdmin/:id", verifyToken, checkPermission("updateAdmin"), userController.updateAdmin);
// router.delete("/api/deleteAdmin/delete/:id", verifyToken, checkPermission("deleteAdmin"), userController.deleteAdmin);

// // -------------------- 💰 Prices --------------------
// router.post("/api/addPrice", verifyToken, checkPermission("addPrice"), userController.addPrice);
// router.put("/api/updatePrice", verifyToken, checkPermission("updatePrice"), userController.updatePrice);
// router.get("/api/getPrices", verifyToken, checkPermission("priceDetails"), userController.getPrice);

// // -------------------- 🎫 Monthly Pass --------------------
// router.post("/api/createMonthlyPass", verifyToken, checkPermission("createMonthlyPass"), passController.createMonthlyPass);
// router.post("/api/renewMonthlyPass/:id", verifyToken, checkPermission("renewMonthlyPass"), passController.renewMonthlyPass);

// // -------------------- 📅 Staff Reports --------------------
// router.get("/api/today-checkins", verifyStaff, checkPermission("getStaffTodayVehicles"), staffController.getStaffTodayVehicles);
// router.get("/api/today-revenue", verifyStaff, checkPermission("getStaffTodayRevenue"), staffController.getStaffTodayRevenue);

// // -------------------- 🆓 Public (No Permissions) --------------------
// router.post("/api/register", upload.single("profileImage"), userController.registerAdmin);
// router.post("/api/loginUser", upload.single("profileImage"), userController.loginUser);

// export default router;
