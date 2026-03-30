const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Landing/Login page at root
app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Main app behind /app route
app.get('/app', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all: send to login
app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(PORT, () => {
        console.log(`SkyWave SARF Maps running on port ${PORT}`);
});
