// const mongoose = require('mongoose');

// const connectToDB = async () => {
//     try{
//        await mongoose.connect(process.env.MONGO_URI)
//        console.log('Database connected successfully');

//     }catch(error){
//         console.error('Database connection failed', error);
//         process.exit(1);
//     }
// }

// module.exports = connectToDB;

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
console.log("MONGO_URI:", MONGO_URI); // Debugging line

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable.");
}

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectToDB;