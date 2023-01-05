import { google } from "googleapis";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLEINT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sendEmail = async (email, subject, text) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "gilogilala@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLEINT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "GILO <gilogilala@gmail.com>",
      to: email,
      subject: subject,
      text: text,
      // html: "<h1>Hello from gmail email using API</h1>",
    };

    const result = await transport.sendMail(mailOptions);
    console.log("email sent successfully 1");
    return result;
  } catch (error) {
    console.log("email not sent!");
    return error;
  }
};

export default sendEmail;
