const { body, validationResult } = require("express-validator");
const express = require("express");
const Router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// import Middlewares
const bussinessAdminMiddleware = require("../Middlewares/getLogedinUserData");

// import user model
const UserModel = require("../Models/Users");

// JWT SECRET KEY
const JWT_SECRET = "ASAN_HESAB%IS_MAQBOL";

//ROUTE 1: Bussiness Admin login
Router.post("/login", [body("email", "لطفآ ایمیل تانرا وارد کنید").isEmail().normalizeEmail(), body("password", "لطفآ پاسورد وارد کنید و حدافل ۸ رقم باشد").not().isEmpty()], async (req, res) => {
    // Check if there are some errors in the data sent from the client
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        // destructure email and password
        const { email, password } = req.body;
        // check if we already have a user with this email
        let User = await UserModel.findOne({ email });
        // if user exists then return error that the email is already taken
        if (!User) {
            return res.status(400).json({ success: false, error: "شما تا هنوز در سیستم ثبت نشده اید", authToken: "" });
        }
        // compare the password with Hashed password
        const comparePass = await bcrypt.compare(password, User.password);
        if (!comparePass) {
            return res.status(400).json({ success: false, error: "لطفآ ایمیل وپاسورد درست را وارد کنید", authToken: "" });
        }

        const data = {
            user: {
                id: User.id,
            },
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        return res.status(200).json({ success: true, authToken: authToken, error: "" });
    } catch (error) {
        return res.status(500).json({ success: false, error: "لطفآ ایمیل وپاسورد درست را وارد کنید", authToken: "" });
    }
});

//ROUTE 2: Get Logged in Bussiness Admin data
Router.post("/getuser", bussinessAdminMiddleware, async (req, res) => {
    try {
        const userid = req.user.id;
        const User = await UserModel.findById(userid).select("-password");
        res.json(User);
    } catch (error) {
        res.status(500).send({ error: "Some error occured" });
    }
});

module.exports = Router;
