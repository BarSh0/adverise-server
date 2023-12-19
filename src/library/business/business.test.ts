import mongoose, { ConnectOptions } from 'mongoose';
import request from 'supertest';
import app from '../../../app'; //
import { Business } from './business.model';

beforeAll(() => {
  // Connect to a test database
  mongoose.createConnection('mongodb://localhost:27017/testDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
});

afterAll(async () => {
  // Disconnect from the test database
  await mongoose.disconnect();
});

describe('Business Controller', () => {
  const testBusiness = {
    businessId: 'testBusinessId',
    name: 'Test Business',
    page: new mongoose.Types.ObjectId(),
    user: new mongoose.Types.ObjectId(),
    campaign: { id: 'testCampaignId', name: 'Test Campaign' },
    audience: { id: 'testAudienceId', name: 'Test Audience' },
    adSetId: 'testAdSetId',
  };

  it('should get all businesses', async () => {
    // Insert a test business into the test database
    await Business.create(testBusiness);

    // Make a GET request to retrieve all businesses
    const response = await request(app).get('/business');

    // Assert that the response status is 200
    expect(response.status).toBe(200);

    // Assert that the response body contains the test business data
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].businessId).toBe(testBusiness.businessId);
  });

  it('should get a business by id', async () => {
    // Insert a test business into the test database
    const createdBusiness = await Business.create(testBusiness);

    // Make a GET request to retrieve the business by id
    const response = await request(app).get(`/business/${createdBusiness._id}`);

    // Assert that the response status is 200
    expect(response.status).toBe(200);

    // Assert that the response body contains the test business data
    expect(response.body.data.businessId).toBe(testBusiness.businessId);
  });

  // Add similar tests for postBusiness and deleteBusiness functions
  // ...

  it('should delete a business by id', async () => {
    // Insert a test business into the test database
    const createdBusiness = await Business.create(testBusiness);

    // Make a DELETE request to delete the business by id
    const response = await request(app).delete(`/business/${createdBusiness._id}`);

    // Assert that the response status is 200
    expect(response.status).toBe(200);

    // Assert that the response body contains the deleted business data
    expect(response.body.data.businessId).toBe(testBusiness.businessId);

    // Check that the business is deleted from the database
    const deletedBusiness = await Business.findById(createdBusiness._id);
    expect(deletedBusiness).toBeNull();
  });
});
