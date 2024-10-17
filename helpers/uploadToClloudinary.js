const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

let streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            console.log(result)
              resolve(result);
          } else {
            console.log(error)
              reject(error);
          }
      });
      streamifier.createReadStream(buffer).pipe(stream);
  });
};


module.exports.uploadToCloudinary = async (buffer) => {
  console.log("cc")
  let result = await streamUpload(buffer);
  return result.secure_url;
};





