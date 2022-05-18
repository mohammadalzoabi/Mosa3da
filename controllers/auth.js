const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const fileHelper = require("../util/file");


const jwt_secret = "some super secret";

// Login Exports
exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("login", {
    path: "/login",
    pageTitle: "Sign in",
    pageName: "login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  let errors = [];

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        errors.push({ msg: "Invalid Email Or Password." });
        res.render("login", {
          errors,
          email,
          pageTitle: "Sign in",
        });
      } else if (user.role === "therapist" && user.acceptedTherapist === "No") {
        errors.push({ msg: "Your application is under review." });
        res.render("login", {
          errors,
          email,
          pageTitle: "Sign in",
        });
      } else {
        passport.authenticate("local", {
          successRedirect: "/dashboard",
          failureRedirect: "/login",
          failureFlash: true,
        })(req, res, next);
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//Forgot-password
exports.getForgotPassword = (req, res, next) => {
  res.render("forgot-password", {
    path: "/forgot-password",
    pageTitle: "Forgot Password",
    pageName: "Forgot Password",
  });
};
exports.postForgotPassword = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not registered");
      }

      const secret = jwt_secret + user.password;
      const payload = {
        email: user.email,
        id: user._id.toString(),
      };
      const token = jwt.sign(payload, secret, { expiresIn: "15m" });
      const link = `http://localhost:5000/reset-password/${user._id}/${token}`;
      console.log(link);
      res.send("<h1>Password reset link has been sent to your email.</h1>");
    })
    .catch((err) => {
      console.log(err);
    });
};

