const database = require('../database')
class lesson_db {
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

    insertMany(users) { 
        users = [
            { username: 'John', email: 'john@gmail.com' },
            {username: 'Ama', email: 'ama@gmail.com'}
        ]

        let allValues = ''

        users.map((data,index) => { 
            // (john, john@gmail.com)
            if (index >= 1) { 
                allValues += ','
            }
            allValues += '(' + data.username + ',' + data.email + ')'
        })

        allValues = '(john, john@gmail.com), (ama, ama@yahoo.com)'

        let query = 'Insert into  table (username, email) values ' + allValues
    }


    // --------------------------LESSON SECTION------------------------------

    getLesson(n_id, callback) {
        let query =`SELECT * FROM lesson WHERE _id=?;`;
        try {
            db.query(query,[n_id], (err, response)=>{
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
                    message: "Failed to add lesson"
                  })
                }
            })
        } catch (err) { 
            return callback({
                status: false,
                message: 'System Error'});
        }
    }
    getSingleLesson(id, callback) {
        let query =`SELECT * FROM lesson WHERE id=?;`;
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
                        message:'Successfully got the Lesson',
                        response: response[0]
                    });
                } else {
                  return callback({
                    status: false,
                    message: "Failed to get lesson"
                  })
                }
            })
        } catch (err) { 
            return callback({
                status: false,
                message: 'System Error'});
        }
     }
   
     // -------------------------- ADD LESSON
     addLesson(n_id,title,desc,course_id, callback) {
        let query =`INSERT INTO lesson (_id,title,description,course_id,date,time) 
                    VALUES (?,?,?,?,?,?);`;
        try {
            db.query(query,[n_id,title,desc,course_id,date,time], (err, response)=>{
                if (err) {
                    throw err;
                    return callback({
                        status: false,
                        message: 'Internal error',
                    });
                }
                if (response.affectedRows !== 0) {
                    this.getLesson(n_id, (res) => {
                        if (res.status) {
                            return callback({
                                status: true,
                                message: 'Lesson Added successfully',
                                response: res.response
                            });
                        } else {
                            return callback({
                                status: true,
                                message: 'Lesson Added successfully',
                                response: {
                                    _id: n_id
                                }
                            });
                        }
                    })
                } else {
                  return callback({
                    status: false,
                    message: "Failed to add lesson"
                  })
                }
            })
        } catch (err) {
            throw err
            return callback({
                status: false,
                message: 'System Error'});
        }
     }
     
    // -------------------------- UPDATE LESSON
    updateLesson(id,title,desc, callback) {
      let query =`UPDATE lesson SET
                  title=?,description=?
                  WHERE id=?;`;
      try {
          db.query(query,[title,desc,id], (err, response)=>{
              if (err) {
                  return callback({
                      status: false,
                      message: 'System error',
                  });
              }   
              if(response.affectedRows !== 0){
                  return callback({
                      status: true,
                      message:'Lesson updated successfully'
                  });
              } else {
                return callback({
                  status: false,
                  message: "Failed to update lesson"
                })
              }
          })
      } catch (err) { 
          return callback({
              status: false,
              message: 'System Error'});
      }
  }
    // -------------------------- DELETE LESSON
    deleteLesson(id, callback) {
      let query =`DELETE FROM lesson WHERE id=?;`;
      try {
          db.query(query,[id], (err, response)=>{
              if (err) {
                  return callback({
                      status: false,
                      message: 'System error',
                  });
              }   
              if(response.affectedRows !== 0){
                  return callback({
                      status: true,
                      message:'Lesson deleted successfully'
                  });
              } else {
                return callback({
                  status: false,
                  message: "Failed to delete lesson"
                })
              }
          })
      } catch (err) { 
          return callback({
              status: false,
              message: 'System Error'});
      }
  }
    // -------------------------- UPDATE VIDEO
    updateLessonVideo(id,video, callback) {
      let query =`UPDATE lesson SET video=?
                  WHERE id=?;`;
      try {
          db.query(query,[video,id], (err, response)=>{
              if (err) {
                  return callback({
                      status: false,
                      message: 'System error',
                  });
              }   
              if(response.affectedRows !== 0){
                  return callback({
                      status: true,
                      message:'Lesson-video updated successfully'
                  });
              } else {
                return callback({
                  status: false,
                  message: "Failed to update lesson-video"
                })
              }
          })
      } catch (err) { 
          return callback({
              status: false,
              message: 'System Error'});
      }
  }
    // -------------------------- UPDATE PDF
    updateLessonPdf(id,pdf, callback) {
      let query =`UPDATE lesson SET pdf=?
                  WHERE id=?;`;
      try {
          db.query(query,[pdf,id], (err, response)=>{
              if (err) {
                //   throw err;
                  return callback({
                      status: false,
                      message: 'Internal error' ,
                  });
              }   
              if(response.affectedRows !== 0){
                  return callback({
                      status: true,
                      message:'Lesson-pdf updated successfully'
                  });
              } else {
                return callback({
                  status: false,
                  message: "Failed to update lesson-pdf"
                })
              }
          })
      } catch (err) { 
          return callback({
              status: false,
              message: 'System Error'});
      }
  }

    // --------------------------END LESSON SECTION------------------------------


}

module.exports = lesson_db