import { createError } from "../../../../utils/error.js";
import Holidays from "../models/Holidays.js";

// Update Quiz profile   =>   /api/admin/Quiz/:id
export const createHolidays = async (req, res, next) => {
  try {
    const holidays = req.body;
    if (!holidays) return next(createError(400, "invalid question!"));

      const exist = await Holidays.findOne(req.params.id); 
    if (!exist) return next(createError(409, "There is already another leave type with same short name!"));

       const newHolidays = new Holidays({
      // fullname: req.body.fullname,
      // username: req.body.username,
      // email: req.body.email,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      ...req.body,
    });
   
    
    await newHolidays.save();
    res.status(200).json({
       status: "Success",
      message: "Holidays created successfully",
      newHolidays
    });
  } catch (err) {
    next(err);
  }
};

export const createHolidays1 = async (req, res, next) => {
  const { year, holiday } = req.body;
    try {
    const updatedHolidays = await Holiday.findOneAndUpdate(
    { year },
      {
        $push: {
          lists: {
            ...holiday, _id: mongoose.Types.ObjectId()
          }
        }
      },
      {
        upsert: true,
        new: true
      }
  );
    res.status(200).json(updatedHolidays);
  } catch (err) {
    next(err);
  }
};



// find the quiz with quizid
export const updateHolidays = async (req, res, next) => {
  try {
    const holidays = await Holidays.findById(req.params.id);
    if (!holidays) return next(createError(404, "Could not find Holidays. "));

    if (!holidays.createdBy === req.user.id)
      return next(createError(403, "You are not author of that Leave Type! "));

    const updatedHolidays = await Holidays.findByIdAndUpdate(
      company,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
       status: "Success",
      message: "Holidays updated successfully",
      holidays: updatedHolidays,
    });
  } catch (err) {
    next(err);
  }
};

// Delete user   =>   /api/admin/user/:id
export const deleteHolidays = async (req, res, next) => {
  
  try {
    await Holidays.findByIdAndDelete(req.params.id);
      
    res.status(200).json({
      status: "Success",
      message: "Holidays deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get all users   =>   /api/admin/users
export const getPolicies = async (req, res, next) => {
  try {
    const holidays = await Holidays.find().populate('departments lists.leavetype')
      .lean().sort({ _id: -1 }).limit(10);

    if (!holidays) {
      return next(createError(404, `Holidays not found! `));
    }

    res.status(200).json({
      status: "success",
      message: "All Holidays 1 - 10",
      holidays,
    });
  } catch (err) {
    next(err);
  }
};

export const getPoliciesByDept = async (req, res, next) => {
  try {
    const holidays = await Holidays.find({ departments: req.params.id}).populate('lists.leavetype')
      .lean().sort({ _id: -1 }).limit(10);

    if (!holidays) {
      return next(createError(404, `Holidays not found! `));
    }

    res.status(200).json({
      status: "success",
      message: "All Holidays 1 - 10",
      holidays,
    });
  } catch (err) {
    next(err);
  }
};

export const getHolidays = async (req, res, next) => {
  try {
    const holidays = await Holidays.findById({ _id: req.params.id });

    res.status(200).json({
      status: "success",
      message: "Holidays",
      holidays,
    });
  } catch (err) {
    next(err);
  }
};



