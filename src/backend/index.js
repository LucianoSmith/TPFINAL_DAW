//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

// Device list
app.get('/devices/', function(req, res, next) {
    utils.query("select * from Devices;", function(err, result) {
        if (err == null) {
            res.status(200).json(result);
        } else {
            console.log(err);
            res.status(304);
        }
    })
});

// New device
app.post('/new/', function(req, res, next) {
    console.log(req.body.name);
    let s = "insert into Devices (name, description, state, type, posx, posy) values ('"+req.body.name+"', '"+req.body.description+"', 0, "+req.body.type+", "+req.body.posx+", "+req.body.posy+");";
    console.log(s);
    utils.query(s, function(err, result) { 
        if (err == null) {
            res.status(200).json(result);
        } else {
            console.log(err);
            res.status(304);
        }
    })
});

// Delete device
app.delete('/delete/:id', function(req, res, next) {
    console.log(req.params.id);
    let s = "delete from Devices where id="+req.params.id+";";
    console.log(s);
    utils.query(s, function(err, result) { 
        if (err == null) {
            res.status(200).json(result);
        } else {
            console.log(err);
            res.status(304);
        }
    })
});

// Update device 
app.post('/update/', function(req, res, next) {
    let s = "update Devices set @";
    if (req.body.name!==-1) s += ", name='"+req.body.name+"'";
    if (req.body.description!==-1) s += ", description='"+req.body.description+"'";
    if (req.body.state!==-1) {
        if (req.body.type==0) {
            if (req.body.state==false) {
                s += ", state=0";     
            } else {
                s += ", state=1";
            }
        } else {
            s += ", state=" + req.body.state;    
        }
    }
    if (req.body.type!==-1) s += ", type="+req.body.type;
    if (req.body.posx!==-1) s += ", posx="+req.body.posx;
    if (req.body.posy!==-1) s += ", posy="+req.body.posy;
    s += " where id="+req.body.id+";";    
    s = s.replace("@,", "");
    console.log(s);
    utils.query(s, function(err, result) { 
        if (err == null) {
            res.status(200).json(result);
        } else {
            console.log(err);
            res.status(304);
        }
    })
} ); 

// Device Info
app.get('/info/:id', function(req, res, next) {
    let s = "select * from Devices where id="+req.params.id+";";
    console.log(s);
    utils.query(s, function(err, result) {  
        if (err == null) {
            res.status(200).json(result);
        } else {
            console.log(err);
            res.status(304);
        }
    })
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================