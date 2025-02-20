const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  b2bPrice: { type: Number, required: true },
  mrp: { type: Number, required: true },
  sampleType: { type: String },
  fastingRequired: { type: Boolean },
  reportingTAT: { type: String },
  productImage: { type: String }, // URL to PDF/JPG
});

module.exports = mongoose.model('Product', ProductSchema);