const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "dblbb0djk",
  api_key: "952127182447594",
  api_secret: "mqR8zwdSwo8nO2GI4b3_GjJefgA",
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
