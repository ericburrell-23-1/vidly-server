const moment = require("moment");
const request = require("supertest");
const mongoose = require("mongoose");
const Rental = require("../../models/rental").Model;
const Customer = require("../../models/customer").Model;
const Movie = require("../../models/movie").Model;
const User = require("../../models/user").Model;

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;

  let exec = async () => {
    return await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({
        customerId,
        movieId,
      });
  };

  beforeEach(async () => {
    server = require("../../index");

    movieId = mongoose.Types.ObjectId();
    customerId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    rental = new Rental({
      customer: new Customer({
        _id: customerId,
        name: "customer",
        phone: "1234567",
      }),
      movie: new Movie({
        _id: movieId,
        title: "movie",
        dailyRentalRate: 2,
        genre: { name: "genre" },
        numberInStock: 2,
      }),
    });

    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for this customer/movie", async () => {
    await Rental.remove({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 if rental already processed", async () => {
    rental.dateReturned = Date.now();
    await rental.save();

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if request is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("should set return date if request is valid", async () => {
    await exec();
    const returnedRental = await Rental.findById(rental._id);
    const diff = new Date() - returnedRental.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it("should set rentalFee if request is valid", async () => {
    rental.date = moment().add(-7, "days").toDate(); // 7 days ago
    await rental.save();

    await exec();
    const returnedRental = await Rental.findById(rental._id);
    const expectedRentalFee = 14;
    expect(returnedRental.rentalFee).toBe(expectedRentalFee);
  });

  it("should increase the movie stock for a valid return", async () => {
    await Movie.collection.insertOne(rental.movie);
    const initialStock = rental.movie.numberInStock;
    await exec();
    const newStock = (await Movie.findById(movieId)).numberInStock;
    expect(newStock).toBe(initialStock + 1);
  });

  it("should return the rental if request is valid", async () => {
    const res = await exec();
    rental = await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "date",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
