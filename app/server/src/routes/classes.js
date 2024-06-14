import express from "express";  

const router = express.Router(); 

// JWT ** Hard. ? 
// 
//  bscypt hashing -> 
//  and salting -> add salting numbers to .env

router.get("/classes", async (req, res) => {
    // TODO Handle Login
}); 

router.get("/create-classes", async (req, res) => {
    // TODO Handle Register
}); 

export {router as classRouter};