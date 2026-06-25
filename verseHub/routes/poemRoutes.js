const express = require('express');
const router = express.Router();
const poemController = require('../controllers/poemController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', poemController.getAllPoems);
router.get('/create', protect, poemController.getCreatePoem);
router.post('/create', protect, poemController.postCreatePoem);
router.get('/:id', poemController.getPoemById);
router.get('/:id/edit', protect, poemController.getEditPoem);
router.post('/:id/edit', protect, poemController.postEditPoem);
router.post('/:id/delete', protect, poemController.deletePoem);

// Like e Comentários
router.post('/:id/like', protect, poemController.toggleLike);
router.post('/:id/comment', protect, poemController.postComment);
router.post('/:id/comment/:commentId/delete', protect, poemController.deleteComment);

module.exports = router;