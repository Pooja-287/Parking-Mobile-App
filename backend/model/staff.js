
import mongoose from 'mongoose';


const staffSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true    // actual secure password used for login
  },

  role: {
    type: String,
    enum: ['staff'],
    default: 'staff'
  },

  // ✅ Link to Admin
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
});

const Staff = mongoose.model('Staff', staffSchema);

export default Staff; // ✅ ES Module default export
