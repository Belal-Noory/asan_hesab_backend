const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create monoose schema/document
const shareholderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    name: {
        type: String,
        required: true,
    },
    capital: {
        type: Number,
        required: true,
    },
    date: { type: Date, default: Date.now }
});
const Customer = mongoose.model("shareholder", shareholderSchema);
module.exports = Customer;
