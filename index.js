const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const reg = require('./reg.js');
const game = require('./page.js');
const express = require('express');
const app = express();

app.get('/', (request,response) => {
    readFile('./index.html', 'utf8', (err, html) => {
        if (err) {
            response.status(500).send(err.message)
        }
        response.send(html);
    })
});

app.listen(process.env.PORT)