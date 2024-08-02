function loadXML() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            createTable(this);
        }
    };

    xmlhttp.open("GET", "resurse/persoane.xml", true);
    xmlhttp.send();
    
}

function createTable(xml){
    var xmlDocument = xml.responseXML;
    var table = "<table><tr><th>Nume</th><th>Prenume</th><th>Vârstă</th><th>Adresă</th></tr>";

    var x = xmlDocument.getElementsByTagName("persoana");

    for (let i = 0; i < x.length; i++) {
        table += "<tr><td>" + x[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue +
            "</td><td>" + x[i].getElementsByTagName("prenume")[0].childNodes[0].nodeValue +
            "</td><td>" + x[i].getElementsByTagName("varsta")[0].childNodes[0].nodeValue +
            "</td><td>" + "adresa " + x[i].getElementsByTagName("adresa")[0].childNodes[0].nodeValue +
            ", nr. " + x[i].getElementsByTagName("numar")[0].childNodes[0].nodeValue +
            ", loc. " + x[i].getElementsByTagName("localitate")[0].childNodes[0].nodeValue +
            ", jud. " + x[i].getElementsByTagName("judet")[0].childNodes[0].nodeValue +
            "," + x[i].getElementsByTagName("tara")[0].childNodes[0].nodeValue +
            "</td></tr>";
    }
table += "</table>";
var inPageTable = document.getElementById("table");
inPageTable.innerHTML = table;
inPageTable.style.backgroundColor = 'white';
inPageTable.style.margin = '20%';
console.log(table);
}