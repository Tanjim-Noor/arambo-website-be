import request from 'supertest';
import app from '../src/index';

describe('API Health Check', () => {
  it('should return 200 for health check', async () => {
    const response = await request(app)
      .get('/api/properties/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('timestamp');
  });
});

describe('Root Endpoint', () => {
  it('should return API information', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('endpoints');
  });
});

describe('Property Validation', () => {
  it('should validate required fields for property creation', async () => {
    const invalidProperty = {
      name: '', // Invalid: empty name
      email: 'invalid-email', // Invalid: bad email format
      phone: '123', // Invalid: too short
    };

    const response = await request(app)
      .post('/api/properties')
      .send(invalidProperty)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation Error');
    expect(response.body).toHaveProperty('details');
  });
});