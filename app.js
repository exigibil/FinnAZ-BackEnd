const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const ExchangeRate = require("./api/ExchangeRate/exchangeRate");
const financialsRouter = require("./api/Financials/financialsRouter");

app.use(cors());
app.use(express.json());

const connectionString = process.env.MONGO_URI;
mongoose.connect(connectionString, {
  dbName: "Financials",
})
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });




app.use("/financials", financialsRouter);


// Rutele API
app.use("/exchange-rate", ExchangeRate);





module.exports = app;