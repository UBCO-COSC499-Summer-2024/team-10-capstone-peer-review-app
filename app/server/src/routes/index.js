import { Router } from "express";
import passport from "passport";
// Routers
import authRouter from "./auth.js";
import classesRouter from "./classes.js";
import instructorsRouter from "./instructors.js";
import studentsRouter from "./students.js";
import usersRoutes from "./usersRoutes.js";
import notifsRouter from "./notifs.js";
import gradesRouter from "./grade.js";
import reviewRouter from "./review.js";
import submitRouter from "./submit.js";
import assignmentRouter from "./assignment.js";
import rubricRouter from "./rubric.js";
import categoryRouter from "./category.js";
import enrollRequestsRouter from "./enroll-requests.js";

// Middlewares
import localStrategy from "../middleware/passportStrategies/localStrategy.js";
import {
	ensureUser,
	ensureInstructor,
	ensureAdmin
} from "../middleware/ensureUserTypes.js";

const router = Router();

localStrategy(passport);
// Routes that do not require authentication
router.use("/auth", authRouter);
// Routes that require authentication
router.use("/classes", classesRouter);
router.use("/category", categoryRouter);
router.use("/assignment", assignmentRouter);
router.use("/rubric", rubricRouter);
router.use("/users", usersRoutes);
router.use("/students", ensureUser, studentsRouter);
router.use("/enroll-requests", ensureUser, enrollRequestsRouter);
router.use("/notifs", ensureUser, notifsRouter);
router.use("/submit", submitRouter);
router.use("/review", reviewRouter);
router.use("/grade", ensureUser, gradesRouter);

router.use("/instructors", ensureUser, ensureInstructor, instructorsRouter);

export default router;
