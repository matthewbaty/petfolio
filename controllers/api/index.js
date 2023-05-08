const router = require('express').Router();
const userRoutes = require('./userRoutes');
const petRoutes = require('./petRoutes');
const fileRoutes = require('./fileRoutes');

router.use('/users', userRoutes);
router.use('/pets', petRoutes);
router.use('/files', fileRoutes);

module.exports = router;