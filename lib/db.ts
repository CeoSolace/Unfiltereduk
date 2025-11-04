import mongoose from 'mongoose';

let globalConnection = global._mongooseConnection;

if (!globalConnection) {
  globalConnection = mongoose.connect(process.env.AUTH_DB_URI!, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
  });
  global._mongooseConnection = globalConnection;
}

export async function connectAuthDB() {
  await globalConnection;
  return mongoose.connection;
}
