const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create monoose schema/document
const userSchema = new Schema({
    name:  {
       type: String,
       required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: { type: Date, default: Date.now },
    company:  {
        type: String,
        required: true
     },
     status:  {
        type: String,
        default: "active"
     },
  });
const User = mongoose.model("user",userSchema);
module.exports = User;