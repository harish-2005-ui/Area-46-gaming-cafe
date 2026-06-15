/**
 * AREA 46 - LOCAL DEV SERVER
 * Run using: node server.js
 * Open in browser: http://localhost:8080
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.json': 'application/json'
};

const server = http.createServer((req, res) => {
    // Decodes URL (e.g. spaces as %20)
    const decodedUrl = decodeURIComponent(req.url);
    
    // Resolve file path
    let filePath = path.join(__dirname, decodedUrl === '/' ? 'index.html' : decodedUrl);
    
    // Check if path is outside root directory (security check)
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Access Forbidden');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`Area 46 Gaming Cafe server online!`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Press Ctrl+C to terminate server`);
    console.log(`==================================================`);
});
