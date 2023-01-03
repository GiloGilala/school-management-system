import { createError } from "../../../../utils/error.js";
import LeaveType from "../models/LeaveType.js";

// Update Quiz profile   =>   /api/admin/Quiz/:id
export const createLeaveType = async (req, res, next) => {
  try {
    const leaveType = req.body;

      const exist = await LeaveType.findOne({ code: leaveType.code }); 
    if (!exist) return next(createError(409, "There is already another leave type with same short name!"));

       const newLeaveType = new LeaveType({
      // fullname: req.body.fullname,
      // username: req.body.username,
      // email: req.body.email,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      ...req.body,
    });
   
    
    await newLeaveType.save();
    res.status(200).json({
       status: "Success",
      message: "Leave Type created successfully",
      newLeaveType
    });
  } catch (err) {
    next(err);
  }
};



// find the quiz with quizid
export const updateLeaveType = async (req, res, next) => {
  try {
    const leaveType = await LeaveType.findById(req.params.id);
    if (!leaveType) return next(createError(404, "Could not find Leave Type. "));

    if (!leaveType.createdBy === req.user.id)
      return next(createError(403, "You are not author of that Leave Type! "));

    const updatedLeaveType = await LeaveType.findByIdAndUpdate(
      company,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
       status: "Success",
      message: "LeaveType updated successfully",
      company: updatedLeaveType,
    });
  } catch (err) {
    next(err);
  }
};

// Delete user   =>   /api/admin/user/:id
export const deleteCompany = async (req, res, next) => {
  
  try {
    await Company.findByIdAndDelete(req.params.id);
      
    res.status(200).json({
      status: "Success",
      message: "Company deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get all users   =>   /api/admin/users
export const getAllLeaveType = async (req, res, next) => {
  try {
    const leaveType = await LeaveType.find().sort({ _id: -1 }).limit(10);

    if (!leaveType) {
      return next(createError(404, `Company not found! `));
    }

    res.status(200).json({
      status: "success",
      message: "All Leave Type 1 - 10",
      leaveType,
    });
  } catch (err) {
    next(err);
  }
};

export const getLeaveType = async (req, res, next) => {
  try {
    const leaveType = await LeaveType.findById({ _id: req.params.id });

    res.status(200).json({
      status: "success",
      message: "Leave Type",
      leaveType,
    });
  } catch (err) {
    next(err);
  }
};



