import express from "express";
import dotenv from "dotenv" 
import { PrismaClient } from "@prisma/client"; 
import  usersRouter from "./routes/users.js"; 
// import { authRouter } from "./routes/auth.js";

// Once dotenv.config() is called, env vars are available in process.env to all files. 
// No need to import dotenv in other files.
dotenv.config(); 

const app = express();
const BACKEND_PORT = process.env.BACKEND_PORT;

// Create a new Prisma client instance, share across all files using it in order to 
// minimize the number of open connections to the database.
const prisma = new PrismaClient();

// Make sure to include any middleare before the routes if you want the middleware to apply to the routes

// Middlewares

app.use(express.json()); // Parse JSON bodies with express middleware

// Routers 

app.use("/users", usersRouter(prisma));
// app.use("/auth", authRouter); 

app.listen(BACKEND_PORT, () => {
	console.log(`Server is running on port ${BACKEND_PORT}`);
});

app.get("/", (req, res) => {
	res.json({ message: "Hello from the server!" });
});

