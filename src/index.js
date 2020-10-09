const express = require('express');
const path = require('path');  
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();
app.use(cors());
require('./database');

app.set('port', process.env.PORT || 3000);
app.set('dir', __dirname);

app.use(express.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname,'public')));

app.use(require('../routes/route'));

app.listen(app.get('port'),()=>{
    console.log("Server on ",app.get('port'));
    
});
