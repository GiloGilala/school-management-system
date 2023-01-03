import Media from "../models/Media.js";
import { createError } from "../../../utils/error.js";
// import cloudinary from "../../../middleware/cloudinary.js";

// Create new Media   =>   /api/admin/Media/new

export const cloudinaryImage = async (req, res, next) => {
  try {
    // console.log(req.body.image);
    const result = await cloudinary.uploader.upload(req.body.image);
    // console.log("uploaded image url => ", result);
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    next(err);
  }
};

export const cloudinaryImageFile = async (req, res, next) => {
  //   console.log(req.files); // [] of File {}
  try {
    // console.log(req.body.image);
    const result = await cloudinary.uploader.upload(req.files.file.path);
    // console.log("uploaded image url => ", result);
    // save to db
    const media = await new Media({
      url: result.secure_url,
      public_id: result.public_id,
      postedBy: req.user.id,
    }).save();
    res.json(media);
    // res.json({
    //   url: result.secure_url,
    //   public_id: result.public_id,
    // });
  } catch (err) {
    next(err);
  }
};

export const getMedia = async (req, res, next) => {
  try {
    const media = await Media.find({})
      .populate("postedBy", "_id")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      media,
    });
  } catch (err) {
    next(err);
  }
};

export const createMedia = async (req, res, next) => {
  try {
    // const { name } = req.body;
    // const media = await Media.findOne({ name }).exec();
    // if (media) return next(createError(400, "Media already exsit!"));
    const newMedia = await new Media({
      createdBy: req.user.id,
      ...req.body,
    });

    const savedMedia = await newMedia.save();
    res.status(200).json({
      status: "success",
      savedMedia,
    });
  } catch (err) {
    next(err);
  }
};

// Update Media   =>   /api/admin/Media/:id

export const updateMedia = async (req, res, next) => {
  try {
    const { name } = req.body;
    let updateMedia = await Media.findOne({ slug: req.body.slug });

    if (!updateMedia) {
      return next(createError(404, "Media not found!"));
    }

    updatedMedia = await Media.findByIdAndUpdate(
      { slug: req.params.slug },
      { $set: { name, slug: slugify(name) } },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      updatedMedia,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Media   =>   /api/admin/Media/:id

export const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const media = await Media.findByIdAndDelete(id);
    res.status(200).json(`Media ${media} has been deleted.`);
  } catch (err) {
    next(err);
  }
};

// Get single Media details   =>   /api/Media/:id

export const getAllMedia = async (req, res, next) => {
  try {
    const Media = await Media.find().sort({ createdAt: -1 });
    if (!categories) {
      return next(createError(404, "Media not found!"));
    }
    res.status(200).json({
      status: "success",
      MediaList,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserMedia = async (req, res, next) => {
  try {
    let userId = req.user.id;
    const user = User.findOne({ userId });

    if (!user) {
      return next(createError(404, "Media not found!"));
    }

    const MediaList = createCategories(Media);
    res.status(200).json({
      status: "success",
      MediaList,
    });
  } catch (err) {
    next(err);
  }
};

export const getSearchMedia = async (req, res, next) => {
  try {
    const { search } = req.query;
    if (search) {
      Media.find({
        $or: [{ name: { $regex: search, $options: "i" } }],
      }).select("-photo -body");
      if (!search) {
        return next(createError(404, "Media not found!"));
      }
    }
    res.status(200).json({
      status: "success",
      Media: search,
    });
  } catch (err) {
    next(err);
  }
};

export const getMediaPerPage = async (req, res, next) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;

    const Medias = await Media.find({})
      .skip((page - 1) * perPage)
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 })
      .limit(perPage)
      .exec();
    if (!Medias) {
      return next(createError(404, "Media not found!"));
    }

    res.status(200).json({
      status: "success",
      Medias,
    });
  } catch (err) {
    next(err);
  }
};
