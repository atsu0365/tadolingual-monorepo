const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const dbName = "englishReadingDB";

let client;
let db;

async function connectDB(retries = 5) {
  try {
    client = await MongoClient.connect(uri, {
      maxPoolSize: 10, // 接続プールの最大サイズ
      connectTimeoutMS: 5000, // 接続タイムアウト（ミリ秒）
      socketTimeoutMS: 45000, // ソケットタイムアウト（ミリ秒）
    });
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`Failed to connect to MongoDB (Attempt ${6 - retries}/5):`, error);
    if (retries > 0) {
      console.log(`Retrying in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retries - 1);
    }
    throw new Error("Failed to connect to MongoDB after multiple attempts");
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not connected. Call connectDB first.");
  }
  return db;
}

async function closeDB() {
  if (client) {
    try {
      await client.close();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Error while disconnecting from MongoDB:", error);
    }
  }
}

module.exports = { connectDB, getDB, closeDB };