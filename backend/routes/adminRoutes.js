
import { Router } from "express";
import mongoose from "mongoose";

import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import { requireAuth, requireAdmin } from "../middleware/requireAuth.js";

const router = Router();

const POINTS_PER_VERIFIED_COMPLAINT = 10;

const validStatuses = [
  "Assigned",
  "In Progress",
  "Resolved",
  "Reopened",
];

// All routes in this file require an authenticated administrator.
router.use(requireAuth, requireAdmin);

// GET /api/admin/complaints
// View complaints, optionally filtered by status.
router.get("/complaints", async (req, res) => {
  try {
    const { status, page = "1", limit = "20" } = req.query;

    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number.parseInt(limit, 10) || 20)
    );

    const filter = {};

    if (status) {
      const allowedStatuses = [
        "Submitted",
        "Under Verification",
        "Verified",
        "Assigned",
        "In Progress",
        "Resolved",
        "Rejected",
        "Reopened",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid complaint status.",
        });
      }

      filter.status = status;
    }

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate("citizen", "name email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),
      Complaint.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      complaints,
    });
  } catch (error) {
    console.error("Admin complaint list error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch complaints.",
    });
  }
});

// PATCH /api/admin/complaints/:id/verify
// Verify a complaint and award points exactly once.
router.patch("/complaints/:id/verify", async (req, res) => {
  const session = await mongoose.startSession();

  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    let result;

    await session.withTransaction(async () => {
      const complaint = await Complaint.findById(req.params.id).session(
        session
      );

      if (!complaint) {
        const error = new Error("Complaint not found.");
        error.statusCode = 404;
        throw error;
      }

      if (!["Submitted", "Under Verification"].includes(complaint.status)) {
        const error = new Error(
          `This complaint cannot be verified from status "${complaint.status}".`
        );
        error.statusCode = 409;
        throw error;
      }

      const updatedComplaint = await Complaint.findOneAndUpdate(
        {
          _id: complaint._id,
          status: { $in: ["Submitted", "Under Verification"] },
          pointsAwarded: false,
        },
        {
          $set: {
            status: "Verified",
            verifiedBy: req.user._id,
            verifiedAt: new Date(),
            pointsAwarded: true,
          },
        },
        { new: true, session }
      );

      if (!updatedComplaint) {
        const error = new Error(
          "This complaint has already been processed. Refresh and try again."
        );
        error.statusCode = 409;
        throw error;
      }

      const citizen = await User.findByIdAndUpdate(
        updatedComplaint.citizen,
        { $inc: { points: POINTS_PER_VERIFIED_COMPLAINT } },
        { new: true, session }
      );

      if (!citizen) {
        throw new Error("Complaint owner was not found.");
      }

      result = {
        complaint: updatedComplaint,
        pointsAwarded: POINTS_PER_VERIFIED_COMPLAINT,
        citizenTotalPoints: citizen.points,
      };
    });

    return res.json({
      success: true,
      message: `Complaint verified. ${POINTS_PER_VERIFIED_COMPLAINT} points awarded to the citizen.`,
      ...result,
    });
  } catch (error) {
    console.error("Complaint verification error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Unable to verify the complaint right now.",
    });
  } finally {
    await session.endSession();
  }
});

// PATCH /api/admin/complaints/:id/reject
// Reject a complaint with a mandatory explanation.
router.patch("/complaints/:id/reject", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const reason =
      typeof req.body.reason === "string" ? req.body.reason.trim() : "";

    if (reason.length < 5 || reason.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Provide a rejection reason between 5 and 500 characters.",
      });
    }

    const complaint = await Complaint.findOneAndUpdate(
      {
        _id: req.params.id,
        status: { $in: ["Submitted", "Under Verification"] },
      },
      {
        $set: {
          status: "Rejected",
          rejectionReason: reason,
          verifiedBy: req.user._id,
          verifiedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!complaint) {
      const exists = await Complaint.exists({ _id: req.params.id });

      return res.status(exists ? 409 : 404).json({
        success: false,
        message: exists
          ? "Only submitted or under-verification complaints can be rejected."
          : "Complaint not found.",
      });
    }

    return res.json({
      success: true,
      message: "Complaint rejected successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Complaint rejection error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to reject the complaint right now.",
    });
  }
});

// PATCH /api/admin/complaints/:id/status
// Update the progress of a verified complaint.
router.patch("/complaints/:id/status", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const { status } = req.body;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}.`,
      });
    }

    const transitions = {
      Verified: ["Assigned"],
      Assigned: ["In Progress"],
      "In Progress": ["Resolved"],
      Resolved: ["Reopened"],
      Reopened: ["In Progress"],
    };

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    if (!transitions[complaint.status]?.includes(status)) {
      return res.status(409).json({
        success: false,
        message: `Cannot change status from "${complaint.status}" to "${status}".`,
      });
    }

    complaint.status = status;
    await complaint.save();

    return res.json({
      success: true,
      message: `Complaint status updated to ${status}.`,
      complaint,
    });
  } catch (error) {
    console.error("Complaint status update error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update complaint status.",
    });
  }
});

export default router;
