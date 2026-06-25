const Poem = require('../models/Poem');
const Comment = require('../models/Comment');
const Favorite = require('../models/Favorite');

// Listar todos os poemas (com busca e filtro)
exports.getAllPoems = async (req, res) => {
    try {
        const { search, category, filterType } = req.query;
        let query = {};

        if (category) query.category = category;
        if (search) {
            if (filterType === 'author') {
                // Busca por autor exige populate avançado ou agregação. Simplificado aqui:
                const matchUsers = await require('../models/User').find({ name: new RegExp(search, 'i') });
                query.author = { $in: matchUsers.map(u => u._id) };
            } else {
                query.title = new RegExp(search, 'i');
            }
        }

        const poems = await Poem.find(query).populate('author').sort({ createdAt: -1 });
        res.render('poems/index', { poems, query: req.query });
    } catch (err) {
        res.status(500).send('Erro no servidor');
    }
};

exports.getCreatePoem = (req, res) => res.render('poems/create');

exports.postCreatePoem = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        await Poem.create({ title, content, category, author: req.user._id });
        res.redirect('/poems');
    } catch (err) {
        res.status(400).send('Erro ao criar poema.');
    }
};

exports.getPoemById = async (req, res) => {
    try {
        const poem = await Poem.findById(req.params.id).populate('author');
        if (!poem) return res.status(404).send('Poema não encontrado');

        const comments = await Comment.find({ poem: poem._id }).populate('author').sort({ createdAt: -1 });
        const isFavorited = req.user ? await Favorite.findOne({ user: req.user._id, poem: poem._id }) : false;

        res.render('poems/show', { poem, comments, isFavorited: !!isFavorited });
    } catch (err) {
        res.status(500).send('Erro no servidor');
    }
};

exports.getEditPoem = async (req, res) => {
    const poem = await Poem.findById(req.params.id);
    if (!poem || poem.author.toString() !== req.user._id.toString()) return res.redirect('/poems');
    res.render('poems/edit', { poem });
};

exports.postEditPoem = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        await Poem.findOneAndUpdate({ _id: req.params.id, author: req.user._id }, { title, content, category });
        res.redirect(`/poems/${req.params.id}`);
    } catch (err) {
        res.status(400).send('Erro ao editar.');
    }
};

exports.deletePoem = async (req, res) => {
    try {
        await Poem.findOneAndDelete({ _id: req.params.id, author: req.user._id });
        await Comment.deleteMany({ poem: req.params.id });
        await Favorite.deleteMany({ poem: req.params.id });
        res.redirect('/poems');
    } catch (err) {
        res.status(500).send('Erro ao deletar.');
    }
};

// Curtidas (Like/Unlike)
exports.toggleLike = async (req, res) => {
    try {
        const poem = await Poem.findById(req.params.id);
        if (!poem) return res.status(404).send();

        if (poem.likes.includes(req.user._id)) {
            poem.likes.pull(req.user._id);
        } else {
            poem.likes.push(req.user._id);
        }
        await poem.save();
        res.redirect(`/poems/${req.params.id}`);
    } catch (err) {
        res.status(500).send();
    }
};

// Comentários
exports.postComment = async (req, res) => {
    try {
        await Comment.create({ content: req.body.content, poem: req.params.id, author: req.user._id });
        res.redirect(`/poems/${req.params.id}`);
    } catch (err) {
        res.status(400).send();
    }
};

exports.deleteComment = async (req, res) => {
    try {
        await Comment.findOneAndDelete({ _id: req.params.commentId, author: req.user._id });
        res.redirect(`/poems/${req.params.id}`);
    } catch (err) {
        res.status(500).send();
    }
};