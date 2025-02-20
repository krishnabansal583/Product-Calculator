const User = require('../models/User');
const Product = require('../models/Product');

// Approve User
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add Product
exports.addProduct = async (req, res) => {
  const { productName, b2bPrice, mrp, sampleType, fastingRequired, reportingTAT, productImage } = req.body;
  try {
    const newProduct = new Product({ productName, b2bPrice, mrp, sampleType, fastingRequired, reportingTAT, productImage });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};