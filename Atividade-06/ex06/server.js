// 1. Importação
const express = require('express');
const app = express();

// 2. Configuração
app.use(express.json());

// 3. Middleware GLOBAL (vem antes das rotas)
app.use((req, res, next) => {
    console.log(`Acessou: ${req.url}`);
    next();
});

// 4. ROTAS

app.get('/', (req, res) => {
    res.send('Página INDEX');
});

app.get('/about', (req, res) => {
    res.send('Página ABOUT');
});

app.post('/data', (req, res) => {
    res.send('Página DATA (POST)');
});

app.get('/users', (req, res) => {
    res.send('Página USERS');
});

app.get('/users/signup', (req, res) => {
    res.send('Página SIGNUP');
});

// ⚠️ rota com parâmetro vem depois das específicas
app.get('/users/:userid', (req, res) => {
    const userid = req.params.userid;
    res.send(`Bem-vindo, usuário ${userid}`);
});

app.get('/users/signin', (req, res) => {
    const userid = req.query.userid;

    if (!userid) {
        return res.redirect('/users/signup');
    }

    res.send(`Bem-vindo no signin, usuário ${userid}`);
});

// 5. ERRO 404 (SEMPRE POR ÚLTIMO)
app.use((req, res) => {
    res.status(404).send('Erro 404 - Página não encontrada');
});

// 6. Servidor (último de tudo)
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});