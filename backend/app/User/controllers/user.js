import { createError } from "../../../utils/error.js";
import Post from "../../Blog/models/Post.js";
import User from "../models/User.js";

// Update user profile   =>   /api/admin/user/:id
export const updateUser = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        next(err);
      }
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "user not found!"));
    // if (req.user.id === user) {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("The user has been deleted.");
    // }
  } catch (err) {
    next(err);
  }
};

// Get user details   =>   /api/admin/users
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    // const { password, ...others } = user._doc;
    if (!user) {
      return next(
        createError(500, `User was not found with this id: ${req.params.id}`)
      );
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Get all users   =>   /api/admin/users
export const getUsers = async (req, res, next) => {
  try {
    // const users = await User.find();
    const users = await User.find().sort({ _id: -1 }).limit(15);

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json("Subscription successfull.");
  } catch (err) {
    next(err);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    try {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { subscribedUsers: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: -1 },
      });
      res.status(200).json("Unsubscription successfull.");
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

export const like = async (req, res, next) => {
  const id = req.user.id;
  const postId = req.params.postId;
  try {
    await Post.findByIdAndUpdate(postId, {
      $addToSet: { likes: id },
      $pull: { dislikes: id },
    });
    res.status(200).json("The video has been liked.");
  } catch (err) {
    next(err);
  }
};

export const dislike = async (req, res, next) => {
  const id = req.user.id;
  const postId = req.params.postId;
  try {
    await Post.findByIdAndUpdate(postId, {
      $addToSet: { dislikes: id },
      $pull: { likes: id },
    });
    res.status(200).json("The video has been disliked.");
  } catch (err) {
    next(err);
  }
};

export const getStats = async (req, res, next) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createProfilePic = async (req, res, next) => {
  try {
    if (!req.file)
      return next(
        createError(400, {
          success: false,
          message: "No image received",
        })
      );
    if (!req.file.originalname.match(/\.(jpg|jpeg|png)$/))
      return next(
        createError(400, {
          success: false,
          message: "Only .png .jpg and .jpeg formate allowed",
        })
      );
    req.user.profilePic = req.file.destination + "/" + req.file.filename;
    await req.user.save();

    // await User.findOneAndUpdate(
    //   { profilePic: req.body.profilePic },
    //   { profilePic: req.file.destination + "/" + req.file.filename }
    // );
    // await profilePic.save();

    res.status(200).json({
      message: "File has been uploaded",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProfilePic = async (req, res, next) => {
  req.user.profilePic = undefined;
  await req.user.save();

  res.status(200).json({
    message: "File has been Deleted",
  });
};

export const getProfilePic = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user === !user.profilePic)
      return next(createError(404, "user not found!"));

    // res.set("Content-Type", "image/png");
    res.status(200).json(user.profilePic);
  } catch (err) {
    next(err);
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    //get user base on the email
    const adminUser = await getUserByEmail(email);

    ////lots of work to be done
    if (adminUser?._id) {
      //1. create OTP
      const otpLength = 6;
      const otp = await getRandOTP(otpLength);
      //store otp in db
      const newOtp = {
        otp,
        email,
      };

      const result = await storeNewPin(newOtp);

      if (result?._id) {
        //2. email OTP to the admin

        const { otp, email } = result;
        console.log(otp, email);
        const mailInfo = {
          type: "OTP_REQUEST",
          otp,
          email,
        };
        emailProcessor(mailInfo);
      }
    }

    res.status(200).json({
      status: "success",
      message:
        "If your email is found in our system, we will send you the password rest instruction. IT may take upto 5min to arrive the email. Please check your junk/spam folder if you don't see email in  your inbox.",
    });
  } catch (err) {
    next(err);
  }
};

// router.post(
//   "/users/me/avatar",
//   auth,
//   upload.single("avatar"),
//   async (req, res) => {
//     const buffer = await sharp(req.file.buffer)
//       .resize({ width: 250, height: 250 })
//       .png()
//       .toBuffer();
//     req.user.avatar = buffer;
//     await req.user.save();
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

// router.put("/updatepic", requireLogin, (req, res) => {
//   User.findByIdAndUpdate(
//     req.user.id,
//     { $set: { pic: req.body.pic } },
//     { new: true },
//     (err, result) => {
//       if (err) {
//         return res.status(422).json({ error: "pic canot post" });
//       }
//       res.json(result);
//     }
//   );
// });
