
class Produs{
    
    constructor(nume, cantitate){
        this.nume = nume;
        this.cantitate = cantitate;
        this.id = ++Produs.counter;
    }

}

Produs.counter = 0;

const worker = new Worker('./js/worker.js');

function insertData() {

    var nume = document.getElementById("product-name").value;
    var cant = document.getElementById("product-quantity").value;
    var p = new Produs(nume, cant);
    //console.log(p);

    const storageType = document.getElementById("storage-type").value;
    if(storageType == 'local'){
        
       
        worker.postMessage({type: 'start', data : p});
        
        
        localStorage.setItem(p.id, JSON.stringify(p));

        setTimeout(() => {
            worker.postMessage({type: 'end', data: p});
            createTableFromLocal();
        }, 1500);
    }else if(storageType == 'indexed'){
        var request = window.indexedDB.open('cumparaturiDB', 1);

        request.onerror = function(event){
            console.log("Eroare la indexedDB: ", event.target.errorCode);
        };

        request.onsuccess = function(event){
            var db = event.target.result;

            worker.postMessage({type: 'start', data: p});

            var transaction = db.transaction(['Produs'], 'readwrite');
            var objectStore = transaction.objectStore('Produs');
            var addRequest = objectStore.add(p);

            addRequest.onsuccess = function(event){
                worker.postMessage({type:'end', data: p});
                createTableFromIndexedDB(db);
            };

            addRequest.onerror = function(event){
                console.log("Eroare la adaugarea in indexedDB: ",event.target.error);
            };

        };

        request.onupgradeneeded = function(event){
            var db = event.target.result;
            if(!db.objectStoreNames.contains('Produs')){
                var objectStore = db.createObjectStore('Produs', {keyPath: 'id', autoIncrement: true});
                objectStore.createIndex('nume', 'nume', {unique: false});
                objectStore.createIndex('cantitate', 'cantitate', {unique: false});
            }
        };

    }


}

function createTableFromIndexedDB(db) {
    var table = "<table><tr><th>Id</th><th>Produs</th><th>Cantitate</th></tr>";
    var transaction = db.transaction(['Produs'], 'readonly');
    var objectStore = transaction.objectStore('Produs');
    var cursorRequest = objectStore.openCursor();

    cursorRequest.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            var data = cursor.value;
            table += "<tr><td>" + data.id + "</td><td>" +
                data.nume + "</td><td>" + data.cantitate + "</td></tr>";
            cursor.continue();
        } else {
            table += "</table>";
            document.getElementById("cart").innerHTML = table;
        }
    };

    cursorRequest.onerror = function(event) {
        console.log("Error retrieving data from IndexedDB:", event.target.error);
    };
}

worker.onmessage = function(event) {
    console.log("Received message from worker:", event.data);
};

function createTableFromLocal(){
    var table = "<table><tr><th>Id</th><th>Produs</th><th>Cantitate</th></tr>";
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var data = JSON.parse(localStorage.getItem(key));
        table += "<tr><td>" + data.id + "</td><td>" +
            data.nume + "</td><td>" + data.cantitate + "</td></tr>";
    }
    table += "</table>";
    document.getElementById("cart").innerHTML = table;
}

worker.onmessage = function(event) {
    console.log("S-a primit mesaj de la worker", event.data);
}