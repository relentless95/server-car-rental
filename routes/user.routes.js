const router = require("express").Router();
const User = require("../models/User.model");
const mongoose = require("mongoose");

router.post("/users", (req, res, next) => {
  const { email, password, name } = req.body;

  // Check if the email or password are empty strings or name is not provided
  if (email === "" || password === "" || name === "") {
    res.status(400).json({
      message: "Provide email, password and name",
    });
    return;
  } else {
    // using regular expressions to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        message: "Provide a valid email address.",
      });
      return;
    } else {
      // Use regular expression to validate the password format
      const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      if (!passwordRegex.test(password)) {
        res.status(400).json({
          message:
            "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
        });
        return;
      } else {
        // Check the users collection if a user with the same email already exists
        User.findOne({ email })
          .then((foundUser) => {
            if (foundUser) {
              res.status(400).json({
                message: "User already exists",
              });
              return;
            } else {
              // if email is unique hash the password

              // create user in the database;
              return User.create({ email, password, name }).then(
                (createdUser) => {
                  //Deconstruct the newly created user object and omit the password
                  // password shouldn't be exposed publicly
                  const { email, name, _id } = createdUser;

                  //Create a new object that doesn't expose the password
                  const user = { email, name, _id };

                  // send a json response containing the user object
                  res.status(201).json({ user: user });
                }
              );
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "Internal server Error",
            });
          });
      }
    }
  }
});

// Get /api/users - get request to test the route
router.get("/users", (req, res, next) => {
  User.find()
    .populate("bookings")
    .then((allUsers) => {
      res.json(allUsers);
    })
    .catch((err) => res.json(err));
});

// Get /api/users/:userId - retrieves the bookings for a specific user
router.get("/users/:userId", (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "specified id is not valid" });
    return;
  }

  //Each User  document has the `bookings` array holding `_id's` of Bookings documents.
  // We use .populate() method to swap the `_id's` for the actual booking documents
  // this will be used to see all the bookings for a specific user
  User.findById(userId)
    .populate("bookings")
    .populate("privateInfo")
    .then((user) => res.status(200).json(user))
    .catch((error) => res.json(error));
});

module.exports = router;

//POST/api/user - post request to create a user
// router.post("/users", (req, res, next) => {
//   const { email, password, name } = req.body;

//   // Check if the email or password are empty strings

//   if (email === "" || password === "" || name == "") {
//     res.status(400).json({
//       message: "Provide email, password and name",
//     });
//     return;
//   }

//   // using regular expressions to validate the email format
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
//   if (!emailRegex.test(email)) {
//     res.status(400).json({
//       message: "Provide a valid email address.",
//     });
//     return;
//   }

//   // Use regular expression to validate the password format
//   const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
//   if (!passwordRegex.test(password)) {
//     res.status(400).json({
//       message:
//         "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
//     });
//     return;
//   }

//   // Check the users collection if a user with the same email already exists
//   User.findOne({ email })
//     .then((foundUser) => {
//       if (foundUser) {
//         res.status(400).json({
//           message: "User already exists",
//         });
//         return;
//       }

//       // if email is unique hash the password

//       // create user in the database;
//       return User.create({ email, password, name });
//     })
//     .then((createdUser) => {
//       //Deconstruct the newly created user object and omit the password
//       // password shouldn't be exposed publicly
//       const { email, name, _id } = createdUser;

//       //Create a new object that doesn't expose the password
//       const user = { email, name, _id };

//       // send a json response containing the user object
//       res.status(201).json({ user: user });
//     })
//     .catch((err) => {
//       console.log(err);
//        res.status(500).json({
//         message: "Internal server Error",
//       });
//     });
// });
