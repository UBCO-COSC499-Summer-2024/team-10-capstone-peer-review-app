import express from 'express';
import pg from 'pg';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';

import dotenv from "dotenv" 
import { PrismaClient } from "@prisma/client"; 
import  usersRouter from "./routes/users.js"; 
// import { authRouter } from "./routes/auth.js";

// Once dotenv.config() is called, env vars are available in process.env to all files. 
// No need to import dotenv in other files.
dotenv.config(); 

const BACKEND_PORT = process.env.BACKEND_PORT;

// Create a new Prisma client instance, share across all files using it in order to 
// minimize the number of open connections to the database.
const prisma = new PrismaClient();

const { Pool } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));
// const port = process.env.PORT || 5000;
import bcrypt from "bcrypt";

const app = express();
const saltRounds = 10;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({ 
  secret: "TOPSECRETWORD ", 
  resave: false,  // Forces the session to be saved back to the session store, even if the session was never modified during the request 
  // look into what this means with the connection to postgres
  saveUninitialized: true ,
  cookie : {
    maxAge :1000 *60 *60 *24 *7 // 1 week,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Create a new pool instance
const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the database connection
pool.connect((err, client, done) => {
  if (err) {
      console.error('Error connecting to the database:', err);
  } else {
      console.log('Connected to the database');
      done();
  }
});

async function checkUserByEmail(email) {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  return user;
}

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/home", (req, res) => {
  // console.log(req.user);
  if (req.isAuthenticated()) {
    res.render("secrets.ejs");
  } else { 
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


app.post("/register", async (req, res) => {
  const { username, password, firstname, lastname, email, user_type } = req.body;
  //const sql = 'INSERT INTO users (username, pwd, firstname, lastname, email, user_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';

  async function createUser(username, hash, firstname, lastname, email, user_type) {
    const newUser = await prisma.user.create({
      data: {
        username: username,
        pwd: hash,
        firstname: firstname,
        lastname: lastname,
        email: email,
        user_type: user_type,
      },
    });
    console.log(newUser);
    return newUser;
  }

  
  try {
    const checkResult = checkUserByEmail(email)
      .then(user => {
        console.log(user);
      })
      .catch(e => {
        throw e;
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
    // const checkResult = await pool.query("SELECT * FROM users WHERE email = $1", [
    //   email,
    // ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      //hashing the password and saving it in the database
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", hash);
          //const values = [username, hash, firstname, lastname, email, user_type];

          const user = createUser(username, hash, firstname, lastname, email, user_type)
          .catch(e => {
            throw e;
          })
          .finally(async () => {
            await prisma.$disconnect();
          });
          //const result = await pool.query(sql, values);
          //const user = result.rows[0];
          req.login(user, (err) => {
            console.log("success");
            res.redirect("/home");
          });
          //res.render("secrets.ejs");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/home", 
    failureRedirect: "/login" 
}));

passport.use(
  new Strategy(async function verify(email, password, cb) {
    try {
      const result = checkUserByEmail(email)
      .then(user => {
        console.log(user);
      })
      .catch(e => {
        throw e;
      })
      .finally(async () => {
        await prisma.$disconnect();
      });

      // const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      //   email,
      // ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.pwd;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(BACKEND_PORT, () => {
  console.log(`Server running on port ${port}`);
});
