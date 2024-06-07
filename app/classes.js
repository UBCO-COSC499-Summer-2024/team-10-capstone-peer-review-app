import express from 'express';
import pg from 'pg';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
const { Pool } = pg;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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

// Define your routes and middleware here
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'create_class.html'));
});

app.post('/submit-class', async (req, res) => {
    const { classname, description, start_date, term, end_date, class_size } = req.body;

    const sql = 'INSERT INTO classes (classname, description, start_date, term, end_date, class_size) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [classname, description, start_date, term, end_date, class_size];

    try {
        const result = await pool.query(sql, values);
        console.log('Class added to the database');
        res.sendStatus(200);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.sendStatus(500);
    }
});

// Read table
// Define a route that queries the database
app.get('/classes', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM classes');
        res.json(rows);
    } catch (err) {
        console.error('Error executing query', err);
        res.sendStatus(500);
    }
});

//Find user by id
// Define a route that queries the database with a parameter
app.get('/classes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM classes WHERE class_id = $1', [id]);
        res.json(rows);
    } catch (err) {
        console.error('Error executing query', err);
        res.sendStatus(500);
    }
});

//delete user by id
app.get('/classes/del/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM classes WHERE class_id = $1', [id]);
        res.sendStatus(200);
    } catch (err) {
        console.error('Error executing query', err);
        res.sendStatus(500);
    }
});

//update user by id
// app.get('/users/up/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         const result = await pool.query('DELETE FROM users WHERE user_id = $1', [id]);
//         res.sendStatus(200);
//     } catch (err) {
//         console.error('Error executing query', err);
//         res.sendStatus(500);
//     }
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});