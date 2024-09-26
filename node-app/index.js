//index.js
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
var jwt = require("jsonwebtoken");
const multer = require("multer");
const http = require("http");
const { Server } = require("socket.io");
const productController = require("./controllers/productController");
const userController = require("./controllers/userController");

const Razorpay = require("razorpay");

const sellerSockets = {};

const razorpay = new Razorpay({
  key_id: "",
  key_secret: "",
});

app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Razorpay expects amount in paisa
    currency: "INR",
    receipt: "receipt_order_74394",
    payment_capture: 1,
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong!");
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const port = 4000;
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017");

app.get("/", (req, res) => {
  res.send("Hello World !");
});

app.get("/search", productController.search);
app.post("/dislike-product", userController.dislikeProducts);
app.post("/like-product", userController.likeProducts);
app.post(
  "/add-product",
  upload.fields([{ name: "pimage" }, { name: "pimage2" }]),
  productController.addProduct
);
app.post(
  "/edit-product",
  upload.fields([{ name: "pimage" }, { name: "pimage2" }]),
  productController.editProduct
);
app.get("/get-products", productController.getProducts);
app.post("/delete-product", productController.deleteProduct);
app.get("/get-product/:pId", productController.getProductsById);
app.post("/liked-products", userController.likedProducts);
app.post("/my-products", productController.myProducts);
app.post("/signup", userController.signup);
app.get("/my-profile/:userId", userController.myProfileById);
app.get("/get-user/:uId", userController.getUserById);
app.post("/login", userController.login);

app.post("/notify-seller", (req, res) => {
  const orderDetails = req.body;

  // Emit a notification event to all connected clients
  io.emit("newOrder", orderDetails);

  console.log("Notification sent to all clients:", orderDetails);

  res.sendStatus(200);
});

let messages = [];

io.on("connection", (socket) => {
  console.log("Socket Connected", socket.id);

  socket.on("sendMsg", (data) => {
    messages.push(data);
    io.emit("getMsg", messages);
  });
  io.emit("getMsg", messages);
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
