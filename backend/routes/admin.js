const express = require('express');
const router = express.Router();
const { approveUser, addProduct } = require('../controllers/adminController');

router.put('/approve-user/:id', approveUser);
router.post('/add-product', addProduct);

module.exports = router;