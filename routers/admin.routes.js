const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');

// Route de connexion admin (POST)
router.post('/login', adminController.loginAdmin);

module.exports = router;

