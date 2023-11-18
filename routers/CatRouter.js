const express = require('express')
const router = express.Router()

const catController = require("../controller/CatController")

router.get('/', catController.index)

router.get('/:id', catController.show)

router.post('/', catController.create)

router.patch('/:id', catController.update)

router.delete('/:id', catController.destroy)

module.exports = router; 
