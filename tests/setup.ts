// Jest/Testing setup — mocks env, connects to test DBs
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

// Prevent actual network calls
jest.mock('cloudinary');
jest.mock('stripe');

// Clean up MongoDB between tests
afterEach(async () => {
  const mongoose = await import('mongoose');
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await (await import('mongoose')).connection.close();
});
