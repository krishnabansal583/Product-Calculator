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
//update Product
exports.updateProduct = async (req, res) => {
  const { productName, b2bPrice, mrp, sampleType, fastingRequired, reportingTAT, productImage } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { productName, b2bPrice, mrp, sampleType, fastingRequired, reportingTAT, productImage }, { new: true });
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// Delete Product 
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  } 
}
// Get Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// Get Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

