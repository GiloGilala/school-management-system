
cloudinary.config({ 
  cloud_name: 'dv14ebnf2', 
  api_key: '832835675429238', 
  api_secret: 'fXrR4daj_2bNVMkmWFNhYtFbQDo' 
});


const express = require("express");
var path = require("path");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "uploads")));

var URIstring = "your-mongodb-connection-string";

app.use("/galleries", require("./routes/gallery"));

mongoose.connect(URIstring, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use("./uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
module.exports = app.listen(PORT, () => {
  console.log("Server listening in port:" + PORT);
});

============

const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dmcxlwnr3",
  api_key: "869218425715569",
  api_secret: "vG-REAiBMFGVhKr31H5XTLcPlso",
});

exports.uploads = async (file, folder) => {
  const result = await cloudinary.v2.uploader.upload(file, {
    eager: { crop: "thumb", width: 200, gravity: "face" },
    // eager_async: true,
    resource_type: "auto",
    folder: folder,
  });
  console.log("result here:", result);
  return result;
};

exports.delete = async (public_id) => {
  const response = await cloudinary.v2.uploader.destroy(public_id);
  console.log("~~~~cloudinary: ", response);
  return response;
};

==================

const Gallery = require("../models/Gallery");
const router = require("express").Router();
const upload = require("../middlewares/multer");
const fs = require("fs");

router.get("/", (req, res) => {
  Gallery.find().exec((err, galleries) => {
    if (err)
      return res.json({
        status: false,
        message: "Server errors",
        result: err,
      });
    return res.json({
      status: false,
      message: "Data found",
      result: galleries,
    });
  });
});

router.post("/add", (req, res) => {
  const gallery = new Gallery(req.body);
  gallery.save((err, newGallery) => {
    if (err)
      return res.json({
        status: false,
        message: "Server errors",
        result: err,
      });
    return res.json({
      status: true,
      message: "Gallery added",
      result: newGallery,
    });
  });
});

router.put("/upload/:galleryId", upload.array("image", 3), async (req, res) => {
  const inputfiles = req.files;
  const images = [];
  inputfiles.map((file) => {
    images.push(file.filename);
  });
  const galleryId = req.params.galleryId;

  Gallery.findOneAndUpdate(
    { _id: galleryId },
    { $push: { images: images } },
    { new: true },
    function (err, data) {
      if (err) {
        res.status(500).json({
          status: false,
          message: "Upload error",
          result: err,
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Upload successfully!",
          result: data,
        });
      }
    }
  );
});

router.get("/detail/:galleryId", (req, res) => {
  const galleryId = req.params.galleryId;
  Gallery.findOne({ _id: galleryId }, function (err, gallery) {
    if (err) {
      res.status(500).json({
        status: false,
        message: "Get gallery error",
        result: err,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Get gallery successfully!",
        result: gallery,
      });
    }
  });
});

router.put("/removeImage/:galleryId", async (req, res) => {
  const fileName = req.body.fileName;
  console.log("~~~fileName: ", fileName);

  const galleryId = req.params.galleryId;

  Gallery.findOneAndUpdate(
    { _id: galleryId },
    { $pull: { images: fileName } },
    { new: true },
    function (err, data) {
      if (err) {
        res.status(500).json({
          status: false,
          message: "Remove image error",
          result: err,
        });
      } else {
        const path = "server/uploads/" + fileName;
        fs.unlinkSync(path);
        res.status(200).json({
          status: true,
          message: "Remove image successfully!",
          result: data,
        });
      }
    }
  );
});

module.exports = router;

================

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallerySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  images: {
    type: [String],
    required: false,
  },
});

module.exports = mongoose.model("galleries", gallerySchema);

======================

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./server/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: fileFilter,
});

module.exports = upload;

=================



/**
 * it gives a number as byte and convert it to KB, MB and GB (depends on file size) and return the result as string.
 * @param number file size in Byte
 */
function ConvertSize(number)
{
    if(number <= 1024) { return (`${number} Byte`); }
    else if(number > 1024 && number <= 1048576) { return ((number / 1024).toPrecision(3) + ' KB'); }
    else if(number > 1048576 && number <= 1073741824) { return ((number / 1048576).toPrecision(3) + ' MB'); }
    else if(number > 1073741824 && number <= 1099511627776) { return ((number / 1073741824).toPrecision(3) + ' GB'); }
}



==============================================



//configure multer

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a valid image file'))
        }
        cb(undefined, true)
    }
})

app.post('/image', upload.single('upload'), async (req, res) => {
    try {
         await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toFile(__dirname + `/images/${req.file.originalname}`)
         res.status(201).send('Image uploaded succesfully')
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})


const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "devitproject.media@gmail.com", // generated ethereal user
        pass: "ezwvvpfzwrljqzbf"  // generated ethereal password
    }
});

let sendEmail = (emailTemplate) => {
    transporter.sendMail(emailTemplate, (err, info) => {
        if(err) {
            console.log(err)
        }else{
            console.log('Email sent: ', info.response)
        }
    })
}

module.exports = {sendEmail};


let resetPassword = (email, token) => {
    const emailTemplate = {
        from: "noreply@gmail.com",
        to: email,
        subject: "Password reset for " + email,
        text:
            "Password Reset Link: " + 
            "localhost: 4000/customers/" + 
            "resetPassword/" + token,
    };
    return emailTemplate;
}

module.exports = { resetPassword };

