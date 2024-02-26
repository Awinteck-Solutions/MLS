const mysql = require('mysql');

// let connection = mysql.createPool({
//     connectionLimit : 4, 
//     host: '162.0.232.194',
//     // host: 'https://database.awinteck.com',
//     user: 'awinxcxu_taxlawgh',
//     password: 'e*=t2(?$bLw,',
//     port:3306,
//     database: 'awinxcxu_taxlawgh',
//     charset: 'utf8mb4'
// })


    let connection = mysql.createPool({
        connectionLimit : 2, 
        host: 'localhost',
        user: 'root',
        database: 'taxlawgh',
        charset: 'utf8mb4'
    })

    connection.getConnection(function(error, pool){
        if(error) return console.log('error : ', error.message);
        console.log('Connected to the Mysql database')
        pool.release();
    })
 

    module.exports = connection;