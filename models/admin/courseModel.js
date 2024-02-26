const database = require('../database')
class course_db {
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


    // --------------------------COURSE SECTION------------------------------

    // -------------------------- ADD COURSE
    addCourse(title,desc,thumbnail,link,price,category,status, callback) {
      let query =`INSERT INTO course 
                  (title,description,thumbnail,link,price,category,status,date) 
                  VALUES (?,?,?,?,?,?,?,?);`;
      try {
          db.query(query,[title,desc,thumbnail,link,price,category,status,date], (err, response)=>{
              if (err) {
                  return callback({
                      status: false,
                      message: 'Internal error',
                  });
              }   
              if(response.affectedRows !== 0){
                  return callback({
                      status: true,
                      message:'Course Added successfully'
                  });
              } else {
                return callback({
                  status: false,
                  message: "Failed to add course"
                })
              }
          })
      } catch (err) { 
          return callback({
              status: false,
              message: 'System Error'});
      }
  }
    // -------------------------- UPDATE COURSE
    updateCourse(id,title,desc,link,price,category,status, callback) {
      let query =`UPDATE course SET
                  title=?,description=?,link=?,price=?,category=?,status=?
                  WHERE id=?;`;
      try {
          db.query(query,[title,desc,link,price,category,status,id], (err, response)=>{
              if (err) {
                  return callback({
                      status: false,
                      message: 'System error',
                  });
              }   
              if(response.affectedRows !== 0){
                  return callback({
                      status: true,
                      message:'Course Updated successfully'
                  });
              } else {
                return callback({
                  status: false,
                  message: "Failed to update course"
                })
              }
          })
      } catch (err) { 
          return callback({
              status: false,
              message: 'System Error'});
      }
    }
    // -------------------------- UPDATE COURSE THUMBNAIL
    updateCourseThumbnail(id,thumbnail, callback) {
      let query =`UPDATE course SET thumbnail=?
                  WHERE id=?;`;
      try {
          db.query(query,[thumbnail,id], (err, response)=>{
              if (err) {
                  return callback({
                      status: false,
                      message: 'System error',
                  });
              }   
              if(response.affectedRows !== 0){
                  return callback({
                      status: true,
                      message:'Course thumbnail updated successfully'
                  });
              } else {
                return callback({
                  status: false,
                  message: "Failed to update course thumbnail"
                })
              }
          })
      } catch (err) { 
          return callback({
              status: false,
              message: 'System Error'});
      }
  }
    // -------------------------- DELETE COURSE
    deleteCourse(id, callback) {
      let query =`DELETE FROM course WHERE id=?;`;
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
                      message:'Course deleted successfully'
                  });
              } else {
                return callback({
                  status: false,
                  message: "Failed to delete course"
                })
              }
          })
      } catch (err) { 
          return callback({
              status: false,
              message: 'System Error'});
      }
  }
    // -------------------------- UPDATE STATUS COURSE
    updateStatus(id,status, callback) {
      let query =`UPDATE course SET status=?
                  WHERE id=?;`;
      try {
          db.query(query,[status,id], (err, response)=>{
              if (err) {
                  return callback({
                      status: false,
                      message: 'Internal error',
                  });
              }   
              if(response.affectedRows !== 0){
                  return callback({
                      status: true,
                      message:'Course-status Updated successfully'
                  });
              } else {
                return callback({
                  status: false,
                  message: "Failed to update course-status"
                })
              }
          })
      } catch (err) { 
          return callback({
              status: false,
              message: 'System Error'});
      }
  }
   
    // --------------------------END COURSE SECTION------------------------------


}

module.exports = course_db