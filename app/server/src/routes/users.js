import express from "express"; 

const usersRouter = (prisma) => { 
    const router = express.Router();
    
    // return all users
    router.get("/", async (req, res) => {
        const users = await prisma.user.findMany();
        res.json(users);
    }); 
    
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

    return router; 

}

export default usersRouter 