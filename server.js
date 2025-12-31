// In-memory store (use DB later)
const attendees = [];
app.use("/admin.html", (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth === "Bearer dnsadmin123") return next();
  res.status(401).send("Unauthorized");
});

app.get("/admin-data", (req, res) => {
  res.json(attendees);
});
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ROOT TEST */
app.get("/", (req, res) => {
  res.send("DNS Event Backend Live ✅");
});

/* CREATE ORDER */
app.post("/create-order", async (req, res) => {
  const { name, age, mobile, whatsapp } = req.body;

  console.log("New Attendee:", name, age, mobile, whatsapp);

  const order = await razorpay.orders.create({
    amount: 100,
    currency: "INR",
  });

  res.json(order);
});
const tickets = [];

app.post("/verify-payment", (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    user
  } = req.body;

  const crypto = require("crypto");
  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSign !== razorpay_signature) {
    return res.status(400).json({ success: false });
  }

  // ✅ Create ticket
  const ticket = {
    id: "TICKET-" + Date.now(),
    name: user.name,
    mobile: user.mobile,
    whatsapp: user.whatsapp,
    paymentId: razorpay_payment_id
  };

  tickets.push(ticket);

  res.json({
    success: true,
    ticket
  });
});
