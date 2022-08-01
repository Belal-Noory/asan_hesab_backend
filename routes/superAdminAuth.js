const { body, validationResult } = require("express-validator");
const express = require("express");
const Router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// import user model
const UserModel = require("../Models/Users");

// Contact Model
const ContractModel = require("../Models/Contracts");

// import user model
const SuperAdminModel = require("../Models/SuperAdmin");

// JWT SECRET KEY
const JWT_SECRET = "ASAN_HESAB%IS_MAQBOL";

// import Middlewares
const bussinessAdminMiddleware = require("../Middlewares/getLogedinUserData");

//ROUTE 1: Super Admin login
Router.get("/login", [body("email", "لطفآ ایمیل تانرا وارد کنید").isEmail().normalizeEmail(), body("password", "لطفآ پاسورد وارد کنید و حدافل ۸ رقم باشد").not().isEmpty()], async (req, res) => {
    // Check if there are some errors in the data sent from the client
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // destructure email and password
        const { email, password } = req.body;

        // check if we already have a user with this email
        let User = await SuperAdminModel.findOne({ email });
        // if user exists then return error that the email is already taken
        if (!User) {
            res.status(400).json({ error: "لطفآ ایمیل وپاسورد درست را وارد کنید" });
        }
        // compare the password with Hashed password
        const comparePass = await bcrypt.compare(password, User.password);
        if (!comparePass) {
            res.status(400).json({ error: "لطفآ ایمیل وپاسورد درست را وارد کنید" });
        }

        const data = {
            user: {
                id: User.id,
            },
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken: authToken });
    } catch (error) {
        res.status(500).send({ error: "Some error occured" });
    }
});

//ROUTE 2: Super Admin add new bussiness users
Router.post(
    "/add",
    [
        body("name", "لطفآ اسم تانرا وارد کنید").not().isEmpty().trim().escape().isLength({ min: 4 }),
        body("email", "لطفآ ایمیل تانرا وارد کنید").isEmail().normalizeEmail(),
        body("password", "لطفآ پاسورد وارد کنید و حدافل ۸ رقم باشد").not().isEmpty().isLength({ min: 8 }),
        body("company", "لطفآ اسم کمپنی تانرا وارد کنید").not().isEmpty().trim().escape().isLength({ min: 4 }),
    ],
    async (req, res) => {
        // Check if there are some errors in the data sent from the client
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // check if we already have a user with this email
            let User = await UserModel.findOne({ email: req.body.email });
            // if user exists then return error that the email is already taken
            if (User) {
                res.json({ error: "این ایمیل قبلآ در سیستم موجود است لطفآ ایمیل دیگری را استفاده کنید" });
            }

            // if the email is not exist then create one
            // Generate encrypted password
            const encSalt = await bcrypt.genSalt(10);
            const ecnPAss = await bcrypt.hash(req.body.password, encSalt);
            User = await UserModel.create({
                name: req.body.name,
                email: req.body.email,
                password: ecnPAss,
                company: req.body.company,
            });

            // Add contract
            const newContarct = await ContractModel.create({
                user: User._id,
                start: req.body.start,
                end: req.body.end,
            });

            console.log(newContarct);
            const data = {
                user: {
                    id: User.id,
                },
            };
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ authToken: authToken });
        } catch (error) {
            res.status(500).send({ error: "Some error occured" });
        }
    }
);

//ROUTE 3: add new Super Admin
Router.post(
    "/add/sadmin",
    [body("name", "لطفآ اسم تانرا وارد کنید").not().isEmpty().trim().escape().isLength({ min: 4 }), body("email", "لطفآ ایمیل تانرا وارد کنید").isEmail().normalizeEmail(), body("password", "لطفآ پاسورد وارد کنید و حدافل ۸ رقم باشد").not().isEmpty().isLength({ min: 8 })],
    async (req, res) => {
        // Check if there are some errors in the data sent from the client
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // check if we already have a user with this email
            let User = await SuperAdminModel.findOne({ email: req.body.email });
            // if user exists then return error that the email is already taken
            if (User) {
                res.json({ error: "این ایمیل قبلآ در سیستم موجود است لطفآ ایمیل دیگری را استفاده کنید" });
            }

            // if the email is not exist then create one
            // Generate encrypted password
            const encSalt = await bcrypt.genSalt(10);
            const ecnPAss = await bcrypt.hash(req.body.password, encSalt);
            User = await SuperAdminModel.create({
                name: req.body.name,
                email: req.body.email,
                password: ecnPAss,
            });

            const data = {
                user: {
                    id: User.id,
                },
            };
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ authToken: authToken });
        } catch (error) {
            res.status(500).send({ error: "Some error occured" });
        }
    }
);

//ROUTE 4: get all users
Router.get(
    "/activeusers",
    async (req, res) => {
        try {
            const allUsers = await ContractModel.find().populate("_id");
            return res.json(allUsers);
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }
);

// ROUTE 5: get disabled users
Router.get(
    "/disabledusers",
    async (req, res) => {
        try {
            const allUsers = await UserModel.find({status: "disable"}).populate("contract");
            return res.json(allUsers);
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }
);

//ROUTE 6: Add new contract
Router.post(
    "/contract/add",
    async (req, res) => {
        const {user,start,end} = req.body;
        try {
            // first disable all the contracts
            await ContractModel.updateMany({ user: user},{ $set: { current: 0 }});
            // Add new contract
            const newContarct = await ContractModel.create({
                user: user,
                start: start,
                end: end,
            });
            return res.json(newContarct);
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }
);

//ROUTE 7: Disable user
Router.post(
    "/disable/:id",
    async (req, res) => {
        const id = req.params.id;
        try {
            // first disable all the contracts
            const updatedUser = await UserModel.findByIdAndUpdate({ _id: id},{ $set: { status: "disable" }});
            return res.json(updatedUser);
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }
);

//ROUTE 8: Enable user
Router.post(
    "/enable/:id",
    async (req, res) => {
        const id = req.params.id;
        try {
            const updatedUser = await UserModel.findByIdAndUpdate({ _id: id},{ $set: { status: "active" }});
            return res.json(updatedUser);
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }
);
module.exports = Router;
