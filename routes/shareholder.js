const express = require("express");
const Router = express.Router();

// import Middlewares
const bussinessAdminMiddleware = require("../Middlewares/getLogedinUserData");
const ShareHolderModel = require("../Models/Shareholders");

//ROUTE 1: Get all shareholders of the user
Router.get("/", bussinessAdminMiddleware, async (req, res) => {
    try {
        const allHolders = await ShareHolderModel.find({ user: req.user.id});
        return res.json(allHolders);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

//ROUTE 2: Add new shareholder of the user
Router.post(
    "/add",
    bussinessAdminMiddleware,
    async (req, res) => {
        // destructure all variables
        const { name, capital} = req.body;
        const userid = req.user.id;
        try {
            const newHolder = new ShareHolderModel({ user: userid, name, capital });
            const savedHolder = await newHolder.save();
            return res.json(savedHolder);
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }
);

module.exports = Router;