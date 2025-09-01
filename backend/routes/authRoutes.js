// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authController.getAllUsers);
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/verify-admin', authMiddleware.verifyToken, authMiddleware.isAdmin, (req, res) => {
  res.json({ isAdmin: true, message: 'Usuario es administrador' });
});

module.exports = router;