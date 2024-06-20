import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";

import setupRoutes from "./routes/index.js";
import apiError from "./utils/apiError.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";

dotenv.config();

const app = express();
const BACKEND_PORT = process.env.BACKEND_PORT;

// SET UP CORS FOR DOCKER?
// app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());

app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 24 * 60 * 60 * 1000
		}
	})
);

app.use(passport.initialize());
app.use(passport.session());

// Set up routes
app.use(setupRoutes);

app.get("/", (req, res) => {
	console.log(req.session);
	console.log(req.session.id);
	console.log(req.user);
	res.json({ message: "Hello from the server!" });
});

// Catch all route for any other requests that don't match any existing routes
app.all("*", (req, res, next) => {
	next(new apiError(`Route ${req.originalUrl} does not exist`, 404));
});

// Global error handler middleware
app.use(globalErrorHandler);

app.listen(BACKEND_PORT, () => {
	console.log(`Server is running on port ${BACKEND_PORT}`);
});

export default app;
