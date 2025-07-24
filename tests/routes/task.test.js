const request = require("supertest");
const mongoose = require("mongoose");
const Task = require("../../src/models/task");
const Person = require("../../src/models/person");
const app = require("../../app");

describe("Task Routes", () => {
  let personId;

  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_DB_URL || "mongodb://localhost:27017/tasks-api-test"
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean databases
    await Task.deleteMany({});
    await Person.deleteMany({});

    // Create a person to assign tasks to
    const person = new Person({
      name: "John Doe",
      age: 30,
    });
    await person.save();
    personId = person._id;
  });

  describe("POST /tasks", () => {
    it("should create a new task with all valid data", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7); // 7 days from now

      const newTaskData = {
        title: "Complete project documentation",
        description: "Write comprehensive documentation for the API",
        status: "To Do",
        assignedTo: personId,
        dueDate: futureDate.toISOString(),
      };

      const response = await request(app).post("/tasks").send(newTaskData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "title",
        "Complete project documentation"
      );
      expect(response.body).toHaveProperty(
        "description",
        "Write comprehensive documentation for the API"
      );
      expect(response.body).toHaveProperty("status", "To Do");
      expect(response.body).toHaveProperty("assignedTo", personId.toString());
      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");

      // Verify it was actually saved in database
      const savedTask = await Task.findById(response.body._id);
      expect(savedTask).toBeTruthy();
      expect(savedTask.title).toBe("Complete project documentation");
    });

    it("should create a task with minimal required data", async () => {
      const newTaskData = {
        title: "Simple task",
        status: "To Do",
        assignedTo: personId,
      };

      const response = await request(app).post("/tasks").send(newTaskData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("title", "Simple task");
      expect(response.body).toHaveProperty("status", "To Do");
      expect(response.body).toHaveProperty("assignedTo", personId.toString());
      // Optional fields should not be present when not sent
      expect(response.body.description).toBeUndefined();
      expect(response.body.dueDate).toBeUndefined();
    });

    it("should create task with different valid statuses", async () => {
      const validStatuses = ["To Do", "In Progress", "In Revision", "Done"];

      for (const status of validStatuses) {
        const taskData = {
          title: `Task with ${status} status`,
          status: status,
          assignedTo: personId,
        };

        const response = await request(app).post("/tasks").send(taskData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("status", status);
      }
    });

    it("should return 400 when title is missing", async () => {
      const response = await request(app).post("/tasks").send({
        status: "To Do",
        assignedTo: personId,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContain(
        "The title cannot be empty and must be a string"
      );
    });

    it("should return 400 when title is empty string", async () => {
      const response = await request(app).post("/tasks").send({
        title: "",
        status: "To Do",
        assignedTo: personId,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContain(
        "The title cannot be empty and must be a string"
      );
    });

    it("should return 400 when title is only whitespace", async () => {
      const response = await request(app).post("/tasks").send({
        title: "   ",
        status: "To Do",
        assignedTo: personId,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContain(
        "The title cannot be empty and must be a string"
      );
    });

    it("should return 400 when status is invalid", async () => {
      const response = await request(app).post("/tasks").send({
        title: "Valid title",
        status: "Invalid Status",
        assignedTo: personId,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContain(
        "Invalid status value, must be one of: To Do, In Progress, In Revision, Done"
      );
    });

    it("should return 400 when assignedTo is missing", async () => {
      const response = await request(app).post("/tasks").send({
        title: "Valid title",
        status: "To Do",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContain(
        "Invalid assignedTo ID format for MongoDB"
      );
    });

    it("should return 400 when assignedTo is invalid ObjectId", async () => {
      const response = await request(app).post("/tasks").send({
        title: "Valid title",
        status: "To Do",
        assignedTo: "invalid-id",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContain(
        "Invalid assignedTo ID format for MongoDB"
      );
    });

    it("should return 400 when description is not a string", async () => {
      const response = await request(app).post("/tasks").send({
        title: "Valid title",
        status: "To Do",
        assignedTo: personId,
        description: 123, // Not a string
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContain(
        "The description must be a string"
      );
    });

    it("should return 400 when dueDate is in the past", async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // Yesterday

      const response = await request(app).post("/tasks").send({
        title: "Valid title",
        status: "To Do",
        assignedTo: personId,
        dueDate: pastDate.toISOString(),
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContain(
        "The dueDate must be a valid future date"
      );
    });

    it("should return 400 when dueDate is invalid format", async () => {
      const response = await request(app).post("/tasks").send({
        title: "Valid title",
        status: "To Do",
        assignedTo: personId,
        dueDate: "invalid-date",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContain(
        "The dueDate must be a valid future date"
      );
    });

    it("should return 400 with multiple validation errors", async () => {
      const response = await request(app).post("/tasks").send({
        title: "", // Invalid
        status: "Invalid Status", // Invalid
        assignedTo: "invalid-id", // Invalid
        description: 123, // Invalid
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(Array.isArray(response.body.errors)).toBe(true);
      expect(response.body.errors.length).toBeGreaterThan(1);
    });

    it("should handle database errors", async () => {
      jest.spyOn(Task.prototype, "save").mockImplementationOnce(() => {
        throw new Error("Database error");
      });

      const response = await request(app).post("/tasks").send({
        title: "Valid title",
        status: "To Do",
        assignedTo: personId,
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error trying to save a task" });
    });

    it("should create task with future dueDate correctly", async () => {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 1); // 1 month from now

      const response = await request(app).post("/tasks").send({
        title: "Task with future due date",
        status: "To Do",
        assignedTo: personId,
        dueDate: futureDate.toISOString(),
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("dueDate");
      expect(new Date(response.body.dueDate)).toBeInstanceOf(Date);
    });
  });
});
