const express = require('express');
const authMiddleware = require('../../middlewares/auth');

const User = require('../../models/user');

const database = require('../../database/index');
const { response } = require('express');
const { update } = require('../../models/user');
const Product = require('../../models/product');

const router = express.Router();
router.use(authMiddleware)

// get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.send( {total: users.length, users} )

    } catch (err) {
        res.send( err )
    }

    // User.find((err, users, next) => {
    //     if (err) return next(err)
    //     res.send({ total: users.length, users })
    // })
})

router.get('/:cpf', async (req, res) => {
    const cpf = req.params.cpf
    const user = await User.findOne( {cpf} ) // se não uso "await" não retorna as informações do cpf buscado

    // typeof user -> object
    // se tivesse usado 'User.find()' -> validação seria: !Object.keys(user).length

    if (!user)
        return res.status(404).send({ error: 'User not found' })

    console.log(user.password);
    
    return res.status(200).send({ user })
})

router.patch('/:cpf', async (req, res) => {
    try {
        const cpf = req.params.cpf
        const user = await User.findOne({ cpf })
        if (!user)
            res.status(404).send({ error: 'User not found' })

        if (req.body.name)
            user.name = req.body.name

        if (req.body.email)
            user.email = req.body.email
        
        if (req.body.password)
            user.password = req.body.password
        
        await user.save()
        res.send(user)
        
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
})

router.put('/', async (req, res) => {
    const { cpf } = req.body

    if (!await User.findOne({ cpf }))
            return res.status(404).send({ error: 'User not found' });
    
    await User.findOneAndReplace({ cpf }, req.body);

    const user = await User.findOne({ cpf });
    
    return res.send({
        user
    })
})

router.delete('/', async (req, res) => {
    const { cpf } = req.body

    if(!await User.findOne({ cpf }))
        return res.status(404).send({ error: 'User not found' })
    
    await User.deleteOne({ cpf })

    return res.status(204).send({ message: 'User deleted' })

})

module.exports = app => app.use('/users', router)