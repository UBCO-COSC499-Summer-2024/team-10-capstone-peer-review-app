import request from "supertest";
import prisma from "../../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

const API_URL = process.env.API_URL || "http://peergrade-server-test:5001"; // Adjust this URL as needed

// beforeAll(async () => {
// 	await prisma.$connect();
// });

// afterAll(async () => {
// 	await prisma.$disconnect();
// });