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

// Get /api/bookings -retrieve all the bookings
// for the admin
router.get("/bookings", (req, res, next) => {
  Booking.find()
    .populate("user")
    .then((allBookings) => {
      res.json(allBookings);
    });
});

// Get /api/bookings/user/:userId - retrieves the booking for a user
router.get("/bookings/user/:userId", (req, res, next) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Booking.find({ user: userId })
    .then((userBookings) => {
      res.json(userBookings);
    })
    .catch((err) => res.json(err));
});

// Get /api/bookings -retrieve the users booking
router.put("/bookings/:bookingId", (req, res, next) => {
  const { bookingId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Booking.findByIdAndUpdate(bookingId, req.body, { new: true })
    .then((updatedBooking) => {
      res.json(updatedBooking);
    })
    .catch((err) => res.json(err));
});

module.exports = router;
