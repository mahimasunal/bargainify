require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./schema/productSchema");

const sampleProducts = [
  {
    name: "Blue Cotton T-Shirt",
    price: 499,
    description: "Comfortable cotton t-shirt for daily wear",
    image: "https://placehold.co/300x300.png",
    category: "Clothing",
  },
  {
    name: "White Sneakers",
    price: 1999,
    description: "Casual white sneakers",
    image: "https://placehold.co/300x300.png",
    category: "Footwear",
  },
  {
    name: "Black Leather Jacket",
    price: 3499,
    description: "Stylish black leather jacket",
    image: "https://placehold.co/300x300.png",
    category: "Clothing",
  },
  {
    name: "Denim Shorts",
    price: 899,
    description: "Casual denim shorts",
    image: "https://placehold.co/300x300.png",
    category: "Clothing",
  },
  {
    name: "Running Shoes",
    price: 2499,
    description: "Lightweight running shoes",
    image: "https://placehold.co/300x300.png",
    category: "Footwear",
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Old products cleared");

    await Product.insertMany(sampleProducts);
    console.log("Sample products added successfully!");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.log("Error:", err.message);
  });
