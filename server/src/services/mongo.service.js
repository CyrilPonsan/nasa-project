const mongoose = require("mongoose");

MONGO_URL =
  "mongodb+srv://toto:n2HE4KNFSWXLoGDF@fake-nasa-cluster.rj3f8nt.mongodb.net/nasa?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

module.exports = { mongoConnect };
