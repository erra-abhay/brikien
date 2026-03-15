import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing from environment');

  let retries = 10;
  while (retries > 0) {
    try {
      await mongoose.connect(uri);
      console.log('✅ MongoDB connected successfully');
      return;
    } catch (err) {
      retries -= 1;
      console.error(`❌ MongoDB connection failed. Retries left: ${retries}`, err);
      if (retries === 0) {
        console.error('All retries failed. Exiting.');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};
