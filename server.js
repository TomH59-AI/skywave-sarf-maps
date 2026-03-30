const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Landing/Login page at root - BEFORE static middleware
app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Main app at /app
app.get('/app', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve static files (CSS, JS, images) but NOT index.html at root
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Catch-all: send to login
app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(PORT, () => {
            console.log(`SkyWave SARF Maps running on port ${PORT}`);
});
