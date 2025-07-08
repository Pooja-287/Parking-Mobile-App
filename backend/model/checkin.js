import mongoose from "mongoose";

const vehicleCheckinSchema = new mongoose.Schema(
  {
    tokenId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      default: "",
    },
    vehicleNo: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    checkInBy: {
      type: String,
      required: true,
    },
    adminId: {
      type: String,
      required: true,
    },
    isCheckedOut: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const VehicleCheckin = mongoose.model("VehicleCheckin", vehicleCheckinSchema);
export default VehicleCheckin;
