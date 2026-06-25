const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const { optionalAuth } = require('./middlewares/authMiddleware');
require('dotenv').config();

const app = express();

// Conexão com o Banco de Dados
connectDB();

// Configurações e Template Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares Globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(optionalAuth); // Aplica verificação de usuário logado a todas as views de forma global

// Injeção de Rotas
app.use('/auth', require('./routes/authRoutes'));
app.use('/poems', require('./routes/poemRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));

// Rota raiz (Landing Page)
app.get('/', (req, res) => {
    res.render('home');
});

// Inicialização do Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor VerseHub rodando perfeitamente na porta ${PORT}`);
});