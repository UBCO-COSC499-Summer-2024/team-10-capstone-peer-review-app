import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import LocalStrategy from "../middleware/passportStrategies/localStrategy.js";

const authRouter = (prisma) => { 
  const router = express.Router();

  // TODO move to .env
  const SALT_ROUNDS = 10;

  // Enable local Strat for Login 
  LocalStrategy(passport, prisma); 

  // Reused Prisma queries 
  async function checkUserByEmail(email) {
    return await prisma.user.findUnique({ where: { email } });
  }


  // Register 
  router.post('/register', async (req, res) => {
    // Check if user already exists with email
    const existingUser = checkUserByEmail(req.body.email);
    
    if (existingUser) {
        return res.status(400).json({ message: 'User with that email already exists' }); 
    }
      const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
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

      res.json(result);
  }); 

  // Login 
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
        return res.status(200).json({ message: 'You have been logged in!' });
      });
    })(req, res, next);
  });

  // Router logout 
  router.post('/logout', (req, res) => {
    if (req.isAuthenticated()) { 
      req.logout((err) => {  
        if (err) { 
          return res.status(400).json({ message: 'Logout Failed', error: err });
        } 
        return res.status(200).json({ message: 'You have been logged out' });
      });
    } else { 
      return res.status(400).json({ message: 'You are not logged in' }); 
    }
  });


   // TODO Router forgot-password 
  router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    // const user = await checkUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "No user with that email" });
    }
    // const token = generateToken(); // Implement this function
    // Save the token in your database associated with the user
    // Send an email to the user with the reset link that includes the token
  });



  router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    // Verify the token and find the associated user
    // Update the user's password
  });



  router.post("/verify-email", async (req, res) => {
    const { email } = req.body;
    const user = await checkUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "No user with that email" });
    }
    const token = generateToken(); // Implement this function
    // Save the token in your database associated with the user
    // Send an email to the user with the verification link that includes the token
  });



  router.post("/confirm-email", async (req, res) => {
    const { token } = req.body;
    // Verify the token and find the associated user
    // Update the user's email verification status
  });



  return router;
}

export default authRouter;