const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Booking = require("../models/Booking.model");
const PrivateInfo = require("../models/PrivateInfo.model");

// POST /api/bookings - Creates a new booking
router.post("/bookings", (req, res, next) => {
  const { carType, pickUpLocation, dropOfLocation, pickUpDate, dropOfDate } =
    req.body;

  Booking.create({
    carType,
    pickUpLocation,
    dropOfLocation,
    pickUpDate,
    dropOfDate,
    user: [],
  })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

//Get /api/bookings -retrieve all bookings
router.get("/bookings", (req, res, next) => {
  Booking.find()
    .populate("user")
    .then((allBookings) => {
      res.json(allBookings);
    })
    .catch((err) => res.json(err));
});

module.exports = router;
