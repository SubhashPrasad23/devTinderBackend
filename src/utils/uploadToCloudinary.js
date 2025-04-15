const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath, folder = "profiles") => {
  try {
    if (!filePath) return null;

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    });
    fs.unlinkSync(filePath); // Delete local file after upload
    return result.secure_url;
  } catch (err) {
    fs.unlinkSync(filePath);
    throw err;
  }
};

module.exports = uploadToCloudinary;
