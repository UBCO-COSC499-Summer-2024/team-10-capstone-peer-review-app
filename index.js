import express from 'express';
import pg from 'pg';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';


const { Pool } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 5000;
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
    //secure : true,
    maxAge :1000 *60 *60 // 1 hour,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Create a new pool instance
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'COSC 499',
  password: '123456ab',
  port: 5433, // default PostgreSQL port
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

const login = `<form action="/login" method="POST">
            <div>
              <label for="email">Email</label>
              <input type="email" name="username">
            </div>
            <div>
              <label for="password">Password</label>
              <input type="password" name="password">
            </div>
            <button type="submit">Login</button>
          </form>`;

const register = `<form action="/register" method="POST">

            <div>
              <label for="username">Username</label>
              <input type="text" name="username">
            </div>
            <div>
              <label for="email">Email</label>
              <input type="email" name="email">
            </div>
            <div>
              <label for="password">Password</label>
              <input type="password" name="password">
            </div>

            <div>
              <label for="firstname">First name:</label>
              <input type="text" name="firstname">
            </div>

            <div>
              <label for="lastname">Last name:</label>
              <input type="text" name="lastname">
            </div>

            <div>
              <label for="user_type">Role:</label><br>
              <select name="user_type">
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
              </select><br>
            </div>

            <button type="submit">Register</button>
          </form>`;

const auth = `<h1>Hello!</h1>
      <p>Welcome to Auth page.</p>
      <hr>
      <a href="/logout" role="button">Log Out</a>`;

const home = `<h1">Home</h1>
    <p>Please login</p>
    <hr>
    <a href="/register" role="button">Register</a>
    <a href="/login" role="button">Login</a>`;

app.get("/", (req, res) => {
  res.send(home);
});

app.get("/login", (req, res) => {
  res.send(login);
});

app.get("/register", (req, res) => {
  res.send(register);
});

app.get("/home", (req, res) => {
  // console.log(req.user);
  if (req.isAuthenticated()) {
    res.send(auth);
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
  const sql = 'INSERT INTO users (username, pwd, firstname, lastname, email, user_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';

  try {
    const checkResult = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      //hashing the password and saving it in the database
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", hash);
          const values = [username, hash, firstname, lastname, email, user_type];
          const result = await pool.query(sql, values);
          const user = result.rows[0];
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
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
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
  cb(null, user.user_id);
});

passport.deserializeUser(async (id, cb) => {
  const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]); 
  cb(null, result.rows[0]);
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
