const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'service_catalog',
    password: 'P@55w0rd',
    port: 5432,
});

app.get('/api/services', async (req, res) => {
    try {
        const { environment } = req.query;
        const result = await pool.query('SELECT * FROM services WHERE environment = $1', [environment]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
   // console.log(`Server running on http://localhost:${port}`);
   console.log(`Server running on http://10.20.30.25:${port}`);
  
});


// Regestration of Services  MisikirD 14 02 2024

app.post('/api/services', async (req, res) => {
    const { serviceName, description, ip, port, contextRoot, ssl, environment } = req.body;

    if (!serviceName || !description || !environment) {
        return res.status(400).json({ message: 'Service Name, Description, and Environment are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO services (service_name, description, ip, port, context_root, ssl, environment) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [serviceName, description, ip, port, contextRoot, ssl, environment]
        );
        res.status(201).json({ message: 'Service added successfully', service: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// login route

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length > 0) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
           // window.location.href = '/home.html'; // Redirect to the home page
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});