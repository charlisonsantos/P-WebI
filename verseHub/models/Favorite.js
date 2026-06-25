const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    poem: { type: mongoose.Schema.Types.ObjectId, ref: 'Poem', required: true }
}, { timestamps: true });

// Garante que o usuário só favorite o mesmo poema uma única vez
FavoriteSchema.index({ user: 1, poem: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);