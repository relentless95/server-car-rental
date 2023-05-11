const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Booking = require("../models/Booking.model");
const PrivateInfo = require("../models/PrivateInfo.model");
const User = require("../models/User.model");

// POST /api/bookings - Creates a new booking
router.post("/bookings", (req, res, next) => {
  const {
    carType,
    pickUpLocation,
    dropOfLocation,
    pickUpDate,
    dropOfDate,
    userId,
  } = req.body;

  Booking.create({
    carType,
    pickUpLocation,
    dropOfLocation,
    pickUpDate,
    dropOfDate,
    user: userId,
  })
    .then((newBooking) => {
      return User.findByIdAndUpdate(
        userId,
        {
          $push: { bookings: newBooking._id },
        },
        { new: true }
      );
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

//Get /api/bookings -retrieve the users booking
router.get("/bookings/:userId", (req, res, next) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
  }
  Booking.findById(userId)
    .populate("user")
    .then((allBookings) => {
      res.json(allBookings);
    })
    .catch((err) => res.json(err));
});

module.exports = router;
