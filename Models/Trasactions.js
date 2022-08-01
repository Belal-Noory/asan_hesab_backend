const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create monoose schema/document
const transactionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer",
    },
    date: { type: Date, default: Date.now },
    details: {
        type: String,
    },
    tone_quantity: {
        type: Number,
        required: true,
    },
    fuel_type: {
        type: String,
        required: true,
    },
    unit_price: {
        type: Number,
        required: true,
    },
    t_type: {
        type: String,
        required: true,
    },
    drive: {type: String},
    palit: {type: String},
    page: {type: String},
    status: { type: String, default: "active" },
});
const Transaction = mongoose.model("transaction", transactionSchema);
module.exports = Transaction;
