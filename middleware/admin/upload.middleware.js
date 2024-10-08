const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// End upload Online
module.exports.upload = function (req, res, next) {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    async function upload(req) {
      let result = await streamUpload(req);
      // console.log(result);
      req.body[req.file.fieldname] = result.secure_url;
      next();
    }
    upload(req);
  } else {
    next();
  }
};



module.exports.uploadMultiple = function (req, res, next) {
  if (req.files && Object.keys(req.files).length > 0) {
    let streamUpload = (file) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    };

    async function uploadFiles(files) {
      const uploadedFiles = {};
      for (const [fieldname, fileArray] of Object.entries(files)) {
        const uploadPromises = fileArray.map(file => streamUpload(file));
        const results = await Promise.all(uploadPromises);
        uploadedFiles[fieldname] = results.map(result => result.secure_url);
      }
      
      // Lưu các URL đã upload vào req.body
      Object.assign(req.body, uploadedFiles);
      
      next();
    }

    uploadFiles(req.files);
  } else {
    next();
  }
};