var mysql  = require('mysql'); 
var express = require('express');
var nodemailer = require('nodemailer');
// var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var dateFormat = require('dateformat');

const dotenv = require('dotenv');
dotenv.config();
console.log(`Your port is ${process.env.PORT}`); // 8626

const port = process.env.PORT || 3500;

var connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB
});

let transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERV,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

var app = express();
var jobsnuEmail = 'jobsnu.se@gmail.com';
var verificationEmailSubject =  'JOBSNU - E-mail Verification';
var otpEmailSubject = 'JOBSNU - One-Time Password for Login'

connection.connect();

// app.use(express.static('./jobsnu/build'));
app.use(express.static(path.join(__dirname, "jobsnu", "build")));
// app.use(session({
//     secret: process.env.SESS_SECRET,
//     resave: true,
//     saveUninitialized: true
// }));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// HELPER FUNCTIONS

function createMessage(htmlMessage, fromId, toId, subject)
{
    let message = {
        from: fromId,
        to: toId,
        subject: subject,
        html: htmlMessage
    };
    return message;
}

function sendMessage(message)
{
    transporter.sendMail(message, function(err, info) {
        if (err) {
            console.log("ERROR IN SENDING MAIL.");
            console.log(err)
        } else {
            console.log("SUCCESSFULLY SENT MAIL.");
            console.log("MAIL INFO\n"+info);
        }
    });
}

// POST ROUTER FUNCTIONS

app.post('/applyJob', function (request,response) {
    let userId = request.body.user.userId;
    let jobId = request.body.user.jobId;

    insertSql = "insert into job_application(user_profile_id, job_post_id, application_date) VALUES (?,?,CURDATE())";
    insertSqlParams = [userId, jobId];
    connection.query(insertSql, insertSqlParams, function (selectErr, selectResult, selectFields) {
        if (selectErr) {
            var postResponse = {
                "dbError": 1,
                "jobApplied": 0
            }

            console.log("Error in applying for job. See below for detailed error information.\n" + selectErr.message)
            console.log("-----DATABASE CONNECTIVITY ERROR-----\nKindly contact ADMIN.\n");
            response.send(JSON.stringify(postResponse));
        } else {
            var postResponse = {
                "dbError": 0,
                "jobApplied": 1,
                "jobId": jobId,
                "userId": userId
            }

            console.log("-----------User " + userId +
                " applied to job " + jobId +
                " successfully------------\n");
            response.send(JSON.stringify(postResponse));
        }
    });

    console.log("-----UNKNOWN ERROR-----\nKindly contact ADMIN to escalate issue to DEV team.\n");
    response.redirect("error.html");
});

app.post('/createJob', function (req, res) {
    let jobName = req.body.user.jobName;
    let postedByUserId = req.body.user.userId;
    let companyId = req.body.user.companyId;
    let jobDomain = req.body.user.jobDomain;
    let companyIndustry = req.body.user.companyIndustry;
    let jobFunction = req.body.user.jobFunction;
    let jobDescription = req.body.user.jobDescription;
    let city = req.body.user.city;
    let state =  req.body.user.state;
    let country =  req.body.user.country;
    let jobType = req.body.user.jobType;
    let isActive = req.body.user.isActive;
    let skills = req.body.user.skills;
    let skillLevel = req.body.user.skillLevel;

    var insertSql = 'INSERT INTO job_post(job_name, posted_by_id, company_id, domain, industry, function, description, city, state, country, job_type) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
    var insertSqlParams = [jobName, postedByUserId, companyId, jobDomain, companyIndustry, jobFunction, jobDescription, city, state, country, jobType];
    connection.query(insertSql,insertSqlParams, function (err, result)
    {
        if(err) {
            console.log('[INSERT ERROR] - ',err.message);
            var response = {
                "jobAdded": 0,
                "jobId": null
            };

            console.log("----------Error while creating job.\n-----------\n");
            console.log(response);
            res.send(JSON.stringify(response));
        }
        else
        {
            let jobId = result.insertId;
            insertSql = "INSERT INTO jp_skill_set(job_post_id, skill_level) VALUES (?,?)";
            insertSqlParams = [jobId, skillLevel];
            // TO DO - enter data in jp_skill_set table
            var response = {
                "jobAdded": 1,
                "jobId": jobId
            };

            console.log("----------Job created successfully-----------\n");
            console.log(response);
            res.send(JSON.stringify(response));
        }
    });
    console.log("-----UNKNOWN ERROR-----\nKindly contact ADMIN to escalate issue to DEV team.\n");
});

