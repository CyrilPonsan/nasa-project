const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
  test("it should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Test DELETE /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .delete("/launches/100")
      .expect("Content-Type", /json/)
      .expect(200);
  });
  test("It should respond with 404 success", async () => {
    const response = await request(app)
      .delete("/launches/1000")
      .expect("Content-Type", /json/)
      .expect(404);
  });
});

describe("Test POST /launches", () => {
  const completeLaunchData = {
    mission: "uss enterprise",
    rocket: "toto rocket",
    target: "gelos",
    launchDate: "January 4, 2028",
  };

  const launchDataWithoutDate = {
    mission: "uss enterprise",
    rocket: "toto rocket",
    target: "gelos",
  };

  test("it should respond with 201 success", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate);

    expect(response.body).toMatchObject(launchDataWithoutDate);
  });

  test("it should catch missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send({
        //mission: "uss enterprise",
        rocket: "toto rocket",
        target: "gelos",
        launchDate: "January 4, 2028",
      })
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });

  test("it shoild also catch invalid date", async () => {
    const response = await request(app)
      .post("/launches")
      .send({
        mission: "uss enterprise",
        rocket: "toto rocket",
        target: "gelos",
        launchDate: "coucou les tests",
      })
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toStrictEqual({ error: "Invalid launch date" });
  });
});
