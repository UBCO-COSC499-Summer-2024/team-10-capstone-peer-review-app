import request from "supertest";
import app from "../../../src/index.js"; // Import your app

// TODO set up a mock database for testing / multiple environments for testing environment
describe("Auth routes", () => {
	test("should respond with a 200 for valid login", async () => {
		const response = await request(app)
			.post("/auth/login")
			// todo ADD JOI to api routes to validate typing
			.send({ email: "test@gmail.com", password: "test" });

		expect(response.statusCode).toBe(200);
	});

	test("should respond with a 401 for invalid login", async () => {
		const response = await request(app)
			.post("/auth/login")
			.send({ username: "wrongUser", password: "wrongPassword" });

		expect(response.statusCode).toBe(401);
	});
});
