const express = require('express');
const controller = require('../controllers/heroController');
const { validateFavorite } = require('../validators/favoriteValidator');

const router = express.Router();

router.get('/superheroes', controller.getAllHeroes);
router.get('/superheroes/:id', controller.getHero);
router.post('/favorites', validateFavorite, controller.addFavorite);
router.get('/favorites', controller.getFavorites);
router.delete('/favorites/:id', controller.deleteFavorite);

module.exports = router;
