const express = require('express');
const router = express.Router();

const { registerConsultor, login } = require('../controllers/authController');
const { autenticarToken, somenteAdmin } = require('../middlewares/authMiddleware');

router.post('/login', login);
router.post('/cadastrar', autenticarToken, somenteAdmin, registerConsultor);

module.exports = router;
