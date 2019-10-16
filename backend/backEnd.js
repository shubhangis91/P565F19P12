const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path =require('path');
const cors =require('cors');

app.use(cors());
app.use(bodyParser.json());
app.listen(3500, function() {
   console.log("Server is running on Port: " + 3500);
});
app.use(express.static('../jobsnu/build'))
app.get('/',(req,res)=>{
});

