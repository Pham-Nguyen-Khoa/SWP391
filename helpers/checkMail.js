const axios = require("axios");

module.exports.verifyEmail = async (email) => {
  try {
    const apiKey = "live_4837389fcef584b773681ac760011a0ab3d9b93fe3870be055b42f7fe32c98e4"; 
    const response = await axios.get(
      `https://api.kickbox.com/v2/verify?email=${email}&apikey=${apiKey}`
    );
    console.log("API Response:", response.data); 
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
