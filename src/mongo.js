const mongoose = require("mongoose");
require("dotenv").config();

if (process.argv.length < 3) {
  console.log("give password as argument");
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
  console.log("phonebook:");
  Person.find({}).then((res) => {
    if (res.length === 0) console.log("empty");
    res.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
