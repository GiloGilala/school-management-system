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
