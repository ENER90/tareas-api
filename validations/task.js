const express = require("express");

//validation GET by ID
function validateID(req, res, next) {
  const { id } = req.params;

  // Validate ID format on MongoDB
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: "invalid ID format" });
  }

  next();
}

//POST validation
function validateTask(req, res, next) {
  const { title, description, status, asignedTo, dueDate } = req.body;

  //title validation
  if (!title | (typeof title !== "string") || title.trim() === "") {
    return res
      .status(400)
      .json({ error: "The title cannot be emty and must be a strng" });
  }
  //description validation
  if (description && typeof description !== "string") {
    return res.status(400).json({ error: "The description must be a strng" });
  }
  //status validation
  const validStatus = ["To Do", "In Progress", "In Revision", "Done"];
  if (!validStatus.includes(status)) {
    return res.status(400).json({
      error: `Invalid status value, most be one of : ${validStatus.join(
        ", "
      )}.`,
    });
  }
  //asignedTo validation
  if (!asignedTo || !asignedTo.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: "Ivalid asignedTo ID format" });
  }
  //dueDate validation
  if (dueDate) {
    const parseDate = new Date(dueDate);
    if (isNaN(parseDate.getTime()) || parseDate < new Date()) {
      return res
        .status(400)
        .json({ error: "the dueDate must be a valid future date." });
    }
  }

  next();
}

//PUT validatrion
function updateValidation(req, res, next) {
  const { title, description, status, asignedTo, dueDate } = req.body;
  const { id } = req.params;

  // Validate ID format on MongoDB
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: "invalid ID format" });
  }

  //title send validation
  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res
        .status(400)
        .json({ error: "The title cannot be emty and must be a strng" });
    }
  }

  //description send validation
  if (description !== undefined) {
    if (typeof description !== "string") {
      return res.status(400).json({ error: "The description must be a strng" });
    }
  }

  //status send validation
  const validStatus = ["To Do", "In Progress", "In Revision", "Done"];
  if (status !== undefined) {
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        error: `Invalid status value, most be one of : ${validStatus.join(
          ", "
        )}.`,
      });
    }
  }

  //asignedTo send validation
  if (asignedTo !== undefined) {
    if (!asignedTo.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Ivalid asignedTo ID format" });
    }
  }

  //dueDate send validation
  if (dueDate !== undefined) {
    const parseDate = new Date(dueDate);
    if (isNaN(parseDate.getTime()) || parseDate < new Date()) {
      return res
        .status(400)
        .json({ error: "the dueDate must be a valid future date." });
    }
  }

  next();
}

module.exports = { validateID, updateValidation, validateTask };
