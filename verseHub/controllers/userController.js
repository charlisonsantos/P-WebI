const User = require('../models/User');
const Poem = require('../models/Poem');
const Favorite = require('../models/Favorite');

exports.getProfile = async (req, res) => {
    try {
        const profileUser = await User.findById(req.params.id);
        if (!profileUser) return res.status(404).send('Usuário não encontrado');

        const poems = await Poem.find({ author: profileUser._id }).sort({ createdAt: -1 });
        res.render('user/profile', { profileUser, poems });
    } catch (err) {
        res.status(500).send();
    }
};

exports.getEditProfile = (req, res) => res.render('user/edit', { error: null });

exports.postEditProfile = async (req, res) => {
    try {
        const { name, bio } = req.body;
        const updateData = { name, bio };

        if (req.file) {
            updateData.profilePicture = req.file.filename;
        }

        await User.findByIdAndUpdate(req.user._id, updateData);
        res.redirect(`/user/profile/${req.user._id}`);
    } catch (err) {
        res.render('user/edit', { error: 'Erro ao atualizar perfil.' });
    }
};

// Favoritos
exports.getFavorites = async (req, res) => {
    const favs = await Favorite.find({ user: req.user._id }).populate({
        path: 'poem',
        populate: { path: 'author' }
    });
    res.render('user/favorites', { favs });
};

exports.toggleFavorite = async (req, res) => {
    try {
        const exists = await Favorite.findOne({ user: req.user._id, poem: req.params.id });
        if (exists) {
            await Favorite.findByIdAndDelete(exists._id);
        } else {
            await Favorite.create({ user: req.user._id, poem: req.params.id });
        }
        res.redirect(`/poems/${req.params.id}`);
    } catch (err) {
        res.status(500).send();
    }
};