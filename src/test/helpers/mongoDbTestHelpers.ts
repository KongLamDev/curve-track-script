import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export type MongoDbTestEnvironment = {
  mongoServer: MongoMemoryServer;
};

export const connectMongoose = async (): Promise<MongoDbTestEnvironment> => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  return { mongoServer };
};

/**
 * Mongoose disconnect to the in-memory MongoDB instance and
 * stop the MongoDB instance.
 */
export const disconnectMongoose = async (
  testEnvironment: MongoDbTestEnvironment
) => {
  await mongoose.disconnect();
  await testEnvironment.mongoServer.stop();
};