app.post('/login', function(request, response){
    let userEmail = request.body.user.email;
    console.log("REQUEST.BODY\n"+ request.body);
    console.log("REQUEST - Email: "+userEmail);

    selectSql = "select * from user_profile where email = '" + userEmail +"'";
    connection.query(selectSql, function (selectErr, selectResult) {
        if (selectErr) {
            var loginResponse = {
                "dbError" : 1,
                "invalid": 0,
                "verified": 1,
                "userId": null,
                "username": null,
                "isRecruiter": null
            }

            console.log("Error fetching user details. See below for detailed error information.\n" + selectErr.message)
            console.log("-----DATABASE CONNECTIVITY ERROR-----\nKindly contact ADMIN.\n");
            response.send(JSON.stringify(loginResponse));
        }
        else if (selectResult == '') {
            // return 0;
            var loginResponse = {
                "dbError" : 0,
                "invalid": 0,
                "verified": 1,
                "userId": null,
                "username": null,
                "isRecruiter": null
            }

            console.log("-----DATABASE ENTRY ERROR-----\nKindly contact ADMIN.\n")
            response.send(JSON.stringify(loginResponse));
        }
        else {
            // Set session variables
            // request.session.loggedIn = true;
            // request.session.userId = selectResult[0].id;
            // request.session.username = selectResult[0].first_name;

            // console.log("-----------SESSION DETAILS-----------\n" + request.session.loggedIn + "\n" + request.session.userId + "\n" + request.session.username);

            var loginResponse = {
                "dbError" : 0,
                "invalid": 0,
                "verified": 1,
                "userId": selectResult[0].userId,
                "username": selectResult[0].first_name,
                "isRecruiter": selectResult[0].is_recruiter
            }

            console.log("-----------Login successful!------------\nLogging in user " + selectResult[0].first_name);
            response.send(JSON.stringify(loginResponse));
        }
    });

    console.log("-----UNKNOWN ERROR-----\nKindly contact ADMIN to escalate issue to DEV team.\n");
});

app.post('/mfaLogin', function (req,res) {
    console.log(req.body.user)
    let email = req.body.user.email;
    let password = req.body.user.password;
    let otp = req.body.user.otp;

    console.log("In LOGIN");
    var selectSQL = "select email, password, verified, mfa_enabled from login where email = '" + email + "' and password = '" + password + "'";
    // var  addSqlParams = [req.query.emailid,req.query.password];
    connection.query(selectSQL, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        console.log(result)
        if (result == '') {
            console.log("Invalid credentials.");
            let response = {
                "invalid" : 1
            }
            res.send(JSON.stringify(response));
        }
        else if(!result[0].verified)    // User has not yet verified their email account
        {
            // User E-mail ID Verification
            let response = {
                "invalid" : 0,
                "verified" : 0,
                "otp" : otp
            }
            console.log(response);
            res.send(JSON.stringify(response));
        }
        else {
            // selectSQL2 = "SELECT id FROM user_profile where "
            if (result[0].mfa_enabled) {

                console.log("IN VERIFIED & MFA_ENABLED");

                let htmlMessageString =
                    "<html>" +
                    "<head>" +
                    "<title>" + otpEmailSubject + "</title>" +
                    "</head>" +
                    "<body>" +
                    "<div style=\"text-align: center\">" +
                    "<br><br><br><br>" +
                    "</div>" +
                    "<div style=\"margin:0 auto; width:600px; height:600px; text-align: center；\">" +
                    "<div style=\"margin:0 auto; width:600px; height:30px; text-align: center; background-color:#E7717D \"> " +
                    "</div>" +
                    "<div style=\" text-align: center; margin:0 auto;  width:600px; height:200px; background-color:#C2CAD0 \">" +
                    "<img src=\"https://cdn.pixabay.com/photo/2015/01/08/18/26/write-593333_1280.jpg\" " +
                    "height = \"250px\"  width=\"600px text-align: center\">" +
                    "</div>" +
                    "<div style=\"margin:0 auto; width:600px; height:370px; text-align: center;background-color:#C2CAD0 \">" +
                    "</div>" +
                    "<div style=\"position:absolute;left:580px;top:560px; width: 150px; height: 60px; display: block; color: #fff;background: #AFD275; font-size: 24px; line-height: 50px;text-align: center; \">" +
                    otp +
                    "</div>" +
                    "<div style=\" position:absolute;left:450px;top:450px; width:400px; height:300px; text-align: center; \">" +
                    "<p style=\" width:400px; height:300px; text-align: center；\">Kindly use the OTP below to log in to Jobsnu.<p>" +
                    "</div>" +
                    "<div style=\" font-size: 1px; position:absolute;left:352px;top:700px; width:600px; height:40px; background-color:#7E685A \"> " +
                    "*Terms & conditions apply."
                "Do not share your the OTP or other personal details, such as user ID/password, with anyone, either over phone or through email." +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
                let otpMessage = createMessage(htmlMessageString, jobsnuEmail, email, otpEmailSubject);
                sendMessage(otpMessage);

                var response = {
                    "invalid": 0,
                    "verified": 1,
                    "otp": otp,
                    "email": result[0].email
                }

                console.log("***************\nMFA RESPONSE\n***************\n" + JSON.stringify(response));
                res.send(JSON.stringify(response));
            }
            else
            {
                var response = {
                    "invalid": 0,
                    "verified": 1,
                    "otp": -1,
                    "email": result[0].email
                }
                console.log("IN VERIFIED & !MFA_ENABLED");
                console.log("***************\nLOGIN WITHOUT MFA RESPONSE\n***************\n" + JSON.stringify(response));
                // res.send(JSON.stringify(response));
                res.redirect(307, '/login');
            }
        }
    });
});

