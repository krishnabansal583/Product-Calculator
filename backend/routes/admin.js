const express = require('express');
const router = express.Router();
const { approveUser, addProduct, updateProduct, deleteProduct, getProducts, getProductById, getUsers, getUserById } = require('../controllers/adminController');

router.put('/approve-user/:id', approveUser);
router.post('/add-product', addProduct);
router.put('/update-product/:id', updateProduct);
router.delete('/delete-product/:id', deleteProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);


module.exports = router;