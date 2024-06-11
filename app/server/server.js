import express from "express";
import dotenv from "dotenv"; 

dotenv.config(); 

const app = express();
const BACKEND_PORT = process.env.BACKEND_PORT || 5000;

app.get("/api", (req, res) => {
	res.json({ message: "Hello from the server!" });
});

app.listen(BACKEND_PORT, () => {
	console.log(`Server is running on port ${BACKEND_PORT}`);
});
