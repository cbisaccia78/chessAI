

const express = require('express');
const app = express();
//var Mongoose = require('mongoose');
//var db = Mongoose.createConnection('mongodb://root:FEFQ9F1qaz0@174.129.83.34/DATABASE');
const hostname = '174.129.83.34';
const port = '3000';


app.use(express.static('public'))
app.get('/', (req, res) => 
{
res.sendFile('/opt/bitnami/projects/chessApp/public/index.html', {root: path.join(__dirname, 'public')});


});



app.listen(port, () => console.log(`Server running at http://${hostname}:80`));
