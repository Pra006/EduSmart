import mongoose from "mongoose";

// ✅ FIXED: Added videoUrl and videoName to lessonSchema
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: "",
  },
  videoUrl: {
    type: String,
    required: false, // Optional in case some lessons don't have videos
  },
  videoName: {
    type: String,
    required: false,
  }
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    students: {
      type: Number,
      default: 0,
    },
    // ✅ REMOVED: videoUrl from course level (it belongs in lessons)
    lessons: [lessonSchema], // Use the lessonSchema with videoUrl
    learn: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);