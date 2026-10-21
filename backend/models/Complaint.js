
import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Garbage",
        "Road Damage",
        "Water Supply",
        "Drainage",
        "Streetlight",
        "Public Sanitation",
        "Other",
      ],
    },

    location: {
      address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300,
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: true,
          validate: {
            validator(value) {
              return (
                value.length === 2 &&
                Number.isFinite(value[0]) &&
                Number.isFinite(value[1]) &&
                value[0] >= -180 &&
                value[0] <= 180 &&
                value[1] >= -90 &&
                value[1] <= 90
              );
            },
            message: "Coordinates must be [longitude, latitude].",
          },
        },
      },
    },

    evidence: [
      {
        url: {
          type: String,
          trim: true,
        },
        publicId: String,
        mediaType: {
          type: String,
          enum: ["image", "video"],
        },
      },
    ],

    status: {
      type: String,
      enum: [
        "Submitted",
        "Under Verification",
        "Verified",
        "Assigned",
        "In Progress",
        "Resolved",
        "Rejected",
        "Reopened",
      ],
      default: "Submitted",
    },

    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: null,
      maxlength: 500,
    },

    pointsAwarded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

complaintSchema.index({ "location.coordinates": "2dsphere" });
complaintSchema.index({ status: 1, createdAt: -1 });

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
