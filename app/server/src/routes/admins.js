import express from "express";

const adminsRouter = (prisma) => {
	const router = express.Router();

	// return a single user by id
	router.get("/:id", async (req, res) => {
		const { id } = req.params;
		const user = await prisma.user.findUnique({
			where: {
				userId: id
			}
		});
		res.json(user);
	});

	router.get("/all-users", async (req, res) => {
		try {
			const allUsers = await prisma.user.findMany();
			res.status(200).json(allUsers);
		} catch (error) {
			res.status(500).json({ message: "Failed to retrieve classes" });
		}
	});

	// returns all classes
	router.get("/classes", async (req, res) => {
		try {
			const allClasses = await prisma.class.findMany();
			res.status(200).json(allClasses);
		} catch (error) {
			res.status(500).json({ message: "Failed to retrieve classes" });
		}
	});

	return router;
};

export default adminsRouter;
