import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      // required: true,
      lowercase: true,
      // unique: true,
    },
    type: {
      type: String,
    },
    image: {
      type: String,
    },
    excerpt: {
      type: String,
      max: 1000,
    },
    mateTitle: {
      type: String,
    },
    mateDesc: {
      type: String,
    },

    category: { type: String },
    parentId: {
      type: String,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    featuredImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
    published: {
      type: Boolean,
      default: true,
    },
    allowComments: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: [String],
      default: [],
    },
    dislikes: {
      type: [String],
      default: [],
    },
    content: { type: String },
    categoriesId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    tagsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
