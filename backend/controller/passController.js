// import monthlyPass from "../model/monthlyPass.js";
// import { sendWhatsAppTemplate } from "../utils/sendWhatsAppTemplate.js";

//  const createMonthlyPass = async(req,res)=> {
//     try {
//     const{ name, vehicleNumber, mobileNumber, startDate, endDate, amount, paymentMode } = req.body;
//     const pass = new monthlyPass({
//         name,
//         vehicleNumber: vehicleNumber.toUpperCase().replace(/\s/g,''),
//         mobileNumber,
//         startDate,
//         endDate,
//         amount,
//         paymentMode,
//         createdBy: req.user._id
//     });

//     await pass.save();

//     await sendWhatsAppTemplate(mobileNumber, 'monthly Pass Created', [
//         name,
//         vehicleNumber,
//         new Date(startDate).toDateString(),
//         new Date(endDate).toDateString()
//     ]);
//       res.status(201).json({message: "Monthly pass Created", pass});
// }  catch (err) {
//     res.status(500) .json({message: "Error creating pass", error: err.message});
// }
// };

// const renewMonthlyPass = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const {monthsToAdd, amount, paymentMode} = req.body;

//         const pass = await monthlyPass.findById(id);
//         if(!pass) return res.status(404). json({message: "Pass not Found"});

//         const newEndDate = new Date(pass.endDate);
//         newEndDate.setMonth(newEndDate.getMonth() + parseInt(monthsToAdd));

//         pass.endDate = newEndDate;
//         pass.amount += amount;
//         pass.paymentMode = paymentMode;

//         await pass.save();

//         await sendWhatsAppTemplate(pass.mobileNumber, 'monthly_pass_created', [
//             pass.name,
//             pass.vehicleNumber,
//             pass.startDate.toDateString(),
//             pass.endDate.toDateString()
//         ]);

//         res.status(200).json({message: "Pass Renewed", pass});

//     } catch(err) {
//         res.status(500).json({message: "Error renewing pass", error: err.message});
//     }
// }

// export default {
//   createMonthlyPass,
//   renewMonthlyPass
// };

import monthlyPass from "../model/monthlyPass.js";
// import { sendWhatsAppTemplate } from "../utils/sendWhatsAppTemplate.js";
import QRCode from "qrcode";

// ✅ CREATE Monthly Pass
const createMonthlyPass = async (req, res) => {
  try {
    const {
      name,
      vehicleNumber,
      mobileNumber,
      startDate,
      endDate,
      amount,
      paymentMode,
    } = req.body;
    const upperPlate = vehicleNumber.toUpperCase().replace(/\s/g, "");

    // ❗ Check for existing active pass
    const existing = await monthlyPass.findOne({
      vehicleNumber: upperPlate,
      endDate: { $gte: new Date() },
      isExpired: false,
    });

    if (existing) {
      return res.status(400).json({
        message: `Active pass already exists for ${upperPlate}. Expires on ${existing.endDate.toDateString()}`,
      });
    }

    const pass = new monthlyPass({
      name,
      vehicleNumber: upperPlate,
      mobileNumber,
      startDate,
      endDate,
      amount,
      paymentMode,
      createdBy: req.user._id,
    });

    await pass.save(); // Save first to get _id

    // 🧾 Generate QR Code
    const qrData = `MonthlyPass:${pass._id}`;
    pass.qrCode = await QRCode.toDataURL(qrData);
    await pass.save(); // Save QR

    // 📩 Send WhatsApp Template
    await sendWhatsAppTemplate(mobileNumber, "monthly_pass_created", [
      name,
      upperPlate,
      new Date(startDate).toDateString(),
      new Date(endDate).toDateString(),
    ]);

    res.status(201).json({ message: "Monthly pass created", pass });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating pass", error: err.message });
  }
};

// ✅ RENEW Monthly Pass
const renewMonthlyPass = async (req, res) => {
  try {
    const { id } = req.params;
    const { monthsToAdd, amount, paymentMode } = req.body;

    const pass = await monthlyPass.findById(id);
    if (!pass) return res.status(404).json({ message: "Pass not found" });

    const newEndDate = new Date(pass.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + parseInt(monthsToAdd));

    pass.endDate = newEndDate;
    pass.amount += amount;
    pass.paymentMode = paymentMode;

    await pass.save();

    await sendWhatsAppTemplate(pass.mobileNumber, "monthly_pass_created", [
      pass.name,
      pass.vehicleNumber,
      pass.startDate.toDateString(),
      pass.endDate.toDateString(),
    ]);

    res.status(200).json({ message: "Pass renewed", pass });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error renewing pass", error: err.message });
  }
};

export default {
  createMonthlyPass,
  renewMonthlyPass,
};
