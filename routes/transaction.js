const { body, validationResult } = require("express-validator");
const express = require("express");
const Router = express.Router();
// import user model
const TransactionModel = require("../Models/Trasactions");

// import Middlewares
const bussinessAdminMiddleware = require("../Middlewares/getLogedinUserData");

//ROUTE 1: Get all transactions of the user
Router.get("/", bussinessAdminMiddleware, async (req, res) => {
    try {
        const allTransactions = await TransactionModel.find({ user: req.user.id, status: "active" }).populate("customer", "name");
        return res.json(allTransactions);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

//ROUTE 1: Get all deleted transactions of the user
Router.get("/deleted", bussinessAdminMiddleware, async (req, res) => {
    try {
        const allTransactions = await TransactionModel.find({ user: req.user.id, status: "deleted" }).populate("customer", "name");
        return res.json(allTransactions);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

//ROUTE 2: Add transactions of the user
Router.post(
    "/add",
    bussinessAdminMiddleware,
    [
        body("customer", "لطفآ اینجا چیزی بنوسید").not().isEmpty(),
        body("details", "لطفآ اینجا چیزی بنوسید").not().isEmpty(),
        body("tone_quantity", "لطفآ اینجا چیزی بنوسید").not().isEmpty(),
        body("fuel_type", "لطفآ اینجا چیزی بنوسید").not().isEmpty(),
        body("unit_price", "لطفآ اینجا چیزی بنوسید").not().isEmpty(),
        body("t_type", "لطفآ اینجا چیزی بنوسید").not().isEmpty(),
    ],
    async (req, res) => {
        // Check if there are some errors in the data sent from the client
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // destructure all variables
        const { customer, details, tone_quantity, fuel_type, unit_price, t_type, date, drive, palit, page, status } = req.body;
        const userid = req.user.id;
        try {
            const newTransaction = new TransactionModel({
                user: userid,
                customer: customer,
                details: details,
                tone_quantity: tone_quantity,
                fuel_type: fuel_type,
                unit_price: unit_price,
                t_type: t_type,
                date: date,
                drive: drive, 
                palit: palit, 
                page: page,
                status: status,
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
    const { customer, details, tone_quantity, fuel_type, unit_price, t_type, date,driver, palit, page, status } = req.body;

    // create new transaction object to just append the changed fields
    const newTransaction = {};
    // check the changed fileds
    if (customer) {
        newTransaction.customer = customer;
    }
    if (details) {
        newTransaction.details = details;
    }
    if (tone_quantity) {
        newTransaction.tone_quantity = tone_quantity;
    }
    if (fuel_type) {
        newTransaction.fuel_type = fuel_type;
    }
    if (unit_price) {
        newTransaction.unit_price = unit_price;
    }
    if (t_type) {
        newTransaction.t_type = t_type;
    }
    if (date) {
        newTransaction.date = date;
    }
    newTransaction.drive = driver;
    newTransaction.palit = palit;
    newTransaction.page = page;
    try {
        // find the transaction that needs to be updated
        let transaction = await TransactionModel.findById(req.params.id);
        // check if transaction exists
        if (!transaction) {
            return res.status(404).json({ error: "در سیستم موجود نیست" });
        }
        // if the transaction is in the database, check if the user want to change the transaction is real
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "شما اجازه حذف را ندارید" });
        }
        const updatedTransaction = await TransactionModel.findByIdAndUpdate(req.params.id, { $set: newTransaction }, { new: true });
        return res.json(updatedTransaction);
    } catch (error) {
        return res.status(500).send({ error: "Some error occured" });
    }
});

//ROUTE 4: Delete specific transaction of the user
Router.delete("/delete/:id", bussinessAdminMiddleware, async (req, res) => {
    const TID = req.params.id;
    // find the transaction that needs to be updated
    let transaction = await TransactionModel.findById(TID);
    try {
        // check if transaction exists
        if (!transaction) {
            return res.status(404).json({ error: "در سیستم موجود نیست" });
        }
        // if the transaction is in the database, check if the user want to change the transaction is real
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "شما اجازه حذف را ندارید" });
        }
        await TransactionModel.updateOne({ _id: TID }, { $set: { status: "deleted" } });
        return res.json({ success: "موفقانه حذف شد" });
    } catch (error) {
        return res.status(500).send({ error: "Some error occured" });
    }
});

//ROUTE 4.1: Undelete specific transaction of the user
Router.delete("/undelete/:id", bussinessAdminMiddleware, async (req, res) => {
    const TID = req.params.id;
    // find the transaction that needs to be updated
    let transaction = await TransactionModel.findById(TID);
    try {
        // check if transaction exists
        if (!transaction) {
            return res.status(404).json({ error: "در سیستم موجود نیست" });
        }
        // if the transaction is in the database, check if the user want to change the transaction is real
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "شما اجازه حذف را ندارید" });
        }
        await TransactionModel.updateOne({ _id: TID }, { $set: { status: "active" } });
        return res.json({ success: "موفقانه به سیستم وارد شد" });
    } catch (error) {
        return res.status(500).send({ error: "Some error occured" });
    }
});

//ROUTE 5: Get specific transaction of the user
Router.get("/:id", bussinessAdminMiddleware, async (req, res) => {
    try {
        const transactions = await TransactionModel.findById(req.params.id);
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
