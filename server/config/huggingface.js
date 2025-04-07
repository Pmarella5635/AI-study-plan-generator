// server/config/huggingface.js
require('dotenv').config();

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
const HF_MODEL = process.env.HUGGINGFACE_MODEL;

module.exports = {
  HF_TOKEN,
  HF_MODEL
};