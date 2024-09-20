const axios = require("axios");

module.exports.verifyEmail = async (email) => {
  try {
    const apiKey = "live_0a9bd111ac2faaab4732e3011f01d42b932db6c7cf0176057e91eb31ab817903"; 
    const response = await axios.get(
      `https://api.kickbox.com/v2/verify?email=${email}&apikey=${apiKey}`
    );

    if (response.data.result === "deliverable") {
      console.log("Email is valid and deliverable");
      return true;
    } else {
      console.log("Invalid or undeliverable email");
      return false;
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    throw new Error("Could not verify email");
  }
};