app.post('/register', function (req, res) {
    let email = req.body.user.email;
    let firstName = req.body.user.firstName;
    let lastName = req.body.user.lastName;
    let dob = req.body.user.dob;
    let gender = req.body.user.gender;
    let primaryContact = req.body.user.primaryContact;
    let secondaryContact = req.body.user.secondaryContact;

    let insertSql = 'INSERT INTO user_profile(email, first_name, ' +
        'last_name, dob, gender, primary_contact, secondary_contact, ' +
        'registration_date,	is_recruiter) VALUES(?,?,?,?,?,?,?,CURDATE(),0)';
    let insertSqlParams = [email, firstName, lastName, dob, gender, primaryContact, secondaryContact];
    connection.query(insertSql,insertSqlParams, function (err, result)
    {
        if(err) {
            console.log('[INSERT ERROR] - ',err.message);
            res.end("0");
            return;
        }

        console.log("User added successfully.\n" + result);
    });

    var response = {
        "email": email,
        "firsName":firstName,
        "lastName":lastName,
        "dob": dob,
        "gender": gender,
        "primaryContact": primaryContact,
        "secondaryContact": secondaryContact
    };
    // should show profile saved message/saved profile details
    console.log(response);
    res.end(JSON.stringify(response));
});

app.post('/setEducation', function (req, res) {
    let userId = req.body.education.userId;
    let eduLevel = req.body.education.eduLevel;
    let eduField = req.body.education.eduField;
    let institute = req.body.education.institute;
    let startDate = req.body.education.startDate;
    let endDate = req.body.education.endDate;
    let percentage = req.body.education.percentage;

    let insertSql = 'INSERT INTO education(user_profile_id, education_level, field, institute, ' +
        'start_date, end_date, percentage) VALUES (?,?,?,?,?,?,?)';
    let insertSqlParams = [userId, eduLevel, field, institute, dateFormat(startDate,"UTC:yyyy-mm-dd"), dateFormat(endDate, "UTC:yyyy-mm-dd"), percentage];

    connection.query(insertSql,insertSqlParams, function (insertError, insertResult)
    {
        if(insertError) {
            console.log('[INSERT ERROR] - EDUCATION DETAILS', insertError.message);
            return;
        }

        console.log("Education details added successfully.\n", insertResult);

        var responseJson = {
            "userId": req.body.education.userId,
            "eduLevel" : req.body.education.eduLevel,
            "eduField" : req.body.education.eduField,
            "institute" : req.body.education.institute,
            "startDate" : req.body.education.startDate,
            "endDate" : req.body.education.endDate,
            "percentage" : req.body.education.percentage
        };
        // should show profile saved message/saved profile details
        console.log("------------EDUCATION DETAILS RESPONSE----------\n"+responseJson);
        res.end(JSON.stringify(responseJson));
    });
});

