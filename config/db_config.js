const { printConsole } = require("../utils/development");
const mongoose = require("mongoose");
const MONGO_DB_URI = process.env.MONGO_DB_URL;

const connectToDB = async () => {
  try {
    printConsole(
      { data: "Connecting to MongoDB ......" },
      { printLocation: "db_config.js:12" },
      { textColor: "yellow" }
    );
    console.log(MONGO_DB_URI);

    const DBConnection = await mongoose.connect(MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    printConsole(
      { data: `Database Connected : ${DBConnection.connection.host}` },
      { printLocation: "db_config.js:24" },
      {
        textColor: "green",
      }
    );
  } catch (error) {
    printConsole(error);

    process.exit(1);
  }
};

module.exports = connectToDB;
