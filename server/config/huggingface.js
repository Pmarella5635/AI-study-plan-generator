// server/config/huggingface.js
require('dotenv').config();

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN || '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';
const HF_MODEL = process.env.HUGGINGFACE_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3';

module.exports = {
  HF_TOKEN,
  HF_MODEL
};