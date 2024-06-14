import express from "express";
import session from "express-session"
import cookieParser from "cookie-parser"
import passport from "passport";
import dotenv from "dotenv" 
import { PrismaClient } from "@prisma/client"; 

// Routes
import studentsRouter from "./routes/students.js"; 
import instructorsRouter from "./routes/instructors.js"
// Change to stragies later
import passportLocalValidation from "./middleware/passportLocalValidation.js";
import authRouter from "./routes/auth.js";

// Once dotenv.config() is called, env vars are available in process.env to all files. 
// No need to import dotenv in other files.
dotenv.config(); 

const app = express();
const BACKEND_PORT = process.env.BACKEND_PORT;

// Create a new Prisma client instance, share across all files using it in order to 
// minimize the number of open connections to the database.
const prisma = new PrismaClient();

// SET UP CORS FOR DOCKER? 
// app.use(cors({ origin: 'http://localhost:3000' }));

// Initialing cookies to be used for session management
// Add a secret key soon to cookie parser, this allows user to access cookie data from 
// req.cookies
app.use(cookieParser())
// Populates the req.session object with the session data
app.use(session({
	secret: "super secret", // Secret to sign the session ID cookie
	resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
	saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
	cookie: { 
	  maxAge: 24 * 60 * 60 * 1000, // Cookie expires after 1 day
	}
  }));

passportLocalValidation(passport, prisma);

app.use(passport.initialize());
app.use(passport.session());
// Make sure to include any middleare before the routes if you want the middleware to apply to the routes

// Middlewares
app.use(express.json()); // Parse JSON bodies with express middleware


app.use("/students", passport.authenticate('local'), studentsRouter(prisma));
app.use("/instructors", passport.authenticate('local'), instructorsRouter(prisma))
app.use("/auth", authRouter(prisma));

app.listen(BACKEND_PORT, () => {
	console.log(`Server is running on port ${BACKEND_PORT}`);
});

app.get("/", (req, res) => {
	console.log(req.session); 
	console.log(req.session.id);
	res.json({ message: "Hello from the server!" });
});

export default app;

