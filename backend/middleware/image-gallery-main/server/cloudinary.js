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
