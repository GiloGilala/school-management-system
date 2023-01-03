import Comment from "../models/Comment.js";
// import User from "../../models/User.js";
import { createError } from "../../../utils/error.js";
import slugify from "slugify";

// Create new Comment   =>   /api/admin/Comment/new

export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;

    const newComment = await new Comment({
      content: comment,
      postId,
      postedBy: req.user._id,
    });
    const savedComment = await newComment.save();

    res.status(200).json({
      status: "success",
      savedComment,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Comment   =>   /api/admin/Comment/:id

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(res.params.id);

    if (!deleteComment) return next(createError(404, "Comment not found!"));

    const post = await Post.findById(res.params.id);
    if (req.user.id === comment.postedBy || req.user.id === post.postedBy) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("The comment has been deleted.");
    } else {
      return next(createError(403, "You can delete ony your comment!"));
    }
  } catch (err) {
    next(err);
  }
};

// Get single Comment details   =>   /api/Comment/:id

export const getAllComment = async (req, res, next) => {
  try {
    const count = await Comment.countDocuments();

    const Comment = await Comment.find().sort({ createdAt: -1 });
    if (!categories) {
      return next(createError(404, "Comment not found!"));
    }
    res.status(200).json({
      status: "success",
      CommentList,
      CommentCount: count,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserComments = async (req, res, next) => {
  try {
    const count = await Comment.countDocuments();
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("postedBy", "_id name")
      .populate("postId", "title slug")
      .sort({ createdAt: -1 })
      .exec();

    const CommentList = createCategories(comments);
    res.status(200).json({
      status: "success",
      CommentList,
      count,
    });
  } catch (err) {
    next(err);
  }
};

export const getCommentsPerPage = async (req, res, next) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const count = await Comment.countDocuments();

    const Comments = await Comment.find({})
      .skip((page - 1) * perPage)
      .populate("postedBy", "_id name")
      .populate("postId", "title slug")
      .sort({ createdAt: -1 })
      .limit(perPage)
      .exec();
    if (!Comments) {
      return next(createError(404, "Comment not found!"));
    }

    res.status(200).json({
      status: "success",
      Comments,
      CommentsCounts: count,
    });
  } catch (err) {
    next(err);
  }
};
