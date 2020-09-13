const dotenv = require("dotenv");
const fs = require("fs");
const colors = require("colors");
const mongoose = require("mongoose");
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require('./models/User');

dotenv.config({ path: "./config/config.env" });

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`)
);

const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const importData = async () => {
  try {
    console.log(`Running seeder...`.yellow);
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    console.log("Data imported".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    console.log(`Running seeder...`.yellow);
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
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
