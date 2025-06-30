

// import mongoose from 'mongoose';

// const vehicleCheckinSchema = new mongoose.Schema({
//   tokenId: {
//     type: String,
//     required: true,
//     unique: true,
//     index: true
//   },
//   vehicleNumber: {
//     type: String,
//     required: true
//   },
//   vehicleType: {
//     type: String,
//     required: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   mobileNumber: {
//     type: String,
//     required: true,
//     match: /^[6-9]\d{9}$/
//   },
//   entryDateTime: {
//     type: Date,
//     default: Date.now
//   },
//   qrCode: {
//     type: String,
//     required: true
//   },
//   exitDateTime: {
//     type: Date
//   },
//   totalParkedHours: {
//     type: Number
//   },
//   totalAmount: {
//     type: Number
//   },
//   pricePerHour: {
//     type: Number
//   },
//   pricePerDay: {
//     type: Number
//   },
//   priceType: {
//     type: String,
//     enum: ['perHour', 'perDay']
//   },
//   isCheckedOut: {
//     type: Boolean,
//     default: false
//   },

//   // ✅ Who created the check-in (admin or staff)
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     refPath: 'createdByRole'
//   },
//   createdByRole: {
//     type: String,
//     enum: ['Admin', 'Staff']
//   },

//   // ✅ Who performed the checkout
//   checkedOutBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     refPath: 'checkedOutByRole'
//   },
//   checkedOutByRole: {
//     type: String,
//     enum: ['Admin', 'Staff']
//   },

//   // Optional: if an admin updates check-in data manually
//   updatedByAdmin: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Admin'
//   }
// }, { timestamps: true });

// const Checkin = mongoose.model('VehicleCheckin', vehicleCheckinSchema);
// export default Checkin;







import mongoose from 'mongoose';

const vehicleCheckinSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/
  },
  entryDateTime: {
    type: Date,
    default: Date.now
  },
  qrCode: {
    type: String,
    required: true
  },
  exitDateTime: Date,
  totalParkedHours: Number,
  totalAmount: Number,
  pricePerHour: Number,
  pricePerDay: Number,
  priceType: {
    type: String,
    enum: ['perHour', 'perDay']
  },
  isCheckedOut: {
    type: Boolean,
    default: false
  },

  // ✅ Who created it
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'createdByRole'
  },
  createdByRole: {
    type: String,
    enum: ['Admin', 'Staff']
  },

  // ✅ NEW: Track which admin owns this check-in
  adminRefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },

  // ✅ Who checked out
  checkedOutBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'checkedOutByRole'
  },
  checkedOutByRole: {
    type: String,
    enum: ['Admin', 'Staff']
  },

  updatedByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, { timestamps: true });

const VehicleCheckin = mongoose.model('VehicleCheckin', vehicleCheckinSchema);
export default VehicleCheckin;
