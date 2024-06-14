import express from "express"; 

const usersRouter = (prisma) => { 
    const router = express.Router();
    
    // return a single user by id
    router.get("/:id",  async (req, res) => {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: {
                userId: id,
            },
        });
        res.json(user);
    }); 

    // USER ROUTE get all classes a user is in.
    router.get("/classes", async (req, res) => {
        try {
            const userId = req.user.userId // Get user'ID from the request object from the JWT middleware
            const userClasses = await prisma.class.findMany({ 
                where: { 
                    userId: userId
                },
                include: { 
                    class: true
                }
            });
            const classes = userClasses.map(userClass => userClass.class);
            res.status(200).json(classes);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve classes" });
        }
    });

    return router; 

}

export default usersRouter 