app.post('/setMfa', function (request,response) {
    let mfaEnabled = req.body.user.mfa;
    // let userId = request.body.user.userId;
    // let userId = request.session.userId;

    updateSql = "update login set mfa_enabled = " + mfaEnabled;
    connection.query(v, function (updateErr, updateResult, updateFields) {
        if (updateErr) {
            var setMfaResponse = {
                "dbError" : 1,
                "mfaSet": 0
            }

            console.log("Error updating MFA details. See below for detailed error information.\n" + updateErr.message)
            console.log("-----DATABASE CONNECTIVITY ERROR-----\nKindly contact ADMIN.\n");
            response.send(JSON.stringify(setMfaResponse));
        }
        else {
            var setMfaResponse = {
                "dbError" : 0,
                "mfaSet": 1
            }

            console.log("-----------MFA enabled/disabled.------------\n");
            response.send(JSON.stringify(setMfaResponse));
        }
    });

    console.log("-----UNKNOWN ERROR-----\nKindly contact ADMIN to escalate issue to DEV team.\n");
    // response.send(JSON.stringify(errorResonse));
    response.redirect("error.html");
});

app.post('/set_verification_status', function (req, res) {
    let isVerified = req.body.user.isVerified;
    let email = req.body.user.email;
    let password = req.body.user.password;

    if(isVerified) {    // if user is verified (OTP entered was correct)
        // Change verification status of user in login table
        let  sqlQuery = 'UPDATE login SET verified = ? where email = ? and password = ?' ;
        let  sqlQueryParams = [isVerified, email, password];

        connection.query(sqlQuery, sqlQueryParams,
            function (err, result)
            {
                if(err){
                    console.log('[UPDATE ERROR] - ',err.message);
                    res.send(err.message);
                    return;
                }
                console.log(result);
            });

        let response = {
            "verified" : 1
        }

        console.log("OK");

        console.log(response);
        res.send(JSON.stringify(response));
        // res.send(response);
    }
    else
    {
        let response = {
            'verified' : 0
        }
        res.send(JSON.stringify(response))
    }
    // console.log(response);
});

app.post('/setWorkExperience', function (req, res) {
    let userId = req.body.work.userId;
    let startDate = req.body.work.startDate;
    let endDate = req.body.work.endDate;
    let company = req.body.work.company;
    let description = req.body.work.description;
    let designation = req.body.work.designation;
    let location = req.body.work.location;

    let insertSql = 'INSERT INTO work_experience(user_profile_id, start_date, end_date, ' +
        'company, description, designation, location) VALUES (?,?,?,?,?,?,?)';
    let insertSqlParams = [userId, dateFormat(startDate, "UTC:yyyy-mm-dd"), dateFormat(endDate, "UTC:yyyy-mm-dd"), company, description, designation, location];

    connection.query(insertSql,insertSqlParams, function (insertError, insertResult)
    {
        if(insertError) {
            console.log('[INSERT ERROR] - WORK EXPERIENCE DETAILS', insertError.message);
            // res.end("0");
            return;
        }

        console.log("Work experience details added successfully.\n", insertResult);

        var responseJson = {
            "userId" : userId,
            "startDate" : startDate,
            "endDate" : endDate,
            "company" : company,
            "description" : description,
            "designation" : designation,
            "location" : location
        };
        // should show profile saved message/saved profile details
        console.log("------------WORK EXPERIENCE RESPONSE----------\n"+responseJson);
        res.end(JSON.stringify(responseJson));
    });
});

