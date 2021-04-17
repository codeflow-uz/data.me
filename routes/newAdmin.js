const express = require('express');
const {
  query
} = require('../public/pool');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('addAdmin', {
    msg: ''
  })
})

router.post('/', async (req, res) => {
  let {
    fullname,
    login,
    password,
    type
  } = req.body

  let is_excite = await query('select * from admins where login = $1', login)

  if (is_excite.length == 0) {
    await query('insert into admins ( fullname, login, password, level ) values ($1, $2, $3, $4)',
      fullname,
      login,
      password,
      type
    )
    res.render('addAdmin', {
      msg: ''
    })
  } else {
    res.render('addAdmin', {
      msg: 'Bunday login bilan ro`yxatdan o`tilgan.'
    })
  }

})

module.exports = router