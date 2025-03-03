const express = require("express");
const mongoose = require("mongoose");

function validateID(id) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return "invalid ID format on MongoDB";
  }
  return null;
}

function validateTitle(title) {
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return "The title cannot be empty and must be a string";
  }
  return null;
}

function validateDescription(description) {
  if (description && typeof description !== "string") {
    return "The description must be a string";
  }
  return null;
}

function validateStatus(status) {
  const validStatus = ["To Do", "In Progress", "In Revision", "Done"];
  if (!validStatus.includes(status)) {
    return `Invalid status value, must be one of : ${validStatus.join(", ")}.`;
  }
  return null;
}

function validateAssignedTo(assignedTo) {
  if (!assignedTo || !mongoose.Types.ObjectId.isValid(assignedTo)) {
    return "Invalid assignedTo ID format format on MongoDB";
  }
  return null;
}

function validateDueDate(dueDate) {
  if (dueDate) {
    const parseDate = new Date(dueDate);
    if (isNaN(parseDate.getTime()) || parseDate < new Date()) {
      return "the dueDate must be a valid future date.";
    }
  }
  return null;
}

function postValidation(req, res, next) {
  const { title, description, assignedTo, status, dueDate } = req.body;
  const errors = [
    validateTitle(title),
    validateDescription(description),
    validateStatus(status),
    validateAssignedTo(assignedTo),
    validateDueDate(dueDate),
  ].filter((error) => error !== null);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

function updateValidation(req, res, next) {
  const { id } = req.params;
  const { title, description, assignedTo, status, dueDate } = req.body;
  const taskData = { title, description, assignedTo, status, dueDate };

  const errorID = validateID(id);
  if (errorID !== null) {
    return res.status(400).json({ error: errorID });
  }

  const errors = [];

  Object.entries(taskData).forEach(([key, value]) => {
    if (value !== undefined) {
      let error = null;

      switch (key) {
        case "title":
          error = validateTitle(value);
          break;
        case "description":
          error = validateDescription(value);
          break;
        case "status":
          error = validateStatus(value);
          break;
        case "assignedTo":
          error = validateAssignedTo(value);
          break;
        case "dueDate":
          error = validateDueDate(value);
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

module.exports = { validateID, postValidation, updateValidation };
