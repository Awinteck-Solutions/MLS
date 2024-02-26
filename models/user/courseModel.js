const db = require('../database')

class Courses{
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


    // USER COURSES -------------
    getUserCourses(user_id, callback) {
        let query = "SELECT * FROM my_courses WHERE user_id=? AND NOT status='DEACTIVE';";
        try {
            let courseList = []
            db.query(query,[user_id], (err, response)=>{
                if (err) {
                    return callback({
                        status: false,
                        message: 'System error',
                    });
                }  
                
                if(response.length == 0){
                    console.log('response', response[0])
                    return callback({
                        status: false,
                        message:'response is null'
                    });
                }
                response.map((value) => {
                    let courseId = value['course_id']
                    this.getSingleCourse(courseId, (res) => {

                        let obj = {
                            course: {
                                ...value,
                                lesson: res.response
                            },
                            
                        }

                        courseList.push(obj)
                   
                        if(0===--response.length){
                            return callback({
                            status: true,
                            message: "User assigned courses",
                            response: courseList,
                            });
                        } 
                    }) 
                })
                
            })
        } catch (err) {
            console.log('Myerr', err)
            return callback({
                status: false,
                message: 'failed password reset'});
        }
    }

     // SINGLE COURSES -------------
     getSingleCourse(course_id, callback) {
        let query = "SELECT * FROM course WHERE id=? AND NOT status='DEACTIVE';";
        try {
            db.query(query,[course_id], (err, response)=>{
                if (err) {
                    return callback({
                        status: false,
                        message: 'System error',
                    });
                }
                if(response.length == 0){
                    console.log('response', response[0])
                    return callback({
                        status: false,
                        message: 'response is null',
                        response: []
                    });
                }
                this.getLesson(course_id, (resp) => {
                    if (resp.status) {
                        return callback({
                            status: true,
                            message: 'All Courses',
                            response: {
                                ...response[0],
                                lesson: resp.response
                            }
                        });
                    } else {
                        return callback({
                            status: true,
                            message: 'All Courses',
                            response:response});
                    }
                })
                
            })
        } catch (err) {
            console.log('Myerr', err)
            return callback({
                status: false,
                message: 'failed password reset'});
        }
     }
    
    // SINGLE LESSON -------------
     getLesson(course_id, callback) {
        let query = "SELECT * FROM lesson WHERE course_id=? AND status='ACTIVE';";
        try {
            db.query(query,[course_id], (err, response)=>{
                if (err) {
                    return callback({ status: false, message: 'error here', });
                }
                if(response.length == 0){
                    console.log('response', response[0])
                    return callback({
                        status: false,
                        message: 'response is null',
                        response: null
                    });
                }
                return callback({
                    status: true,
                    message: 'All Lessons',
                    response:response});
            })
        } catch (err) {
            console.log('Myerr', err)
            return callback({
                status: false,
                message: 'failed password reset'});
        }
    }
   
    // ALL COURSES -------------
    getAllCourse(callback) {
        let query = "SELECT * FROM course WHERE status='ACTIVE';";
        try {
            let courseList = []
            db.query(query, (err, response)=>{
                if (err) {
                    return callback({
                        status: false,
                        message: 'System error',
                    });
                }
                if(response.length == 0){
                    console.log('response', response[0])
                    return callback({
                        status: false,
                        message: 'response is null',
                        response: []
                    });
                }

                response.map((value) => {
                    let courseId = value['id']
                    this.getLesson(courseId, (resp) => {
                            let obj = {
                                course: {
                                    ...value,
                                    lesson: resp.response
                                },
                                
                            }

                            courseList.push(obj)
                    
                            if(0===--response.length){
                                return callback({
                                status: true,
                                message: "All courses",
                                response: courseList,
                                });
                            }   
                    })
                    
            })
                
            })
        } catch (err) {
            console.log('Myerr', err)
            return callback({
                status: false,
                message: 'failed password reset'});
        }
     }

   
 

}

module.exports = Courses;