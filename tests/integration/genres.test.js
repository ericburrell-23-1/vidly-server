const request = require("supertest");
const Genre = require("../../models/genre").Model;
const mongoose = require("mongoose");
const User = require("../../models/user").Model;

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Genre.remove({}); // Clean up database after each run
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return the genre with the given id", async () => {
      let payload = {
        name: "genre1",
        _id: new mongoose.Types.ObjectId(),
      };
      await Genre.collection.insertOne(payload);

      const res = await request(server).get(`/api/genres/${payload._id}`);
      payload._id = payload._id.toHexString();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toStrictEqual(payload);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get(`/api/genres/1`);
      expect(res.status).toBe(404);
    });

    it("should return 404 if the genre does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/genres/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;
    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: name });
    };

    beforeEach(() => {
      token = new User({ isAdmin: true }).generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if user is not admin", async () => {
      token = new User().generateAuthToken();
      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      await exec();

      const genre = await Genre.find({ name: "genre1" });
      expect(genre.length).toBeTruthy();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /:id", () => {
    let token;
    let payload;
    let name;
    let _id;

    const exec = async () => {
      return await request(server)
        .put(`/api/genres/${_id}`)
        .set("x-auth-token", token)
        .send({ name: name });
    };

    beforeEach(async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
      payload = {
        name: "genre1",
        _id: mongoose.Types.ObjectId(),
      };

      await Genre.collection.insertOne(payload);

      name = "genre2";
      _id = payload._id; //.toHexString();
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if invalid id is passed", async () => {
      _id = 1;
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if the genre does not exist", async () => {
      _id = new mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should update the genre if it is valid", async () => {
      await exec();

      const genre = await Genre.findById(_id);

      expect(genre).toMatchObject({ name: "genre2" });
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", _id.toHexString());
      expect(res.body).toHaveProperty("name", "genre2");
    });
  });

  describe("DELETE /:id", () => {
    let _id;
    let token;

    let exec = async () => {
      return await request(server)
        .delete(`/api/genres/${_id}`)
        .set("x-auth-token", token);
    };

    beforeEach(async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
      const payload = {
        name: "genre1",
        _id: mongoose.Types.ObjectId(),
      };

      await Genre.collection.insertOne(payload);

      _id = payload._id;
    });

    it("should return 404 if invalid id is passed", async () => {
      _id = 1;
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if the genre does not exist", async () => {
      _id = new mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the genre if it is valid", async () => {
      await exec();

      const genre = await Genre.findById(_id);

      expect(genre).toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", _id.toHexString());
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
