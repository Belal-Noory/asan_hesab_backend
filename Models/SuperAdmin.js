const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create monoose schema/document
const superAdminSchema = new Schema({
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
    }
  });
const superAdmin = mongoose.model("superAdmin",superAdminSchema);
module.exports = superAdmin;