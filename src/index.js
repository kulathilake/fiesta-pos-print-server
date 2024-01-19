const express = require('express');
const {printBill,printerInfo} = require('./print');
const cors = require('cors')
const app = express();

app.use(express.json())
app.use(cors());

app.post('/print/bill',(req,res)=>{
    printBill(req.body.visibleId, req.body.openedAt, req.body.items, req.body.total);
    printBill(req.body.visibleId, req.body.openedAt, req.body.items, req.body.total,true);
    res.send('OK')
})

app.get('/printer/',(req,res)=>{
    res.send(printerInfo())
})

app.listen(9000)