import express from "express"; 

const instructorsRouter = (prisma) => { 
    const router = express.Router();
    

    // add ensureInstructor middleware to api-endpoints 

    // return a single user by id
    // router.get("/:id",  async (req, res) => {
    //     const { id } = req.params;
    //     const user = await prisma.user.findUnique({
    //         where: {
    //             userId: id,
    //         },
    //     });
    //     res.json(user);
    // });

    router.get("/profile", async (req, res) => { 
        if (req.isAuthenticated()) { 
            res.status(200).send(`Hello, ${req.user.firstname} ${req.user.lastname}! ID: ${req.user.userId}`)
        } else {
            res.status(401).json({ message: 'Not authenticated' })
        }
    });

    router.post("/create-class", async (req, res) => { 
        // Assumes when a user logs in, JWT will include 
        const instructorId = req.user.userId;

        const { classname, description, startDate, endDate, term, classSize }  = req.body;

        try {
            const newClass = await prisma.class.create({
                data: {
                    instructorId,
                    classname,
                    description,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    term, 
                    classSize
                }
            });
            res.status(201).json(newClass);
        } catch (error) {
            res.status(500).json({ message: "Failed to create class" });
        }
    });

    router.get("/my-classes", async (req, res) => {
        // Get the user ID from the Passport user object
        const instructorId = req.user.userId;
    
        try {
            // Retrieve all classes for the instructor
            const classes = await prisma.class.findMany({
                where: {
                    instructorId: instructorId
                }
            });
    
            res.status(200).json(classes);
        } catch (error) {
            res.status(500).json({ message: "Failed to retrieve classes" });
        }
    });

    return router; 

}

export default instructorsRouter 