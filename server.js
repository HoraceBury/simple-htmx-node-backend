// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (like your HTMX front end)
app.use(express.static('public'));

// Example route to serve HTML for HTMX
app.get('/data', (req, res) => {
    // This could be dynamic data from a database
    const data = '<div>New content loaded!</div>';
    res.send(data); // Send back HTML snippet
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
