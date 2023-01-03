import { createError } from "../../../../utils/error.js";
import Role from "../models/Role.js";

// Update Quiz profile   =>   /api/admin/Quiz/:id
export const createRole = async (req, res, next) => {
  try {
    const role = req.body.role;

    if (!role) return next(createError(400, "invalid Role!"));

       const newRole = new Role({
      // fullname: req.body.fullname,
      // username: req.body.username,
      // email: req.body.email,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      ...req.body,
    });

    await newRole.save();
    res.status(200).json({
       status: "Success",
      message: "Role updated successfully",
      newRole
    });
  } catch (err) {
    next(err);
  }
};



// find the quiz with quizid
export const updateRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return next(createError(404, "Could not find Role. "));

    const updatedRole = await Role.findByIdAndUpdate(
      role,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
       status: "Success",
      message: "Role updated successfully",
      role: updatedRole,
    });
  } catch (err) {
    next(err);
  }
};

// Delete user   =>   /api/admin/user/:id
export const deleteRole = async (req, res, next) => {
  
  try {
    await Role.findByIdAndDelete(req.params.id);
      
    res.status(200).json({
      status: "Success",
      message: "Role deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get all users   =>   /api/admin/users
export const getAllRoles = async (req, res, next) => {
  try {
    const role = await Role.find().sort({ _id: -1 }).limit(10);

    if (!role) {
      return next(createError(404, `Role not found! `));
    }

    res.status(200).json({
      status: "success",
      message: "All Role 1 - 10",
      Role,
    });
  } catch (err) {
    next(err);
  }
};

export const getRole = async (req, res, next) => {
  try {
    const role = await Role.findById({ _id: req.params.id });

    res.status(200).json({
      status: "success",
      message: "Role",
      role,
    });
  } catch (err) {
    next(err);
  }
};

export const getRoleName = async (req, res, next) => {
  try {
    const role = await Role.find({ name: req.body.name });

    res.status(200).json({
      status: "success",
      message: "Role",
      role,
    });
  } catch (err) {
    next(err);
  }
};



