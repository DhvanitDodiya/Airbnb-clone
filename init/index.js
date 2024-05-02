const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({}); // delete all listings from the database
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "662f3d3f03cbaf59cfd65c19",
  }));
  await Listing.insertMany(initData.data); // add new data to the database
  console.log("Data was initialised");
};

initDB();
