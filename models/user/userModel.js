const db = require('../database')

class User{
    constructor() {
        global.db = db
       var date = new Date()

        global.date = new Intl.DateTimeFormat('en-US', {
            dateStyle: 'short',
            timeZone: 'Africa/Accra',
          }).format(date)
            
        global.time = new Intl.DateTimeFormat('en-GB', {
            timeStyle: 'long',
            timeZone: 'Africa/Accra',
          }).format(date)
    }

     
    // =======================REGISTER=======================
    register(firstname,lastname,email,password,otp_code, callback){
        let query = "INSERT INTO `user` (`firstname`, `lastname`, `email`, `password`, `otp_code`, `date`,`time`) VALUES (?);";
        var values = [firstname,lastname,email,password,otp_code,date,time];
        
        try {
            db.query(query, [values], (err, response)=>{
                if (err) {
                    // throw err;
                    return callback({ status: false, message: err.sqlMessage });
                }  
                
                console.log('DATA', response)
                if(response.length==0){
                    return callback(
                        {status:false,
                         message:'No data available',
                        });
                }
                else {
                    this.find_user_by_otp(otp_code, (res) => {
                        console.log('res :>> ', res);
                        if (res.status) {
                            return callback({
                                status:true,
                                message:'user registered successfully',
                                response:res.response});
                        } else {
                            return callback({
                                status:true,
                                message: 'user registered successfully',
                                other:'Use token to get profile. Token: ' + otp_code,
                                response:{}});
                        }
                    })
                }
            })
        } catch (err) {
            console.log('Myerr', err)
            return callback({
                status:false,
                message:'failed user registration',
                });
        }
    }

    // =======================LOGIN=======================
    find_user(email, callback){
        let query = "SELECT * FROM user WHERE email=? AND status='ACTIVE';";
        try {
            db.query(query,[email], (err, response)=>{
                if (err) { return callback({ status: false, message: 'error here' + err, }); }  
                
                if(response.length == 0){ 
                    return callback({
                        status: false,
                        message:'response is null'
                    }); 
                }else{
                    console.log('user response', response[0])
                    return callback({
                        status: true,
                        message: 'User is found',
                        response:response[0]});
                }
            })
           } catch (err) {
                return callback({
                    status: false,
                    message:'User does not exist'
                });
           }  
    }
    
    find_user_by_otp(otp_code, callback){
        let query = "SELECT * FROM user WHERE otp_code=?;";
        try {
            db.query(query,[otp_code], (err, response)=>{
                if (err) { return callback({ status: false, message: 'error here' + err, }); }  
                
                if(response.length == 0){ 
                    return callback({
                        status: false,
                        message:'response is null'
                    }); 
                }else{
                    return callback({
                        status: true,
                        message: 'User is found',
                        response:response[0]});
                }
            })
           } catch (err) {
                return callback({
                    status: false,
                    message:'User does not exist'
                });
           }  
    }

    // =======================FORGET_PASSWORD=======================
    find_otpCode(email_phone, callback){
        let query = "SELECT otp_code FROM user WHERE email_phone=?;";
        try {
            db.query(query,[email_phone], (err, response)=>{
                if (err) { return callback({ status: false, message: 'error here' + err, }); } 
                
                if(response.length == 0){ 
                    return callback({
                        status: false,
                        message:'response is null'
                    }); 
                }else{
                    console.log('user response', response[0])
                    return callback({
                        status: true,
                        message: 'User is found',
                        response:response[0]});
                }
            })
           } catch (err) {
                return callback({
                    status: false,
                    message:'User does not exist'
                });
           }  
    }

