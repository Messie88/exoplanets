const request = require('supertest');
const app = require('../../app');
const {
  mongoConnect,
  mongoDisconnect,
} = require('../../services/mongo');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });

  // Test fixtures
  describe('Test GET /launches', () => {
    //   Name of the test                      test code
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.statusCode).toBe(200);
    });
  });

  describe('Test POST /v1/launch', () => {
    const completeLaunchData = {
      mission: 'Congo Spatial',
      rocket: 'Mfoua 1',
      destination: 'Kepler-442 b',
      launchDate: 'January 4, 2028'
    };
    const launchDataWithoutDate = {
      mission: 'Congo Spatial',
      rocket: 'Mfoua 1',
      destination: 'Kepler-442 b',
    };
    const launchDataWithInvalidData = {
      mission: 'Congo Spatial',
      rocket: 'Mfoua 1',
      destination: 'Kepler-442 b',
      launchDate: 'January'
    };

    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Missing required launch properties'
      });
    });

    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Invalid Launch date',
      });
    });
  });
});
