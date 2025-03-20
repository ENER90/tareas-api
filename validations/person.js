const express = require("express");
const mongoose = require("mongoose");

function validateID(id) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return "invalid ID format on MongoDB";
  }
  return null;
}

function validateName(name) {
  if (!name || typeof name !== "string" || name.trim() === "") {
    return "The name can`t be empty and must be a string.";
  }

  return null;
}

function validateAge(age) {
  if (!age || isNaN(Number(age)) || Number(age) > 100 || Number(age) <= 0) {
    return "The age cannot be empty and must be a valid number between 1 and 100.";
  }

  return null;
}

function postValidation(req, res, next) {
  const { name, age } = req.body;
  const errors = [validateName(name), validateAge(age)].filter(
    (error) => error !== null
  );

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

function updateValidation(req, res, next) {
  const { id } = req.params;
  const { name, age } = req.body;
  const personData = { name, age };

  const errorID = validateID(id);
  if (errorID !== null) {
    return res.status(400).json({ error: errorID });
  }

  const errors = [];

  Object.entries(personData).forEach(([key, value]) => {
    if (value !== undefined) {
      let error = null;

      switch (key) {
        case "name":
          error = validateName(name);
          break;

        case "age":
          error = validateAge(age);
          break;
      }

      if (error) errors.push(error);
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({ error: errors });
  }

  next();
}

function idValidation(req, res, next) {
  const { id } = req.params;
  const errorID = validateID(id);
  if (errorID !== null) {
    return res.status(400).json({ error: errorID });
  }

  next();
}

module.exports = { idValidation, updateValidation, postValidation };
