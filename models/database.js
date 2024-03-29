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


    // let connection = mysql.createPool({
    //     connectionLimit : 10, 
    //     host: '127.0.0.1',
    //     user: 'admin',
    //     password:"root",
    //     database: 'taxlawgh',
    //     charset: 'utf8mb4',
    //     // port:3307
    // })

    // const connection = mysql.createPool({
    //     connectionLimit : 100,
    //     host: 'localhost',
    //     user: 'admin',
    //     password:"root",
    //     database: 'taxlawgh',
    //     charset: 'utf8mb4',
    //     port:3307
    // });

    const connection = mysql.createPool({
        connectionLimit : 100,
        // host: 'host.docker.internal',
        host: 'localhost',
        user: 'admin',
        password:"root",
        database: 'taxlawgh',
        charset: 'utf8mb4',
        debug    : false,
        timezone: 'cet',
        port:3306
    });
      

    connection.getConnection(function(error, pool){
        if(error) return console.log('error : ', error.sqlMessage);
        console.log('Connected to the Mysql database')
        pool.release();
    })
 

    module.exports = connection;