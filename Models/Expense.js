const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create monoose schema/document
const expenseSchema = new Schema({
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
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
    },
    kind: {
        type: String,
    },
    status: { type: String, default: "active" },
});
const Transaction = mongoose.model("expense", expenseSchema);
module.exports = Transaction;
