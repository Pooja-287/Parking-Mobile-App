import monthlyPass from "../model/monthlyPass.js";
import QRCode from "qrcode";
import Price from "../model/price.js";


const createMonthlyPass = async (req, res) => {
  try {
    const {
      name,
      vehicleNo,
      mobile,
      startDate,
      duration,
      endDate,
      paymentMode,
      vehicleType,
    } = req.body;

    if (
      !name || !vehicleNo || !mobile || !startDate ||
      !duration || !endDate || !vehicleType || !req.user?._id
    ) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (![3, 6, 9, 12].includes(Number(duration))) {
      return res.status(400).json({ message: "Duration must be 3, 6, 9, or 12 months" });
    }

    const upperPlate = vehicleNo.toUpperCase().replace(/\s/g, "");

    const existing = await monthlyPass.findOne({
      vehicleNo: upperPlate,
      endDate: { $gte: new Date() },
      isExpired: false,
    });

    if (existing) {
      return res.status(400).json({
        message: `Active pass already exists for ${upperPlate}. Expires on ${existing.endDate.toDateString()}`,
      });
    }

    // 💰 Get Monthly Price from DB
    const price = await Price.findOne({ adminId: req.user._id });
    const vehicleKey = vehicleType.toLowerCase();
    const rateStr = price?.monthlyPrices?.[vehicleKey];

    if (!rateStr || rateStr === "0") {
      return res.status(400).json({ message: `Monthly price not set for ${vehicleKey}` });
    }

    const monthlyRate = parseFloat(rateStr);
    if (isNaN(monthlyRate)) {
      return res.status(400).json({ message: "Invalid monthly rate" });
    }

    const calculatedAmount = monthlyRate * duration;

    const pass = new monthlyPass({
      name,
      vehicleNo: upperPlate,
      mobile,
      startDate: new Date(startDate),
      duration,
      endDate: new Date(endDate),
      amount: calculatedAmount,
      vehicleType: vehicleKey,
      paymentMode: paymentMode || "cash",
      createdBy: req.user._id,
      isExpired: new Date(endDate) < new Date(),
    });

    await pass.save();

    const qrData = `MonthlyPass:${pass._id}`;
    const qrCode = await QRCode.toDataURL(qrData);

    res.status(201).json({ message: "Monthly pass created", pass, qrCode });
  } catch (err) {
    res.status(500).json({ message: "Error creating pass", error: err.message });
  }
};

const getMontlyPass = async (req, res) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;
    let pass;

    if (id === "expired") {
      pass = await monthlyPass
        .find({ createdBy: userId, isExpired: true })
        .sort({ createdAt: -1 });
    } else if (id === "active") {
      pass = await monthlyPass
        .find({ createdBy: userId, isExpired: false })
        .sort({ createdAt: -1 });
    } else {
      // Try to find by specific ID
      pass = await monthlyPass.findOne({ _id: id, createdBy: userId });
      if (!pass) {
        return res.status(404).json({ message: "Pass not found" });
      }
    }

    return res.status(200).json(pass);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pass", error: error.message });
  }
};

const extendPass = async (req, res) => {
  try {
    const { months } = req.body;
    const passId = req.params.id;
    const parsedMonths = parseInt(months);

    if (!parsedMonths || isNaN(parsedMonths) || parsedMonths <= 0) {
      return res.status(400).json({ message: "Invalid months value" });
    }

    const pass = await monthlyPass.findById(passId);
    if (!pass) {
      return res.status(404).json({ message: "Pass not found" });
    }

    if (!pass.vehicleType) {
      return res.status(400).json({ message: "Vehicle type is missing in pass data" });
    }

    const now = new Date();
    const currentEndDate = new Date(pass.endDate);
    const baseDate = currentEndDate < now ? now : currentEndDate;

    const newEndDate = new Date(baseDate);
    newEndDate.setMonth(newEndDate.getMonth() + parsedMonths);

    const price = await Price.findOne({ adminId: pass.createdBy });
    const vehicleKey = pass.vehicleType.toLowerCase();
    const rateStr = price?.monthlyPrices?.[vehicleKey];

    if (!rateStr || rateStr === "0") {
      return res.status(400).json({ message: `Monthly price not found for ${vehicleKey}` });
    }

    const monthlyRate = parseFloat(rateStr);
    if (isNaN(monthlyRate)) {
      return res.status(400).json({ message: "Invalid monthly rate" });
    }

    const additionalAmount = monthlyRate * parsedMonths;

    pass.duration += parsedMonths;
    pass.endDate = newEndDate;
    pass.amount += additionalAmount;
    pass.isExpired = false;

    await pass.save();

    res.status(200).json({
      message: `Pass extended successfully for ${parsedMonths} months`,
      pass,
    });
  } catch (err) {
    console.error("❌ Extension error:", err);
    res.status(500).json({ message: "Extension failed", error: err.message });
  }
};


export default {
  createMonthlyPass,
  getMontlyPass,
  extendPass,
};
