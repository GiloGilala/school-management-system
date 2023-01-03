import { createError } from "../../../../utils/error.js";
import Staff from "../../../Staff/models/Staff.js";
import LeaveRequests from "../models/LeaveRequests.js";
import Leave from "../models/Leave.js";
import rolesConfig from "./roles.config.js";

// Update Quiz profile   =>   /api/admin/Quiz/:id
export const createLeaveRequests = async (req, res, next) => {
  try {
    const leaveRequests = req.body.LeaveRequests;

    if (!leaveRequests) return next(createError(400, "invalid LeaveRequests!"));
    const staffId = await Staff.findById(req.params.id);

       const newLeaveRequests = new LeaveRequests({
      // fullname: req.body.fullname,
      // username: req.body.username,
      // email: req.body.email,
    reviewers: req.body.managerids,
      appliedBy: staffId,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      ...req.body,
    });

    await newLeaveRequests.save();
     await Leave.updateMany(
      { _id: { $in: req.body.managerids } },
      {
        $push: {
          leaveToApprove: newLeaveRequests._id,
        },
      }
    );
    await Leave.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          leaveApplied: newLeaveRequests._id,
        },
      }
    );
    res.status(200).json({
       status: "Success",
      message: "Leave Requests successfully",
      newLeaveRequests
    });
  } catch (err) {
    next(err);
  }
};



// find the quiz with quizid
export const updateLeaveRequests = async (req, res, next) => {
  try {
    const LeaveRequests = await LeaveRequests.findById(req.params.id);
    if (!LeaveRequests) return next(createError(404, "Could not find LeaveRequests. "));

    if (!LeaveRequests.createdBy === req.user.id)
      return next(createError(500, "You are not author of that LeaveRequests! "));

    const updatedLeaveRequests = await LeaveRequests.findByIdAndUpdate(
      LeaveRequests,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
       status: "Success",
      message: "LeaveRequests updated successfully",
      LeaveRequests: updatedLeaveRequests,
    });
  } catch (err) {
    next(err);
  }
};


export const lama = async (req, res, next) => {
  try {
    const managerids = req.body.reviewers;
    
    const leaveToUpdate = await LeaveRequests.findById(req.query.id);
     
    if (!leaveToUpdate) return next(createError(404, "Could not find LeaveRequests. "));

    const manageridsupdate = await Promise.all(
      leaveToUpdate.reviewers.map((reviewer) => {
        return Staff.findById(reviewer).toString();
      })
    );

     let toBePushed = [];
    let toBePulled = [];

    managerids.forEach((reviewer) => {
      if (!manageridsupdate.includes(reviewer)) {
        toBePushed.push(reviewer);
      }
    });
    manageridsupdate.forEach((reviewer) => {
      if (!managerids.includes(reviewer)) {
        toBePulled.push(reviewer);
      }
    });

     if (toBePushed.length) {
      await Leave.updateMany(
        { _id: { $in: toBePushed } },
        {
          $push: {
            leaveToApprove: req.query.id,
          },
        }
      );
    }
    if (toBePulled.length) {
      await Leave.updateMany(
        { _id: { $in: toBePulled } },
        {
          $pull: {
            leaveToApprove: req.query.id,
          },
        }
      );
    }

    const updatedLeaveRequests = await LeaveRequests.findByIdAndUpdate(req.query.id, leave);
    
 
    res.status(200).json({
       status: "Success",
      message: "LeaveRequests updated successfully",
      leaveRequests: leaveToUpdate,
      leaveRequests: updatedLeaveRequests,
    });
  } catch (err) {
    next(err);
  }
};

