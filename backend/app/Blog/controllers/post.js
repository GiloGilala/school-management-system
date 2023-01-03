import Post from "../../../app/Blog/models/Post.js";
import Comment from "../../../app/Blog/models/Comment.js";
import { createError } from "../../../utils/error.js";
import slugify from "slugify";
// import path from "path";
// import { fileURLToPath } from "url";

export const createPost = async (req, res, next) => {
  try {
    const categories_Id = req.params.categoriesId;
    const tags_Id = req.params.tagsId;

    const { title, content, categoriesId, tagsId, image } = req.body;

    if (!title || !title.length)
      return next(createError(400, "title is required"));

    if (!content || content.length < 20)
      return next(createError(400, "Content is too short"));

    // if (!categoriesId)
    //   return next(createError(400, "At least one category is required"));

    // if (!tagsId) return next(createError(400, "At least one tag is required"));

    // if (!req.file)
    //   return next(
    //     createError(400, {
    //       success: false,
    //       message: "No image received1",
    //     })
    //   );

    const newPost = await new Post({
      // excerpt: smartTrim(body, 320, " ", " ..."),
      slug: slugify(title),
      mateTitle: `${title} | ${process.env.APP_NAME}`,
      postedBy: req.user.id,
      ...req.body,
      // image: req.file.destination + "/" + req.file.filename.toString(),
      // image:
      //   req.protocol +
      //   "://" +
      //   req.get("host") +
      //   "/" +
      //   req.file.destination +
      //   "/" +
      //   req.file.filename,
    });

    const savedPost = await newPost.save();
    try {
      await Post.findByIdAndUpdate(categories_Id, {
        $push: { categoriesId: savedPost._id },
      });
      await Post.findByIdAndUpdate(tags_Id, {
        $push: { tagsId: savedPost._id },
      });
    } catch (err) {
      next(err);
    }

    res.status(200).json({
      status: "success",
      savedPost,
    });
  } catch (err) {
    next(err);
  }
};

// Update Post   =>   /api/admin/Post/:id

export const updatePost = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase();
    let updatePost = await Post.findOne({ slug });

    if (!updatePost) {
      return next(createError(404, "Post not found!"));
    }
    const { title } = req.body;
    const updatedPost = new Post({
      slug: slugify(title).toLowerCase(),
      mateTitle: `${title} | ${process.env.APP_NAME}`,
      postedBy: req.user.id,
      image: req.file.destination + "/" + req.file.filename,
      title,
      ...req.body,
    });

    await Post.findOneAndUpdate(slug, { updatedPost }, { new: true });
    res.status(200).json({
      status: "success",
      updatedPost,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Post   =>   /api/admin/Post/:id

export const deletePost = async (req, res, next) => {
  try {
    const slug = req.params.slug;

    let deletePost = await Post.findOne({ slug }).exec();

    if (!deletePost) {
      return next(createError(404, "Post not found!"));
    }
    await Post.findOneAndDelete({ slug });
    res.status(200).json(`Post ${slug} has been deleted.`);
  } catch (err) {
    next(err);
  }
};

export const photo = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Post.findOne({ slug })
    .select("photo")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.set("Content-Type", post.photo.contentType);
      return res.send(post.photo.data);
    });
};

// Get single Post details   =>   /api/Post/:id

export const getAllPost = async (req, res, next) => {
  try {
    const postCount = await Post.countDocuments();
    const postList = await Post.find()
      .populate("postedBy", "_id name")
      .populate("categoriesId", "_id name slug")
      .populate("featuredImage", "url")
      .sort({ createdAt: -1 })
      .exec();
    if (!postList) {
      return next(createError(404, "Post not found!"));
    }
    res.status(200).json({
      status: "success",
      postCount,
      postList,
    });
  } catch (err) {
    next(err);
  }
};

