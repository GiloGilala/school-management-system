import jwt from "jsonwebtoken";
import { createError } from "../../../utils/error.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import sendEmail from "../../../utils/sendEmail.js";

// Register a user   => /api/register

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashPwd = bcrypt.hashSync(req.body.password, salt);

    //validations

    const { username, email, password } = req.body;

    if (!username) return next(createError(400, "UserName must be provided!"));

    if (!password || password.length < 8)
      return next(createError(400, "Password must be 8 character long!"));

    const user = await User.findOne({ email }).exec();
    if (user) return next(createError(400, "User already registered!"));

    // const url = `http://localhost:5000/api/auth/${user.id}/${token}`;
    await sendEmail(
      email,
      "Verify Email Regster",
      `click on the link to change password of your account . this link is valid only for 1 hour.`
    );

    const newUser = new User({
      // fullname: req.body.fullname,
      // username: req.body.username,
      // email: req.body.email,
      // password: hash,
      ...req.body,
      password: hashPwd,
    });

    // const token = jwt.sign(
    //   { username, email, password },
    //   process.env.JWT_ACCOUNT_ACTIVATION,
    //   {
    //     expiresIn: "5d",
    //   }
    // );

    await newUser.save();
    // res.status(200).send("User has been created.");
    res.status(200).send(newUser);
  } catch (err) {
    next(err);
  }
};

export const register1 = async (req, res, next) => {
  try {
   const salt = bcrypt.genSaltSync(10);
    const hashPwd = bcrypt.hashSync(req.body.password, salt);
    //validations

    const { username, email, password  } = req.body;

    if (!username) return next(createError(400, "UserName must be provided!"));

    if (!password || password.length < 8)
      return next(createError(400, "Password must be 8 character long!"));

    const user = await User.findOne({ email }).exec();
    if (user) return next(createError(400, "User already registered!"));

    const token = jwt.sign(
      { username, email, password:hashPwd, },
      process.env.JWT_ACCOUNT_ACTIVATE,
      {
        expiresIn: "7d",
      }
    );
     // console.log(token)
     const url = `http://localhost:5000/api/auth/activate/${token}`;
     // console.log(token)
     // console.log(url)

    await sendEmail(
      email,
      "Verify Email",
      `click on the link to change password of your account ${url}. this link is valid only for 1 hour.`
    );

    // res.status(200).send("User has been created.");
    res.status(200).send({
      status: "success",
      message: " Verify Email Sent... Please Check Your Email",
    });
  } catch (err) {
    next(err);
  }
};

 // const url = `http://localhost:5000/api/auth/${user._id}/${token}`;

export const activateAccount = async (req, res, next) => {
  try {
    const { token } = req.body;

    
    // let password = hashPwd;
   
       let decodedToken = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATE) 

        if (!decodedToken) return next(createError(400, "Incorrect or Expired link!"));

       const { username, email,  password } = decodedToken;

      const user = await User.findOne({ email }).exec();
    if (user) return next(createError(400, "User already registered!"));

    //  const salt = bcrypt.genSaltSync(10);
    // const hashPwd = bcrypt.hashSync(decodedToken.password, salt);
     
        const newUser = new User({
      username,
      email,
      password,
      // password:hashPwd,
    });
    await newUser.save();
    console.log(decodedToken)
    // res.status(200).send("User has been created.");
    res.status(200).send(newUser);
    
  } catch (err) {
    next(err);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    
    const { email  } = req.body;
  
    const user = await User.findOne({ email }).exec();
    if (!user) return next(createError(400, "User dose not exists "));

    const token = jwt.sign(
      {  id: user._id },
      process.env.RESET_PASSWORD_KEY,
      {
        expiresIn: "20m",
      }
    );
    
     const url = `http://localhost:5000/api/auth/resetpassword/${token}`;
  
    await sendEmail(
      email,
      "Verify Email",
      `click on the link to change password of your account 
      ${url}
       this link is valid only for 1 hour.`
    );
return user.updateOne({resetLink: token})
    // res.status(200).send("User has been created.");
    res.status(200).send({
      status: "success",
      message: " Verify Email Sent... Please Check Your Email",
    });
  } catch (err) {
    next(err);
  }
};

// Login User  =>  /api/login

export const login = async (req, res, next) => {
  try {
    //check whether we have the user or not with that email
    User.findOne({ email: req.body.email }).exec(async (error, user) => {
      if (!user) return next(createError(400, "Please enter email "));
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordCorrect) return next(createError(401, "Wrong password! "));

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "5d",
      });

      const { _id, username, email, roles } = user;
      res
        .cookie("t", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ token, user: { _id, email, username, roles } });
    });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    //check whether we have the user or not with that email
    User.findOne({ email: req.body.email }).exec(async (error, user) => {
      if (!user) return next(createError(400, "Please enter email "));

      // if (!user.activeStatus)
      //   return next(createError(400, { message: "Unauthorized" }));

      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordCorrect) return next(createError(401, "Wrong password! "));

      const accessToken = jwt.sign(
        {
          id: user._id,
          username: user.username,
          roles: user.roles,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      const refreshToken = jwt.sign(
        { id: user._id, username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      // Create secure cookie with refresh token
      const { _id, username, email, roles } = user;
      res
        .cookie("jwt", accessToken, {
          httpOnly: true, //accessible only by web server
          secure: true, //https
          sameSite: "None", //cross-site cookie
          maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
        })
        .status(200)
        .json({ message: "Signin Success" });
        // .json({  user: { _id, email, username, roles } });
    });
  } catch (err) {
    next(err);
  }
};



export const upDatePassword = async (req, res, next) => {
  try {
    //check whether we have the user or not with that email
    User.findOne({ email: req.body.email }).exec(async (error, user) => {
      if (!user) return next(createError(400, "Please enter email "));
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordCorrect) return next(createError(401, "Wrong password! "));

      const token = jwt.sign({ id: user._id }, RESET_PASSWORD_KEY, {
        expiresIn: "5d",
      });

      const { _id, username, email, roles } = user;
      res
        .cookie("t", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ token, user: { _id, email, username, roles } });
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return next(
      createError(401, { message: "Login first to access this resource." })
    );
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return next(createError(403, { message: "Forbidden." }));

      const user = await User.findOne({
        id: decoded._id,
        // username: decoded.username,
      }).exec();

      if (!user) return next(createError(403, { message: "Unauthorized." }));

      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: user._id,
            username: user.username,
            roles: user.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  );
};

export const logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.json({ message: "Signout Success" });
  } catch (err) {
    console.log(err);
  }
};

// export const logout = async (req, res) => {
//   try {
//     res.clearCookie("t");
//     return res.json({ message: "Signout Success" });
//   } catch (err) {
//     console.log(err);
//   }
// };
