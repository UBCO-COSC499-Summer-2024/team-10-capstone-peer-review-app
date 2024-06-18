import { Router } from 'express';
import passport from 'passport';

// Routers
import authRouter from './auth.js'; 
import instructorsRouter from './instructors.js'; 
import studentsRouter from './students.js';
// Middlewares
import localStrategy from '../middleware/passportStrategies/localStrategy.js';
import {ensureUser, ensureInstructor, ensureAdmin} from '../middleware/ensureUserTypes.js';

const setupRoutes = (prisma) => { 
    const router = Router(); 

    // Initialize Passport with the local strategy so req.user is available
    localStrategy(passport, prisma);

    router.use('/auth', authRouter(prisma)); 
    router.use('/students', ensureUser, studentsRouter(prisma));
    router.use('/instructors', ensureUser, ensureInstructor, instructorsRouter(prisma));
    router.use('/admins', ensureUser, ensureAdmin, instructorsRouter(prisma));  

    return router;
}

export default setupRoutes;