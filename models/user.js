import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  automaticBidding: { type: Boolean, default: false },
  user_type: {
    type: String,
    enum: ["admin", "seller", "buyer"],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
