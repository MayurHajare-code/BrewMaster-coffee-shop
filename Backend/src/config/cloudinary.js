import dotenv from "dotenv";
dotenv.config();


import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


// console.log("Cloud Name:", process.env.CLOUD_NAME);
// console.log("API Key:", process.env.API_KEY);
// console.log("API Secret:", process.env.API_SECRET);


export default cloudinary;
