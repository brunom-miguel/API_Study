const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../../config/auth.json')

const User = require('../../models/user')

const router = express.Router();

function generateAuthorizationToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        // token expira em 86400 segundos
        expiresIn: 86400
    })
}

// registra usuário
router.post('/register', async (req, res) => {
    try {
        // verificação se existe usuário
        const { email } = req.body;

        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'Email already exists' });
        
        // criando usuário
        const user = await User.create(req.body);
        user.password = undefined;

        return res.send({
            user
        })
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne(({ email })).select('+password') // se não colocar '+password' não faz requisição

    if (!user)
        return res.status(400).send({ error: 'User not found' })
    
    if (!await bcrypt.compare(password, user.password)) 
        return res.status(400).send({ error: 'Password mismatch' })

    res.send({
        user,
        token: generateAuthorizationToken({ id: user.id })
    })
})

module.exports = app => app.use('/auth/users', router)
