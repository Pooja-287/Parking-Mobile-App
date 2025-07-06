import mongoose from "mongoose";

const priceSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
    },
    vehicle: {
      cycle: {
        type: String,
        default: 0,
      },
      bike: {
        type: String,
        default: 0,
      },
      car: {
        type: String,
        default: 0,
      },
      van: {
        type: String,
        default: 0,
      },
      lorry: {
        type: String,
        default: 0,
      },
      bus: {
        type: String,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

const Price = mongoose.model("Price", priceSchema);
export default Price;
