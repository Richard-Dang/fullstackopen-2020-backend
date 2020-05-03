require("dotenv").config();
const express = require("express");
const morganLogger = require("./middlewares/morganLogger");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const Person = require("./models/person");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static("build"));
app.use(cors());
app.use(express.json());
app.use(morganLogger());

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons.map((person) => person.toJSON()));
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => res.status(204).end())
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: `name or number missing` });
  }

  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson.toJSON());
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: `name or number missing` });
  }

  const person = {
    name,
    number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson.toJSON());
    })
    .catch((err) => next(err));
});

app.get("/info", (req, res) => {
  Person.countDocuments({})
    .then((count) => {
      res.send(`Phonebook has info for ${count} people\n ${new Date()}`);
    })
    .catch((err) => next(err));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
