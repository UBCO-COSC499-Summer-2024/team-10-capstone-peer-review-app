import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import passportLocalValidation from "../middleware/passportLocalValidation.js"

const authRouter = (prisma) => { 
    const router = express.Router();

    passportLocalValidation(passport, prisma);

    router.post('/register', async (req, res) => {
    // Check if user already exists with email
    const existingUser = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (existingUser) {
        return res.status(400).json({ message: 'User with that email already exists' }); 
    }
      // Hashing hardcoded salt to 10, TODO: move to .env
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = {
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,  
          firstname: req.body.firstname, 
          lastname: req.body.lastname,
          role: req.body.role
      };
      // Save the user to the database using Prisma
      const result = await prisma.user.create({ data: user });
      req.session.userId = result.userId; // Store user id in session
      res.json(result);
  });

  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json(user);
      });
    })(req, res, next);
  });

return router;

}

export default authRouter;