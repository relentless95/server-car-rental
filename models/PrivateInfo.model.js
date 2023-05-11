const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the privateInfo model to whatever makes sense in this case
const privateInfoSchema = new Schema({
  phoneNumber: {
    type: String,
    require: true,
  },
  age: {
    type: String, //<---is there a way to specify this as a date d/m/y?
    required: true,
  },
  city: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  zipCode: {
    type: String,
    require: true,
  },
  // idCard: {
  //   type:,
  //   required: true,
  // }
  bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  user: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const PrivateInfo = model("PrivateInfo", privateInfoSchema);

module.exports = PrivateInfo;
