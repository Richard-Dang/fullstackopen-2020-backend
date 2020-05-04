const personsRouter = require("express").Router();
const Person = require("../models/person");

personsRouter.get("/", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons.map((person) => person.toJSON()));
    })
    .catch((err) => next(err));
});

personsRouter.get("/:id", (req, res, next) => {
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

personsRouter.delete("/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

personsRouter.post("/", (req, res, next) => {
  const { name, number } = req.body;
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

personsRouter.put("/:id", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "name or number missing" });
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

personsRouter.get("/info", (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      res.send(`Phonebook has info for ${count} people\n ${new Date()}`);
    })
    .catch((err) => next(err));
});

module.exports = personsRouter;
