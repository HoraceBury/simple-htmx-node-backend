// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (like your HTMX front end)
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Example route to serve HTML for HTMX
app.get('/load-data', (req, res) => {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
    const data = `<div>New content loaded! (${currentTime})</div>`;
    res.send(data); // Send back HTML snippet
});

// New route to return a form for in-place editing of the username
app.get('/edit-username', (req, res) => {
    const currentUsername = 'User123'; // This could come from a database
    const html = `
        <form hx-put="/update-username" hx-target="#username-display" hx-swap="innerHTML">
            <input type="text" name="username" value="${currentUsername}" />
            <button type="submit">Save</button>
        </form>
    `;
    res.send(html);
});

// New route to simulate updating the username and return updated display HTML
app.put('/update-username', (req, res) => {
    const updatedUsername = req.body.username || 'Unnamed';
    const html = `
        <div id="username-display"
             hx-get="/edit-username"
             hx-trigger="click"
             hx-target="#username-display"
             hx-swap="innerHTML"
             class="editable">
            ${updatedUsername}
        </div>
    `;
    res.send(html);
});

// New POST route to handle form submissions
app.post('/submit-form', (req, res) => {
    const name = req.body.name || 'Guest';
    const html = `
        <div id="form-container">
            <p>Thanks for your submission, ${name}!</p>
        </div>
    `;
    res.send(html);
});

// Dummy auto-suggest list
const allSuggestions = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew'];

// New GET route to handle /suggest for search suggestions
app.get('/suggest', (req, res) => {
    const query = req.query.query?.toLowerCase() || '';

    const filtered = allSuggestions.filter(item => item.toLowerCase().includes(query));
    const html = filtered.map(item => `<div class="suggestion">${item}</div>`).join('');

    res.send(html || '<div class="suggestion">No results found</div>');
});

// New GET routes for tab navigation
app.get('/tab1', (req, res) => {
    res.send('<p>This is content for Tab 1. Welcome to the first tab!</p>');
});

app.get('/tab2', (req, res) => {
    res.send('<p>This is content for Tab 2. Here is something different!</p>');
});

app.get('/tab3', (req, res) => {
    res.send('<p>This is content for Tab 3. You\'ve reached the final tab.</p>');
});

// Dummy data source
const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);
const pageSize = 10;

// API endpoint for infinite scroll
app.get('/load-items', (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const start = page * pageSize;
    const end = start + pageSize;
    const chunk = items.slice(start, end);
  
    const html = chunk.map(item => `<div class="item">${item}</div>`).join('');
  
    const nextTrigger = end < items.length
      ? `<div id="load-more-trigger"
               hx-get="/load-items"
               hx-trigger="revealed"
               hx-swap="beforeend"
               hx-target="#item-container"
               hx-vals='{"page": ${page + 1}}'>
            </div>`
      : ''; // stop adding if all items are loaded
  
    res.send(html + nextTrigger);
  });
