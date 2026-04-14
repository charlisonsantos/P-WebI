const express = require('express')
const app = express()

const routes = require('./routes/routes')

// Middleware global
app.use((req, res, next) => {
  console.log(`Acessou: ${req.method} ${req.url}`)
  next()
})

// Usando Router
app.use('/', routes)

// Página 404
app.use((req, res) => {
  res.status(404).send('Erro 404 - Página não encontrada <br><a href="/">Voltar</a>')
})

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000')
})