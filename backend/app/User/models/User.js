import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
      min: 3,
      max: 20,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: false,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetLink: {
      Data: String,
      required: "",
    },
    profilePic: {
      type: String,
      default: "image",
    },
    avatar: {
      type: Object,
      contains: {
        publicId: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    },

    roles: {
      type: [String],
      default: ["User"],
      enum: [
        "Student",
        "Teacher",
        "Principal",
        "Staff",
        "Parents",
        "Accountant",
        "Receptionist",
        "Subscriber",
        "Librarian",
        "Instructor",
        "Admin",
        "SuperAmdin",
        "User",
      ],
    },

    likedQuizzes: {
      type: Array,
      default: [],
    },
    verified: {
      type: Boolean,
    },
    activeStatus: {
      type: Boolean,
      required: false,
    },
    is_registered: {
      type: Boolean,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedUsers: {
      type: [String],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamp: true }
);

export default mongoose.model("User", userSchema);
