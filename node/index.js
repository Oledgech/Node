const express = require("express");
const PORT = process.env.PORT || "3000";
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config(); 
const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

app.get('/activity', (req, res) => {
    db.query('SELECT * FROM user_activity', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/activity', (req, res) => {
    const { user_group, activity_date, steps, distance_km, active_time_minutes } = req.body;
    const sql = 'INSERT INTO user_activity (user_group, activity_date, steps, distance_km, active_time_minutes) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [user_group, activity_date, steps, distance_km, active_time_minutes], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id: result.insertId, ...req.body });
    });
});
app.listen(PORT, () => console.log("API started on port 3000"));
