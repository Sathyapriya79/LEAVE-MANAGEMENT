
import connectDB from "../../lib/mongodb.js";
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

    const { id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid leave ID" });
    }

    if (req.method === "PATCH") {
      const leave = await Leave.findByIdAndUpdate(
        id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );

      if (!leave) {
        return res.status(404).json({ message: "Leave request not found" });
      }

      return res.status(200).json(leave);
    }

    if (req.method === "DELETE") {
      const leave = await Leave.findByIdAndDelete(id);

      if (!leave) {
        return res.status(404).json({ message: "Leave request not found" });
      }

      return res.status(200).json({ message: "Leave request deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Leave API error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
