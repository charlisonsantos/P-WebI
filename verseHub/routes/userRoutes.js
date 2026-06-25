const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configuração de Upload de foto de perfil
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, req.user._id + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get('/profile/:id', userController.getProfile);
router.get('/edit', protect, userController.getEditProfile);
router.post('/edit', protect, upload.single('profilePicture'), userController.postEditProfile);
router.get('/favorites', protect, userController.getFavorites);
router.post('/favorites/:id', protect, userController.toggleFavorite);

module.exports = router;