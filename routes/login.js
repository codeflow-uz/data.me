const express = require('express');
const { query } = require('../public/pool');
const router  = express.Router();

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', async (req, res) => {
    let {
        login, password
    } = req.body
    let is_excist = await query('select * from admins where login = $1 AND password = $2', login, password)
    if (is_excist.length != 0) {
        res.redirect('/home')
    }else {
        res.status(404).send("User is not found.")
    }
})

module.exports = router