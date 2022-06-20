import mongoose from 'mongoose';

async function initDbConnection() {
  await mongoose.connect(
    process.env.MONGO_URI || 'mongodb://localhost:27017/end-project'
  );
}

export default initDbConnection;
