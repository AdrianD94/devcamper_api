const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a review title"],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, "Please add some text "],
  },
  rating: {
    type: Number,
    required: [true, "Please add a raiting between 1 and 10"],
    min: 1,
    max: 10,
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
},{timestamps:true});
//limit only 1 review per bootcamp
// ReviewSchema.index({bootcamp:1,user:1},{unique:true});



ReviewSchema.statics.getAverageRating = async function (bootcampId) {
 

    const obj = await this.aggregate([
      {
        $match: { bootcamp: bootcampId },
      },
      {
        $group: {
          _id: "$bootcamp",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    
    try {
      await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
        averageRating:obj[0].averageRating
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  ReviewSchema.post("save", function () {
    this.constructor.getAverageRating(this.bootcamp);
  });
  
  ReviewSchema.pre("remove", function () {
    this.constructor.getAverageRating(this.bootcamp);
  });

module.exports = mongoose.model("Review", ReviewSchema);
