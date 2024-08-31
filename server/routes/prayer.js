const express = require('express')
const router = express.Router()


const {updatePrayer, getPrayers, postPrayers, deletePrayer} = require('../controllers/prayerController')

router.get('/', getPrayers)

router.patch('/:id',updatePrayer)

router.post('/',postPrayers)

router.delete('/:id', deletePrayer)

module.exports = router