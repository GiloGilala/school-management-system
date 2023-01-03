import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploads = async (file, folder) => {
  const result = await cloudinary.v2.uploader.upload(
    file,
    {
      // eager: { crop: "thumb", width: 200, gravity: "face" },
      // eager_async: true,
      resource_type: "auto",
      folder: folder,
    },
    {
      public_id: result.public_id,
      url: result.secure_url,
      // public_id: result.public_id,
      // url: result.secure_url,
    }
  );
  console.log("result here:", result);
  return result;
};

export const delete1 = async (public_id) => {
  const response = await cloudinary.v2.uploader.destroy(public_id);
  console.log("~~~~cloudinary: ", response);
  return response;
};

// req.files.file.path
export const upload = async (req, res) => {
  let result = await cloudinary.uploader.upload(file, {
    public_id: `${Date.now()}`,
    resource_type: "auto", // jpeg, png
    // public_id: `${Date.now()}`,
    // resource_type: "auto", // jpeg, png
  });
  res.json({
    public_id: result.public_id,
    url: result.secure_url,
    // public_id: result.public_id,
    // url: result.secure_url,
  });
};

export const remove = (req, res) => {
  let image_id = req.body.public_id;

  cloudinary.uploader.destroy(image_id, (err, result) => {
    if (err) return res.json({ success: false, err });
    res.send("ok");
  });
};
// exports.upload = async (req, res) => {
//   let result = await cloudinary.uploader.upload(req.body.image, {
//     public_id: `${Date.now()}`,
//     resource_type: "auto", // jpeg, png
//   });
//   res.json({
//     public_id: result.public_id,
//     url: result.secure_url,
//   });
// };

// exports.remove = (req, res) => {
//   let image_id = req.body.public_id;

//   cloudinary.uploader.destroy(image_id, (err, result) => {
//     if (err) return res.json({ success: false, err });
//     res.send("ok");
//   });
// };

// how to resize
// cloudinary.image("turtles.jpg", {width: 70, height: 53, crop: "scale"})
