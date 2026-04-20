// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGO_URI || 'mongodb+srv://ayeshahabib77:tool77@cluster0.kri2j01.mongodb.net/hr-tool?retryWrites=true&w=majority&appName=Cluster0';
// // console.log("uriii:", uri);
// let client;
// let clientPromise;

// if (!uri) {
//     throw new Error('Please define mongo MONGO_URI in .env')
// }
// if (process.env.NODE_ENV === 'development') {
//     if (!global._mongoClientPromise) {
//         client = new MongoClient(uri);
//         global._mongoClientPromise = client.connect();
//     }
//     clientPromise = global._mongoClientPromise;
// } else {
//     client = new MongoClient(uri);
//     clientPromise = client.connect();
// }
// export default clientPromise;



import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;

if (!uri) {
    throw new Error('Please define MONGO_URI in .env');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;

export { connectDB, connectDB as connectMongoose } from "./mongoose";