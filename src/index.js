const express = require("express");

const app = express();

app.use(express.json());

let persons = [
  { name: "Richard Dang", number: "647-717-0339", id: 1 },
  { name: "Test 1", number: "123-717-0339", id: 2 },
  { name: "Test 2", number: "456-717-0339", id: 3 },
  { name: "Test 3", number: "789-717-0339", id: 4 },
];

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const newPerson = req.body;
  newPerson.id = generateId();

  if (!newPerson.name || !newPerson.number) {
    return res.status(400).json({ error: `name or number missing` });
  } else if (persons.find((p) => p.name === newPerson.name)) {
    return res.status(400).json({ error: `name must be unique` });
  }

  persons = persons.concat(newPerson);
  res.json(newPerson);
});

app.get("/info", (req, res) => {
  const info = `Phonebook has info for ${
    persons.length
  } people\n ${new Date()}`;
  res.send(info);
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
