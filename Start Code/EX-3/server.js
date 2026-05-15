// server.js
const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    console.log(`Received ${method} request for ${url}`);

    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(`
            <html>
                <head><title>Home</title></head>
                <body>
                    <h1>Welcome to the Home Page</h1>
                    <p>This is a simple Node.js server.</p>
                </body>
            </html>
        `);

    } else if (url === '/about' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('About us: at CADT, we love node.js!');

    } else if (url === '/contact-us' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('You can reach us via email...');

    } else if (url === '/products' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Buy one get one...');

    } else if (url === '/projects' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Here are our awesome projects');

    } else if (url === '/contact' && method === 'GET') {
        // Serve the contact form
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(`
            <html>
                <head><title>Contact</title></head>
                <body>
                    <h1>Contact Us</h1>
                    <form method="POST" action="/contact">
                        <label>Name: <input type="text" name="name" /></label>
                        <br/><br/>
                        <button type="submit">Submit</button>
                    </form>
                </body>
            </html>
        `);

    } else if (url === '/contact' && method === 'POST') {
        // Collect the request body chunks
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            // Parse the form data
            const parsed = querystring.parse(body);
            const name = parsed.name;

            console.log('Form submission received:', parsed);

            // Validate name is not empty
            if (!name || name.trim() === '') {
                res.writeHead(400, { 'Content-Type': 'text/html' });
                return res.end(`
                    <html>
                        <body>
                            <h1>Error: Name cannot be empty!</h1>
                            <a href="/contact">Go back</a>
                        </body>
                    </html>
                `);
            }

            // Append the name to submissions.txt
            const entry = `Name: ${name} | Submitted at: ${new Date().toISOString()}\n`;
            fs.appendFile('submissions.txt', entry, (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    return res.end('500 Internal Server Error');
                }

                // Send success response
                res.writeHead(200, { 'Content-Type': 'text/html' });
                return res.end(`
                    <html>
                        <head><title>Success</title></head>
                        <body>
                            <h1>Thank you, ${name}!</h1>
                            <p>Your submission has been received and saved.</p>
                            <a href="/contact">Submit another</a>
                        </body>
                    </html>
                `);
            });
        });

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running at http