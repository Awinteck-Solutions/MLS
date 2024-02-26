const database = require('../database')
class feedback_db {
    constructor() {
        global.db = database;
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


    // --------------------------FEEDBACKS SECTION------------------------------

    getSingle(id, callback) {
        let query =`SELECT * FROM feedbacks WHERE id=?;`;
        try {
            db.query(query,[id], (err, response)=>{
                if (err) {
                    return callback({
                        status: false,
                        message: 'System error',
                    });
                }   
                if(response.length !== 0){
                    return callback({
                        status: true,
                        response: response[0]
                    });
                } else {
                  return callback({
                    status: false,
                    message: "Failed to get"
                  })
                }
            })
        } catch (err) { 
            return callback({
                status: false,
                message: 'System Error'});
        }
    }
    getAll( callback) {
        let query =`SELECT * FROM feedbacks ORDER BY id DESC;`;
        try {
            db.query(query, (err, response)=>{
                if (err) {
                    return callback({
                        status: false,
                        message: 'Internal error',
                    });
                }   
                if(response.length !== 0){
                    return callback({
                        status: true,
                        message:'Successfully got all feedbacks',
                        response: response
                    });
                } else {
                  return callback({
                    status: false,
                    message: "Failed to get feedback"
                  })
                }
            })
        } catch (err) { 
            return callback({
                status: false,
                message: 'System Error'});
        }
     }
   
     // -------------------------- ADD FEEDBACKS
     add(type,user_id,phone,message, callback) {
        let query =`INSERT INTO feedbacks (type,user_id,phone,message,date,time) 
                    VALUES (?,?,?,?,?,?);`;
        try {
            db.query(query,[type,user_id,phone,message,date,time], (err, response)=>{
                if (err) {
                    throw err;
                    return callback({
                        status: false,
                        message: 'Internal error',
                    });
                }
                if (response.affectedRows !== 0) {
                    return callback({
                        status: true,
                        message: 'Feedback Added successfully'
                    });

                } else {
                  return callback({
                    status: false,
                    message: "Failed to add FEEDBACKS"
                  })
                }
            })
        } catch (err) {
            // throw err
            return callback({
                status: false,
                message: 'System Error'});
        }
     }
     
  
    // -------------------------- DELETE FEEDBACKS
    deleteFeedback(id, callback) {
      let query =`DELETE FROM feedbacks WHERE id=?;`;
      try {
          db.query(query,[id], (err, response)=>{
              if (err) {
                  return callback({
                      status: false,
                      message: 'Internal error',
                  });
              }   
              if(response.affectedRows !== 0){
                  return callback({
                      status: true,
                      message:'Feedback deleted successfully'
                  });
              } else {
                return callback({
                  status: false,
                  message: "Failed to delete feedback"
                })
              }
          })
      } catch (err) { 
          return callback({
              status: false,
              message: 'System Error'});
      }
    }
     // -------------------------- UPDATE FEEDBACKS
     updateStatusFeedback(id,status, callback) {
        let query =`UPDATE feedbacks SET status=? WHERE id=?;`;
        try {
            db.query(query,[status,id], (err, response)=>{
                if (err) {
                    // throw err
                    return callback({
                        status: false,
                        message: 'Internal error',
                    });
                }   
                if(response.affectedRows !== 0){
                    return callback({
                        status: true,
                        message:'Feedback updated successfully'
                    });
                } else {
                  return callback({
                    status: false,
                    message: "Failed to update feedback"
                  })
                }
            })
        } catch (err) { 
            return callback({
                status: false,
                message: 'System Error'});
        }
    }
   
    // --------------------------END FEEDBACKS SECTION------------------------------


}

module.exports = feedback_db