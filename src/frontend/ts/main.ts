declare const M;
// my ip "localhost" o "172.16.4.133";

// Draws smart home devices on the home map
function  drawDevices(): void {
    let xml = new XMLHttpRequest();   
    xml.onreadystatechange = function respuestaServidor () {            
        if (xml.readyState == 4) {
            if (xml.status == 200) {
                let respuestaObj = JSON.parse(xml.responseText);
                let houseDraw = document.getElementById("houseDraw");
                houseDraw.innerHTML = "";
                // Draw the device circles and bind them with the showInfo(id) function
                for(let i = 0; i in respuestaObj; i++) {
                    // red color: device off
                    // green color: device on 
                    let c = 'red';
                    if (respuestaObj[i].state>0) c='green';  
                    let s: string = '<circle id="c'+ respuestaObj[i].id+'" onclick="showInfo(' + respuestaObj[i].id + ');" class="l1 modal-trigger" cx="' + respuestaObj[i].posx + '" cy="' + respuestaObj[i].posy + '" r="3" fill="'+c+'" stroke="white" stroke-width="1" href="#show" style="cursor: pointer;" />';
                    houseDraw.innerHTML = houseDraw.innerHTML + s;   
                }  
            } else {
                alert("HTTP Request Error: function drawDevices()");
            }
        }
    }
    xml.open("GET", "http://172.16.4.133:8000/devices", true);
    xml.send();
}


// Shows a list with all the information of the devices
function deviceList() {
    let xml = new XMLHttpRequest();   
    xml.onreadystatechange = function respuestaServidor () {
        if (xml.readyState == 4) {
            if (xml.status == 200) {
                let respuestaObj = JSON.parse(xml.responseText);
                let list = document.getElementById("deviceList");
                list.innerHTML = '<b><div class="row"><div class="col s1">ID</div><div class="col s3">Name</div><div class="col s4">Description</div><div class="col s1">Status</div><div class="col s1">Value</div><div class="col s2"></div></div></b>'; 
                for(let i = 0; i in respuestaObj; i++) {
                    let s = 'Switch'; // default type
                    let p = '' // default suffix
                    if (respuestaObj[i].type=='1') {
                        s = 'Slider';
                        p = ' %';
                    }
                    // generate every row of the list
                    list.innerHTML +='<div class="row"><div class="col s1">'+respuestaObj[i].id+'</div><div class="col s3">'+respuestaObj[i].name+'</div><div class="col s4">'+respuestaObj[i].description+'</div><div class="col s1">'+s+'</div><div class="col s1">'+respuestaObj[i].state+p+'</div><div class="col s2"><a href="#show" onclick="showInfo(' + respuestaObj[i].id + ');" class="waves-effect waves-light btn-small modal-trigger">View</a></div></div>'; 
                }
            } else {
                alert("HTTP Request Error: function deviceList()");
            }
        }
    }
    xml.open("GET", "http://172.16.4.133:8000/devices", true);
    xml.send();         
}

// Delete the device with the id submitted 
function deleteDevice(id) {
    let xml = new XMLHttpRequest();   
    xml.onreadystatechange = function respuestaServidor () {
        if (xml.readyState == 4) {
            if (xml.status == 200) {
                // if everything ok then, re draw the home map
                drawDevices();
            } else {
                alert("HTTP Request Error: function deleteDevice(id)");
            }
        }
    }
    xml.open("DELETE", "http://172.16.4.133:8000/delete/"+id, true);
    xml.send();     
}

