import express from "express";  

const classesRouter = (prisma) => { 
    const router = express.Router(); 

    // TODO Implement JWT processing middle-ware
    //router.use(authenticateToken); 

    // Basic get all classes route
    router.get("/", async (req, res) => {
        try {
            const allClasses = await prisma.class.findMany();
            res.status(200).json(allClasses);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve classes" });
        }
    });

    router.get("/get-all-classes", async (req, res) => {
        try {
            const userId = req.user.id // Get user'ID from the request object from the JWT middleware
            const allClasses = await prisma.class.findMany();
            res.status(200).json(allClasses);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve classes" });
        }
    });
    // classes
    router.post("/create", async (req, res) => { 
        // Assumes when a user logs in, JWT will include 
        // and ensureInstructor middleware
        const { instructorId, classname, description, startDate, endDate, term} = req.body;

        try {
            const newClass = await prisma.class.create({
                data: {
                    instructorId,
                    classname,
                    description,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    term
                }
            });
            res.status(201).json(newClass);
        } catch (error) {
            res.status(500).json({ error: "Failed to create class" });
        }
    });

    router.get("/:id", async (req, res) => {
        const { id } = req.params;
        try {
            const classData = await prisma.class.findUnique({
                where: {
                    classId: id
                }
            });
            if (classData) {
                res.status(200).json(classData);
            } else {
                res.status(404).json({ error: "Class not found" });
            }
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve class" });
        }
    });
}

export {router as classRouter};