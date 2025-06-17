const express = require("express");
const app = express();
const ExchangeRate = require("./api/exchangeRate");
const cors = require("cors");

app.use(cors());

// Rutele API
app.use("/exchange-rate", ExchangeRate);


module.exports = app;