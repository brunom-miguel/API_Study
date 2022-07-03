const express = require('express');

const Product = require('../../models/product')

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { code } = req.body;

        if (await Product.findOne({ code }))
            return res.status(400).send({ error: 'Product already registered' })
        
        const product = await Product.create(req.body);

        return res.send({
            product
        })
    } catch (err) {
        return res.status(400).send({ error: err.message})
    }
})

router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
        res.send({ totalProducts: products.length, products })
    } catch (err) {
        res.send( err )
    }
})

module.exports = app => app.use('/product', router)