// Delete user   =>   /api/admin/user/:id
export const deleteLeaveRequests = async (req, res, next) => {
  
  try {
    await LeaveRequests.findByIdAndDelete(req.params.id);
      
    res.status(200).json({
      status: "Success",
      message: "LeaveRequests deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get all users   =>   /api/admin/users
export const approveLeaveRequests = async (req, res, next) => {
  try {
    const leaveToCancel = await LeaveRequests.findById(req.query.leaveid);

    if (leaveToCancel.leaveStatus === rolesConfig.leaves.APPROVED) {
      return res.status(200).json({
        status: "ok",
        message: "Leave is already approved",
      });
    }
    const staffId = await Staff.findById(req.params.id);

    if (leaveToCacel.reviewers.includes(staffId)) {
      const statusUpdated = await LeaveRequests.findByIdAndUpdate(
        req.query.leaveid,
        {
          $set: {
            approvedBy: staffId,
          },
          leaveStatus: rolesConfig.leaves.APPROVED,
        }
      );
      // let approvedFor = await Leave.findByIdAndUpdate
      await Leave.findByIdAndUpdate(
        statusUpdated.appliedBy,
        {
          $pull: {
            leaveApplied: statusUpdated._id,
          },
          $push: {
            leaveApproved: statusUpdated._id,
          },
        }
      );
    
      // let approvedBy = await userSchema.findByIdAndUpdate(req.user.id, {
      //   $pull: {
      //     leaveToApprove: statusUpdated._id,
      //   },
      // });
      // let transporter = nodemailer.createTransport({
      //   host: "smtp.office365.com", // Office 365 server
      //   port: 587,
      //   secure: false,
      //   auth: {
      //     user: "rohita@touchcoresystems.com",
      //     pass: "Kholdeyar17",
      //   },
      //   tls: {
      //     ciphers: "SSLv3",
      //   },
      // });
      // await transporter.sendMail({
      //   from: `"HRMS" ${process.env.EMAIL}`, // sender address
      //   to: `${approvedFor.email}`, // list of receivers
      //   subject: "Leave Approved!", // Subject line
      //   text: `Hey ${approvedFor.firstname} ${approvedFor.lastname}! Your leave has been approved by ${approvedBy.firstname} ${approvedBy.lastname}`, // plain text body
      // });
   
     return res.status(200).json({
        status: "ok",
        message: "Leave Rejected",
      });
    } else {
      return next(createError(500, {
        status: "error",
        message: "You are not authorized for this action",
      }));
        
    }
  
  } catch (err) {
    next(err);
  }
};

export const rejectLeaveRequests = async (req, res, next) => {
  try {
    const leaveToCancel = await LeaveRequests.findById(req.query.leaveid);

    if (leaveToCancel.leaveStatus === 2) {
      return res.status(200).json({
        status: "ok",
        message: "Leave is already approved",
      });
    }
    const staffId = await Staff.findById(req.params.id);

    if (leaveToCacel.reviewers.includes(staffId)) {
      const statusUpdated = await LeaveRequests.findByIdAndUpdate(
        req.query.leaveid,
        {
          $set: {
            approvedBy: staffId,
          },
          leaveStatus: rolesConfig.leaves.APPROVED,
        }
      );
      // let rejectedFor = await Leave.findByIdAndUpdate
      await Leave.findByIdAndUpdate(
        statusUpdated.appliedBy,
        {
          $pull: {
            leaveApplied: statusUpdated._id,
          },
          $push: {
            leaveApproved: statusUpdated._id,
          },
        }
      );
    
      // let approvedBy = await userSchema.findByIdAndUpdate(req.user.id, {
      //   $pull: {
      //     leaveToApprove: statusUpdated._id,
      //   },
      // });
      // let transporter = nodemailer.createTransport({
      //   host: "smtp.office365.com", // Office 365 server
      //   port: 587,
      //   secure: false,
      //   auth: {
      //     user: "rohita@touchcoresystems.com",
      //     pass: "Kholdeyar17",
      //   },
      //   tls: {
      //     ciphers: "SSLv3",
      //   },
      // });
      // await transporter.sendMail({
      //   from: `"HRMS" ${process.env.EMAIL}`, // sender address
      //   to: `${approvedFor.email}`, // list of receivers
      //   subject: "Leave Approved!", // Subject line
      //   text: `Hey ${approvedFor.firstname} ${approvedFor.lastname}! Your leave has been approved by ${approvedBy.firstname} ${approvedBy.lastname}`, // plain text body
      // });
   
     return res.status(200).json({
        status: "ok",
        message: "Leave Approved",
      });
    } else {
      return next(createError(500, {
        status: "error",
        message: "You are not authorized for this action",
      }));
        
    }
  
  } catch (err) {
    next(err);
  }
};
export const cancelLeaveRequests = async (req, res, next) => {
  try {
    const leaveToCancel = await LeaveRequests.findById(req.query.leaveid);

    if (leaveToCancel.leaveStatus === 0) {
      return res.status(200).json({
        status: "ok",
        message: "Leave is already cancelled",
      });
    }
    const staffId = await Staff.findById(req.params.id);
    
    if (staffId == leaveToCancel.appliedBy.toString()) {
      await LeaveRequests.findByIdAndUpdate(req.query.leaveid, {
        leaveStatus: rolesConfig.leaves.CANCELLED,
      });
      return res.status(200).json({
        status: "ok",
        message: "Leave Cancelled",
        LeaveRequests
      });
    } else {
      return next(createError(404, {
        status: "error",
        message: "You are not authorized for this action",
      }));
        
    }
  
  } catch (err) {
    next(err);
  }
};
// Get all users   =>   /api/admin/users
export const getAllLeaveRequests = async (req, res, next) => {
  try {
    const LeaveRequests = await LeaveRequests.find().sort({ _id: -1 }).limit(10);

    if (!LeaveRequests) {
      return next(createError(404, `LeaveRequests not found! `));
    }

    res.status(200).json({
      status: "success",
      message: "All LeaveRequests 1 - 10",
      LeaveRequests,
    });
  } catch (err) {
    next(err);
  }
};

export const getLeaveRequests = async (req, res, next) => {
  try {
    const LeaveRequests = await LeaveRequests.findById({ _id: req.params.id });

    res.status(200).json({
      status: "success",
      message: "LeaveRequests",
      LeaveRequests,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllLeaveRequestsBranchs = async (req, res, next) => {
  try {
    const LeaveRequests = await LeaveRequests.find({ branchname: req.body.branchname });

    res.status(200).json({
      status: "success",
      message: "LeaveRequests",
      LeaveRequests,
    });
  } catch (err) {
    next(err);
  }
};

export const getLeaveRequestsBranch = async (req, res, next) => {
  try {
    const LeaveRequestsBranch = await LeaveRequests.findOne({ branchname: req.body.branchname });

    res.status(200).json({
      status: "success",
      message: "LeaveRequests Branch",
      LeaveRequestsBranch,
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

