const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, isAdmin, isEntregador } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, orderController.createOrder)
    .get(protect, isAdmin, orderController.getAllOrders);

router.get('/my-orders', protect, orderController.getMyOrders);
router.get('/available', protect, isEntregador, orderController.getAvailableOrders);
router.put('/:id/status', protect, orderController.updateOrderStatus);

module.exports = router;