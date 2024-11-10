const express = require('express');

const app = express();

//Listen for Req

app.listen(3000);

app.get('/admin', (req, res)=>{
    res.sendFile('./admin.html', {root: __dirname});   
});

//DEFAULT CASE
app.use((req, res)=>{
    res.sendFile('./auth.html', {root: __dirname});
});
