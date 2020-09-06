const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(
      `MongoDB connected: ${connection.connection.host}`.cyan.underline.bold
    );
  } catch (error) {
    console.log(`${error.message}`.red.bold);
  }
};

module.exports = dbConnect;
