import { createError } from "../../../../utils/error.js";
import Company from "../models/Company.js";

// Update Quiz profile   =>   /api/admin/Quiz/:id
export const createCompany = async (req, res, next) => {
  try {
    const company = req.body.company;

    if (!company) return next(createError(400, "invalid Company!"));

       const newCompany = new Company({
      // fullname: req.body.fullname,
      // username: req.body.username,
      // email: req.body.email,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      ...req.body,
    });

    await newCompany.save();
    res.status(200).json({
       status: "Success",
      message: "Company updated successfully",
      newCompany
    });
  } catch (err) {
    next(err);
  }
};



// find the quiz with quizid
export const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return next(createError(404, "Could not find Company. "));

    if (!company.createdBy === req.user.id)
      return next(createError(403, "You are not author of that Company! "));

    const updatedCompany = await Company.findByIdAndUpdate(
      company,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
       status: "Success",
      message: "Company updated successfully",
      company: updatedCompany,
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
export const getAllCompany = async (req, res, next) => {
  try {
    const company = await Company.find().sort({ _id: -1 }).limit(10);

    if (!company) {
      return next(createError(404, `Company not found! `));
    }

    res.status(200).json({
      status: "success",
      message: "All Company 1 - 10",
      company,
    });
  } catch (err) {
    next(err);
  }
};

export const getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById({ _id: req.params.id });

    res.status(200).json({
      status: "success",
      message: "Company",
      company,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllCompanyBranchs = async (req, res, next) => {
  try {
    const company = await Company.find({ branchname: req.body.branchname });

    res.status(200).json({
      status: "success",
      message: "Company",
      company,
    });
  } catch (err) {
    next(err);
  }
};

export const getCompanyBranch = async (req, res, next) => {
  try {
    const companyBranch = await Company.findOne({ branchname: req.body.branchname });

    res.status(200).json({
      status: "success",
      message: "Company Branch",
      companyBranch,
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

