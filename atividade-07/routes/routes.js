const express = require('express')
const router = express.Router()

// Rotas

router.get('/', (req, res) => {
  res.send('Página inicial')
})

router.get('/about', (req, res) => {
  res.send('Página About')
})

router.post('/data', (req, res) => {
  res.send('Recebeu dados via POST')
})

router.get('/signin', (req, res) => {
  res.send('Página Signin')
})

router.get('/signup', (req, res) => {
  res.send('Página Signup')
})

router.get('/users/:userid', (req, res) => {
  const user = req.params.userid

  if (!user) {
    return res.redirect('/signup')
  }

  res.send(`Bem-vindo, usuário ${user}`)
})

module.exports = router