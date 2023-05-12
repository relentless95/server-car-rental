const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const PrivateInfo = require("../models/PrivateInfo.model");
const User = require("../models/User.model");
// const Booking = require("../models/Booking.model");

//POST /api/details - create private info
router.post("/details", (req, res, next) => {
  const { phoneNumber, age, city, address, zipCode, userId } = req.body;

  // add a way to verify that all the variables needed are present to create
  if (!phoneNumber || !age || !city || !address || !zipCode || !userId) {
    res.status(400).json({
      message: "provide phoneNumber, age, city, address, zipCode and userId",
    });
    return;
  } else {
    PrivateInfo.create({
      phoneNumber,
      age,
      city,
      address,
      zipCode,
      user: userId,
    })
      .then((privateInfo) => {
        return User.findByIdAndUpdate(
          userId,
          {
            $push: { privateInfo: privateInfo._id },
          },
          { new: true }
        );
      })
      .then((response) => res.json(response))
      .catch((err) => res.json(err));
  }
});

//PUT /api/details - update the users private info

router.put("/details/user/:privateInfoId", (req, res, next) => {
  const { privateInfoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(privateInfoId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  PrivateInfo.findByIdAndUpdate(privateInfoId, req.body, { new: true })
    .then((updatedInfo) => {
      res.json(updatedInfo);
    })
    .catch((err) => res.json(err));
});

//Delete /api/details - deletes the personal info
// should be used only by the admin
router.delete("/details/:privateInfoId", (req, res, next) => {
  const { privateInfoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(privateInfoId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  PrivateInfo.findByIdAndDelete({ _id: privateInfoId }).then(() =>
    res.json({
      message: `Private Info with Id: ${privateInfoId}, is removed successfully `,
    })
  );
});

module.exports = router;
