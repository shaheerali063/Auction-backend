const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  automaticBidding: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  user_type: {
    type: String,
    enum: ['admin', 'seller', 'buyer'],
    default: 'buyer',
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
