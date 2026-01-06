import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: String,
  duration: String,
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
    videoUrl:{
      type:String,
      required:false,
    },
    lessons: [
      {
        title: String,
        duration: String,
      },
    ],

    learn: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
