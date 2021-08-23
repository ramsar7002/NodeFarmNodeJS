const http = require('http');
const url = require('url');
const fs = require('fs');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate.js');

const temp_overview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

console.log(slugs);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  //api page
  if (pathname === '/api') {
    try {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(data);
    } catch (err) {
      res.end(err);
    }
  }

  //OverView page
  else if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join();
    const overView = temp_overview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(overView);
  }

  //product page
  else if (pathname === '/product') {
    let product = dataObj[query.id];
    const productHtml = replaceTemplate(tempProduct, product);
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(productHtml);
  } else if (pathname === '/card') {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(tempCard);
  }

  //not found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found<h1/>');
  }
});

server.listen(8000, 'localhost', () => {
  console.log('Listening on requests on port 8000');
});