app.post('/verify', function (req, res) {
    console.log(req.body);
    let email = req.body.user.email;
    let password = req.body.user.password;
    let otp = req.body.user.otp;

    // Add user to login table
    let  addSql = 'INSERT INTO login (email, password, otp) VALUES(?, ?, ?)';
    let  addSqlParams = [email, password, otp];

    connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
            console.log('[INSERT ERROR] - VERIFY',err.message);
            res.end("0");
            return;
        }

        let htmlMessageString =
            "<html>" +
            "<head>" +
            "<title>" + verificationEmailSubject + "</title>" +
            "</head>" +
            "<body>" +
            "<div style=\"text-align: center\">" +
            "<br><br><br><br>" +
            "</div>" +
            "<div style=\"margin:0 auto; width:600px; height:600px; text-align: center；\">" +
            "<div style=\"margin:0 auto; width:600px; height:30px; text-align: center; background-color:#E7717D \"> " +
            "</div>" +
            "<div style=\" text-align: center; margin:0 auto;  width:600px; height:200px; background-color:#C2CAD0 \">" +
            "<img src=\"https://cdn.pixabay.com/photo/2015/01/08/18/26/write-593333_1280.jpg\" height = \"250px\"  width=\"600px text-align: center\">" +
            "</div>" +
            "<div style=\"margin:0 auto; width:600px; height:370px; text-align: center;background-color:#C2CAD0 \">" +
            "</div>" +
            "<div style=\"position:absolute;left:580px;top:560px; width: 150px; height: 60px; display: block; color: #fff;background: #AFD275; font-size: 24px; line-height: 50px;text-align: center; \">" +
            otp +
            "</div>" +
            "<div style=\" position:absolute;left:450px;top:450px; width:400px; height:300px; text-align: center; \">" +
            "<p style=\" width:400px; height:300px; text-align: center；\">" +
            "                   Kindly use the code below to complete your registration process on Jobsnu.<p>" +
            "</div>" +
            "<div style=\" font-size: 1px; position:absolute;left:352px;top:700px; width:600px; height:40px; background-color:#7E685A \"> " +
            "*Terms & conditions apply."
        "Do not share your the OTP or other personal details, such as user ID/password, with anyone, either over phone or through email." +
        "</div>" +
        "</div>" +
        "</body>" +
        "</html>";
        let verificationMessage = createMessage(htmlMessageString, jobsnuEmail, email, verificationEmailSubject);
        sendMessage(verificationMessage);

        // Output JSON format
        var response = {
            "email": email,
            "password": password,
            "verified": 0,        // 0: Not verified, 1: Verified; becomes 1 after verification
            "otp": otp
        };

        console.log("OK");
        console.log(result);
        console.log(response);

        //res.end(JSON.stringify(response));
        res.send(response);
    });

    // console.log(response);
});

// GET ROUTER FUNCTIONS

app.get('/jobPosts', function (request,response) {

    // let userId = request.body.user.userId;

    // selectSql = "select * from job_post";
    selectSql = "SELECT jp.*, jp_ss.skill_level, e.user_name, ss.skill_name " +
        "FROM job_post as jp " +
        "INNER JOIN jp_skill_set as jp_ss " +
        "ON jp.id=jp_ss.job_post_id INNER JOIN employer as e " +
        "ON jp.company_id = e.id INNER JOIN skill_set as ss " +
        "ON jp_ss.skill_id = ss.id"
    connection.query(selectSql, function (selectErr, selectResult, selectFields) {
        if (selectErr) {
            var responseJson = {
                "dbError" : 1,
                "jobId": null
            }

            console.log("Error fetching job details. See below for detailed error information.\n" + selectErr.message)
            console.log("-----DATABASE CONNECTIVITY ERROR-----\nKindly contact ADMIN.\n");
            response.send(JSON.stringify(responseJson));
        }
        else if (selectResult == '') {
            var responseJson = {
                "dbError" : 0,
                "jobId": null
            }

            console.log("-----DATABASE ENTRY ERROR-----\nKindly contact ADMIN.\n")
            response.send(JSON.stringify(responseJson));
        }
        else {
            console.log("IN JOB POSTS\n");
            // console.log("-----------SESSION DETAILS-----------\n" + request.session.loggedIn + "\n" + request.session.userId + "\n" + request.session.username);

            var jobPostsArr = []
            for(i = 0; i < selectResult.length; i++)
            {
                var jobId = selectResult[i].id;
                var jobType = (selectResult[i].job_type='F')? "Full-Time":"Internship";
                var postedByUserId = selectResult[i].posted_by_id;
                var selectQuery2 = "select CONCAT(first_name, last_name) from user_profile where id = "+ postedByUserId;
                let postedByName;
                connection.query(selectQuery2, function (selectError2, selectResult2) {
                    if(selectError2)
                    {   console.log("----------DB ERROR---------\n"+selectError2.message);
                        return;
                    }
                    postedByName = selectResult2[0].first_name + " " + selectResult2[0].last_name;
                });
                var jsonObj = {
                    "jobId": jobId,
                    "jobName" : selectResult[i].job_name,
                    "postedById": postedByUserId,
                    "postedByName" : postedByName,
                    "companyName" : selectResult[i].user_name,
                    "city": selectResult[i].city,
                    "state" : selectResult[i].state,
                    "country" : selectResult[i].country,
                    "domain": selectResult[i].domain,
                    "industry": selectResult[i].industry,
                    "function": selectResult[i].function,
                    "description": selectResult[i].description,
                    "jobType": jobType,
                    "isActive": selectResult[i].is_active,
                    "skillName" : selectResult[i].skill_name,
                    "skillLevel": selectResult[i].skill_level
                }
                jobPostsArr.push(jsonObj);
            }

            var responseJson = {
                "dbError" : 0,
                "jobPosts" : jobPostsArr
            }

            console.log("-----------Returning job posts------------\n"+responseJson);
            response.send(JSON.stringify(responseJson));
        }
    });

    console.log("-----UNKNOWN ERROR-----\nKindly contact ADMIN to escalate issue to DEV team.\n");
});

