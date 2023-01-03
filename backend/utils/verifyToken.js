import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import User from "../app/user/models/User.js";

//  ths is working

// verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor)
//  isAuthRoles(["superadmin", "admin"]),

export const isJwtUser = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    req.id = decoded.UserInfo.id;
  });

  next();
};

export const isAuthUser = async (req, res, next) => {
  const token = req.cookies.t;

  if (!token) {
    return next(createError(401, "Login first to access this resource."));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select("-password");
  req.roles = decoded.roles;
  next();
};

// Handling users roles
export const isAuthRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
      return next(
        createError(
          401,
          `Role (${req.user.role}) is not allowed to acccess this resource`
        )
      );
    }
    next();
  };
};
// ===================================

export const checkRole = (roles) => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json("Unauthorized")
    : next();

// ================================

// export const isAdmin = (req, res, next) => {
//   User.findById(req.userId).exec((err, user) => {
//     if (err) {
//       res.status(500).send({ message: err });
//       return;
//     }
//     Role.find(
//       {
//         _id: { $in: user.roles },
//       },
//       (err, roles) => {
//         if (err) {
//           res.status(500).send({ message: err });
//           return;
//         }
//         for (let i = 0; i < roles.length; i++) {
//           if (roles[i].name === "admin") {
//             next();
//             return;
//           }
//         }
//         res.status(403).send({ message: "Require Admin Role!" });
//         return;
//       }
//     );
//   });
// };

// export const checkRolesExisted = (req, res, next) => {
//   if (req.body.roles) {
//     for (let i = 0; i < req.body.roles.length; i++) {
//       if (!ROLES.includes(req.body.roles[i])) {
//         res.status(400).send({
//           message: `Failed! Role ${req.body.roles[i]} does not exist!`,
//         });
//         return;
//       }
//     }
//   }
//   next();
// };

// Super Admin Protected Route

// router.get(
//   "/super-admin-and-admin-protectd",
//   userAuth,
//   checkRole(["superadmin", "admin"]),
//   async (req, res) => {
//     return res.json("Super admin and Admin");
//   }
// );
