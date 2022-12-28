const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart")
const orderRoutes = require("./routes/order");
const cors = require("cors");

dotenv.config();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL
).then(() =>
    console.log("Mongoose Connection Successfull!"))
    .catch((err) => {
        console.log(err);
    });

app.get("/", async (req, res) => {
    return res.send(`Backend Server is running at port ${port}!`).status(200);
});

app.get("/api/test", async (req, res) => {
    console.log("Test Is Successfull!");
    res.send("Test Is Successfull!").status(200);
});

app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

app.listen(port, () => {
    console.log(`Backend Server is running at port ${port}!`);
});
