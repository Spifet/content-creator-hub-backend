import mongoose from "mongoose";

async function initDbConnection() {
  await mongoose.connect(
    process.env.MONGO_URI ||
      "mongodb+srv://JLA:AdminJLA@jla.efjgg44.mongodb.net/?retryWrites=true&w=majority"
  );
}

export default initDbConnection;
