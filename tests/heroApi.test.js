const request = require('supertest');
const express = require('express');
const heroRoutes = require('../routes/heroRoutes');
const { errorHandler } = require('../middlewares');
const { resetFavorites } = require('../controllers/heroController');
const axios = require('axios');

jest.mock('axios');

const app = express();
app.use(express.json());
app.use('/', heroRoutes);
app.use(errorHandler);

beforeEach(() => resetFavorites());

const mockHeroes = [
  {
    id: 1,
    name: 'Superman',
    biography: { fullName: 'Clark Kent' },
    powerstats: { strength: 100 },
    images: { md: 'superman.png' }
  }
];

describe('SuperHero REST API', () => {
  let favoriteId = 1;

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockHeroes });
  });

  test('GET /superheroes returns an array of heroes', async () => {
    const res = await request(app).get('/superheroes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('id', 1);
    expect(res.body[0]).toHaveProperty('name', 'Superman');
  });

  test('GET /superheroes/:id returns a specific hero', async () => {
    const res = await request(app).get('/superheroes/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('name', 'Superman');
  });

  test('GET /superheroes/:id returns 404 for invalid ID', async () => {
    const res = await request(app).get('/superheroes/999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Hero not found');
  });

  test('POST /favorites adds a favorite', async () => {
    const res = await request(app).post('/favorites').send({ id: favoriteId, note: 'Min yndlingshelt!' });
    expect(res.status).toBe(201);
    expect(res.body.favorite).toEqual({ id: favoriteId, note: 'Min yndlingshelt!' });
  });

  test('POST /favorites returns 400 if note is missing', async () => {
    const res = await request(app).post('/favorites').send({ id: 2 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /favorites returns 400 if id is missing', async () => {
    const res = await request(app).post('/favorites').send({ note: 'Ingen ID' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /favorites returns list of favorites', async () => {
    await request(app).post('/favorites').send({ id: favoriteId, note: 'Test' });
    const res = await request(app).get('/favorites');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('note');
  });

  test('DELETE /favorites/:id deletes a favorite', async () => {
    await request(app).post('/favorites').send({ id: favoriteId, note: 'Test' });
    const res = await request(app).delete(`/favorites/${favoriteId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Favorite deleted');
  });

  test('DELETE /favorites/:id returns 404 if not found', async () => {
    const res = await request(app).delete(`/favorites/999`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Favorite not found');
  });
});
