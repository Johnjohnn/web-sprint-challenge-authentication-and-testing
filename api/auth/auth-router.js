const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Auth = require("./auth-model");
const restricted = require("../middleware/restricted");

const router = express.Router();

router.get("/users", restricted, async (req, res, next) => {
  try {
    res.json(await Auth.findUsers());
  } catch (err) {
    next(err);
  }
})

router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

// This condition is not responding as expected.
    // const user = await Auth.findByUsername(username);
    // if (user) {
    //   res.status(409).json({
    //     Message: "Username is already Exsist"
    //   })
    // }

    if (password == null) {
      res.status(400).json({
        Message: "Password is mandatory to register",
      })
    }

    const newUser = await Auth.addUser({
      username,
      password: await bcrypt.hash(password, 10),
    })
    res.status(201).json(newUser);

  } catch (err) {
    next(err);
  }
  // res.end('implement register, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }
    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }
    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".
    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // verifying username:
    const [user] = await Auth.findByUsername(username)
    console.log(user);
    if (!user) {
      return res.status(401).json({
        Message: "User does not exsist"
      })
    }

    // verifying password:
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        Message: "Invalid password",
      })
    }

    // creating token:
    const token = jwt.sign({
      userId: user.id,
      username: user.username,
    }, "secret code")
    res.json({
      Message: `Welcome ${user.username}`,
      token: token
    })
  } catch (err) {
    next(err);
  }
  // res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }
    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }
    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".
    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

router.get("/logout", async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.status(204).end();
        // res.json({
        //   Message: "You are successfully logout"
        // })
      }
    })
  } catch (err) {
    next(err);
  }
})

module.exports = router;