const mongoose = require("mongoose");
const URI =
  "mongodb+srv://Belalnoory:143Kakawjan12345@asanhesab.kn7gy.mongodb.net/?retryWrites=true&w=majority";

const connect = async () => {
  const DBInstance = mongoose.connect(
    URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, res) => {
      if (err) {
        console.log(err.message);
      }
      console.log("connected to the database");
    }
  );
  return DBInstance;
};

module.exports = connect;
