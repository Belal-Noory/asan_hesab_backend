const database = require("./Helpers/Database.js");
const express = require("express");
const cors = require("cors");

// Import routes
const superAdminRoutes = require("./routes/superAdminAuth");
const AdminRoutes = require("./routes/bussinessAdmin");
const Transactions = require("./routes/transaction");
const Customers = require("./routes/customer");
const Expense = require("./routes/expense");
const Shareholder = require("./routes/shareholder");
const Withdraw = require("./routes/withdraw");

// create new server/app
const app = express();
// Set port from environment or if not then use 5050
const PORT = process.env.PORT | 5050;

app.use(cors());

// Coonect to the database
database();

// use json as return for every end point
app.use(express.json());

// use SuperAdminRoutes for /superadmin/auth end points
app.use("/superadmin/auth", superAdminRoutes);

// use admin/auth for bussiness users authentication end point
app.use("/admin/auth", AdminRoutes);

app.use("/transactions", Transactions);

app.use("/customers", Customers);

app.use("/expenses", Expense);

app.use("/shareholder", Shareholder);

app.use("/withdraw", Withdraw);

// listen to the specefic port
app.listen(PORT, () => {
    console.log("server is running on port " + PORT);
});
