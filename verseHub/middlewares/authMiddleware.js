const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rotas privadas
const protect = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/auth/login');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) return res.redirect('/auth/login');
        next();
    } catch (err) {
        res.clearCookie('token');
        return res.redirect('/auth/login');
    }
};

// Middleware opcional (apenas injeta usuário global nas views se logado)
const optionalAuth = async (req, res, next) => {
    const token = req.cookies.token;
    res.locals.user = null;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = await User.findById(decoded.id).select('-password');
            req.user = res.locals.user;
        } catch (err) {
            res.clearCookie('token');
        }
    }
    next();
};

module.exports = { protect, optionalAuth };