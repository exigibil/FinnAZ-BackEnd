const express = require("express");
const router = express.Router();
const axios = require("axios");
const Joi = require("joi");
const FinancialsData = require("../Models/financialsSchema");

const multer = require("multer");
const pdfParse = require("pdf-parse");
const storage = multer.memoryStorage();
const upload = multer({ storage });



const accountSchema = Joi.object({
  accountnumber: Joi.string().required(),
  accountname: Joi.string().required(),
  initialBalance: Joi.object({
    debit: Joi.number().default(0),
    credit: Joi.number().default(0),
  }).required(),
  turnovers: Joi.object({
    debit: Joi.number().default(0),
    credit: Joi.number().default(0),
  }).required(),
  totals: Joi.object({
    debit: Joi.number().default(0),
    credit: Joi.number().default(0),
  }).required(),
  finalBalance: Joi.object({
    debit: Joi.number().default(0),
    credit: Joi.number().default(0),
  }).required(),
});

const financialsSchema = Joi.object({
  uploadDate: Joi.date().default(() => new Date()),
  financialDate: Joi.date().iso().required(),
  currency: Joi.string().default('RON').valid('RON', 'EUR', 'USD'),
  company: Joi.object({
    name: Joi.string().allow('', null),
    cui: Joi.string().allow('', null),
    regCom: Joi.string().allow('', null),
  }).optional(),
  accounts: Joi.array().items(accountSchema).required(),
});



router.get("/",  async (req, res) => {
  // console.log("Request object:", req);

  try {
    const financials = await FinancialsData.find();
    res.json(financials);
  } catch (error) {
    console.error("Error fetching food data:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/uploadBalance", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Nu ai trimis niciun fișier PDF." });
    }

    const dataBuffer = req.file.buffer;
    const parsed = await pdfParse(dataBuffer);

    const extractedText = parsed.text;

    // 🛠️ Extrage luna/anul (ex. "01.01.2020 31.12.2020")
    const dateMatch = extractedText.match(/01\.01\.(\d{4})\s+31\.12\.\d{4}/);
    const financialYear = dateMatch ? parseInt(dateMatch[1]) : new Date().getFullYear();
    const financialDate = new Date(`${financialYear}-12-01`);

    // 📦 Extrage conturile
    const lines = extractedText.split('\n').filter(line => /^\d{3,4}\s+/.test(line));
    const accounts = lines.map(line => {
      const parts = line.trim().split(/\s{2,}/); // separare după spații multiple
      const [accountnumber, accountname] = parts[0].split(/\s(.+)/);

      const numbers = parts.slice(1).map(n => parseFloat(n.replace(/\s/g, '').replace(',', '.')) || 0);

      return {
        accountnumber,
        accountname,
        initialBalance: { debit: numbers[0], credit: numbers[1] },
        turnovers: { debit: numbers[2], credit: numbers[3] },
        totals: { debit: numbers[4], credit: numbers[5] },
        finalBalance: { debit: numbers[6], credit: numbers[7] },
      };
    });

    const financialDoc = {
      financialDate,
      uploadDate: new Date(),
      currency: "RON",
      company: {
        name: "MAGIC TUTORING CENTRE SRL", // poți extrage din PDF dacă vrei
        cui: "39949605",
        regCom: "J40/14200/2018",
      },
      accounts,
    };

    const { error } = financialsSchema.validate(financialDoc);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const saved = await FinancialsData.create(financialDoc);
    res.status(201).json(saved);

  } catch (err) {
    console.error("Eroare la încărcare PDF:", err);
    res.status(500).json({ message: "Eroare la procesarea fișierului." });
  }
});


module.exports = router;