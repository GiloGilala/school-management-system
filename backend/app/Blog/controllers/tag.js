import Tag from "../../../app/Blog/models/Tag.js";
// import User from "../../models/User.js";
import { createError } from "../../../utils/error.js";
import slugify from "slugify";
import Post from "../models/Post.js";

// Create new Tag   =>   /api/admin/Tag/new

export const createTag = async (req, res, next) => {
  try {
    const name = req.body;
    const newTag = await new Tag({
      name,
      slug: slugify(name),
    });

    const savedTag = await newTag.save();
    res.status(200).json({
      status: "success",
      savedTag,
    });
  } catch (err) {
    next(err);
  }
};

// Update Tag   =>   /api/admin/Tag/:id

export const updateTag = async (req, res, next) => {
  try {
    let updateTag = await Tag.findById(req.params.id);

    if (!updateTag) {
      return next(createError(404, "Tag not found!"));
    }
    const slug = req.params.slug;
    const name = req.body.name;

    const updatedTag = new Tag({
      name,
      slug: slugify(name),
      ...req.body,
    });

    updatedTag = await Tag.findOneAndUpdate(
      slug,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      updateTag,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Tag   =>   /api/admin/Tag/:id

export const deleteTag = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase();

    let deleteTag = await Tag.findOne({ slug });

    if (!deleteTag) {
      return next(createError(404, "Tag not found!"));
    }
    await Tag.findOneAndDelete({ slug });
    res.status(200).json(`Tag ${slug} has been deleted.`);
  } catch (err) {
    next(err);
  }
};

// Get single Tag details   =>   /api/Tag/:id

export const getAllTag = async (req, res, next) => {
  try {
    const tag = await Tag.find();
    if (!tag) {
      return next(createError(404, "Tag not found!"));
    }
    const tagList = createTag(tag);
    res.status(200).json({
      status: "success",
      tagList,
    });
  } catch (err) {
    next(err);
  }
};

export const getTag = async (req, res, next) => {
  try {
    // const tags = req.query.tags.split(",");
    const tags = req.query.slug.split(",");

    const tag = await Tag.findOne({
      slug: req.params.slug,
    });
    if (!tag) {
      return next(createError(404, "Tag not found!"));
    }
    const post = await Post.find({ tags })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name")
      .select(
        "_id title slug excerpt categories postedBy tags createdAt updatedAt"
      )
      .limit(20)
      .exec();
    res.status(200).json({
      status: "success",
      tag: tag,
      post,
    });
  } catch (err) {
    next(err);
  }
};
