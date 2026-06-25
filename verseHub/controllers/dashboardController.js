const User = require('../models/User');
const Poem = require('../models/Poem');
const Comment = require('../models/Comment');

exports.getDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPoems = await Poem.countDocuments();
        const totalComments = await Comment.countDocuments();

        res.render('dashboard/index', { totalUsers, totalPoems, totalComments });
    } catch (err) {
        res.status(500).send('Erro ao carregar Dashboard');
    }
};