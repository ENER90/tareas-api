const express = require("express");
const Task = require("../models/task");
const validation = require("../validations/task");
const taskRouter = express.Router();

// List all tasks
taskRouter.get("/", async (_req, res) => {
  try {
    const tasks = await Task.find();

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error trying to get the tasks list" });
  }
});

// Find task by ID
taskRouter.get("/:id", validation.idValidation, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error trying to fetch task" });
  }
});

// Create new task
taskRouter.post("/", validation.postValidation, async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Error trying to save a task" });
  }
});

// Edit task by ID
taskRouter.put("/:id", validation.updateValidation, async (req, res) => {
  try {
    const updateTask = await Task.findByIdAndUpdate(req.params.id, req.body);

    if (!updateTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task updated successfully", task: updateTask });
  } catch (error) {
    res.status(500).json({ error: "Error trying to edit task" });
  }
});

// Delete task by ID
taskRouter.delete("/:id", validation.idValidation, async (req, res) => {
  try {
    const deleteTask = await Task.findByIdAndUpdate(req.params.id, {
      $set: { deletedAt: Date.now() },
    });

    if (!deleteTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully", task: deleteTask });
  } catch (error) {
    res.status(500).json({ error: "Error trying to delete task" });
  }
});

module.exports = taskRouter;