app.get('/logout', function(req,res){
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            req.session.loggedIn= false;
            res.redirect('/');
        }
    });
});

app.get('/recruiterJobPosts', function (request,response) {
    let postedByUserId = request.body.user.userId;

    // selectSql = "select * from job_post";
    selectSql = "SELECT jp.*, jp_ss.skill_level, e.user_name, ss.skill_name " +
        "FROM job_post as jp " +
        "INNER JOIN jp_skill_set as jp_ss " +
        "ON jp.id=jp_ss.job_post_id INNER JOIN employer as e " +
        "ON jp.company_id = e.id INNER JOIN skill_set as ss " +
        "ON jp_ss.skill_id = ss.id WHERE posted_by_id = '"+ postedByUserId+ "'";
    connection.query(selectSql, function (selectErr, selectResult, selectFields) {
        if (selectErr) {
            var responseJson = {
                "dbError" : 1,
                "jobId": null
            }

            console.log("Error fetching job details. See below for detailed error information.\n" + selectErr.message)
            console.log("-----DATABASE CONNECTIVITY ERROR-----\nKindly contact ADMIN.\n");
            response.send(JSON.stringify(responseJson));
        }
        else if (selectResult == '') {
            var responseJson = {
                "dbError" : 0,
                "jobId": null
            }

            console.log("-----DATABASE ENTRY ERROR-----\nKindly contact ADMIN.\n")
            response.send(JSON.stringify(responseJson));
        }
        else {
            console.log("IN JOB POSTS\n");
            // console.log("-----------SESSION DETAILS-----------\n" + request.session.loggedIn + "\n" + request.session.userId + "\n" + request.session.username);

            var jobPostsArr = []
            for(i = 0; i < selectResult.length; i++)
            {
                var jobId = selectResult[i].id;
                var jobType = (selectResult[i].job_type='F')? "Full-Time":"Internship";
                var postedByUserId = selectResult[i].posted_by_id;
                var selectQuery2 = "select CONCAT(first_name, last_name) from user_profile where id = "+ postedByUserId;
                let postedByName;
                connection.query(selectQuery2, function (selectError2, selectResult2) {
                    if(selectError2)
                    {   console.log("----------DB ERROR---------\n"+selectError2.message);
                        return;
                    }
                    postedByName = selectResult2[0].first_name + " " + selectResult2[0].last_name;
                });
                var jsonObj = {
                    "jobId": jobId,
                    "jobName" : selectResult[i].job_name,
                    "postedById": postedByUserId,
                    "postedByName" : postedByName,
                    "companyName" : selectResult[i].user_name,
                    "city": selectResult[i].city,
                    "state" : selectResult[i].state,
                    "country" : selectResult[i].country,
                    "domain": selectResult[i].domain,
                    "industry": selectResult[i].industry,
                    "function": selectResult[i].function,
                    "description": selectResult[i].description,
                    "jobType": jobType,
                    "isActive": selectResult[i].is_active,
                    "skillName" : selectResult[i].skill_name,
                    "skillLevel": selectResult[i].skill_level
                }
                jobPostsArr.push(jsonObj);
            }

            var responseJson = {
                "dbError" : 0,
                "jobPosts" : jobPostsArr
            }

            console.log("-----------Returning job posts------------\n"+responseJson);
            response.send(JSON.stringify(responseJson));
        }
    });

    console.log("-----UNKNOWN ERROR-----\nKindly contact ADMIN to escalate issue to DEV team.\n");
});

