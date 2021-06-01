import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI || "";
if (!uri) {
  console.error("ERROR: Missing environment variable MONGO_URI.");
}

let client:MongoClient;

export async function getClient() {
	if (!client || !client.isConnected()) {
		client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.debug("DB CLIENT RECONNECTED");
  }
	return client;
};