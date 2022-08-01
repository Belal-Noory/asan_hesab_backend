const { body, validationResult } = require("express-validator");
const express = require("express");
const Router = express.Router();

// import Middlewares
const bussinessAdminMiddleware = require("../Middlewares/getLogedinUserData");

// import user model
const CustomernModel = require("../Models/Customers");

// Import Transaction Model
const TransactionModel = require("../Models/Trasactions");

//ROUTE 1: Get all customers of the user
Router.get("/", bussinessAdminMiddleware, async (req, res) => {
    try {
        const allTransactions = await CustomernModel.find({ user: req.user.id, status: "active", type: "customer" });
        return res.json(allTransactions);
    } catch (error) {
        return res.status(500).send({ error: "Some error occured" });
    }
});

//ROUTE 1: Get all staff of the user
Router.get("/staffs", bussinessAdminMiddleware, async (req, res) => {
    try {
        const allTransactions = await CustomernModel.find({ user: req.user.id, status: "active", type: "staff" });
        return res.json(allTransactions);
    } catch (error) {
        return res.status(500).send({ error: "Some error occured" });
    }
});

//ROUTE 1: Get all staff of the user
Router.get("/hodlers", bussinessAdminMiddleware, async (req, res) => {
    try {
        const allTransactions = await CustomernModel.find({ user: req.user.id, status: "active", type: "shareholder" });
        return res.json(allTransactions);
    } catch (error) {
        return res.status(500).send({ error: "Some error occured" });
    }
});

//ROUTE 1.1: Get all deleted customers of the user
Router.get("/deleted", bussinessAdminMiddleware, async (req, res) => {
    try {
        const allTransactions = await CustomernModel.find({ user: req.user.id, status: "deleted", type: "customer" });
        return res.json(allTransactions);
    } catch (error) {
        return res.status(500).send({ error: "Some error occured" });
    }
});

//ROUTE 1.1: Get all deleted customers of the user
Router.get("/staffs/deleted", bussinessAdminMiddleware, async (req, res) => {
    try {
        const allTransactions = await CustomernModel.find({ user: req.user.id, status: "deleted", type: "staff" });
        return res.json(allTransactions);
    } catch (error) {
        return res.status(500).send({ error: "Some error occured" });
    }
});

//ROUTE 2: Add new customer of the user
Router.post("/add", bussinessAdminMiddleware, [body("name", "لطفآ اسم مشتری را بنوسید").not().isEmpty(), body("phone", "لطفآ شماره تماس مشتری را بنوسید").not().isEmpty()], async (req, res) => {
    // Check if there are some errors in the data sent from the client
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
    }
    // destructure all variables
    const { name, phone } = req.body;
    const userid = req.user.id;
    try {
        const newCustomer = new CustomernModel({ user: userid, name, phone });
        const savedCustomer = await newCustomer.save();
        return res.json(savedCustomer);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

//ROUTE 2: Add new customer of the user
Router.post("/staff/add", bussinessAdminMiddleware, [body("name", "لطفآ اسم کارمند را بنوسید").not().isEmpty(), body("phone", "لطفآ شماره تماس کارمند را بنوسید").not().isEmpty()], async (req, res) => {
    // Check if there are some errors in the data sent from the client
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
    }
    // destructure all variables
    const { name, phone } = req.body;
    const userid = req.user.id;
    try {
        const newCustomer = new CustomernModel({ user: userid, name, phone, type: "staff" });
        const savedCustomer = await newCustomer.save();
        return res.json(savedCustomer);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

//ROUTE 3: Update specific customer of the user
Router.put("/update/:id", bussinessAdminMiddleware, async (req, res) => {
    // destructure all variables
    const { name, phone } = req.body;

    // create new transaction object to just append the changed fields
    const newCustomer = { name: name, phone: phone };
    try {
        // find the transaction that needs to be updated
        let customer = await CustomernModel.findById(req.params.id.toString());
        // check if transaction exists
        if (!customer) {
            return res.status(404).json({ error: "در سیستم موجود نیست" });
        }
        // if the transaction is in the database, check if the user want to change the transaction is real
        if (customer.user.toString() !== req.user.id.toString()) {
            return res.status(401).json({ error: "شما اجازه حذف را ندارید" });
        }

        const updatedTransaction = await CustomernModel.findByIdAndUpdate(req.params.id, newCustomer, { new: true });
        return res.json(updatedTransaction);
    } catch (error) {
        return res.status(500).send({ error: "Some error occured" });
    }
});

//ROUTE 3: Update specific customer of the user
Router.put("/update/active/:id", bussinessAdminMiddleware, async (req, res) => {
    const cusID = req.params.id;
    try {
        // find the transaction that needs to be updated
        let customer = await CustomernModel.findById(cusID);
        // check if transaction exists
        if (!customer) {
            return res.status(404).json({ error: "در سیستم موجود نیست" });
        }
        // if the transaction is in the database, check if the user want to change the transaction is real
        if (customer.user.toString() !== req.user.id.toString()) {
            return res.status(401).json({ error: "شما اجازه حذف را ندارید" });
        }

        const updated = await CustomernModel.updateOne({ _id: cusID }, { $set: { status: "active" } });
        return res.json(updated);
    } catch (error) {
        return res.status(500).send({ error: "Some error occured" });
    }
});

//ROUTE 4: Delete specific customers of the user
Router.delete("/delete/:id", bussinessAdminMiddleware, async (req, res) => {
    const cusID = req.params.id;
    try {
        // find the transaction that needs to be updated
        let customer = await CustomernModel.findById(cusID);
        // check if transaction exists
        if (!customer) {
            return res.status(404).json({ error: "در سیستم موجود نیست" });
        }
        // if the transaction is in the database, check if the user want to change the transaction is real
        if (customer.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "شما اجازه حذف را ندارید" });
        }
        await CustomernModel.updateOne({ _id: cusID }, { $set: { status: "deleted" } });
        await TransactionModel.updateMany({ customer: cusID }, { $set: { status: "deleted" } });
        return res.json({ result: "Successfully Deleted" });
    } catch (error) {
        return res.status(500).send({ error: "Some error occured" });
    }
});

//ROUTE 4.1: Delete many customers of the user
Router.delete("/deletemany", bussinessAdminMiddleware, async (req, res) => {
    const { source } = req.body;
    try {
        CustomernModel.updateMany({ _id: source }, { $set: { status: "deleted" } }, { multi: true }, (err, writeResult) => {
            if (err) {
                res.send({ error: err });
            }
            return res.json(writeResult);
        });
    } catch (error) {
        return res.status(500).send({ error: "Some error occured" });
    }
});

//ROUTE 5: Get specific transaction of the user
Router.get("/:id", bussinessAdminMiddleware, async (req, res) => {
    try {
        const customer = await CustomernModel.findById(req.params.id);
        // check if transaction exists
        if (!customer) {
            return res.status(404).json({ error: "در سیستم موجود نیست" });
        }
        return res.json(customer);
    } catch (error) {
        return res.status(500).send({ error: "Some error occured" });
    }
});

module.exports = Router;
