import express from "express";  
import { prisma } from "@/index";

const router = express.Router(); 

// JWT ** Hard. ? 
// 
//  bscypt hashing -> 
//  and salting -> add salting numbers to .env

router.post("/login", async (req, res) => {
    // TODO Handle Login
}); 

router.post("/register", async (req, res) => {
    // TODO Handle Register
}); 

export default router;