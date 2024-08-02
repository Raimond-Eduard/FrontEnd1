//worker.js

self.onmessage = function(event){
    const {type, data} = event.data;

    if(type === 'start'){
        console.log("Worker: a inceput procesul de stocare");
    }else if(type === 'end'){
        console.log("Worker: S-a terminat procesul de stocare");
    }
};