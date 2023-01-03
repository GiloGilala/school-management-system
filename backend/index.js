import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// import multer from "multer";
import { google } from "googleapis";
import  nodemailer from "nodemailer";

import authRoute from "./app/user/routes/auth.js";
import usersRoute from "./app/user/routes/users.js";

import categoriesRoute from "./app/Blog/routes/categories.js";
import tagsRoute from "./app/Blog/routes/tags.js";
import commentsRoute from "./app/Blog/routes/comments.js";
import postsRoute from "./app/Blog/routes/posts.js";
import notesRoute from "./app/Blog/routes/notes.js";
import mediasRoute from "./app/Blog/routes/media.js";
// import sendMail from "./nodemailer.js";

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

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLEINT_SECRET,
  process.env.REDIRECT_URI,
  process.env.REFRESH_TOKEN,
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'gilogilala@gmail.com', 
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLEINT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'SENDER NAME <gilogilala@gmail.com>',
      to: 'gilogilala@hotmail.com',
      subject: 'Hello from gmail using API',
      text: 'Hello from gmail email using API',
      html: '<h1>Hello from gmail email using API</h1>',
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

sendMail()
  .then((result) => console.log('Email sent...', result))
  .catch((error) => console.log(error.message));

  const baseUrl = `${protocol}//${hostname}`
console.log(baseUrl)