const fs = require('fs')


/*
///////////// Blocking, synchronous way //////////////////
//Reading files
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);

//write to files
const textOut = `This is what we know about avocado: ${textIn}\n Created on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
*/


///////////// Non-Blocking, asynchronous way //////////////////
//callback hell
fs.readFile('./txt/start.txt', 'utf-8' , (err, data1)=>{
    if(err) return console.log('ERROR')
    fs.readFile(`./txt/${data1}.txt`, 'utf-8' , (err, data2)=>{
        fs.readFile(`./txt/append.txt`, 'utf-8' , (err, data3)=>{
            console.log(data3);
            fs.writeFile(`./txt/final.txt`,`${data2}\n${data3}`, 'utf-8' , (err)=>{
                console.log('file has been written');
            });
        });
    });
});
console.log('will read file');

