const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the booking model to whatever makes sense in this case
const bookingSchema = new Schema(
  {
    carType: {
      type: String,
      required: true,
    },
    pickUpLocation: {
      type: String,
      required: true,
    },
    dropOfLocation: {
      type: String,
      required: true,
    },
    pickUpDate: {
      type: String, //<---is there a way to specify this as a date d/m/y?
      required: true,
    },
    dropOfDate: {
      type: String, // <--same here
      required: true,
    },
    pickUpTime: {
      type: String,
    },
    dropOfTime: {
      type: String,
    },
    // location: {
    //   type: String,
    //   required: true,
    // },

    user: [{ type: Schema.Types.ObjectId, ref: "User" }],
    // privateInfo: [{ type: Schema.Types.ObjectId, ref: "PrivateInfo" }],
  }
  // {
  //   // this second object adds extra properties: `createdAt` and `updatedAt`
  //   timestamps: true,
  // }
);

const Booking = model("Booking", bookingSchema);

module.exports = Booking;