//Reset-password
exports.getResetPassword = (req, res, next) => {
  const { id, token } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send("Invalid ID.");
      }
      const secret = jwt_secret + user.password;
      try {
        const payload = jwt.verify(token, secret);

        res.render("reset-password", {
          email: user.email,
          path: "/reset-password",
          pageTitle: "Reset Password",
          pageName: "Reset Password",
        });
      } catch (error) {
        console.log(error.message);
        res.send(`<h1>${error.message}</h1>`);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postResetPassword = (req, res, next) => {
  const { id, token } = req.params;
  const { password, confirmPassword } = req.body;

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send("Invalid ID.");
      }
      const secret = jwt_secret + user.password;
      try {
        const payload = jwt.verify(token, secret);
        const { email, id } = payload;

        let errors = [];

        //Check Matching Password
        if (password !== confirmPassword) {
          errors.push({ msg: "Passwords do not match" });
        }
        //Check Password Length
        else if (password.length < 6) {
          errors.push({ msg: "Password must be at least 6 characters" });
        }

        const hashedPassword = user.password;
        bcrypt.compare(password, hashedPassword, function (err, result) {
          if (result) {
            errors.push({
              msg: "Password must not be the same as old password",
            });
          }
        });
        //   .then((result) => {
        //     if (result) {
        //       //passwords match
        //       errors.push({
        //         msg: "Password must not be the same as old password",
        //       });
        //       console.log(errors);
        //     }})
        //   .catch((err) => {
        //     console.log(err);
        //   });

        setTimeout(() => {
          if (errors.length > 0) {
            res.render("reset-password", {
              errors,
              email,
              password,
              confirmPassword,
              pageTitle: "reset-password",
              pageName: "reset-password",
            });
          } else {
            //Hashing The Password
            bcrypt.genSalt(10, (err, salt) =>
              bcrypt.hash(password, salt, (err, hash) => {
                if (err) console.log(err);
                //Set User Password to Hashed Password
                user.password = hash;
                //Save User
                user
                  .save()
                  .then((result) => {
                    req.flash("success_msg", "Password Reset Successfully ");
                    res.redirect("/login");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
            );
            console.log("Password Reset Completed!");
          }
        }, 500);
      } catch (error) {
        console.log(error.message);
        res.send(error.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

//Change-Password
exports.getChangePassword = (req, res, next) => {
  const { id } = req.user;

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send("Invalid ID.");
      }
      res.render("change-password", {
        user,
        email: user.email,
        oldPassword: user.password,
        path: "/change-password",
        pageTitle: "Change Password",
        pageName: "Change Password",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postChangePassword = (req, res, next) => {
  const { id } = req.params;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send("Invalid ID");
      }
      try {
        let errors = [];
        //Check Matching Password
        if (newPassword !== confirmPassword) {
          errors.push({ msg: "Passwords do not match" });
        }
        //Check Password Length
        else if (newPassword.length < 6) {
          errors.push({ msg: "Password must be at least 6 characters" });
        }
        //checking Old Password
        const hashedPassword = user.password;
        bcrypt
          .compare(oldPassword, hashedPassword)
          .then((result) => {
            if (!result) {
              //passwords doesn't match
              errors.push({
                msg: "Old Password is not correct",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });

        //checking new password != old password
        bcrypt
          .compare(newPassword, hashedPassword)
          .then((result) => {
            if (result) {
                errors.push({
                  msg: "Password must not be the same as old password",
                });
              }
          })
          .catch((err) => {
            console.log(err);
          });

        setTimeout(() => {
          if (errors.length > 0) {
            console.log(errors);
            res.render("change-password", {
              errors,
              user,
              oldPassword,
              newPassword,
              confirmPassword,
              pageTitle: "Change Password",
              pageName: "change-password",
            });
          } else {
            //Hashing The new Password
            bcrypt.genSalt(10, (err, salt) =>
              bcrypt.hash(newPassword, salt, (err, hash) => {
                if (err) console.log(err);
                //Set User Password to Hashed Password
                user.password = hash;
                //Save User
                user
                  .save()
                  .then((newUser) => {
                    req.flash("success_msg", "Password Changed Successfully");
                    res.redirect("/edit-account");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
            );
            console.log("Password Changed Successfully!");
          }
        }, 500);
      } catch (error) {
        console.log(error);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// Sign up Exports
exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    pageName: "signup",
    oldInput: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
    },
    validationErrors: [],
  });
};
exports.postSignup = (req, res, next) => {
  const { name, email, password, confirmPassword, gender } = req.body;
  let errors = [];

  //Check Required Fields
  if (!name || !email || !password || !confirmPassword || !gender) {
    errors.push({ msg: "Please fill the required info" });
  }
  //Check Matching Password
  if (password !== confirmPassword) {
    errors.push({ msg: "Passwords do not match" });
  }
  //Check Password Length
  if (password.length < 6 && password.length) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render("signup", {
      errors,
      name,
      email,
      password,
      confirmPassword,
      pageTitle: "Signup",
      pageName: "signup",
    });
  } else {
    //Validation Pass
    User.findOne({
      email: email,
    }).then((user) => {
      if (user) {
        errors.push({ msg: "User Already Exists" });
        res.render("signup", {
          errors,
          name,
          email,
          password,
          confirmPassword,
          pageTitle: "Signup",
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          gender,
        });
        //Hashing The Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.log(err);
            //Set User Password to Hashed Password
            newUser.password = hash;
            //Save User
            newUser
              .save()
              .then((user) => {
                req.flash("success_msg", "You Are Now Registered");
                console.log("Registeration Completed!");
                passport.authenticate("local", {
                  successRedirect: "/dashboard",
                  failureRedirect: "/signup",
                  failureFlash: true,
                  pageTitle: "dashboard",
                })(req, res, next);
              })
              .catch((err) => {
                console.log(err);
              });
          })
        );
      }
    });
  }
};

// Join us Exports
exports.getJoinUs = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("join-us", {
    path: "/join-us",
    pageTitle: "Join Us",
    errorMessage: message,
    pageName: "Join Us",
    oldInput: {
      name: "",
      email: "",
      gender: "",
    },
    validationErrors: [],
  });
};
exports.postJoinUs = (req, res, next) => {
  let errors = [];

  const { name, email, gender } = req.body;
  console.log(req.file);

  let cv;
  if (req.file) {
    cv = {
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
    };
    if (cv.fileType !== "application/pdf") {
      errors.push({ msg: "CV must be in PDF format" });
    }
  } else {
    errors.push({
      msg: "Please make sure to upload your CV, must be in PDF Format",
    });
  }

  //Check Required Fields
  if (!name || !email || !gender) {
    errors.push({ msg: "Please fill the required info" });
  }

  if (errors.length > 0) {
    res.render("join-us", {
      errors,
      name,
      email,
      gender,
      pageTitle: "Join Us",
      pageName: "join-u",
    });
  } else {
    //Validation Pass
    User.findOne({
      email: email,
    }).then((user) => {
      if (user) {
        errors.push({ msg: "Email is already used" });
        res.render("join-us", {
          errors,
          name,
          email,
          gender,
          pageTitle: "Join Us",
        });
      } else {
        console.log("Application Sent!");
        const newUser = new User({
          name,
          email,
          password: email + Date.now(),
          role: "therapist",
          acceptedTherapist: "No",
          cv,
          gender,
        });
        //Hashing The Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.log(err);
            //Set User Password to Hashed Password
            newUser.password = hash;
            //Save User
            newUser
              .save()
              .then((user) => {
                req.flash("success_msg", "Thank you.");
                res.redirect("/");
              })
              .catch((err) => {
                console.log(err);
              });
          })
        );
      }
    });
  }
};

// Logout Export
exports.getLogout = (req, res, next) => {
  req.logout();
  req.flash("success_msg", "Logged out successfully");
  res.redirect("/");
};

// Edit Account Exports
exports.getEditAccount = (req, res, next) => {
  User.findOne({ email: req.user.email })
    .then((user) => {
      res.render("user-profile-edit", {
        user: user,
        pageTitle: "Edit Account",
        path: "/edit-account",
        pageName: "Edit Account",
      });
    })
    .catch((err) => {
      console.log("didnt find user account, edit account section!");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postEditAccount = (req, res, next) => {
  const { name, email, gender } = req.body;
  const image = req.file;
  let errors = [];

  //Check Required Fields
  if (!name || !email || !gender) {
    errors.push({ msg: "Cannot leave fields empty" });
  }

  if (errors.length > 0) {
    User.findOne({ email: req.user.email })
      .then((user) => {
        res.render("user-profile-edit", {
          errors: errors,
          user: user,
          pageTitle: "Account",
          path: "/edit-account",
          pageName: "Edit Account",
        });
      })
      .catch((err) => {
        console.log("didnt find user account, edit account section!");
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else {
    User.findOne({ email: req.user.email })
      .then((user) => {
        user.name = name;
        user.email = email;
        user.gender = gender;
        if (image) {
          fileHelper.deleteFile(user.image);
          user.image = image.path;
        }

        return user.save().then((result) => {
          res.redirect("/account");
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
