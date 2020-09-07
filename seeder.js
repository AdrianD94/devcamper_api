const dotenv = require("dotenv");
const fs = require("fs");
const colors = require("colors");
const mongoose = require("mongoose");
const Bootcamp = require("./models/Bootcamp");

dotenv.config({ path: "./config/config.env" });

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`)
);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Data imported".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("Data deleted".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] == "-i") {
  importData();
} else if (process.argv[2] == "-d") {
  deleteData();
}
