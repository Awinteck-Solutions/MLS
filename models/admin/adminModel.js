const database = require('../database')
class admin_db {
    constructor() {
        global.db = database;
    }
 
    // --------------------------ACCOUNT SECTION------------------------------
    // LOGIN SECTION -------------
    get_user(email, callback) {
        let query = "SELECT * FROM admin WHERE email=?";
 
        try {
            db.query(query, [email], (err, response) => {
                if (err) {
                    //   throw err;
                    return callback({ status: false, message: "System error" });
                }
                if (response.length === 0) {
                    return callback({
                        status: false,
                        message: "User not registered",
                    });
                } else {
                    // console.log("user response", response[0]);
                    return callback({
                        status: true,
                        message: "user exists",
                        response: response[0],
                    });
                }
            });
        } catch (err) {
            return callback({
                status: false,
                message: "failed user login (email not in database)",
            });
        }
    }

    // registration for users to userdb
    register_user(email, password, callback) {
        let query = "INSERT INTO `admin` (`email`, `password`) VALUES (?,?)";
 
        try {
            db.query(query, [email, password], (err, response) => {
                if (err) {
                    return callback({
                        status: false,
                        message: "System error"
                    });
                }
                if(response.length==0){
                    return callback({
                        status: false,
                        message: "No data available"
                    });

                } else {
                    return callback({
                        status: true,
                        message: "Admin registered successfully",
                    });
                }
            });
        } catch (err) {
            return callback({
                status: false,
                message: "failed user registration",
            });
        }
    }

    // --------------------------END ACCOUNT SECTION------------------------------

    
}

module.exports = admin_db