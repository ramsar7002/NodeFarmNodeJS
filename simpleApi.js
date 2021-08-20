const http = require('http');
const url = require('url');
const fs = require('fs')

const replaceTemplate = (temp, product)=>{
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%FROM%}/g,product.from);
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%ID%}/g,product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}


const temp_overview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const dataObj=JSON.parse(data);

const server = http.createServer((req, res)=>{

    const pathName = req.url
    //api page
    if(pathName==='/api'){
        try{
            res.writeHead(200, {'content-type': 'application/json'})
            res.end(data)
        }catch(err){
            res.end(err)
        }
        
        
    }
    //OverView page
    else if(pathName==='/' || pathName==='/overview'){
        res.writeHead(200, {'content-type': 'text/html'})

        const cardsHtml = dataObj.map(el=> replaceTemplate(tempCard, el)).join();
        const overView = temp_overview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(overView)

    }

    //product page

    else if(pathName==='/product'){
        res.writeHead(200, {'content-type': 'text/html'})
        res.end(tempProduct)
    }

    else if(pathName==='/card'){
        res.writeHead(200, {'content-type': 'text/html'})
        res.end(tempCard)
    }

    //not found
    else{
        res.writeHead(404,{
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        })
        res.end('<h1>Page not found<h1/>');
    }

});

server.listen(8000, '127.0.0.1', ()=>{
    console.log('Listening on requests on port 8000')
});

