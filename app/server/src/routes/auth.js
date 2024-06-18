import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken";

import LocalStrategy from "../middleware/passportStrategies/localStrategy.js";
import sendEmail from "src/helpers/mailer.js";

const authRouter = (prisma) => { 
  const router = express.Router();

  // TODO move to .env
  const SALT_ROUNDS = 10;

  const JWT_SECRET = "secret-key"

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
  // Potientially look into refactoring for JWT's and JWT refresh token stragety 
  // As system scales, JWT's are more scalable than sessions
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: "An error has occured during login", error: err.toString() })(err);
      }
      if (!user) {
        return res.status(400).json({ message: info.message });
      }
      if (!user.emailVerified) { 
        return res.status(400).json({ message: "Please verify your email before logging in" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json({ message: "You have been logged in!" });
      });
    })(req, res, next);
  });

  // Router logout 
  router.post('/logout', (req, res) => {
    if (req.isAuthenticated()) { 
      req.logout((err) => {  
        if (err) { 
          return res.status(400).json({ message: "Logout Failed", error: err.toString() });
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
    const user = await checkUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "No user with that email" });
    }
    const token = jwt.sign({ email }, JWT_SECRET, {expiresIn: "30m"});

    const resetLink = `http://localhost:3000/api/auth/reset-password?token=${token}`;

    const htmlContent = 
    `<p>You requested a password reset</p>
    <p>Click this link to reset your password. The link will expire in 30 minutes: 
    <a href="${resetLink}">Reset Password</a>
    </p>`;

    try { 
      await sendEmail(email, 'Password Reset', htmlContent);
      return res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) { 
      return res.status(500).json({ message: 'Failed to send password reset email' });
    }
  });

  router.post("/reset-password", async (req, res) => {
    const { token } = req.query.token; 
    const { newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await checkUserByEmail(decoded.email);
  
      if (!user) {
        return res.status(404).json({ message: "No user with that email" });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  
      await prisma.user.update({
        where: { email: decoded.email },
        data: { password: hashedPassword }
      });
  
      return res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
  });


  // Email Verfication 
  router.post("/verify-email", async (req, res) => {
    const { email } = req.body;
    const user = await checkUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "No user with that email" });
    }
    // Could be a security concern since 
    // tokens can be seen the browser history, could be leaked through REFER header
    // Set up HTTPS to prevent this?
    const token = jwt.sign({ email }, JWT_SECRET, {expiresIn: "30m"});

    // Ask Kevin / Scott about this. is this a good approach? 
    // TODO change domain for prod? Ask scott about this 
    const verificationLink = `http://localhost:3000/api/auth/confirm-email?token=${token}`; 

    const htmlContent = 
    `<p>👋 Welcome to PeerGrade!</p>
    <p>Thanks for signing up. Please verify your email address to get started.</p>
    <p>Click this link to verify your email. The link will expire in 30 minutes: 
    <a href="${verificationLink}">Verification Link</a>
    </p>`;

    try { 
      await sendEmail(email, 'Email Verification', htmlContent);
      return res.status(200).json({ message: 'Verification email sent' });
    } catch (error) { 
      return res.status(500).json({ message: 'Failed to send verification email' });
    } 
  });


  // Confirm Email
  router.post("/confirm-email", async (req, res) => {
    // Just retrieve the token from the query string
    const { token } = req.query.token; 
    try { 
      const decoded = jwt.verify(token, JWT_SECRET);  
      const user = await checkUserByEmail(decoded.email);
      if (!user) {
        return res.status(400).json({ message: "No user with that email" });
      }
      await prisma.user.update({ 
        where: { email: decoded.email }, 
        data: { isVerified: true } 
      });
        return res.status(200).json({ message: "Email verified successfully" });
    } catch (err) { 
      return res.status(400).json({ message: "Invalid or expired token" });
    }
  });



  return router;
}

export default authRouter;