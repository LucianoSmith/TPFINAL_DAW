var express = require('express');

var datos = require('./datos.json');

console.log(datos);


var app= express();


app.get('/devices', function(req, res){
    res.send(datos);
});


// GET: /devices/1 ---> id:1 nombre:luciano 
app.get('/devices/:id', function(req, res){
    // buscar el id que me pasaron por parametro 
    idABuscar = req.params.id;
    console.log(idABuscar);
    // devolver el jason de ese objecto
    // map, filter, reduce
    let datosFiltrados = datos.filter(item=>item.id == req.params.id);
    /*
    let datosFiltrados = datos.filter(item=>{
        if (item.id==idABuscar) {
            return true;
        }
        return false;
    });
    */
    res.send(datosFiltrados);  // muy importante que toda request tenga una response!!!! si no se cuelga
});

/*  OTRA FORMA ... ya no se usa
// GET: /devices/?idseg=46 ---> id:46 nombre:valentino 
app.get('/devices/:id', function(req, res){
    // buscar el id que me pasaron por parametro 
    idABuscar = req.query.idseg;
    console.log(idABuscar);
    // devolver el jason de ese objecto
    res.send(datos);  // muy importante que toda request tenga una response!!!! si no se cuelga
});
*/

app.get('/',function(req, res) {
    console.log('test desde /');
    res.send("HOLA");
});

//los navegadores usan unicamente metodos get 

app.get('/test',function(req, res) {
    res.status(404);
    res.send(req.ip);
    res.send({"nombre": "Jose"});
});

app.listen(8081, function() {
    console.log('se levanto la api en el puerto 8081');
});

// el post solo con aplicaciones ... por ejemplo: postman
app.post('/test2',function(req, res) {
    
    res.send({"nombre": "Jose"});
});
