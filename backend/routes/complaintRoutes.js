
import { Router } from "express";
import mongoose from "mongoose";
import { Readable } from "node:stream";

import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/requireAuth.js";
import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/uploadEvidence.js";

const router = Router();

const allowedCategories = [
  "Garbage",
  "Road Damage",
  "Water Supply",
  "Drainage",
  "Streetlight",
  "Public Sanitation",
  "Other",
];

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

const publicFields =
  "title description category location status evidence createdAt updatedAt";

// =====================================================
// COMMUNITY LEADERBOARD
// GET /api/complaints/leaderboard
// =====================================================

router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await User.find({
      role: "citizen",
      isActive: true,
    })
      .select("name points")
      .sort({ points: -1, name: 1 })
      .limit(100)
      .lean();

    return res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error("Leaderboard error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load the leaderboard.",
    });
  }
});

// =====================================================
// SUBMIT A COMPLAINT
// POST /api/complaints
// =====================================================

router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof category !== "string" ||
      !location ||
      typeof location.address !== "string" ||
      !Array.isArray(location.coordinates)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required complaint details.",
      });
    }

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanAddress = location.address.trim();
    const [longitude, latitude] = location.coordinates;

    if (
      cleanTitle.length < 5 ||
      cleanTitle.length > 120 ||
      cleanDescription.length < 10 ||
      cleanDescription.length > 2000 ||
      cleanAddress.length < 3 ||
      cleanAddress.length > 300
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please check the title, description, and address lengths.",
      });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint category.",
      });
    }

    if (
      !Number.isFinite(longitude) ||
      !Number.isFinite(latitude) ||
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid longitude and latitude are required.",
      });
    }

    const complaint = await Complaint.create({
      title: cleanTitle,
      description: cleanDescription,
      category,
      location: {
        address: cleanAddress,
        coordinates: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      citizen: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Complaint submission error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to submit the complaint right now.",
    });
  }
});

// =====================================================
// PUBLIC COMPLAINT EXPLORATION
// GET /api/complaints/explore
// Supports category, status, search, page, and limit.
// =====================================================

router.get("/explore", async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const pageInput = req.query.page ?? "1";
    const limitInput = req.query.limit ?? "12";

    if (
      typeof pageInput !== "string" ||
      !/^[1-9]\d*$/.test(pageInput) ||
      typeof limitInput !== "string" ||
      !/^[1-9]\d*$/.test(limitInput)
    ) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be positive integers.",
      });
    }

    const pageNumber = Number(pageInput);
    const requestedLimit = Number(limitInput);

    if (
      !Number.isSafeInteger(pageNumber) ||
      pageNumber > 1000000 ||
      !Number.isSafeInteger(requestedLimit)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid page number or limit.",
      });
    }

    const pageSize = Math.min(50, requestedLimit);
    const filter = {};

    if (category !== undefined) {
      if (
        typeof category !== "string" ||
        !allowedCategories.includes(category)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid complaint category.",
        });
      }

      filter.category = category;
    }

    if (status !== undefined) {
      if (
        typeof status !== "string" ||
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid complaint status.",
        });
      }

      filter.status = status;
    }

    if (search !== undefined) {
      if (
        typeof search !== "string" ||
        search.trim().length < 1 ||
        search.trim().length > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Search must contain 1 to 100 characters.",
        });
      }

      // Escape special characters before using the search as a regex.
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
        {
          "location.address": {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .select(publicFields)
        .sort({ createdAt: -1, _id: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean(),

      Complaint.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      total,
      page: pageNumber,
      limit: pageSize,
      pages: Math.ceil(total / pageSize),
      complaints,
    });
  } catch (error) {
    console.error(
      "Public complaint exploration error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to explore complaints right now.",
    });
  }
});

// =====================================================
// PUBLIC DETAILS FOR ONE COMPLAINT
// GET /api/complaints/explore/:id
// =====================================================

router.get("/explore/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const complaint = await Complaint.findById(req.params.id)
      .select(publicFields)
      .lean();

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    return res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Public complaint detail error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch complaint details.",
    });
  }
});

// =====================================================
// UPLOAD COMPLAINT EVIDENCE
// POST /api/complaints/:id/evidence
// Form-data field name: evidence
// =====================================================

const uploadToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const resourceType = file.mimetype.startsWith("video/")
      ? "video"
      : "image";

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "civicsetu/evidence",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(file.buffer).pipe(stream);
  });

router.post(
  "/:id/evidence",
  requireAuth,
  (req, res, next) => {
    upload.array("evidence", 5)(req, res, (error) => {
      if (!error) return next();

      return res.status(400).json({
        success: false,
        message: error.message || "Invalid evidence upload.",
      });
    });
  },
  async (req, res) => {
    const uploadedAssets = [];

    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid complaint ID.",
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please select at least one image or video.",
        });
      }

      const complaint = await Complaint.findOne({
        _id: req.params.id,
        citizen: req.user._id,
      });

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: "Complaint not found.",
        });
      }

      if (["Resolved", "Rejected"].includes(complaint.status)) {
        return res.status(409).json({
          success: false,
          message: "Evidence cannot be added to this complaint status.",
        });
      }

      if (complaint.evidence.length + req.files.length > 5) {
        return res.status(400).json({
          success: false,
          message: "A complaint can have at most 5 evidence files.",
        });
      }

      for (const file of req.files) {
        const result = await uploadToCloudinary(file);

        uploadedAssets.push({
          url: result.secure_url,
          publicId: result.public_id,
          mediaType:
            result.resource_type === "video" ? "video" : "image",
        });
      }

      complaint.evidence.push(...uploadedAssets);
      await complaint.save();

      return res.status(201).json({
        success: true,
        message: "Evidence uploaded successfully.",
        evidence: complaint.evidence,
      });
    } catch (error) {
      console.error("Evidence upload error:", error.message);

      await Promise.allSettled(
        uploadedAssets.map((asset) =>
          cloudinary.uploader.destroy(asset.publicId, {
            resource_type:
              asset.mediaType === "video" ? "video" : "image",
          })
        )
      );

      return res.status(500).json({
        success: false,
        message: "Unable to upload evidence right now.",
      });
    }
  }
);

// =====================================================
// GET THE LOGGED-IN CITIZEN'S COMPLAINTS
// GET /api/complaints
// =====================================================

router.get("/", requireAuth, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      citizen: req.user._id,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Fetch complaints error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch complaints.",
    });
  }
});

// =====================================================
// GET ONE COMPLAINT OWNED BY THE LOGGED-IN CITIZEN
// GET /api/complaints/:id
// =====================================================

router.get("/:id", requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const complaint = await Complaint.findOne({
      _id: req.params.id,
      citizen: req.user._id,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    return res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Fetch complaint error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch the complaint.",
    });
  }
});

export default router;
