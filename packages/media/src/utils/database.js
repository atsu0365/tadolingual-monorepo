var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const dbName = "englishReadingDB";
let client;
let db;
function connectDB() {
    return __awaiter(this, arguments, void 0, function* (retries = 5) {
        try {
            client = yield MongoClient.connect(uri, {
                maxPoolSize: 10, // 接続プールの最大サイズ
                connectTimeoutMS: 5000, // 接続タイムアウト（ミリ秒）
                socketTimeoutMS: 45000, // ソケットタイムアウト（ミリ秒）
            });
            db = client.db(dbName);
            console.log("Connected to MongoDB");
        }
        catch (error) {
            console.error(`Failed to connect to MongoDB (Attempt ${6 - retries}/5):`, error);
            if (retries > 0) {
                console.log(`Retrying in 5 seconds...`);
                yield new Promise(resolve => setTimeout(resolve, 5000));
                return connectDB(retries - 1);
            }
            throw new Error("Failed to connect to MongoDB after multiple attempts");
        }
    });
}
function getDB() {
    if (!db) {
        throw new Error("Database not connected. Call connectDB first.");
    }
    return db;
}
function closeDB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (client) {
            try {
                yield client.close();
                console.log("Disconnected from MongoDB");
            }
            catch (error) {
                console.error("Error while disconnecting from MongoDB:", error);
            }
        }
    });
}
module.exports = { connectDB, getDB, closeDB };
