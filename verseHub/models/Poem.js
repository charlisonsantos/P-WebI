const mongoose = require('mongoose');

const PoemSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'O título do poema é obrigatório'],
        trim: true 
    },
    content: { 
        type: String, 
        required: [true, 'O conteúdo do poema não pode estar vazio'] 
    },
    category: { 
        type: String, 
        enum: ['Romance', 'Reflexão', 'Natureza', 'Amizade', 'Motivação'], 
        required: true 
    },
    // Aqui acontece o relacionamento: armazena o ID do Usuário que criou o poema
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Aponta para o Model 'User'
        required: true 
    },
    // Array de IDs de usuários que curtiram o poema
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Poem', PoemSchema);