import mongoose from "mongoose";

//Creating Assignment Schema for mongodb collection
const AssignmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
  task: { type: String, required: true },
  admin: {
    type: String,
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

export const Assignment = mongoose.model("Assignment", AssignmentSchema);
