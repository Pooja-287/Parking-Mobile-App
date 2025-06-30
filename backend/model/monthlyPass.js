// import mongoose from "mongoose";

// const monthlyPassSchema = new mongoose.Schema({
//     name: String,
//     vehicleNumber: String,
//     mobileNumber: String,
//     startDate: Date,
//     endDate: Date,
//     amount: Number,
//     paymentMode: {type: String, enum: ['cash', 'online'], default: 'cash'},
//     paymentStatus:{type: String, enum:['paid', 'unpaid'], default:'paid'},
//     transactionId: {type: String, default: null},
//     createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'Staff'},
    
// },{ timestamps: true });

// export default mongoose.model("MonthlyPass", monthlyPassSchema);





import mongoose from "mongoose";

const monthlyPassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    enum: ['cash', 'online'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'paid'
  },
  transactionId: {
    type: String,
    default: null
  },
  isExpired: {
    type: Boolean,
    default: false // ✅ For auto expiry tracking via cron
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model("MonthlyPass", monthlyPassSchema);
