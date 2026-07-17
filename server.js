require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./schema/userSchema");
const Product = require("./schema/productSchema");
const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.log("mongo error", e.message);
  });

app.post("/user/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      username: user.username,
      email: user.email,
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Incorrect password");
    }
    res.status(200).json({
      username: user.username,
      email: user.email,
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.get("/product/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).send("Query parameter 'q' is required");
  }
  try {
    const products = await Product.find({
      name: { $regex: q, $options: "i" },
    });
    res.status(200).json(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});

// const http = require("http");

// const server = http.createServer((req, res) => {
//   if (req.url === "/") {
//     res.write("Welcome to Home Page");
//     res.end();
//   } else if (req.url === "/about") {
//     res.write("This is About Page");
//     res.end();
//   } else {
//     res.writeHead(404);
//     res.write("Page not found");
//     res.end();
//   }
// });

// server.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });
