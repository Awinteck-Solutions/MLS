var fs = require('fs'); 
var {parse} = require('csv');
const { Readable } = require('stream');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
  
exports.getRandomInt = getRandomInt


function readCSV(file,callback) { 
    let csv_data = []
    const fileStream = Readable.from(file.buffer);

    fileStream
    .pipe(parse({delimiter: ','}))
    .on('data', function(data){
        try {
            let value = data[0]
            console.log('daa',value)
            console.log("Email is: "+value);
            csv_data.push(value)
        }
        catch(err) {
        }
    })
    .on('end',function(){
        return callback({
            emails: csv_data
        });
    }); 
}

exports.readCSV = readCSV

