import VehicleCheckin from "../model/checkin.js";
import Price from "../model/price.js";
import uploadQR from "../utils/ImageLinker.js";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import Staff from "../model/staff.js";
import mongoose from "mongoose";
import { sendWhatsAppTemplate } from "../utils/sendWhatsAppTemplate.js";

const convertToISTString = (date) => {
  const istDate = new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
  return istDate;
};

const Checkin = async (req, res) => {
  try {
    const { name, vehicleNo, vehicleType, mobile, paymentMethod, days } =
      req.body;

    const user = req.user;

    if (
      !name ||
      !vehicleType ||
      !vehicleNo ||
      !mobile ||
      !paymentMethod ||
      !days
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanedPlate = vehicleNo.replace(/\s/g, "").toUpperCase();

    if (vehicleNo !== cleanedPlate) {
      return res.status(400).json({
        message: "Number plate must be in UPPERCASE without spaces.",
      });
    }

    const userRole = user.role;
    const checkInBy = user._id;
    let adminId = "";

    if (userRole === "admin") {
      adminId = checkInBy;
    } else {
      adminId = user.adminId;
    }

    const priceDoc = await Price.findOne({ adminId });

    if (
      !priceDoc ||
      !priceDoc.vehicle[vehicleType] ||
      priceDoc.vehicle[vehicleType] === "0"
    ) {
      return res.status(400).json({
        message: `Please add price for ${vehicleType} before checking in.`,
      });
    }

    const rate = Number(priceDoc.vehicle[vehicleType]);

    const alreadyCheckedIn = await VehicleCheckin.findOne({
      vehicleNo: cleanedPlate,
      isCheckedOut: false,
    });

    if (alreadyCheckedIn) {
      return res.status(400).json({
        message: `Vehicle ${cleanedPlate} is already checked in since ${convertToISTString(
          alreadyCheckedIn.createdAt
        )}`,
      });
    }

    const tokenId = uuidv4();
    const qrCode = await QRCode.toDataURL(tokenId);
    const newCheckin = new VehicleCheckin({
      name,
      vehicleNo: cleanedPlate,
      vehicleType,
      mobile,
      paymentMethod,
      days,
      perDayRate: rate,
      paidDays: days,
      amount: rate * days,
      adminId,
      checkInBy,
      tokenId,
      qrCode,
      isCheckedOut: false,
    });
    const recipientNumber = `91${mobile}`;
    const imageUrl = await uploadQR(qrCode);
    // await sendWhatsAppTemplate(recipientNumber, imageUrl, tokenId);
    await newCheckin.save();

    return res.status(201).json({
      message: "Vehicle checked in successfully",
      tokenId,
    });
  } catch (error) {
    console.error("Check-in error:", error);

    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const Checkout = async (req, res) => {
  try {
    const { tokenId } = req.body;
    const user = req.user;

    if (!tokenId) {
      return res.status(400).json({ message: "tokenId is required" });
    }

    // 1. Find check-in record
    const vehicle = await VehicleCheckin.findOne({ tokenId });

    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "No check-in found with this tokenId" });
    }

    if (vehicle.isCheckedOut) {
      return res.status(400).json({
        message: "Vehicle is already checked out",
        exitTimeIST: convertToISTString(vehicle.exitDateTime),
      });
    }

    // 2. Get adminId from JWT middleware
    const userRole = user.role;
    const userId = user._id;
    const adminId = userRole === "admin" ? userId : user.adminId;

    // 3. Get pricing info
    const priceData = await Price.findOne({ adminId });

    if (!priceData) {
      return res
        .status(404)
        .json({ message: "No pricing info found for this admin" });
    }

    const vehicleType = vehicle.vehicleType;
    const price = priceData.vehicle[vehicleType];

    if (!price) {
      return res
        .status(404)
        .json({ message: `No price found for ${vehicleType}` });
    }

    // 4. Calculate charges
    const exitTime = new Date();
    const entryTime = new Date(vehicle.entryDateTime);
    const timeDiffMs = exitTime - entryTime;
    const minutesUsed = timeDiffMs / (1000 * 60);

    let totalAmount = 0;
    let readableDuration = "";

    if (priceData.priceType === "perHour") {
      const pricePerMinute = price / 60;
      const chargeableMinutes = Math.max(1, Math.ceil(minutesUsed));
      totalAmount = parseFloat((chargeableMinutes * pricePerMinute).toFixed(2));
      readableDuration = `${chargeableMinutes} minute${
        chargeableMinutes > 1 ? "s" : ""
      }`;
    } else if (priceData.priceType === "perDay") {
      const days = timeDiffMs / (1000 * 60 * 60 * 24);
      const chargeableDays = Math.max(1, Math.ceil(days));
      totalAmount = chargeableDays * price;
      readableDuration = `${chargeableDays} day${
        chargeableDays > 1 ? "s" : ""
      }`;
    }

    // 5. Update check-out details
    vehicle.exitDateTime = exitTime;
    vehicle.totalAmount = totalAmount;
    vehicle.totalParkedHours = (timeDiffMs / (1000 * 60 * 60)).toFixed(2);
    vehicle.isCheckedOut = true;
    vehicle.checkedOutBy = user.username;
    vehicle.checkedOutByRole = userRole;

    await vehicle.save();

    // 6. Return response
    res.status(200).json({
      message: "Vehicle checked out successfully",
      receipt: {
        name: vehicle.name,
        mobileNumber: vehicle.mobile,
        vehicleType: vehicle.vehicleType,
        numberPlate: vehicle.vehicleNo,
        table: {
          entryTime: entryTime.toLocaleTimeString(),
          exitTime: exitTime.toLocaleTimeString(),
          timeUsed: readableDuration,
          priceType: priceData.priceType,
          price: `₹${price}`,
          amountPaid: `₹${totalAmount}`,
        },
      },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getCheckins = async (req, res) => {
  try {
    const userId = req.query.staffId || req.user._id; // ✅ Use staffId if passed
    const { vehicle } = req.query;

    let query = {
      isCheckedOut: false,
      checkInBy: userId,
    };

    if (vehicle && vehicle !== "all") {
      query.vehicleType = vehicle;
    }

    const checkins = await VehicleCheckin.find(query).sort({
      entryDateTime: -1,
    });

    res.status(200).json({
      count: checkins.length,
      vehicle: checkins,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getCheckouts = async (req, res) => {
  try {
    const userId = req.query.staffId || req.user._id;

    const { vehicle } = req.query; // ✅ FIXED

    let query = {
      isCheckedOut: true,
      checkInBy: userId,
    };

    if (vehicle && vehicle !== "all") {
      query.vehicleType = vehicle;
    }

    const checkouts = await VehicleCheckin.find(query).sort({
      exitDateTime: -1,
    });

    res.status(200).json({
      count: checkouts.length,
      vehicle: checkouts,
    });
  } catch (error) {
    console.error("getCheckouts error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getVehicleList = async (req, res) => {
  try {
    const { isCheckedOut, vehicleType, numberPlate } = req.query;
    const userId = req.user._id;

    const query = { checkInBy: userId }; // ✅ Correct field name

    if (isCheckedOut === "true") query.isCheckedOut = true;
    else if (isCheckedOut === "false") query.isCheckedOut = false;

    if (vehicleType) query.vehicleType = vehicleType;
    if (numberPlate)
      query.vehicleNo = numberPlate.toUpperCase().replace(/\s/g, "");

    const vehicles = await VehicleCheckin.find(query).sort({
      entryDateTime: -1,
    });

    res.status(200).json({
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    console.error("Vehicle list error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getTodayVehicle = async (req, res) => {
  try {
    const userId = req.user._id;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const checkins = await VehicleCheckin.find({
      checkInBy: userId,
      isCheckedOut: false,
      entryDateTime: { $gte: startOfToday, $lte: endOfToday },
    });

    const checkouts = await VehicleCheckin.find({
      checkInBy: userId,
      isCheckedOut: true,
      entryDateTime: { $gte: startOfToday, $lte: endOfToday },
    });

    const allData = await VehicleCheckin.find({
      checkInBy: userId,
      $or: [
        { entryDateTime: { $gte: startOfToday, $lte: endOfToday } },
        { CheckOutTime: { $gte: startOfToday, $lte: endOfToday } },
      ],
    });

    const checkinsCount = checkins.reduce((acc, curr) => {
      acc[curr.vehicleType] = (acc[curr.vehicleType] || 0) + 1;
      return acc;
    }, {});

    const checkoutsCount = checkouts.reduce((acc, curr) => {
      acc[curr.vehicleType] = (acc[curr.vehicleType] || 0) + 1;
      return acc;
    }, {});
    const allDataCount = allData.reduce((acc, curr) => {
      acc[curr.vehicleType] = (acc[curr.vehicleType] || 0) + 1;
      return acc;
    }, {});

    const allDataTotalMoney = allData.reduce((acc, curr) => {
      acc[curr.vehicleType] = (acc[curr.vehicleType] || 0) + curr.amount;
      return acc;
    }, {});
    const moneyByPaymentMethod = allData.reduce((acc, curr) => {
      acc[curr.paymentMethod] = (acc[curr.paymentMethod] || 0) + curr.amount;
      return acc;
    }, {});
    const vehicleStats = {
      checkinsCount,
      checkoutsCount,
      allDataCount,
      money: allDataTotalMoney,
      PaymentMethod: moneyByPaymentMethod,
      fullData: {
        checkins,
        checkouts,
        allData,
      },
    };

    res.status(200).json(vehicleStats);
  } catch (error) {
    console.error("getTodayVehicleReport error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.staffId || req.user._id;

    const userRole = req.user.role;

    let query = { _id: id };

    if (userRole === "admin") {
      query.adminRefId = userId;
    } else if (userRole === "staff") {
      query.createdBy = userId;
    } else {
      return res.status(403).json({ message: "Invalid user role" });
    }

    const vehicle = await VehicleCheckin.findOne(query);

    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "No vehicle found for your account with this ID" });
    }

    res.status(200).json({ vehicle });
  } catch (error) {
    console.error("getVehicleById error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getVehicleByPlate = async (req, res) => {
  try {
    const numberPlate = req.params.numberPlate.toUpperCase().replace(/\s/g, "");
    const userId = req.user._id;
    const userRole = req.user.role;

    let query = { vehicleNumber: numberPlate };

    if (userRole === "admin") {
      query.adminRefId = userId;
    } else if (userRole === "staff") {
      query.createdBy = userId;
    } else {
      return res.status(403).json({ message: "Invalid user role" });
    }

    const vehicles = await VehicleCheckin.find(query);

    if (!vehicles.length) {
      return res.status(404).json({
        message: "No vehicle found with this number plate for your account",
      });
    }

    res.status(200).json({ count: vehicles.length, vehicles });
  } catch (error) {
    console.error("getVehicleByPlate error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getVehicleByToken = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user._id); // ✅ Ensure it's ObjectId
    const userRole = req.user.role;

    let query = { tokenId };

    if (userRole === "admin") {
      query.adminRefId = userId;
    } else if (userRole === "staff") {
      query.createdBy = userId;
    } else {
      return res.status(403).json({ message: "Invalid user role" });
    }

    console.log("Query to MongoDB =>", query); // 👈 DEBUG line

    const vehicle = await VehicleCheckin.findOne(query);

    if (!vehicle) {
      return res.status(404).json({
        message: "No vehicle found with this tokenId for your account",
      });
    }

    res.status(200).json({ vehicle });
  } catch (error) {
    console.error("getVehicleByToken error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getVehicleByNumberPlate = async (req, res) => {
  try {
    const numberPlate = req.params.numberPlate.toUpperCase().replace(/\s/g, "");
    const userId = req.user._id;

    const vehicles = await VehicleCheckin.find({
      vehicleNumber: numberPlate,
      createdBy: userId,
    });

    if (!vehicles.length) {
      return res.status(404).json({
        message: `No vehicles with this number plate for your account`,
      });
    }

    res.status(200).json({ count: vehicles.length, vehicles });
  } catch (error) {
    console.error("getVehicleByNumberPlate error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getRevenueReport = async (req, res) => {
  try {
    const { from, to, vehicleType, staffId, minRevenue, maxRevenue } =
      req.query;
    const userId = req.user._id.toString();
    const userRole = capitalize(req.user.role); // 'Admin' or 'Staff'

    if (!from || !to) {
      return res
        .status(400)
        .json({ message: "Provide both 'from' and 'to' dates (YYYY-MM-DD)" });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    // Base filter
    const matchQuery = {
      isCheckedOut: true,
      exitDateTime: { $gte: fromDate, $lte: toDate },
    };

    // Build list of allowed user IDs
    let allowedIds = [userId];
    if (userRole === "Admin") {
      const staffs = await Staff.find({ createdBy: userId }).select("_id");
      allowedIds = [userId, ...staffs.map((s) => s._id.toString())];
    }
    matchQuery.createdBy = { $in: allowedIds };

    // Optional filters
    if (vehicleType) matchQuery.vehicleType = vehicleType;
    if (staffId) {
      if (userRole !== "Admin") {
        return res
          .status(403)
          .json({ message: "Only admins can filter by staffId" });
      }
      const ownStaff = await Staff.findOne({ _id: staffId, createdBy: userId });
      if (!ownStaff) {
        return res
          .status(403)
          .json({ message: "Not authorized to view this staff's data" });
      }
      matchQuery.createdBy = staffId;
    }

    // Retrieve & sort
    const allVehicles = await VehicleCheckin.find(matchQuery)
      .populate("createdBy", "username")
      .sort({ exitDateTime: -1 });

    // Apply revenue filters
    const vehicles = allVehicles.filter((v) => {
      const amt = v.totalAmount || 0;
      if (minRevenue && amt < parseFloat(minRevenue)) return false;
      if (maxRevenue && amt > parseFloat(maxRevenue)) return false;
      return true;
    });

    const totalRevenue = vehicles.reduce(
      (sum, v) => sum + (v.totalAmount || 0),
      0
    );

    // Breakdown for admins
    let staffRevenueBreakup = [];
    if (userRole === "Admin") {
      const map = new Map();
      vehicles.forEach((v) => {
        const usr = v.createdBy?.username || "Unknown";
        const sid = v.createdBy?._id?.toString() || "unknown";
        const key = `${usr}_${sid}`;
        const amt = v.totalAmount || 0;
        if (!map.has(key))
          map.set(key, { username: usr, staffId: sid, totalAmount: 0 });
        map.get(key).totalAmount += amt;
      });
      staffRevenueBreakup = Array.from(map.values()).map((e) => ({
        username: e.username,
        staffId: e.staffId,
        totalAmount: +e.totalAmount.toFixed(2),
      }));
    }

    // Response
    res.json({
      fromDate,
      toDate,
      role: userRole,
      totalRevenue: `₹${totalRevenue.toFixed(2)}`,
      totalVehicles: vehicles.length,
      vehicles: vehicles.map((v) => ({
        name: v.name,
        vehicleType: v.vehicleType,
        numberPlate: v.vehicleNumber,
        amount: `₹${v.totalAmount?.toFixed(2)}`,
        exitTime: convertToISTString(v.exitDateTime),
        createdBy: v.createdBy?.username || "N/A",
      })),
      ...(userRole === "Admin" && { staffRevenueBreakup }),
    });
  } catch (err) {
    console.error("Revenue report error:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export default {
  Checkin,
  Checkout,
  getCheckins,
  getCheckouts,
  getVehicleList,
  getTodayVehicle,
  getVehicleById,
  getVehicleByToken,
  getVehicleByNumberPlate,
  getRevenueReport,
  getVehicleByPlate,
};
