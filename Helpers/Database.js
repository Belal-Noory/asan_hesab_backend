const mongoose = require("mongoose");
const URI = "mongodb://localhost:27017/asanhesab";

const connect = async () => {
    const DBInstance = await mongoose.connect(
        URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        () => {
            console.log("connected to the database");
        }
    );
    return DBInstance;
};

module.exports = connect;
