import request from 'supertest';
import app from '../src/index';
import { Property } from '../src/database/models/property.model';

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

describe('Property API', () => {
  const validProperty = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    propertyName: 'Test Property',
    propertyType: 'apartment',
    size: 1000,
    location: 'Test Location',
    bedrooms: 2,
    bathroom: 2,
    baranda: false,
    category: 'sale',
    notes: 'Test notes',
    firstOwner: true,
    paperworkUpdated: true,
    onLoan: false,
  };

  describe('POST /api/properties', () => {
    it('should create a new property with valid data', async () => {
      const response = await request(app)
        .post('/api/properties')
        .send(validProperty)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(validProperty.name);
      expect(response.body.email).toBe(validProperty.email);
      expect(response.body.propertyName).toBe(validProperty.propertyName);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

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

    it('should reject invalid property type', async () => {
      const invalidProperty = {
        ...validProperty,
        propertyType: 'invalid-type',
      };

      const response = await request(app)
        .post('/api/properties')
        .send(invalidProperty)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation Error');
    });
  });

  describe('GET /api/properties', () => {
    beforeEach(async () => {
      // Create test properties
      await Property.create([
        { ...validProperty, propertyName: 'Property 1', category: 'sale' },
        { ...validProperty, propertyName: 'Property 2', category: 'rent' },
        { ...validProperty, propertyName: 'Property 3', category: 'sale', propertyType: 'House' },
      ]);
    });

    it('should get all properties', async () => {
      const response = await request(app)
        .get('/api/properties')
        .expect(200);

      expect(response.body).toHaveProperty('properties');
      expect(response.body).toHaveProperty('total');
      expect(response.body.properties).toHaveLength(3);
    });

    it('should filter properties by category', async () => {
      const response = await request(app)
        .get('/api/properties?category=sale')
        .expect(200);

      expect(response.body.properties).toHaveLength(2);
      response.body.properties.forEach((property: any) => {
        expect(property.category).toBe('sale');
      });
    });

    it('should filter properties by property type', async () => {
      const response = await request(app)
        .get('/api/properties?propertyType=house')
        .expect(200);

      expect(response.body.properties).toHaveLength(1);
      expect(response.body.properties[0].propertyType).toBe('house');
    });
  });

  describe('GET /api/properties/:id', () => {
    let propertyId: string;

    beforeEach(async () => {
      const property = await Property.create(validProperty);
      propertyId = property.id as string;
    });

    it('should get a property by ID', async () => {
      const response = await request(app)
        .get(`/api/properties/${propertyId}`)
        .expect(200);

      expect(response.body.id).toBe(propertyId);
      expect(response.body.propertyName).toBe(validProperty.propertyName);
    });

    it('should return 404 for non-existent property', async () => {
      const fakeId = '507f1f77bcf86cd799439011'; // Valid ObjectId format
      const response = await request(app)
        .get(`/api/properties/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/properties/:id', () => {
    let propertyId: string;

    beforeEach(async () => {
      const property = await Property.create(validProperty);
      propertyId = property.id as string;
    });

    it('should update a property', async () => {
      const updateData = {
        propertyName: 'Updated Property Name',
        size: 1500,
      };

      const response = await request(app)
        .put(`/api/properties/${propertyId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.propertyName).toBe(updateData.propertyName);
      expect(response.body.size).toBe(updateData.size);
      expect(response.body.email).toBe(validProperty.email); // Unchanged field
    });

    it('should return 404 for non-existent property update', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/properties/${fakeId}`)
        .send({ propertyName: 'Updated' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
});