app.get('/recruiterJobPostApplicants', function (request,response) {
    let postedByUserId = request.body.user.userId;
    let jobId = request.body.user.jobId;

    selectSql = "SELECT job_application.*, user_profile.email, " +
        "CONCAT(user_profile.first_name, \" \", user_profile.last_name) AS user_name " +
        "FROM job_application " +
        "INNER JOIN user_profile " +
        "ON user_profile.id = job_application.user_profile_id " +
        "WHERE job_application.job_post_id = " + jobId;
    connection.query(selectSql, function (selectErr, selectResult, selectFields) {
        if (selectErr) {
            var responseJson = {
                "dbError" : 1,
                "jobId": null
            }

            console.log("Error fetching job applicant details. See below for detailed error information.\n" + selectErr.message)
            console.log("-----DATABASE CONNECTIVITY ERROR-----\nKindly contact ADMIN.\n");
            response.send(JSON.stringify(responseJson));
        }
        else if (selectResult == '') {
            var responseJson = {
                "dbError" : 0,
                "jobId": null
            }

            console.log("-----DATABASE ENTRY ERROR-----\nKindly contact ADMIN.\n")
            response.send(JSON.stringify(responseJson));
        }
        else
        {
            var jobApplicantsArr = []
            for(i = 0; i < selectResult.length; i++)
            {
                var applicantId = selectResult[i].user_profile_id;
                var applicantName = selectResult[i].user_name;
                var applicantEmail = selectResult[i].email;
                var appliedOn = dateFormat(selectResult[i].application_date, "UTC:yyyy-mm-dd");

                var jsonObj = {
                    "applicantId" : applicantId,
                    "applicantName" : applicantName,
                    "applicantEmail": applicantEmail,
                    "appliedOn" : appliedOn
                }
                jobApplicantsArr.push(jsonObj);
            }
            
            var responseJson = {
                "dbError" : 0,
                "jobApplicants" : jobApplicantsArr
            }

            console.log("-----------Returning job applicants------------\n"+JSON.stringify(responseJson));
            response.send(JSON.stringify(responseJson));
        }
    });

    console.log("-----UNKNOWN ERROR-----\nKindly contact ADMIN to escalate issue to DEV team.\n");
});

app.get('/showEducation', function (request,response) {
    let userId = request.query.userId;

    selectSql = "select * from education where user_profile_id = " + userId;
    connection.query(selectSql, function (selectErr, selectResult) {
        if (selectErr) {
            var responseJson = {
                "dbError" : 1,
                "userId": null
            }

            console.log("[SELECT ERROR] - EDUCATION DETAILS\n", selectErr.message);
            console.log("Error fetching user details. See below for detailed error information.\n" + selectErr.message)
            console.log("-----DATABASE CONNECTIVITY ERROR-----\nKindly contact ADMIN.\n");
            response.send(JSON.stringify(responseJson));
        }
        else if (selectResult == '') {
            var responseJson = {
                "dbError" : 0,
                "userId": null
            }

            console.log("-----DATABASE ENTRY ERROR-----\nKindly contact ADMIN.\n")
            response.send(JSON.stringify(responseJson));
        }
        else {
            var educationArr = []
            for(i = 0; i < selectResult.length; i++)
            {
                var jsonObj = {
                    "eduLevel" : selectResult[i].education_level,
                    "eduField" : selectResult[i].field,
                    "institute" : selectResult[i].institute,
                    "startDate" : dateFormat(selectResult[i].start_date, "UTC:yyyy-mm-dd"),
                    "endDate" : dateFormat(selectResult[i].end_date, "UTC:yyyy-mm-dd"),
                    "percentage" : selectResult[i].percentage
                }
                educationArr.push(jsonObj);
            }

            var responseJson = {
                "dbError" : 0,
                "userId" : userId,
                "educationList" : educationArr
            }

            console.log("-----------EDUCATION DETAILS------------\n",JSON.stringify(responseJson));
            response.send(JSON.stringify(responseJson));
        }
    });

    console.log("-----UNKNOWN ERROR-----\nKindly contact ADMIN to escalate issue to DEV team.\n");
});

