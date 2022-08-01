const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create monoose schema/document
const withdrawSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    holder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shareholder",
    },
    date: { type: Date, default: Date.now },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    details: {
        type: String,
    }
});
const Transaction = mongoose.model("withdraw", withdrawSchema);
module.exports = Transaction;
