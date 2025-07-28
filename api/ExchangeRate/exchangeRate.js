const express = require("express");
const router = express.Router();
const axios = require("axios");
const xml2js = require("xml2js");
const ExchangeRate = require("../Models/exchangeSchema");

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://www.bnr.ro/nbrfxrates.xml");
    const xml = response.data;
    const parser = new xml2js.Parser({ explicitArray: false });

    parser.parseString(xml, async (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to parse XML" });
      }

      const rates = result.DataSet.Body.Cube.Rate;
      const date = result.DataSet.Body.Cube.$.date;
      const currencies = {
        date: date,
      };

      if (Array.isArray(rates)) {
        for (const rate of rates) {
          const currency = rate.$.currency;
          const value = parseFloat(rate._);
          const dateObj = new Date(date);
          
          const exchangeRate = new ExchangeRate({
            date: dateObj,
            currency: currency,
            rate: value,
          });

         currencies[currency] = value;
        }
      }

      res.json(currencies);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
});

module.exports = router;
