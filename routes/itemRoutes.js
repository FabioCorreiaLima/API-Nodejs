const express = require('express');
const { createItem, getItems, updateItem, deleteItem } = require('../controllers/itemController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/items', protect, createItem);
router.get('/items', protect, getItems);
router.put('/items/:id', protect, updateItem);
router.delete('/items/:id', protect, deleteItem);

module.exports = router;
