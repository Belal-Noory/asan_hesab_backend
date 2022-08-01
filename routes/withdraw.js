const express = require("express");
const Router = express.Router();
// import user model
const WithdrawnModel = require("../Models/Withdraw");

// import Middlewares
const bussinessAdminMiddleware = require("../Middlewares/getLogedinUserData");

//ROUTE 1: Get all transactions of the user
Router.get("/", bussinessAdminMiddleware, async (req, res) => {
    try {
        const allTransactions = await WithdrawnModel.find({ user: req.user.id}).populate("holder");
        return res.json(allTransactions);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

//ROUTE 2: Add transactions of the user
Router.post(
    "/add",
    bussinessAdminMiddleware,
    async (req, res) => {
        // destructure all variables
        const { holder, date, amount, type, details } = req.body;
        const userid = req.user.id;
        try {
            const newTransaction = new WithdrawnModel({
                user: userid,
                holder: holder,
                date: date,
                amount: amount,
                type: type,
                details: details,
            });
            const savedTransaction = await newTransaction.save();
            return res.json(savedTransaction);
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Some error occured" });
        }
    }
);

//ROUTE 3: Update specific transaction of the user
Router.put("/update/:id", bussinessAdminMiddleware, async (req, res) => {
    // destructure all variables
    const { holder, date, amount, type, details } = req.body;

    const newTransaction = {};
    // check the changed fileds
    if (holder) {
        newTransaction.holder = holder;
    }
    if (date) {
        newTransaction.date = date;
    }
    if (amount) {
        newTransaction.amount = amount;
    }
    if (type) {
        newTransaction.type = type;
    }
    if (details) {
        newTransaction.details = details;
    }

    try {
        // find the transaction that needs to be updated
        let transaction = await WithdrawnModel.findById(req.params.id);
        // check if transaction exists
        if (!transaction) {
            return res.status(404).json({ error: "در سیستم موجود نیست" });
        }
        // if the transaction is in the database, check if the user want to change the transaction is real
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "شما اجازه حذف را ندارید" });
        }
        const updatedTransaction = await WithdrawnModel.findByIdAndUpdate(req.params.id, { $set: newTransaction }, { new: true });
        return res.json(updatedTransaction);
    } catch (error) {
        return res.status(500).send({ error: "Some error occured" });
    }
});

//ROUTE 5: Get specific transaction of the user
Router.get("/:id", bussinessAdminMiddleware, async (req, res) => {
    try {
        const transactions = await WithdrawnModel.findById(req.params.id);
        // check if transaction exists
        if (!transactions) {
            return res.status(404).json({ error: "در سیستم موجود نیست" });
        }
        res.json(transactions);
    } catch (error) {
        res.status(500).send({ error: "Some error occured" });
    }
});

module.exports = Router;
