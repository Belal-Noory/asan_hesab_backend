const { body, validationResult } = require("express-validator");
const express = require("express");
const Router = express.Router();

// import Middlewares
const bussinessAdminMiddleware = require("../Middlewares/getLogedinUserData");
// import user model
const ExpenseModel = require("../Models/Expense");

//ROUTE 1: Get all expenses of the user
Router.get("/", bussinessAdminMiddleware, async (req, res) => {
  try {
    const allTransactions = await ExpenseModel.find({
      user: req.user.id,
      status: "active",
    });
    return res.json(allTransactions);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

//ROUTE 1.1: Get all deleted expenses of the user
Router.get("/deleted", bussinessAdminMiddleware, async (req, res) => {
  try {
    const allTransactions = await ExpenseModel.find({
      user: req.user.id,
      status: "deleted",
    }).populate("customer", "name");
    return res.json(allTransactions);
  } catch (error) {
    return res.status(500).send({ error: "Some error occured" });
  }
});

//ROUTE 2: Add new expense of the user
Router.post(
  "/add",
  bussinessAdminMiddleware,
  [
    body("date", "لطفآ کارمند را بنوسید").not().isEmpty(),
    body("details", "لطفآ تفصیلات را بنوسید").not().isEmpty(),
    body("amount", "لطفآ مقدار پول را بنوسید").not().isEmpty(),
  ],
  async (req, res) => {
    // Check if there are some errors in the data sent from the client
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    // destructure all variables
    const { date, details, amount, type, kind } = req.body;
    const userid = req.user.id;
    try {
      const newCustomer = new ExpenseModel({
        user: userid,
        date,
        details,
        amount,
        kind,
      });
      const savedCustomer = await newCustomer.save();
      return res.json(savedCustomer);
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }
);

//ROUTE 3: Update specific customer of the user
Router.put("/update/:id", bussinessAdminMiddleware, async (req, res) => {
  // destructure all variables
  const { user, date, details, amount, kind } = req.body;
  console.log(req.body);
  // create new transaction object to just append the changed fields
  const newCustomer = { user, date, details, amount, kind };
  try {
    // find the transaction that needs to be updated
    let customer = await ExpenseModel.findById(user);
    // check if transaction exists
    if (!customer) {
      return res.status(404).json({ error: "در سیستم موجود نیست" });
    }
    // if the transaction is in the database, check if the user want to change the transaction is real
    if (customer.user.toString() !== req.user.id.toString()) {
      return res.status(401).json({ error: "شما اجازه حذف را ندارید" });
    }

    const updatedTransaction = await ExpenseModel.findByIdAndUpdate(
      user,
      newCustomer,
      { new: true }
    );
    console.log(updatedTransaction);
    return res.json(updatedTransaction);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

//ROUTE 4: Delete specific expense of the user
Router.delete("/delete/:id", bussinessAdminMiddleware, async (req, res) => {
  const cusID = req.params.id;
  try {
    // find the transaction that needs to be updated
    let customer = await ExpenseModel.findById(cusID);
    // check if transaction exists
    if (!customer) {
      return res.status(404).json({ error: "در سیستم موجود نیست" });
    }
    // if the transaction is in the database, check if the user want to change the transaction is real
    if (customer.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "شما اجازه حذف را ندارید" });
    }
    await ExpenseModel.updateOne(
      { _id: cusID },
      { $set: { status: "deleted" } }
    );
    return res.json({ result: "Successfully Deleted" });
  } catch (error) {
    return res.status(500).send({ error: "Some error occured" });
  }
});

//ROUTE 4.1: Undelete specific expense of the user
Router.delete("/undelete/:id", bussinessAdminMiddleware, async (req, res) => {
  const cusID = req.params.id;
  try {
    // find the transaction that needs to be updated
    let customer = await ExpenseModel.findById(cusID);
    // check if transaction exists
    if (!customer) {
      return res.status(404).json({ error: "در سیستم موجود نیست" });
    }
    // if the transaction is in the database, check if the user want to change the transaction is real
    if (customer.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "شما اجازه حذف را ندارید" });
    }
    await ExpenseModel.updateOne(
      { _id: cusID },
      { $set: { status: "active" } }
    );
    return res.json({ result: "Successfully Deleted" });
  } catch (error) {
    return res.status(500).send({ error: "Some error occured" });
  }
});

module.exports = Router;
