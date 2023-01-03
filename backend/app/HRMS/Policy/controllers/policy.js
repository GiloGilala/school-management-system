import { createError } from "../../../../utils/error.js";
import Policy from "../models/Policy.js";

// Update Quiz profile   =>   /api/admin/Quiz/:id
export const createPolicy = async (req, res, next) => {
  try {
    const policy = req.body;

      const exist = await Policy.findOne({ code: policy.code }); 
    if (!exist) return next(createError(409, "There is already another leave type with same short name!"));

       const newPolicy = new Policy({
      // fullname: req.body.fullname,
      // username: req.body.username,
      // email: req.body.email,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      ...req.body,
    });
   
    
    await newPolicy.save();
    res.status(200).json({
       status: "Success",
      message: "Policy created successfully",
      newPolicy
    });
  } catch (err) {
    next(err);
  }
};



// find the quiz with quizid
export const updatePolicy = async (req, res, next) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) return next(createError(404, "Could not find Policy. "));

    if (!policy.createdBy === req.user.id)
      return next(createError(403, "You are not author of that Leave Type! "));

    const updatedPolicy = await Policy.findByIdAndUpdate(
      company,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
       status: "Success",
      message: "Policy updated successfully",
      policy: updatedPolicy,
    });
  } catch (err) {
    next(err);
  }
};

// Delete user   =>   /api/admin/user/:id
export const deletePolicy = async (req, res, next) => {
  
  try {
    await Policy.findByIdAndDelete(req.params.id);
      
    res.status(200).json({
      status: "Success",
      message: "Policy deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get all users   =>   /api/admin/users
export const getPolicies = async (req, res, next) => {
  try {
    const policy = await Policy.find().populate('departments lists.leavetype')
      .lean().sort({ _id: -1 }).limit(10);

    if (!policy) {
      return next(createError(404, `Policy not found! `));
    }

    res.status(200).json({
      status: "success",
      message: "All Policy 1 - 10",
      policy,
    });
  } catch (err) {
    next(err);
  }
};

export const getPoliciesByDept = async (req, res, next) => {
  try {
    const policy = await Policy.find({ departments: req.params.id}).populate('lists.leavetype')
      .lean().sort({ _id: -1 }).limit(10);

    if (!policy) {
      return next(createError(404, `Policy not found! `));
    }

    res.status(200).json({
      status: "success",
      message: "All Policy 1 - 10",
      policy,
    });
  } catch (err) {
    next(err);
  }
};

export const getPolicy = async (req, res, next) => {
  try {
    const policy = await Policy.findById({ _id: req.params.id });

    res.status(200).json({
      status: "success",
      message: "Policy",
      policy,
    });
  } catch (err) {
    next(err);
  }
};



