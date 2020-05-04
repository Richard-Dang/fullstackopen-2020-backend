const mongoose = require("mongoose");
const logger = require("./utils/logger");
require("dotenv").config();

if (process.argv.length < 3) {
  logger.error("give password as argument");
  process.exit(1);
}

const db_password = process.argv[2];
const mongoUri = `mongodb+srv://RichardDang:${db_password}@cluster0-izq2r.mongodb.net/phonebook?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`;
let name = "";
let number = "";

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv[3]) {
  name = process.argv[3];
}
if (process.argv[4]) {
  number = process.argv[4];
}

if (process.argv.length === 3) {
  logger.info("phonebook:");
  Person.find({}).then((res) => {
    if (res.length === 0) logger.info("empty");
    res.forEach((person) => {
      logger.info(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    logger.info(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