// Shows information of the device with the id submitted 
function showInfo(id : number){
    let xml = new XMLHttpRequest();   
    xml.onreadystatechange = function respuestaServidor () {
        if (xml.readyState == 4) {
            if (xml.status == 200) {
                let respuestaObj = JSON.parse(xml.responseText);
                // Show the view divs and hide the edit divs
                document.getElementById("deviceHead").hidden = false;
                document.getElementById("editDeviceHead").hidden = true;
                document.getElementById("deviceHeadFooter").hidden = false;
                document.getElementById("editDeviceFooter").hidden = true;  
                // Puts the device information on the HTML labels
                document.getElementById("sh_name").innerHTML = respuestaObj[0].name;
                document.getElementById("sh_desc").innerHTML = respuestaObj[0].description;
                document.getElementById("sh_posx").innerHTML = respuestaObj[0].posx;
                document.getElementById("sh_posy").innerHTML = respuestaObj[0].posy;
                document.getElementById("sh_type").innerHTML = respuestaObj[0].type;
                // Sets the state of the object based on the type field
                if (respuestaObj[0].type == 0) {
                    let status: string = "";
                    if (respuestaObj[0].state == 1) {
                        status = " checked ";
                    }
                    document.getElementById("sh_state").innerHTML = '<div class="switch"><label>Off<input ' + status+' type="checkbox" onclick="changeStatus(this, '+id+', 0);"><span class="lever"></span>On</label></div>';
                } else {
                    document.getElementById("sh_state").innerHTML = '<form action="#"><p class="range-field"><input type="range" id="test5" min="0" max="100" value="'+respuestaObj[0].state+'" onchange="changeStatus(this, '+id+', 1);" /></p></form>';
                }
                // Set the delete button
                document.getElementById("deleteDevice").onclick = function(){
                    if (confirm("Are you sure?") == true) deleteDevice(id);
                }
                // Set the edit button
                document.getElementById("editDevice").onclick = function(){
                    // if edit mode on then, hide the view divs and show the edit divs
                    document.getElementById("deviceHead").hidden = true;
                    document.getElementById("deviceHeadFooter").hidden = true;
                    document.getElementById("editDeviceFooter").hidden = false;
                    document.getElementById("editDeviceHead").hidden = false;
                    // Puts the device information on the HTML input fields
                    (document.getElementById("ed_name") as HTMLInputElement).value = document.getElementById("sh_name").innerHTML;
                    (document.getElementById("ed_desc") as HTMLInputElement).value = document.getElementById("sh_desc").innerHTML;
                    (document.getElementById("ed_posx") as HTMLInputElement).value = document.getElementById("sh_posx").innerHTML;
                    (document.getElementById("ed_posy") as HTMLInputElement).value = document.getElementById("sh_posy").innerHTML;
                    // Configure the save button
                    document.getElementById("saveDevice").onclick = function(){ updateDevice(id);};
                }
            } else {
                alert("HTTP Request Error: function showInfo(id)");
            }
        }
    }
    xml.open("GET", "http://172.16.4.133:8000/info/"+id, true);
    xml.send(); 
}

// Daya validation function
function validate(name, desc, posx: number, posy: number): boolean {
    let valid = true;    
    if ((name.length<1) || (name.length>64)) valid = false;
    if (desc.length>128) valid = false;
    if ((posx<1) || (posx>200)) valid = false;
    if ((posy<1) || (posy>200)) valid = false;
    if (valid==false) alert("Error - Invalid data. Please, check the entered information.");
    return valid;
}

// Udates the information of the device with the id submitted 
function updateDevice(id) {
    // Get the information from the HTML input elemets
    let u_name = document.getElementById("ed_name") as HTMLInputElement;
    let u_desc = document.getElementById("ed_desc") as HTMLInputElement;
    let u_posx = document.getElementById("ed_posx") as HTMLInputElement;
    let u_posy = document.getElementById("ed_posy") as HTMLInputElement;   
    // A little data validation
    if (validate(u_name.value, u_desc.value, u_posx.valueAsNumber, u_posy.valueAsNumber)==true) {
        // If no error, update the device information
        let xml = new XMLHttpRequest();   
        xml.onreadystatechange = function respuestaServidor () {
            if (xml.readyState == 4) {
                if (xml.status == 200) {
                    drawDevices();
                } else {
                    alert("HTTP Request Error: function updateDevice(id)");
                }
            }
        }
        xml.open("POST", "http://172.16.4.133:8000/update", true);
        xml.setRequestHeader("Content-Type", "application/json");
        let body = '{"id": "'+id+'", "name": "'+u_name.value+'", "description": "'+u_desc.value+'", "type": -1, "state": -1, "posx": '+u_posx.value+', "posy": '+u_posy.value+'}'; 
        xml.send(body);  
    }          
}

