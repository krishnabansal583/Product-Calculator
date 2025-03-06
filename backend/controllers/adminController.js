const User = require('../models/User');
const xlsx = require('xlsx');
const csv = require('papaparse');


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



exports.addProduct = async (req, res) => {
  const {
    productName, // Same as testProfileName
    b2bPrice,
    mrp,
    sampleType,
    fastingRequired,
    reportingTAT, // Same as tat
    productImage, // Same as imageUrl
    srNo,
    testCode,
    category,
    labPartner,
    premiumMinus5,
    premiumROI,
    premium5,
    processLocation,
  } = req.body;

  try {
    const newProduct = new Product({
      productName, // Map to testProfileName
      b2bPrice,
      mrp,
      sampleType,
      fastingRequired,
      reportingTAT, // Map to tat
      productImage, // Map to imageUrl
      srNo,
      testCode,
      category,
      labPartner,
      premiumMinus5,
      premiumROI,
      premium5,
      processLocation,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Product By ID
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

// Update Product
exports.updateProduct = async (req, res) => {
  const { productName, b2bPrice, mrp, sampleType, fastingRequired, reportingTAT, productImage } = req.body;
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    product = await Product.findByIdAndUpdate(req.params.id, { productName, b2bPrice, mrp, sampleType, fastingRequired, reportingTAT, productImage }, { new: true });
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    await Product.findByIdAndDelete(req.params.id); // Use findByIdAndDelete
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addMultipleProductsFromFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    let products = [];

    if (req.file.mimetype === 'text/csv') {
      // Parse CSV file
      const csvData = fileBuffer.toString();
      const parsedData = csv.parse(csvData, { header: true });
      products = parsedData.data.map((row) => ({
        productName: row['TEST/PROFILE NAME'], // Map TEST/PROFILE NAME to productName
        b2bPrice: parseFloat(row['-5 Premium']), // Map -5 Premium to b2bPrice
        mrp: parseFloat(row['MRP']),
        sampleType: row['Sample Type'],
        fastingRequired: row['Fasting Required'].toLowerCase() === 'yes',
        reportingTAT: row['TAT'], // Map TAT to reportingTAT
        productImage: row['Image URL (PDF/JPG/PNG)'], // Map Image URL to productImage
        srNo: row['Sr No'],
        testCode: row['Test code'],
        category: row['Catagory'],
        labPartner: row['Lab Partner'],
        premiumMinus5: parseFloat(row['-5 Premium']),
        premiumROI: parseFloat(row['ROI Premium']),
        premium5: parseFloat(row['5 Premium']),
        processLocation: row['Process Location'],
      }));
    } else if (
      req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      req.file.mimetype === 'application/vnd.ms-excel'
    ) {
      // Parse Excel file
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const excelData = xlsx.utils.sheet_to_json(sheet);
      products = excelData.map((row) => ({
        productName: row['TEST/PROFILE NAME'], // Map TEST/PROFILE NAME to productName
        b2bPrice: parseFloat(row['-5 Premium']), // Map -5 Premium to b2bPrice
        mrp: parseFloat(row['MRP']),
        sampleType: row['Sample Type'],
        fastingRequired: row['Fasting Required'].toLowerCase() === 'yes',
        reportingTAT: row['TAT'], // Map TAT to reportingTAT
        productImage: row['Image URL (PDF/JPG/PNG)'], // Map Image URL to productImage
        srNo: row['Sr No'],
        testCode: row['Test code'],
        category: row['Catagory'],
        labPartner: row['Lab Partner'],
        premiumMinus5: parseFloat(row['-5 Premium']),
        premiumROI: parseFloat(row['ROI Premium']),
        premium5: parseFloat(row['5 Premium']),
        processLocation: row['Process Location'],
      }));
    } else {
      return res.status(400).json({ msg: 'Unsupported file format' });
    }

    // Validate and insert products
    const newProducts = await Product.insertMany(products);
    res.status(201).json(newProducts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// exports.getProductState = async (req, res) => {
//   try {
//     const { state } = req.params;

//     // Get the pricing slab for the state
//     const stateData = await state.findOne({ stateName: state });

//     if (!stateData) {
//       return res.status(404).json({ message: 'State not found' });
//     }

//     const pricingSlab = stateData.pricingSlab;

//     // Fetch all products
//     const products = await Product.find();

//     // Map the correct B2P price based on state pricing slab
//     const updatedProducts = products.map((product) => {
//       let b2pPrice;
//       if (pricingSlab.includes('-5%')) {
//         b2pPrice = product.premiumMinus5;
//       } else if (pricingSlab.includes('ROI')) {
//         b2pPrice = product.premiumROI;
//       } else if (pricingSlab.includes('5%')) {
//         b2pPrice = product.premium5;
//       }
//       return { ...product._doc, b2pPrice };
//     });

//     res.json(updatedProducts);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };


exports.getUserState = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's state
    res.json({ state: user.state });
  } catch (error) {
    console.error('Error in getUserState:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};