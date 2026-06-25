const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getRegister = (req, res) => res.render('auth/register', { error: null });

exports.postRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.render('auth/register', { error: 'E-mail já cadastrado.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/poems');
    } catch (err) {
        res.render('auth/register', { error: 'Erro ao registrar usuário.' });
    }
};

exports.getLogin = (req, res) => res.render('auth/login', { error: null });

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.render('auth/login', { error: 'Credenciais inválidas.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.render('auth/login', { error: 'Credenciais inválidas.' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/poems');
    } catch (err) {
        res.render('auth/login', { error: 'Erro ao fazer login.' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};