import axios from 'axios';

const SUPERHERO_API_URL = 'https://akabab.github.io/superhero-api/api/all.json';

export async function getAllHeroes() {
  const response = await axios.get(SUPERHERO_API_URL);
  return response.data.map(hero => ({
    id: hero.id,
    name: hero.name,
    fullName: hero.biography.fullName,
    strength: hero.powerstats.strength,
    image: hero.images.md,
  }));
}

export async function getHeroById(id) {
  const heroes = await getAllHeroes();
  return heroes.find(hero => hero.id === parseInt(id));
}