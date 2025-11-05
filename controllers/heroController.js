const axios = require('axios');
const SUPERHERO_API_URL = 'https://akabab.github.io/superhero-api/api/all.json';

let favorites = [];

function resetFavorites() {
  favorites = [];
}

async function getAllHeroes(req, res, next) {
  try {
    const response = await axios.get(SUPERHERO_API_URL);
    const heroes = response.data.map(hero => ({
      id: hero.id,
      name: hero.name,
      fullName: hero.biography.fullName,
      strength: hero.powerstats.strength,
      image: hero.images.md
    }));
    res.json(heroes);
  } catch (err) {
    next(err);
  }
}

async function getHero(req, res, next) {
  try {
    const response = await axios.get(SUPERHERO_API_URL);
    const hero = response.data.find(h => h.id === parseInt(req.params.id));
    if (!hero) return res.status(404).json({ error: 'Hero not found' });
    res.json({
      id: hero.id,
      name: hero.name,
      fullName: hero.biography.fullName,
      strength: hero.powerstats.strength,
      image: hero.images.md
    });
  } catch (err) {
    next(err);
  }
}

function addFavorite(req, res, next) {
  const { id, note } = req.body;
  if (!id || !note) return res.status(400).json({ error: 'ID and note are required' });
  favorites.push({ id, note });
  res.status(201).json({ message: 'Favorite added', favorite: { id, note } });
}

function getFavorites(req, res) {
  res.json(favorites);
}

function deleteFavorite(req, res) {
  const index = favorites.findIndex(fav => fav.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Favorite not found' });
  const deleted = favorites.splice(index, 1);
  res.json({ message: 'Favorite deleted', deleted });
}

module.exports = {
  getAllHeroes,
  getHero,
  addFavorite,
  getFavorites,
  deleteFavorite,
  resetFavorites
};
