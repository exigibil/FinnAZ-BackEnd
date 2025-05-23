const express = require("express");
const app = express();
const ExchangeRate = require("./api/exchangeRate");


// Rutele API
app.use("/exchange-rate", ExchangeRate);


module.exports = app;