    // =======================RESET_PASSWORD=======================
    reset_password(otp_code, password,callback){
        let query = "UPDATE user SET password=? WHERE otp_code=?;";
        try {
            db.query(query,[password,otp_code], (err, response)=>{
                if (err) { return callback({ status: false, message: 'error here', }); }  
                
                if(response.length == 0){
                    console.log('response', response[0])
                    return callback({
                        status: false,
                        message:'response is null'
                    });
                }
                if(response.changedRows==0){
                    return callback({
                        status: false,
                        message:'Wrong email/phone'
                    });
                }
                return callback({
                    status: true,
                    message: 'reset password successful',
                    response:response});
            })
        } catch (err) {
            console.log('Myerr', err)
            return callback({
                status: false,
                message: 'failed password reset'});
        }
    }

    // =======================PROFILE_UPLOAD=======================
    upload_profile(user_id, image, callback){
        let query = "UPDATE user SET image=? WHERE id=?;"
        try {
            db.query(query, [image, user_id], (error, response)=>{
              if(error)  {
                // throw error;
              return callback({ status: false, message: "error here " +error});
            }
              else if (response.changedRows === 0) {
                  return callback({
                    status: false,
                    message: "Nothing happened",
                  });
                }
                else{
                    return callback({
                        status:true,
                        message: 'Image upload successful'
                    })
                }
            })
        } catch (error) {
          return callback({
              status: false,
              message: "failed upload image",
            });
        }
    }

    // =======================PROFILE_UPDATE=======================
    update(user_id,firstname,lastname, callback){
        let query = "UPDATE user SET firstname=?, lastname=? WHERE id=?;"
        try {
            db.query(query, [firstname,lastname, user_id], (error, response)=>{
              if(error)  {
                // throw error;
              return callback({ status: false, message: "error here " +error});
            }
              else if (response.changedRows === 0) {
                  return callback({
                    status: false,
                    message: "Nothing happened",
                  });
                }
                else{
                    return callback({
                        status:true,
                        message: 'Profile update successful'
                    })
                }
            })
        } catch (error) {
          return callback({
              status: false,
              message: "failed update",
            });
        }
    }

    // =======================CHANGE_PASSWORD=======================
    change_password(user_id, password,callback){
        let query = "UPDATE user SET password=? WHERE id=?;" ;
        try {
            db.query(query, [password, user_id], (err, response) => {
                
                if (err) { return callback({ status: false, message: 'error here'}); }  
                
                if(response.length == 0){
                    console.log('response', response[0])
                    return callback({
                        status: false,
                        message:'Failed to change password'
                    });
                }
                else if(response.changedRows==0){
                    return callback({
                        status: false,
                        message:'User does not exist'
                    });
                }
                return callback({
                    status: true,
                    message: 'reset password successful'
                    });
            })
        } catch (err) {
            console.log('Myerr', err)
            return callback({
                status: false,
                message: 'Failed password reset'});
        }
    }
  
    // =======================LOGIN=======================
    find_user_by_id(user_id, callback){
        let query = "SELECT * FROM user WHERE id=?;";
        try {
            db.query(query,[user_id], (err, response)=>{
                if (err) { return callback({ status: false, message: 'error here' + err, }); }  
                
                if(response.length == 0){ 
                    return callback({
                        status: false,
                        message:'response is null'
                    }); 
                }else{
                    console.log('user response', response[0])
                    return callback({
                        status: true,
                        message: 'User is found',
                        response:response[0]});
                }
            })
           } catch (err) {
                return callback({
                    status: false,
                    message:'User does not exist'
                });
           }  
    }
   
    // =======================DELETE=======================
    delete(user_id, callback){
        let query = "UPDATE user SET status='DELETED' WHERE id=?;"
        try {
            db.query(query, [user_id], (error, response)=>{
              if(error)  {
                // throw error;
              return callback({ status: false, message: "error here " +error});
            }
              else if (response.changedRows === 0) {
                  return callback({
                    status: false,
                    message: "Nothing happened",
                  });
                }
                else{
                    return callback({
                        status:true,
                        message: 'USER Deleted successful'
                    })
                }
            })
        } catch (error) {
          return callback({
              status: false,
              message: "failed to delete",
            });
        }
    }
    
}

module.exports = User;