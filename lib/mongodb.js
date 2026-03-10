import mongoose from "mongoose";

const MONGODB_URI =
"mongodb://anchal:anchal123@ac-6un107n-shard-00-00.f4vxqw0.mongodb.net:27017,ac-6un107n-shard-00-01.f4vxqw0.mongodb.net:27017,ac-6un107n-shard-00-02.f4vxqw0.mongodb.net:27017/userdb?ssl=true&replicaSet=atlas-p6wrtu-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");
}