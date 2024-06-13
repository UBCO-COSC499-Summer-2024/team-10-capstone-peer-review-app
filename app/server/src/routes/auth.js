import express from "express";  
import { prisma } from "@/index";

const router = express.Router(); 

router.post("/login", async (req, res) => {
    // TODO Handle Login
}); 

router.post("/register", async (req, res) => {
    // TODO Handle Register
}); 

export default router;