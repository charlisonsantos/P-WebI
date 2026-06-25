const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'O nome é obrigatório'],
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, 'O e-mail é obrigatório'], 
        unique: true, // Impede que dois usuários usem o mesmo e-mail
        lowercase: true,
        trim: true 
    },
    password: { 
        type: String, 
        required: [true, 'A senha é obrigatória'] 
    },
    bio: { 
        type: String, 
        default: '' 
    },
    profilePicture: { 
        type: String, 
        default: 'default-avatar.png' // Caminho padrão caso o usuário não envie foto
    }
}, { 
    timestamps: true // Cria automaticamente os campos 'createdAt' (criado em) e 'updatedAt' (atualizado em)
});

module.exports = mongoose.model('User', UserSchema);