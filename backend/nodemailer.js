import { google } from "googleapis";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// These id's and secrets should come from .env file.
// const CLIENT_ID = '418675791962-0g34j6rf05pb60alicvilc8p8sduatu0.apps.googleusercontent.com
// ';
// const CLEINT_SECRET = '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';
// const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
// const REFRESH_TOKEN = '1//048q_u1E1jMOaCgYIARAAGAQSNwF-L9Ir4AGK4zGRzcHTRZ5MK00pCDFkxGkDGtuFkT2CFqiqqbaB8aT5Tcc7moOivK5C3F_HpYA';

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLEINT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export async function sendMail1(email, subject, text) {
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
      from: "SENDER NAME <gilogilala@gmail.com>",
      to: "gilogilala@hotmail.com",
      subject: "Hello from gmail using API",
      text: "Hello from gmail email using API",
      html: "<h1>Hello from gmail email using API</h1>",
    };

    const result = await transport.sendMail(mailOptions);
    console.log("email sent successfully");
    return result;
  } catch (error) {
    console.log("email not sent!");
    return error;
  }
}

export const sendMail = async () => {
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
      from: "SENDER NAME <gilogilala@gmail.com>",
      to: "gilogilala@hotmail.com",
      subject: "Hello from gmail using API",
      text: "Hello from gmail email using API",
      html: "<h1>Hello from gmail email using API</h1>",
    };

    const result = await transport.sendMail(mailOptions);
    console.log("email sent successfully");
    return result;
  } catch (error) {
    console.log("email not sent!");
    return error;
  }
};

// sendMail()
//   .then((result) => console.log("Email sent...", result))
//   .catch((error) => console.log(error.message));
// export default sendMail1
