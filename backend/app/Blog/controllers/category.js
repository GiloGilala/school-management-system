import Category from "../../../app/Blog/models/Category.js";
// import User from "../../models/User.js";
import { createError } from "../../../utils/error.js";
import slugify from "slugify";

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

// Create new Category   =>   /api/admin/Category/new

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const cat = await Category.findOne({ name }).exec();
    if (cat) return next(createError(400, "Category already exsit!"));
    const newCategory = await new Category({
      name,
      slug: slugify(name),
      createdBy: req.user.id,
    });

    const savedCategory = await newCategory.save();
    res.status(200).json({
      status: "success",
      savedCategory,
    });
  } catch (err) {
    next(err);
  }
};

// Update Category   =>   /api/admin/Category/:id

export const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const cat = await Category.findOne({ slug: req.body.slug }).exec();
    if (!cat) return next(createError(400, "Category slug not found!"));

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: { name, slug: slugify(name) } },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      updatedCategory,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCategory2 = async (req, res, next) => {
  try {
    const { name } = req.body;
    const cat = await Category.findOne({ slug: req.body.slug }).exec();
    if (!cat) return next(createError(400, "Category slug not found!"));

    const updatedCategory = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: { name, slug: slugify(name) } },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      updatedCategory,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Category   =>   /api/admin/Category/:id

export const deleteCategory = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const cat = await Category.findOne({ slug }).exec();
    if (!cat) return next(createError(400, "Category slug not found!"));
    await Category.findOneAndDelete({ slug }).exec();

    res.status(200).json(`Category ${slug} has been deleted.`);
  } catch (err) {
    next(err);
  }
};

// Get single Category details   =>   /api/Category/:id

export const getAllCategories = async (req, res, next) => {
  try {
    const count = await Category.countDocuments();

    const categories = await Category.find()
      .populate("createdBy", "username email")
      .select("name slug createdBy")
      .sort({ createdAt: -1 });
    if (!categories) {
      return next(createError(404, "Category not found!"));
    }
    const categoryList = createCategories(categories);
    res.status(200).json({
      status: "success",
      count,
      categoryList,
    });
  } catch (err) {
    next(err);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    // const count = await Category.countDocuments();
    const slug = req.params.slug;

    const category = await Category.findOne({ slug })
      .populate("createdBy", "username")
      .select("createdBy");
    if (!category) return next(createError(400, "Category slug not found!"));

    res.status(200).json({
      status: "success",
      category,
      // count,
    });
  } catch (err) {
    next(err);
  }
};

// export const singleCategory = async (req, res) => {
//   try {
//     const category = await Category.findOne({
//       slug: req.params.slug,
//     });
//     res.json(category);
//   } catch (err) {
//     console.log(err);
//     res.Status(400);
//   }
// };
