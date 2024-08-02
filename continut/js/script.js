//Global variabiles


var counter = 0;
var x, y;


//Functions

//Se actualizeaza data
function updateDateTime(){
    const now = new Date();

    const currentDateTime = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;

    document.getElementById("datetime").textContent = currentDateTime;

}


//Se actualizeaza ora, minutul si secunda curenta

function updateCurrentTime(){
    const now = new Date();

    const currentTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    document.getElementById("hour").textContent = currentTime;
   
}

//Functie de afisat url-ul curent

function displayURL(){
    document.getElementById("web-page-URL").innerHTML = window.location.href;
}

//Functie de afisat locatia curenta prin latitudine si longitudine, necesite permisiune de acces al locatiei

function displayLocation(){
    if ("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                document.getElementById("current-location").textContent = `Latitudine: ${latitude}, longitudine: ${longitude}`;
            },

            (error) =>{
                console.error("Eroare la cautarea locatiei: ", error);
            }
        );
    }else{
        console.error("Nu exista geolocație în acest browser");
    }
}

//Afisarea browser-ului curent

function showBrowser(){
    const userAgent = navigator.userAgent;

    document.getElementById("browser-display").textContent = userAgent;
}

//Afisarea sistemului de operare

function currentOS(){
    var Name = "Not known"; 
    if (navigator.appVersion.indexOf("Win") != -1) Name =  
        "Windows OS"; 
    if (navigator.appVersion.indexOf("Mac") != -1) Name =  
        "MacOS"; 
    if (navigator.appVersion.indexOf("X11") != -1) Name =  
        "UNIX OS"; 
    if (navigator.appVersion.indexOf("Linux") != -1) Name =  
        "Linux OS"; 
    document.getElementById("OS").textContent = Name;
}


//Functie default de stergere a tot ce se afla pe canvas

function clearCanvas(){
    const canvas = document.getElementById("drawing");
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
}

//Inserare de coloane in tabel

function insertColumn(){
    var columnPos = document.getElementById("position").value;
    var tbl = document.getElementById("dynamicTable");

    for(let i = 0 ; i < tbl.rows.length; i++){
        createColumn(tbl.rows[i].insertCell(columnPos), i);
    }
    changeColumnColor();
}

//inserarea de randuri
function insertRow(){
    var rowPos = document.getElementById("position").value;
    var tbl1 = document.getElementById("dynamicTable");
    
    var row = tbl1.insertRow(rowPos);
    
    for(let i = 0; i < tbl1.rows[0].cells.length; i++){
        createColumn(row.insertCell(i), i);
    }
    changeRowColor();
}

function changeColor(){
    changeColumnColor();
    changeRowColor();
}

function createColumn(cell, text){
    var div = document.createElement('div');
    var txt = document.createTextNode(text);
    div.appendChild(txt);
    cell.appendChild(div);
}

function changeColumnColor(){
    var colPos = document.getElementById("position").value;
    var vertically = document.getElementById("dynamicTable").getElementsByTagName("td");
    let color = document.getElementById('tableColor');
    vertically[colPos].style.backgroundColor = color.value;

}

function changeRowColor(){
    var colPos1 = document.getElementById("position").value;
    var vertically1 = document.getElementById("dynamicTable").getElementsByTagName("tr");
    vertically1[colPos1].style.backgroundColor = document.getElementById("tableColor").value;
 
}
//Functie AJAX de schimbat continutul paginii, transformare catre un navbar unic

function schimbaContinut(resursa, jsFisier, jsFunctie) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("continut").innerHTML =
                this.responseText;
            if (jsFisier) {
                var elementScript = document.createElement('script');
                elementScript.onload = function() {
                    console.log("hello");
                    if (jsFunctie) {
                        window[jsFunctie]();
                    }
                };
                elementScript.src = jsFisier;
                document.head.appendChild(elementScript);
            } else {
                if (jsFunctie) {
                    window[jsFunctie]();
                }
            }
        }
    };
    xhttp.open("GET", resursa + ".html", true);
    xhttp.send();
}

//Functie de validare date introduse in formularul din pagina verifica.html

function validare() {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);
            if (document.getElementById("user").value == json[0].utilizator && document.getElementById("parola").value == json[0].parola) {
                document.getElementById("validare1").innerHTML = "Nume utilizator+parolă corecte";
            } else if (document.getElementById("user").value != json[0].utilizator && document.getElementById("parola").value != json[0].parola) {
                document.getElementById("validare1").innerHTML = "Nume utilizator+parolă greșite";
            } else if (document.getElementById("user").value != json[0].utilizator) {
                document.getElementById("validare1").innerHTML = "Nume utilizator greșit";
            } else if (document.getElementById("parola").value != json[0].parola) {
                document.getElementById("validare1").innerHTML = "Parolă greșită";
            }
        }
    };

    xhttp.open("GET", "resurse/utilizatori.json", true);
    xhttp.send();
}

/**************************************************************** */
/* MAIN */
/**************************************************************** */


//Apeleaza functia de update a timpului la fiecare secunda

setInterval(updateCurrentTime, 1000);

//O functie de incarcare a altor functii ce nu necesita apelare decat la incarcarea paginii

function loadEverything(){
    updateDateTime();
    displayURL();
    displayLocation();
    showBrowser();
    currentOS();
}

//Cod canvas
//Canvasul este programat in asa fel incat acesta sa poata avea desen liber
var square = document.getElementById("drawing");

var paper = square.getContext("2d");

var pressedMouse = false;

var x;
var y;
var colorLine = document.getElementById("color-picker").value;

document.addEventListener("mousedown", startDrawing);
document.addEventListener("mousemove", drawLine);
document.addEventListener("mouseup", stopDrawing);

function changeColor(){
    colorLine = document.getElementById("color-picker").value;
    //alert("Culoarea a fost schimbata la" + colorLine);
    return colorLine;
}


function startDrawing(events){
    pressedMouse = true;
    x = events.offsetX;
    y = events.offsetY;
}

function drawLine(events){
    if(pressedMouse){
        document.getElementById("drawing").style.cursor = "crosshair";
        var xM = events.offsetX;
        var yM = events.offsetY;
    
        drawing_line(changeColor(), x, y, xM, yM, paper);
        x = xM;
        y = yM;
    }
}

function stopDrawing(events){
    pressedMouse = false;
    document.getElementById("drawing").style.cursor = "default";

}
drawing_line(changeColor(), x-1, y, x, y, paper);

function drawing_line(color, x_start, y_start, x_end, y_end, board){
    board.beginPath();

    board.strokStyle = color;
    board.lineWidth = 2;
    board.moveTo(x_start, y_start);
    board.lineTo(x_end, y_end);
    board.stroke();
    board.closePath();
}