// Creates a new device
function newDevice() {

    let n_name = (document.getElementById("new_name") as HTMLInputElement).value;
    let n_desc = (document.getElementById("new_desc") as HTMLInputElement).value;
    let n_posx = (document.getElementById("new_posx") as HTMLInputElement).value;
    let n_posy = (document.getElementById("new_posy") as HTMLInputElement).value;
    let n_type = (document.getElementById("new_type") as HTMLSelectElement).selectedIndex;
    if (n_type!==-1) {n_type==0;}
    // A little data validation
    if (validate(n_name, n_desc, parseInt(n_posx), parseInt(n_posy))==true) {
        // If no error, update the device information
        let xml = new XMLHttpRequest();   
        xml.onreadystatechange = function respuestaServidor () {
            if (xml.readyState == 4) {
                if (xml.status == 200) {
                    // Clears the HTML input fields
                    (document.getElementById("new_name") as HTMLInputElement).value = "";
                    (document.getElementById("new_desc") as HTMLInputElement).value = "";
                    (document.getElementById("new_posx") as HTMLInputElement).value = "";
                    (document.getElementById("new_posy") as HTMLInputElement).value = "";
                    //(document.getElementById("new_type") as HTMLSelectElement).selec = "";
                    drawDevices();
                } else {
                    alert("HTTP Request Error: function newDevice()");
                }
            }
        }
        let body = '{"name": "'+n_name+'", "description": "'+n_desc+'", "type": '+n_type+', "state": 0, "posx": '+n_posx+', "posy": '+n_posy+'}'; 
        xml.open("POST", "http://172.16.4.133:8000/new", true);
        xml.setRequestHeader("Content-Type", "application/json");
        xml.send(body);  
    }         
}

// Chage the device status
function changeStatus(cb, id, type: number) {
    
    let xml = new XMLHttpRequest();   
    xml.onreadystatechange = function respuestaServidor () {
        if (xml.readyState == 4) {
            if (xml.status == 200) {  
                drawDevices();
            } else {
                alert("HTTP Request Error: function changeStatus()");
            }
        }
    }
    xml.open("POST", "http://172.16.4.133:8000/update", true);
    xml.setRequestHeader("Content-Type", "application/json");
    let body = "";
    if (type==0) {
        body = '{"id": "'+id+'", "name": -1, "description": -1, "type": 0, "state": '+cb.checked+', "posx": -1, "posy": -1}'; 
    } else {
        body = '{"id": "'+id+'", "name": -1, "description": -1, "type": 1, "state": '+cb.value+', "posx": -1, "posy": -1}';    
    }
    xml.send(body);  
}


class main {
    private lista:Array<Device> = new Array(); 

    constructor(n:string) {
        this.drawDevices();
    }

    public requestGET(url: string, lister) {
        let xml = new XMLHttpRequest();
    
            xml.onreadystatechange = function respustaServidor() {            
                if (xml.readyState == 4) {
                    if (xml.status == 200) {
                        lister.handlerGetResponse(xml.status, xml.responseText);
                    } else {
                        alert("HTTP Request Error - url "+ url);
                    }
                }
            }
          
            xml.open("GET",url, true);
            xml.send();
      }

    public handlerGetResponse(status: number, response: string) {
        
        let respuestaObj: Array<Device> = JSON.parse(response);
        for(let i = 0; i in respuestaObj; i++) {
            this.lista.push(new Device(respuestaObj[i].id, respuestaObj[i].name, respuestaObj[i].description, respuestaObj[i].type, respuestaObj[i].state, respuestaObj[i].posx, respuestaObj[i].posy));
        }
        let houseDraw = document.getElementById("houseDraw");
        houseDraw.innerHTML = "";
        // Draw the device circles and bind them with the showInfo(id) function
        for(let obj in this.lista) {
            this.lista[obj].listDevices();
            // red color: device off
            // green color: device on 
            let c = 'red';
            if (this.lista[obj].state>0) c='green';  
            let s: string = '<circle id="c'+ this.lista[obj].id+'" onclick="showInfo(' + this.lista[obj].id + ');" class="l1 modal-trigger" cx="' + this.lista[obj].posx + '" cy="' + this.lista[obj].posy + '" r="3" fill="'+c+'" stroke="white" stroke-width="1" href="#show" style="cursor: pointer;" />';
            houseDraw.innerHTML = houseDraw.innerHTML + s;   
        }
        
    }
 
    // Draws smart home devices on the home map
    private drawDevices() {
        this.requestGET("http://172.16.4.133:8000/devices", this);
    }
}

// On load function
window.onload = function inicio() {
    let devicesMain: main = new main("smart_home");
    M.AutoInit();
}