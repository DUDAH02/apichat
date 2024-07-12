const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

let dbInstance;

async function connect() {
  if (dbInstance) return dbInstance;

  try {
    const client = new MongoClient(process.env.DB_HOST);
    await client.connect();
    dbInstance = client.db(process.env.DB_DATABASE);
    console.log("Connected to MongoDB");
    return dbInstance;
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    throw error;
  }
}

async function findAll(collection) {
  const db = await connect();
  return db.collection(collection).find().toArray();
}

async function insertOne(collection, object) {
  const db = await connect();
  return db.collection(collection).insertOne(object);
}

async function findOne(collection, _id) {
  const db = await connect();
  let objectId;
  try {
    objectId = new ObjectId(_id);
  } catch (error) {
    console.error("Invalid ObjectId:", _id);
    return false;
  }

  const obj = await db.collection(collection).findOne({ _id: objectId });
  if (!obj) {
    console.error("Document not found:", { _id: objectId });
  }
  return obj || false;
}

async function findAllUsuarios(collection) {
  const db = await connect();
  return db.collection(collection).find().toArray();
}

async function updateOne(collection, object, param) {
  const db = await connect();
  return db.collection(collection).updateOne(param, { $set: object });
}

async function deleteOne(collection, _id) {
  const db = await connect();
  return db.collection(collection).deleteOne(_id);
}

module.exports = {
  findAll,
  insertOne,
  findOne,
  updateOne,
  deleteOne,
  findAllUsuarios,
};
