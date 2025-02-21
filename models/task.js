const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "In Revision", "Done"],
      default: "To Do",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },
    dueDate: {
      type: Date,
    },
    deletedAt: {
      type: Date,
      default: null, // Null means the task is not deleted
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

module.exports = mongoose.model("Task", taskSchema);
