import prisma from "../../../prisma/prismaClient";
import gradeService from "../../../src/services/gradeService.js";
import authService from "../../../src/services/authService.js";
import apiError from "../../../src/utils/apiError";
import e from "express";

let user;
beforeAll(async () => {
    await prisma.$connect();
    // const userData = {
    //     email: "verified@example.com",
    //     password: "password123",
    //     firstname: "Verified",
    //     lastname: "User",
    //     role: "STUDENT"
    // };

    // await authService.registerUser(userData);
    // await prisma.user.update({
    //     where: { email: userData.email },
    //     data: { isEmailVerified: true, isRoleActivated: true }
    // });

    // user = await authService.loginUser(
    //     userData.email,
    //     userData.password
    // );
});

afterAll(async () => {
    await prisma.$disconnect();
});

beforeEach(async () => {
    await prisma.criterionGrade.deleteMany();
});

describe("Grade Service Integration Tests", () => {

});