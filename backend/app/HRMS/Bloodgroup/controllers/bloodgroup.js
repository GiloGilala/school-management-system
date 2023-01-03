import { createError } from "../../../../utils/error.js";
import Bloodgroup from "../models/Bloodgroup.js";

// Update Quiz profile   =>   /api/admin/Quiz/:id
export const createBloodgroup = async (req, res, next) => {
  try {
    const bloodgroup = req.body.bloodgroup;

    if (!bloodgroup) return next(createError(400, "invalid Bloodgroup!"));

       const newBloodgroup = new Bloodgroup({
      // fullname: req.body.fullname,
      // username: req.body.username,
      // email: req.body.email,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      ...req.body,
    });

    await newBloodgroup.save();
    res.status(200).json({
       status: "Success",
      message: "Bloodgroup updated successfully",
      newBloodgroup
    });
  } catch (err) {
    next(err);
  }
};



// find the quiz with quizid
export const updateBloodgroup = async (req, res, next) => {
  try {
    const bloodgroup = await Bloodgroup.findById(req.params.id);
    if (!bloodgroup) return next(createError(404, "Could not find Bloodgroup. "));

    const updatedBloodgroup = await Bloodgroup.findByIdAndUpdate(
      bloodgroup,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
       status: "Success",
      message: "Bloodgroup updated successfully",
      bloodgroup: updatedBloodgroup,
    });
  } catch (err) {
    next(err);
  }
};

// Delete user   =>   /api/admin/user/:id
export const deleteBloodgroup = async (req, res, next) => {
  
  try {
    await Bloodgroup.findByIdAndDelete(req.params.id);
      
    res.status(200).json({
      status: "Success",
      message: "Bloodgroup deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get all users   =>   /api/admin/users
export const getAllBloodgroups = async (req, res, next) => {
  try {
    const bloodgroup = await Bloodgroup.find().sort({ _id: -1 }).limit(10);

    if (!bloodgroup) {
      return next(createError(404, `Bloodgroup not found! `));
    }

    res.status(200).json({
      status: "success",
      message: "All Bloodgroup 1 - 10",
    bloodgroup,
    });
  } catch (err) {
    next(err);
  }
};

export const getBloodgroup = async (req, res, next) => {
  try {
    const bloodgroup = await Bloodgroup.findById({ _id: req.params.id });

    res.status(200).json({
      status: "success",
      message: "Bloodgroup",
      bloodgroup,
    });
  } catch (err) {
    next(err);
  }
};

export const getBloodgroupName = async (req, res, next) => {
  try {
    const bloodgroup = await Bloodgroup.find({ name: req.body.name });

    res.status(200).json({
      status: "success",
      message: "Bloodgroup",
      bloodgroup,
    });
  } catch (err) {
    next(err);
  }
};



