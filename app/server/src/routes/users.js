import express from "express"; 
import { prisma } from "@/index";


const router = express.Router();

// return all users
router.get("/", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
}); 

// return a single user by id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
    });
    res.json(user);
});

export default router; 