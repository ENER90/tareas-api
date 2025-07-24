const express = require("express");
const Person = require("../models/person");
const validation = require("../validations/person");
const personRouter = express.Router();

personRouter.get("/", async (_req, res) => {
  try {
    const people = await Person.find();

    res.json(people);
  } catch (error) {
    res.status(500).json({ error: "Error trying to list people" });
  }
});

personRouter.get("/:id", validation.idValidation, async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);

    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }

    res.json(person);
  } catch (error) {
    res.status(500).json({ error: "Error trying to fetch person" });
  }
});

personRouter.post("/", validation.postValidation, async (req, res) => {
  try {
    const newPerson = new Person(req.body);
    await newPerson.save();
    res.status(201).json(newPerson);
  } catch (error) {
    res.status(500).json({ error: "Error trying to save a person" });
  }
});

personRouter.put("/:id", validation.updateValidation, async (req, res) => {
  try {
    const updatePerson = await Person.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    if (!updatePerson) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json({
      message: "Person updated successfully",
      person: updatePerson,
    });
  } catch (error) {
    res.status(500).json({ error: "Error trying to edit person" });
  }
});

personRouter.delete("/:id", validation.idValidation, async (req, res) => {
  try {
    const deletePerson = await Person.findByIdAndDelete(req.params.id);

    if (!deletePerson) {
      return res.status(404).json({ error: "Person not found" });
    }

    res.json({
      message: "Person deleted successfully",
      person: deletePerson,
    });
    return;
  } catch (error) {
    res.status(500).json({ error: "Error trying to delete person" });
  }
});

module.exports = personRouter;
