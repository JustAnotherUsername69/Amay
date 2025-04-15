const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Store URLs in memory (for demo purposes)
const urlDatabase = {};

// Handle the form submission
app.post('/shorten', (req, res) => {
  const originalUrl = req.body.url;
  const shortCode = crypto.randomBytes(3).toString('hex'); // generates a 6-char code
  urlDatabase[shortCode] = originalUrl;

  res.send(`
    <html>
      <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
        <h2>Your shortened URL:</h2>
        <a href="/${shortCode}" target="_blank">http://localhost:${PORT}/${shortCode}</a>
        <br><br>
        <a href="/">Shorten another</a>
      </body>
    </html>
  `);
});

// Handle redirection
app.get('/:code', (req, res) => {
  const code = req.params.code;
  const originalUrl = urlDatabase[code];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send('Short URL not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
