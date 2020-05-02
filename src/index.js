require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();
const PORT = process.env.PORT || 3001;

morgan.token("data", (req) => {
  return JSON.stringify(req.body);
});

app.use(express.static("build"));
app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

let persons = [
  { name: "Richard Dang", number: "647-717-0339", id: 1 },
  { name: "Test 1", number: "123-717-0339", id: 2 },
  { name: "Test 2", number: "456-717-0339", id: 3 },
  { name: "Test 3", number: "789-717-0339", id: 4 },
];

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons.map((person) => person.toJSON()));
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person.toJSON());
    })
    .catch((err) => res.status(404).end());
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: `name or number missing` });
  }

  const person = new Person({
    name,
    number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson.toJSON());
    persons = persons.concat(newPerson);
  });
});

app.get("/info", (req, res) => {
  const info = `Phonebook has info for ${
    persons.length
  } people\n ${new Date()}`;
  res.send(info);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
