import mongoose from 'mongoose'

const priceSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  vehicleType: {
    type: String,
    required: true
  },
  priceType: {
    type: String,
    enum: ['perHour', 'perDay'], // user will select one of these
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Price = mongoose.model('Price', priceSchema);
export default Price;