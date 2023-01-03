import { createError } from "../../../../utils/error.js";
import Department from "../models/Department.js";

// Update Quiz profile   =>   /api/admin/Quiz/:id
export const createDepartment = async (req, res, next) => {
  try {
    const department = req.body.Department;

    if (!department) return next(createError(400, "invalid Department!"));

       const newDepartment = new Department({
      // fullname: req.body.fullname,
      // username: req.body.username,
      // email: req.body.email,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      ...req.body,
    });

    await newDepartment.save();
    res.status(200).json({
       status: "Success",
      message: "Department updated successfully",
      newDepartment
    });
  } catch (err) {
    next(err);
  }
};



// find the quiz with quizid
export const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return next(createError(404, "Could not find Department. "));

    const updatedDepartment = await Department.findByIdAndUpdate(
      department,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
       status: "Success",
      message: "Department updated successfully",
      department: updatedDepartment,
    });
  } catch (err) {
    next(err);
  }
};

// Delete user   =>   /api/admin/user/:id
export const deleteDepartment = async (req, res, next) => {
  
  try {
    await department.findByIdAndDelete(req.params.id);
      
    res.status(200).json({
      status: "Success",
      message: "Department deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get all users   =>   /api/admin/users
export const getAllDepartments = async (req, res, next) => {
  try {
    const department = await Department.find().sort({ _id: -1 }).limit(10);

    if (!department) {
      return next(createError(404, `Department not found! `));
    }

    res.status(200).json({
      status: "success",
      message: "All Department 1 - 10",
    department,
    });
  } catch (err) {
    next(err);
  }
};

export const getDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById({ _id: req.params.id });

    res.status(200).json({
      status: "success",
      message: "Department",
      department,
    });
  } catch (err) {
    next(err);
  }
};

export const getDepartmentName = async (req, res, next) => {
  try {
    const department = await Department.find({ name: req.body.name });

    res.status(200).json({
      status: "success",
      message: "Department",
      department,
    });
  } catch (err) {
    next(err);
  }
};



