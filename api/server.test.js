// Write your tests here
const supertest = require("supertest");
const server = require("./server");

test('sanity', async () => {
  const res = await supertest(server).get("/")
  expect(res.statusCode).toBe(200);
  expect(res.type).toBe("application/json");
  expect(res.body.Message).toBe("Sprint challenge done");
})
