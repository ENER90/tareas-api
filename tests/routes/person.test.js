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
