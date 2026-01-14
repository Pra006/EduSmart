import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "educator", "admin"],
      default: "student",
    },

    document: {
      type: String, // file path stored as string
      default: null,
    },
    approvalStatus:{
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function () {
        return this.role === "educator"? "pending" : "approved";
      },
    },
    isActive:{
      type: Boolean,
      default: function () {
        return this.role === "educator"? false : true;
      },
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

// Export as default
const User = mongoose.model("User", userSchema);
export default User;
