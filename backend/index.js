import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// import multer from "multer";

import authRoute from "./app/user/routes/auth.js";
import usersRoute from "./app/user/routes/users.js";

import categoriesRoute from "./app/Blog/routes/categories.js";
import tagsRoute from "./app/Blog/routes/tags.js";
import commentsRoute from "./app/Blog/routes/comments.js";
import postsRoute from "./app/Blog/routes/posts.js";
import notesRoute from "./app/Blog/routes/notes.js";
import mediasRoute from "./app/Blog/routes/media.js";
import sendEmail from "./utils/sendEmail.js";

// import { upload, uploadMultiple } from "./middleware/multer.js";
import uploadRoute from "./middleware/multer.js";

// create express app
const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// db
try {
  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.MONGO);
  console.log("Connected to mongoDB.");
} catch (error) {
  throw error;
}

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

// apply middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Serving the static folder for user profile pictures
//connection routes dynamicllay
// readdirSync("./routes").map((r)=>app.use("/api", require(`./routes/${r}`)));

//connection routes dynamicllay

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);

app.use("/api/categories", categoriesRoute);
app.use("/api/posts", postsRoute);
app.use("/api/tags", tagsRoute);
app.use("/api/comments", commentsRoute);
app.use("/api/notes", notesRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/upload", mediasRoute);

//Error Handlers
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// port
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));

// const createbaseUrl = async (req, res) => {
//   const baseUrl = req.protocol + "://" + req.get("host");
//   console.log(baseUrl);
// };

// sendEmail(
//       "jacavix669@letpays.com",
//       "Verify Email",
//       `click on the link to change password of your account . this link is valid only for 1 hour.`
//     );