export const addView = async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("The view has been increased.");
  } catch (err) {
    next(err);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    let userId = req.user.id;
    const count = await Post.countDocuments();

    const posts = await Post.find(userId)
      .populate("categoriesId", "_id name slug")
      .populate("tagsId", "_id name slug")
      .populate("postedBy", "_id name username")
      .populate("featuredImage", "url")
      .select("_id title slug postedBy createdAt updatedAt")
      .sort({ createdAt: -1 })
      .exec();

    if (!posts) {
      return next(createError(404, "Post not found!"));
    }
    const postList = createPost(posts);
    res.status(200).json({
      count,
      status: "success",
      postList,
    });
  } catch (err) {
    next(err);
  }
};

export const getSearchPost = async (req, res, next) => {
  try {
    const { search } = req.query;
    if (search) {
      Blog.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      }).select("-photo -body");
      if (!search) {
        return next(createError(404, "Post not found!"));
      }
    }
    res.status(200).json({
      status: "success",
      post: search,
    });
  } catch (err) {
    next(err);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const slug = req.params.slug;

    const post = await Post.findOne({ slug })
      .populate("categoriesId", "_id name slug")
      .populate("tagsId", "_id name slug")
      .populate("postedBy", "username")
      .select(
        "_id title content slug mateTitle mateDesc categories tags postedBy createdAt updatedAt"
      )
      .exec();
    if (!post) {
      return next(createError(404, "Post not found!"));
    }
    // comments
    const comments = await Comment.find({ postId: post._id })
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      post,
      comments,
    });
  } catch (err) {
    next(err);
  }
};

export const getPostPerPage = async (req, res, next) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;

    const posts = await Post.find({})
      .skip((page - 1) * perPage)
      .populate("postedBy", "_id name")
      .populate("categoriesId", "_id name slug")
      .populate("featuredImage", "url")
      .sort({ createdAt: -1 })
      .limit(perPage)
      .exec();
    if (!posts) {
      return next(createError(404, "Post not found!"));
    }

    res.status(200).json({
      status: "success",
      posts,
    });
  } catch (err) {
    next(err);
  }
};
export const getAllBlogsCategoriesTags = async (req, res, next) => {
  try {
    const posts = await Post.find({})
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username profile")
      .sort({ createdAt: -1 })
      .skip(0)
      .limit(10)
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      )
      .exec();

    if (!posts) {
      return next(createError(404, "Category not found!"));
    }

    res.status(200).json({
      status: "success",
      category,
      posts,
    });
  } catch (err) {
    next(err);
  }
};
export const postsByCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    const posts = await Post.find({ categories: category._id })
      .populate("featuredImage")
      .limit(24);

    if (!category) {
      return next(createError(404, "Category not found!"));
    }

    res.status(200).json({
      status: "success",
      category,
      posts,
    });
  } catch (err) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  const { search } = req.query;
  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
      ],
    })
      .limit(20)
      .select("-photo -content");
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

export const getRelatedPosts = (req, res, next) => {
  // console.log(req.body.blog);
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;
  const { _id, categories } = req.body.blog;
  try {
    const posts = Post.find({
      _id: { $ne: _id },
      categories: { $in: categories },
    })
      .limit(limit)
      .populate("postedBy", "_id name username profile")
      .select("title slug excerpt postedBy createdAt updatedAt")
      .exec();
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => {
        return await Video.find({ userId: channelId });
      })
    );

    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};

export const getNumbers = async (req, res) => {
  try {
    const posts = await Post.countDocuments();
    const users = await User.countDocuments();
    const comments = await Comment.countDocuments();
    const categories = await Category.countDocuments();
    return res.json({
      posts,
      users,
      comments,
      categories,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

// const newCourse = new Course(new_course_data);
// const populate_options = [
//   // Here write your populate options
// ];
// const created_course = await newCourse.save();
// await created_course.populate(populate_options).execPopulate();

// chatRoom = await chatRoom.save();
// const data = await chatRoom
//   .populate("customer", "email dp")
//   .populate({
//     path: "admin",
//     select: "name logo",
//   })
//   .execPopulate();

// let user = await User.create({ ... })
// user = await user.populate('company').execPopulate()
