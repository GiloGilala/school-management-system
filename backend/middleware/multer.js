import multer from "multer";
import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();

const router = express.Router();

// const dir = "./public/images";
// if (!fs.existsSync(dir)) {
//   fs.mkdirSync(dir, { recursive: true });
// }

// image connect ---------------------------------------
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // cb(null, Date.now() + file.originalname);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// export const upload1 = multer({ storage: fileStorage });
// export const uploadMultiple=upload.fields([{name:'file1',maxCount:10},{name:'file2',maxCount:10}]

export const upload = multer({
  storage: fileStorage,
  // limits: {
  //   fileSize: 1024 * 1024 * 2, // max file size 2MB
  // },
  fileDilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cd(null, false);
      return cd(new Error("Only .png .jpg and .jpeg formate allowed"));
    }
  },
});

const fileFilter4 = (req, file, cb) => {
  const getExtention = file.mimetype.split("/");
  const myExtention = getExtention[getExtention.length - 1];
  if (myExtention == "pdf" || myExtention == "docx" || myExtention == "doc") {
    cb(null, true);
  } else {
    cb(new Error("only pdf,docx and doc files are allowed"));
  }
};

// ================================================= Single Upload

// const upload = multer({ storage: storage });

const fileDilter1 = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    cd(null, false);
    console.log("image not inserted");
    return cd(new Error("Only .png .jpg and .jpeg formate allowed"));
  }
};

router.post("/uploadfiles", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.send({
      success: false,
      message: "No file received",
    });
  }

  // if (!req.file.originalname.match(/\.(jpg|jpeg|png)$/)) {
  //   return res.send({
  //     success: false,
  //     message: "Only .png .jpg and .jpeg formate allowed",
  //   });
  // }

  return res.status(200).json({
    success: true,
    message: "File has been uploaded",
    filePath: res.req.file.path.replace("\\", "/"),
    fileName: res.req.file.filename,
    filePath1: req.file.path,
    file: req.file,
    // fileDis: req.file.destination + req.file.filename,
  });
});

router.post("/thumbnail", (req, res) => {
  let thumbsFilePath = "";
  let fileDuration = "";

  ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {
    // console.dir(metadata);
    // console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;
  });

  ffmpeg(req.body.filePath)
    .on("filenames", function (filenames) {
      // console.log("Will generate " + filenames.join(", "));
      thumbsFilePath = "uploads/thumbnails/" + filenames[0];
    })
    .on("end", function () {
      console.log("Screenshots taken");
      return res.json({
        success: true,
        thumbsFilePath: thumbsFilePath,
        fileDuration: fileDuration,
      });
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 3,
      folder: "uploads/thumbnails",
      size: "300x208",
      // %b input basename ( filename w/o extension )
      filename: "thumbnail-%b.png",
    });
});
// ================================================= Multiple Upload

// const upload = multer({ storage: storage });

app.post("/api/uploadmultiple", upload.array("file"), (req, res) => {
  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false,
      message: "No file received",
    });
  } else {
    console.log(req.files);
    console.log("file received");
    return res.status(200).json({
      success: true,
      message: "File has been uploaded",
    });
  }
});

// =============================================================== Multiple Upload fields

export const uploadMultiple = upload.fields([
  { name: "file1", maxCount: 1 },
  { name: "file2", maxCount: 3 },
]);

app.post("/api/uploadfields", uploadMultiple, function (req, res) {
  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false,
      message: "No file received",
    });
  } else {
    console.log(req.files);
    console.log("file received");
    return res.status(200).json({
      success: true,
      message: "File has been uploaded",
    });
  }
});

// ==============================

// app.post("/api/files/remove", (req, res) => {
//   fs.unlink(pathToDir + "\\" + req.body.name, function (err) {
//     if (err) return console.log(err);
//     return res.status(200).json({
//       status: "deleted",
//     });
//   });
// });

// app.post("/api/files/getAllFiles", async (req, res) => {
//   await getFiles(pathToDir, function (err, files) {
//     return res.status(200).json({
//       status: "success",
//       data: files,
//     });
//   });
// });

// const upload = multer({
//   storage: multer.diskStorage({
//     destination(req, file, cb) {
//       cb(null, "./ReferencePaper");
//     },
//     filename(req, file, cb) {
//       cb(null, `${new Date().getTime()}_${file.originalname}`); },
//  }),
//   limits: { fileSize: 1024 * 1024 * 2, // max file size 2MB },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(pdf|doc|docx|xlsx|xls)$/)) {
//       return cb(
//         new Error(
//           "Please Uploadfiles only with the extensions pdf, doc, docx, xslx, xls."
//         )
//       );
//     }
//     cb(undefined, true); // continue with upload
//   },
// });

export default router;
