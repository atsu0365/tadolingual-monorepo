const fs = require('fs');
const path = require('path');
const http = require('http');

const Article = require('./article');
const BlogPost = require('./blog');
const AffiliateLink = require('./affiliate');
const WebMedia = require('./webmedia');
const CMS = require('./cms');

const serveStaticFile = (filePath, contentType) => {
  return (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, '../public', filePath), 'utf-8');
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  };
};

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    serveStaticFile('index.html', 'text/html')(req, res);
  } else if (req.url === '/styles.css') {
    serveStaticFile('styles.css', 'text/css')(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = {
  Article,
  BlogPost,
  AffiliateLink,
  WebMedia,
  CMS
};