app.get('/showWorkExperience', function (request,response) {
    let userId = request.query.userId;

    selectSql = "select * from work_experience where user_profile_id = " + userId;
    connection.query(selectSql, function (selectErr, selectResult, selectFields) {
        if (selectErr) {
            var responseJson = {
                "dbError" : 1,
                "jobId": null
            }

            console.log("Error fetching job details. See below for detailed error information.\n" + selectErr.message)
            console.log("-----DATABASE CONNECTIVITY ERROR-----\nKindly contact ADMIN.\n");
            response.send(JSON.stringify(responseJson));
        }
        else if (selectResult == '') {
            var responseJson = {
                "dbError" : 0,
                "jobId": null
            }

            console.log("-----DATABASE ENTRY ERROR-----\nKindly contact ADMIN.\n")
            response.send(JSON.stringify(responseJson));
        }
        else {
            var workExperienceArr = []
            for(i = 0; i < selectResult.length; i++)
            {
                var jsonObj = {
                    "userId" : selectResult[i].user_profile_id,
                    "startDate" : dateFormat(selectResult[i].start_date, "UTC:yyyy-mm-dd"),
                    "endDate" : dateFormat(selectResult[i].end_date, "UTC:yyyy-mm-dd"),
                    "company" : selectResult[i].company,
                    "description" : selectResult[i].description,
                    "designation" : selectResult[i].designation,
                    "location" : selectResult[i].location
                }
                workExperienceArr.push(jsonObj);
            }

            var responseJson = {
                "dbError" : 0,
                "workExperiences" : workExperienceArr
            }

            console.log("-----------Returning job posts------------\n"+responseJson);
            response.send(JSON.stringify(responseJson));
        }
    });

    console.log("-----UNKNOWN ERROR-----\nKindly contact ADMIN to escalate issue to DEV team.\n");
});

app.get('/userDetails', function (request,response) {
    let userId = request.query.userId;

    selectSql = "select * from user_profile where id = " + userId;
    connection.query(selectSql, function (selectErr, selectResult) {
        if (selectErr) {
            var loginResponse = {
                "dbError" : 1,
                "userId": null
            }

            console.log("Error fetching user details. See below for detailed error information.\n" + selectErr.message)
            console.log("-----DATABASE CONNECTIVITY ERROR-----\nKindly contact ADMIN.\n");
            response.send(JSON.stringify(loginResponse));
        }
        else if (selectResult == '') {
            // return 0;
            var loginResponse = {
                "dbError" : 0,
                "userId": null
            }

            console.log("-----DATABASE ENTRY ERROR-----\nKindly contact ADMIN.\n")
            response.send(JSON.stringify(loginResponse));
        }
        else {
            // console.log("-----------SESSION DETAILS-----------\n" + request.session.loggedIn + "\n" + request.session.id + "\n" + request.session.username);

            var loginResponse = {
                "dbError" : 0,
                "userId": selectResult[0].id,
                "firstName": selectResult[0].first_name,
                "lastName": selectResult[0].last_name,
                "dob": selectResult[0].dob,
                "gender": selectResult[0].gender,
                "primaryContact": selectResult[0].primary_contact,
                "secondaryContact": selectResult[0].secondary_contact
            }

            console.log("-----------Login successful!------------\nLogging in user " + selectResult[0].first_name);
            response.send(JSON.stringify(loginResponse));
        }
    })

    console.log("-----UNKNOWN ERROR-----\nKindly contact ADMIN to escalate issue to DEV team.\n");
});

// TEST ROUTER FUNCTION

app.get('/test_home', function(request, response) {
	if (request) {
		response.send('Welcome!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "jobsnu", "build", "index.html"));
});

var server = app.listen(port, function () {
  
    var host = server.address().address
    var port = server.address().port
    
    console.log("www.jobs-nu.com/login.html", host, port);
    
  });
