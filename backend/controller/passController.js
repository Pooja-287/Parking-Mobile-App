import monthlyPass from "../model/monthlyPass.js";
// import { sendWhatsAppTemplate } from "../utils/sendWhatsAppTemplate.js";
import QRCode from "qrcode";

const createMonthlyPass = async (req, res) => {
  try {
    const {
      name,
      vehicleNo,
      mobile,
      startDate,
      duration,
      endDate,
      amount,
      paymentMode,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !vehicleNo ||
      !mobile ||
      !startDate ||
      !duration ||
      !endDate ||
      !amount ||
      !req.user?._id
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Validate duration
    if (![3, 6, 9, 12].includes(Number(duration))) {
      return res
        .status(400)
        .json({ message: "Duration must be 3, 6, 9, or 12 months" });
    }

    // Normalize vehicleNo
    const upperPlate = vehicleNo.toUpperCase().replace(/\s/g, "");

    // Check for existing active pass
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

    // Create new pass
    const pass = new monthlyPass({
      name,
      vehicleNo: upperPlate,
      mobile,
      startDate: new Date(startDate),
      duration,
      endDate: new Date(endDate),
      amount,
      paymentMode: paymentMode || "cash",
      createdBy: req.user._id,
      isExpired: new Date(endDate) < new Date(),
    });

    await pass.save();

    // Generate QR Code
    const qrData = ` MonthlyPass:${pass._id}`;
    const qrCode = await QRCode.toDataURL(qrData);

    // Send WhatsApp Template
    // await sendWhatsAppTemplate(mobile, "monthly_pass_created", [
    //   name,
    //   upperPlate,
    //   new Date(startDate).toDateString(),
    //   new Date(endDate).toDateString(),
    // ]);

    res.status(201).json({ message: "Monthly pass created", pass, qrCode });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating pass", error: err.message });
  }
};

const getMontlyPass = async (req, res) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;
    let pass;
    if (id == "expired") {
      pass = await monthlyPass
        .find({
          createdBy: userId,
          isExpired: true,
        })
        .sort({ createdAt: -1 });
    } else if (id == "active") {
      pass = await monthlyPass
        .find({
          createdBy: userId,
          isExpired: false,
        })
        .sort({ createdAt: -1 });
    }
    if (!pass) return res.status(400).json({ message: "Invalid Parameter" });
    return res.status(200).json(pass);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pass", error: error.message });
  }
};

const extendPass = async (req, res) => {
  try {
    const { months } = req.body;
    const passId = req.params.id;

    if (!months || isNaN(months)) {
      return res.status(400).json({ message: "Invalid months value" });
    }

    const pass = await monthlyPass.findById(passId);
    if (!pass) {
      return res.status(404).json({ message: "Pass not found" });
    }

    const now = new Date();
    const currentEndDate = new Date(pass.endDate);

    // If the pass is already expired, start extension from today
    const baseDate = currentEndDate < now ? now : currentEndDate;
    const newEndDate = new Date(
      baseDate.setMonth(baseDate.getMonth() + parseInt(months))
    );

    pass.duration += parseInt(months);
    pass.endDate = newEndDate;
    pass.isExpired = false;

    await pass.save();

    res.status(200).json({ message: "Pass extended successfully", pass });
  } catch (err) {
    console.error("Extension error:", err);
    res.status(500).json({ message: "Extension failed", error: err.message });
  }
};

export default {
  createMonthlyPass,
  getMontlyPass,
  extendPass,
};
