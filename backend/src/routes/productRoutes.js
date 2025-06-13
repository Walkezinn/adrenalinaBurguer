const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(productController.getAllProducts)
  .post(protect, isAdmin, productController.createProduct);

router.route('/:id')
  .get(productController.getProductById)
  .put(protect, isAdmin, productController.updateProduct)
  .delete(protect, isAdmin, productController.deleteProduct);

module.exports = router;