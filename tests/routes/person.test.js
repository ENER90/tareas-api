const request = require("supertest");
const mongoose = require("mongoose");
const Person = require("../../models/person");
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
    expect(response.body).toEqual({ error: "Invalid ID format" });
  });

  it("should handle database errors", async () => {
    jest.spyOn(Person, "findById").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app).get(`/people/${personId}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Error trying to get person" });
  });
});
