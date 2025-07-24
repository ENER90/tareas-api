const request = require("supertest");
const mongoose = require("mongoose");
const Person = require("../../src/models/person");
const app = require("../../app");

describe("Person Routes", () => {
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
    await Person.deleteMany({});

    const person = new Person({
      name: "John Doe",
      age: 30,
    });
    await person.save();
    personId = person._id;
  });

  describe("GET /people", () => {
    it("should return all people", async () => {
      await Person.create([
        { name: "Mary Smith", age: 25 },
        { name: "Carl Johnson", age: 40 },
      ]);

      const response = await request(app).get("/people");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it("should handle database errors", async () => {
      jest.spyOn(Person, "find").mockImplementationOnce(() => {
        throw new Error("Database error");
      });

      const response = await request(app).get("/people");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error trying to list people" });
    });
  });

  describe("GET /people/:id", () => {
    it("should return a person by ID", async () => {
      const response = await request(app).get(`/people/${personId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", "John Doe");
      expect(response.body).toHaveProperty("age", 30);
    });

    it("should return 404 if person not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/people/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Person not found" });
    });

    it("should handle invalid ObjectId format", async () => {
      const response = await request(app).get("/people/invalid-id");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid ID format for MongoDB" });
    });

    it("should handle database errors", async () => {
      jest.spyOn(Person, "findById").mockImplementationOnce(() => {
        throw new Error("Database error");
      });

      const response = await request(app).get(`/people/${personId}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error trying to fetch person" });
    });
  });

  describe("POST /people", () => {
    it("should create a new person with valid data", async () => {
      const newPersonData = {
        name: "Jane Smith",
        age: 28,
      };

      const response = await request(app).post("/people").send(newPersonData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("name", "Jane Smith");
      expect(response.body).toHaveProperty("age", 28);
      expect(response.body).toHaveProperty("_id");

      // Verify it was actually saved in database
      const savedPerson = await Person.findById(response.body._id);
      expect(savedPerson).toBeTruthy();
      expect(savedPerson.name).toBe("Jane Smith");
    });

    it("should return 400 when name is missing", async () => {
      const response = await request(app).post("/people").send({ age: 25 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContain(
        "The name cannot be empty and must be a string"
      );
    });

    it("should return 400 when age is missing", async () => {
      const response = await request(app)
        .post("/people")
        .send({ name: "John" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContain(
        "The age cannot be empty and must be a valid number between 1 and 100"
      );
    });

    it("should return 400 when name is empty string", async () => {
      const response = await request(app)
        .post("/people")
        .send({ name: "", age: 25 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContain(
        "The name cannot be empty and must be a string"
      );
    });

    it("should return 400 when age is invalid (too old)", async () => {
      const response = await request(app)
        .post("/people")
        .send({ name: "Old Person", age: 150 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContain(
        "The age cannot be empty and must be a valid number between 1 and 100"
      );
    });

    it("should return 400 when age is invalid (negative)", async () => {
      const response = await request(app)
        .post("/people")
        .send({ name: "Invalid Person", age: -5 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContain(
        "The age cannot be empty and must be a valid number between 1 and 100"
      );
    });

    it("should handle database errors", async () => {
      jest.spyOn(Person.prototype, "save").mockImplementationOnce(() => {
        throw new Error("Database error");
      });

      const response = await request(app)
        .post("/people")
        .send({ name: "Test Person", age: 30 });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error trying to save a person" });
    });
  });

  describe("PUT /people/:id", () => {
    it("should update a person with valid data", async () => {
      const updateData = {
        name: "John Updated",
        age: 35,
      };

      const response = await request(app)
        .put(`/people/${personId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Person updated successfully"
      );
      expect(response.body).toHaveProperty("person");
    });

    it("should update only name", async () => {
      const response = await request(app)
        .put(`/people/${personId}`)
        .send({ name: "Only Name Updated" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Person updated successfully"
      );
    });

    it("should update only age", async () => {
      const response = await request(app)
        .put(`/people/${personId}`)
        .send({ age: 45 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Person updated successfully"
      );
    });

    it("should return 404 when person not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/people/${fakeId}`)
        .send({ name: "Test", age: 30 });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Person not found" });
    });

    it("should return 400 with invalid ID format", async () => {
      const response = await request(app)
        .put("/people/invalid-id")
        .send({ name: "Test", age: 30 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid ID format for MongoDB" });
    });

    it("should return 400 with invalid name", async () => {
      const response = await request(app)
        .put(`/people/${personId}`)
        .send({ name: "", age: 30 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(Array.isArray(response.body.error)).toBe(true);
    });

    it("should return 400 with invalid age", async () => {
      const response = await request(app)
        .put(`/people/${personId}`)
        .send({ name: "Valid Name", age: 150 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(Array.isArray(response.body.error)).toBe(true);
    });

    it("should handle database errors", async () => {
      jest.spyOn(Person, "findByIdAndUpdate").mockImplementationOnce(() => {
        throw new Error("Database error");
      });

      const response = await request(app)
        .put(`/people/${personId}`)
        .send({ name: "Test", age: 30 });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error trying to edit person" });
    });
  });

  describe("DELETE /people/:id", () => {
    it("should delete a person by ID", async () => {
      const response = await request(app).delete(`/people/${personId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Person deleted successfully"
      );
      expect(response.body).toHaveProperty("person");
      expect(response.body.person).toHaveProperty("name", "John Doe");

      // Verify it was actually deleted from database
      const deletedPerson = await Person.findById(personId);
      expect(deletedPerson).toBeNull();
    });

    it("should return 404 when person not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/people/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Person not found" });
    });

    it("should return 400 with invalid ID format", async () => {
      const response = await request(app).delete("/people/invalid-id");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid ID format for MongoDB" });
    });

    it("should handle database errors", async () => {
      jest.spyOn(Person, "findByIdAndDelete").mockImplementationOnce(() => {
        throw new Error("Database error");
      });

      const response = await request(app).delete(`/people/${personId}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error trying to delete person" });
    });
  });
});
