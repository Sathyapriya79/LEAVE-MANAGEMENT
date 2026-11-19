
import connectDB from "../lib/mongodb.js";
import mongoose from "mongoose";

const Leave =
  mongoose.models.Leave ||
  mongoose.model(
    "Leave",
    new mongoose.Schema({
      employeeName: { type: String, required: true },
      leaveType: { type: String, required: true },
      startDate: { type: String, required: true },
      endDate: { type: String, required: true },
      reason: { type: String, required: true },
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
    })
  );

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === "GET") {
      const leaves = await Leave.find().sort({ _id: -1 });
      return res.status(200).json(leaves);
    }

    if (req.method === "POST") {
      const leave = await Leave.create(req.body);
      return res.status(201).json(leave);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Leave API error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
