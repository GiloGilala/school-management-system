import { createError } from "../../../../utils/error.js";
import Leave from "../models/Leave.js";

// Update Quiz profile   =>   /api/admin/Quiz/:id
export const createLeave = async (req, res, next) => {
  try {
    const Leave = req.body.Leave;

    if (!Leave) return next(createError(400, "invalid Leave!"));

       const newLeave = new Leave({
      // fullname: req.body.fullname,
      // username: req.body.username,
      // email: req.body.email,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      ...req.body,
    });

    await newLeave.save();
    res.status(200).json({
       status: "Success",
      message: "Leave updated successfully",
      newLeave
    });
  } catch (err) {
    next(err);
  }
};



// find the quiz with quizid
export const updateLeave = async (req, res, next) => {
  try {
    const Leave = await Leave.findById(req.params.id);
    if (!Leave) return next(createError(404, "Could not find Leave. "));

    if (!Leave.createdBy === req.user.id)
      return next(createError(403, "You are not author of that Leave! "));

    const updatedLeave = await Leave.findByIdAndUpdate(
      Leave,
      { $set: req.body },
      { new: true }
    ); 
    res.status(200).json({
       status: "Success",
      message: "Leave updated successfully",
      Leave: updatedLeave,
    });
  } catch (err) {
    next(err);
  }
};

// Delete user   =>   /api/admin/user/:id
export const deleteLeave = async (req, res, next) => {
  
  try {
    await Leave.findByIdAndDelete(req.params.id);
      
    res.status(200).json({
      status: "Success",
      message: "Leave deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get all users   =>   /api/admin/users
export const getAllLeave = async (req, res, next) => {
  try {
    const Leave = await Leave.find().sort({ _id: -1 }).limit(10);

    if (!Leave) {
      return next(createError(404, `Leave not found! `));
    }

    res.status(200).json({
      status: "success",
      message: "All Leave 1 - 10",
      Leave,
    });
  } catch (err) {
    next(err);
  }
};

export const getLeave = async (req, res, next) => {
  try {
    const Leave = await Leave.findById({ _id: req.params.id });

    res.status(200).json({
      status: "success",
      message: "Leave",
      Leave,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllLeaveBranchs = async (req, res, next) => {
  try {
    const Leave = await Leave.find({ branchname: req.body.branchname });

    res.status(200).json({
      status: "success",
      message: "Leave",
      Leave,
    });
  } catch (err) {
    next(err);
  }
};

export const getLeaveBranch = async (req, res, next) => {
  try {
    const LeaveBranch = await Leave.findOne({ branchname: req.body.branchname });

    res.status(200).json({
      status: "success",
      message: "Leave Branch",
      LeaveBranch,
    });
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

