const database = require('../database');
const bcrypt = require('bcryptjs');

const UserSchema = new database.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    cpf: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

UserSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

const User = database.model('User', UserSchema)

module.exports = User