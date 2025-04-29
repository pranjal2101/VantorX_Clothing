// server.js
const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads'));

// PHPMyAdmin (MySQL) connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // default user in XAMPP
    password: "", // leave blank unless changed
    database: "vantorx"
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL connected with phpMyAdmin");
});

const fs = require('fs');

// Check and create uploads folder if not exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Image upload route
app.post('/upload', upload.single('image'), (req, res) => {
    const productName = req.body.name;
    const imagePath = req.file.filename;

    const sql = 'INSERT INTO products (name, image_path) VALUES (?, ?)';
    db.query(sql, [productName, imagePath], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Product uploaded successfully' });
    });
});

// Route to get all products
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});



// Login API
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ status: "error" });

        if (results.length > 0) {
            res.json({ status: "ok", role: results[0].role });
        } else {
            res.status(401).json({ status: "fail", message: "Invalid credentials" });
        }
    });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});