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

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password : process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB,
    multipleStatements: true,
    connectionLimit: 50
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
var otpEmailSubject = 'JOBSNU - One-Time Password for Login';
var applicationEmailJsSubject = 'JOBSNU - Job Application Submitted';
var applicationEmailRecSubject = "JOBSNU - New Application Received"

var connection;


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

function calculateWorkEx(noOfMonths)
{
    let workExNoOfYears = parseInt(noOfMonths/12);
    let workExNoOfMonths = noOfMonths%12;

    return workExNoOfYears+ " years, "+ workExNoOfMonths+" months";
}

function createEmailHtmlJs(messageJson)
{
    let htmlMessage = '<!DOCTYPE html>'+
        '<html lang="en">'+
        '<head>'+
        '    <meta charset="UTF-8">'+
        '    <title>Job Application Information</title>'+
        '</head>'+
        '<body>'+
        '   <h4>Job application successfully submitted.</h4>'+
        '   <p>Please find below the details of your job application</p>'+
        '   <div class="row">'+
        '       <div class="col-sm-8">'+
        '           <div class="container">'+
        '                <h2>'+messageJson.jobName+'</h2>'+
        '                <table class="table">'+
        '                    <tr>'+
        '                       <td>Company</td>'+
        '                       <td>'+messageJson.company+'</td>'+
        '                    </tr>'+
        '                    <tr>'+
        '                       <td>Job Description</td>'+
        '                       <td>'+messageJson.jobFunction+'</td>'+
        '                    </tr>'+
        '                    </tr>'+
        '                    <tr>'+
        '                       <td>Location</td>'+
        '                       <td>'+messageJson.location+'</td>'+
        '                    </tr>'+
        '                </table>'+
        '               </div>'+
        '           </div>'+
        '           <div class="col-sm-4">'+
        '               <img src="url(url_for_company_logo)" alt="'+messageJson.company+'">'+
        '           </div>'+
        '    </div>'+
        '</body>'+
        '</html>';

    sendMessage(createMessage(htmlMessage, jobsnuEmail, messageJson.jobSeekerEmail, applicationEmailJsSubject));
}

function createEmailHtmlRec(messageJson)
{
    let htmlMessage = '<!DOCTYPE html>'+
        '<html lang="en">'+
        '<head>'+
        '    <meta charset="UTF-8">'+
        '    <title>Applicant Information for Your Job Post</title>'+
        '</head>'+
        '<body>'+
        '   <h4>A user recently applied to your job '+messageJson.jobName +'</h4>'+
        '   <p>Please find below their application details.</p>'+
        '   <div class="row">'+
        '       <div class="col-sm-8">'+
        '           <div class="container">'+
        '                <h2>'+messageJson.applicantName+'</h2>'+
        '                <table class="table">'+
        '                    <tr>'+
        '                       <td>Email</td>'+
        '                       <td>'+messageJson.applicantEmail+'</td>'+
        '                    </tr>'+
        '                    <tr>'+
        '                       <td>Skill Set</td>'+
        '                       <td>'+messageJson.applicantSkills+'</td>'+
        '                    </tr>'+
        '                    </tr>'+
        '                    <tr>'+
        '                       <td>Work Experience</td>'+
        '                       <td>'+messageJson.workEx+'</td>'+
        '                    </tr>'+
        '                </table>'+
        '               </div>'+
        '           </div>'+
        '    </div>'+
        '</body>'+
        '</html>';

    sendMessage(createMessage(htmlMessage, jobsnuEmail, messageJson.recruiterEmail, applicationEmailRecSubject));
}

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

function sendEmailNotifJS(jobSeekerId, jobAppliedId)
{
    console.log("Sending email notification to user " + jobSeekerId);
    selectSql1 = "SELECT email from user_profile WHERE id ="+ jobSeekerId;
    pool.query(selectSql1, function (selectErr1, selectResult1) {
        if (selectErr1) {
            console.log("Error fetching user details. See below for detailed error information.\n" + selectErr1.message);
            console.log("-----DATABASE CONNECTIVITY ERROR-----\nKindly contact ADMIN.\n");
            return;
        } else if (selectResult1 == '') {
            console.log("-----DATABASE ENTRY ERROR-----\nKindly contact ADMIN.\n" + JSON.stringify(responseJson));
            return;
        } else {
            let jobSeekerEmail = selectResult1[0].email;

            let selectSql2 = "SELECT job_post.job_name, employer.user_name, " +
                "job_post.function, job_post.city, job_post.state," +
                " job_post.country FROM job_post " +
                "INNER JOIN employer ON employer.id = job_post.company_id " +
                "INNER JOIN job_application ON job_application.job_post_id = job_post.id " +
                "WHERE job_application.user_profile_id = "+jobSeekerId+ " AND job_application.job_post_id = "+jobAppliedId;

            pool.query(selectSql2, function (selectErr2, selectResult2) {
                if (selectErr2) {
                    console.log("-----DATABASE ERROR-----\nError fetching job details. See below for detailed error information.\n");
                    console.log("Error in query " + selectErr2.message);
                    return;
                }

                let htmlMessageJson = {
                    "jobSeekerEmail" : jobSeekerEmail,
                    "jobName": selectResult2[0].job_name,
                    "company": selectResult2[0].user_name,
                    "jobFunction" : selectResult2[0].function,
                    "location": selectResult2[0].city+", "+selectResult2[0].state+", "+selectResult2[0].country
                };

                createEmailHtmlJs(htmlMessageJson);

                var responseJson = {
                    "dbError": 0,
                    "userId": jobSeekerId,
                    "jobId": jobAppliedId,
                    "notificationSent": 1
                };

                console.log("-----------Email Notification Sent------------\n" + JSON.stringify(responseJson));
                return;
            });
        }
    });
}

function sendEmailNotifRec(applicantId, jobId)
{
    let selectSql1 = "SELECT email from user_profile where id = (SELECT posted_by_id " +
        "from job_post WHERE id = "+jobId+");SELECT job_name, posted_by_id from job_post where id ="+jobId;
    pool.query(selectSql1, function (selectErr1, selectResult1) {
        if (selectErr1) {
            console.log("Error fetching recruiter details. See below for detailed error information.\n" + selectErr.message);
            console.log("-----DATABASE CONNECTIVITY ERROR-----\nKindly contact ADMIN.\n");
            return;
        } else {
            // console.log("selectResult1: "+ JSON.stringify(selectResult1));
            let recruiterEmail = selectResult1[0][0].email;
            let jobName = selectResult1[1][0].job_name;
            // console.log("RECRUITER EMAIL: "+recruiterEmail);
            let selectSqls = "SELECT js_skill_set.user_profile_id, js_skill_set.skill_id, " +
                "skill_set.skill_name, user_profile.email, user_profile.first_name, " +
                "user_profile.last_name FROM js_skill_set " +
                "JOIN skill_set ON skill_set.id = js_skill_set.skill_id " +
                "JOIN user_profile ON user_profile.id = js_skill_set.user_profile_id " +
                "where js_skill_set.user_profile_id = "+applicantId+";" +
                "SELECT PERIOD_DIFF(EXTRACT(YEAR_MONTH FROM end_date), EXTRACT(YEAR_MONTH FROM start_date)) + " +
                "(CASE WHEN ABS((DAY(end_date)-DAY(start_date)) > 15) THEN 1 ELSE 0 END) as num_of_months " +
                "from work_experience where user_profile_id = "+applicantId;

            pool.query(selectSqls, function (selectErrs, selectResults) {
                if (selectErrs) {
                    console.log("-----DATABASE ERROR-----\nError fetching job details. See below for detailed error information.\n");
                    console.log("Error in query " + selectErrs.message);
                    return;
                }

                let applicantSkills = "";
                for(i in selectResults[0]){
                    let skill = JSON.stringify(selectResults[0][i].skill_name).split('"').join('');
                    applicantSkills += skill +", ";
                }

                let numOfMonths = 0;
                for (i in selectResults[1]){
                    numOfMonths += parseInt(selectResults[1][i].num_of_months);
                }
                let workEx = calculateWorkEx(numOfMonths);
                let htmlMessageJson = {
                    "recruiterEmail" : recruiterEmail,
                    "jobName": jobName,
                    "applicantId" : applicantId,
                    "applicantEmail" : selectResults[0][0].email,
                    "applicantName": selectResults[0][0].first_name + " "+ selectResults[0][0].last_name,
                    "applicantSkills" : applicantSkills.substring(0, applicantSkills.length - 2).trim('"'),
                    "workEx" : workEx
                };
                // console.log("htmlMessageJson "+JSON.stringify(htmlMessageJson));
                createEmailHtmlRec(htmlMessageJson);

                var responseJson = {
                    "dbError": 0,
                    "jobId": jobId,
                    "applicantId" : applicantId,
                    "applicantName": selectResults[0][0].first_name + " "+ selectResults[0][0].last_name,
                    "recruiterEmail" : recruiterEmail,
                    "notificationSent": 1
                }

                console.log("-----------Email Notification Sent------------\n" + JSON.stringify(responseJson));
                return;
            });
        }
    });
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
    pool.query(insertSql, insertSqlParams, function (selectErr, selectResult, selectFields) {
        if (selectErr) {
            var postResponse = {
                "dbError": 1,
                "jobApplied": 0,
                "emailSent" : false
            }

            console.log("Error in applying for job. See below for detailed error information.\n" + selectErr.message)
            console.log("-----DATABASE CONNECTIVITY ERROR-----\nKindly contact ADMIN.\n");
            response.send(JSON.stringify(postResponse));
        } else {
            sendEmailNotifJS(userId, jobId);
            sendEmailNotifRec(userId, jobId);

            var postResponse = {
                "dbError": 0,
                "jobApplied": 1,
                "jobId": jobId,
                "userId": userId,
                "emailsSent" : true
            }

            console.log("-----------User " + userId +
                " applied to job " + jobId +
                " successfully------------\n");
            response.send(JSON.stringify(postResponse));
        }
    });


});

app.post('/createJob', function (req, res) {
    let jobName = req.body.job.jobName;
    let postedByUserId = req.body.job.userId;
    let jobDomain = req.body.job.jobDomain;
    let companyIndustry = req.body.job.companyIndustry;
    let jobFunction = req.body.job.jobFunction;
    let jobDescription = req.body.job.jobDescription;
    let city = req.body.job.city;
    let state =  req.body.job.state;
    let country =  req.body.job.country;
    let jobType = req.body.job.jobType;
    let skills = req.body.job.skills;
    let skillsArr = skills.split(',');

    let jobTypeVal;
    if(jobType == "Internship" || jobType == "I")
        jobTypeVal = "I";
    else if(jobType == "Full-Time" || jobType == "F")
        jobTypeVal = "F";
    else if(jobType == "Part-Time" || jobType == "P")
        jobTypeVal = "P";

    let sql = "INSERT INTO job_post(job_name, posted_by_id, company_id, domain, industry, function," +
        " description, city, state, country, job_type_id) VALUES (?,?,(select current_company_id " +
        "from job_seeker_profile where user_profile_id="+parseInt(postedByUserId)+"),?,?,?,?,?,?,?,?);"
    let sqlParams = [jobName, postedByUserId, jobDomain,
        companyIndustry, jobFunction, jobDescription, city, state, country, jobTypeVal];
    pool.query(sql,sqlParams, function (selectError, selectResult)
    {
        if(selectError) {
            throw selectError;
        }

        jobId = selectResult.insertId;

        for (let i=0; i < (skillsArr.length); i++) {
            pool.query("SELECT id from skill_set where lower(skill_name)= ?", [skillsArr[i].toLowerCase().trim()], function (selErr, selRes) {
                if(selErr)
                    throw selErr;

                let skillId = selRes[0].id;
                pool.query("insert into jp_skill_set(job_post_id, skill_id) values (?, ?)", [jobId, skillId], function (insErr, insRes) {
                    if(insErr)
                        throw insErr;
                    console.log("-----Updated skill set for new job post in DB-----");
                });
            });
        }

        var response = {
            "jobAdded": 1,
            "jobId": jobId
        };

        console.log("----------Job created successfully-----------");
        console.log(response);
        res.send(JSON.stringify(response));
    });
});

app.post('/login', function(request, response){
    let userEmail = request.body.user.email;
    console.log("REQUEST.BODY\n"+ request.body);
    console.log("REQUEST - Email: "+userEmail);

    let selectSql = "select * from user_profile where email = '" + userEmail +"';";
    pool.query(selectSql, function (selectErr, selectResult) {
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
});

app.post('/mfaLogin', function (req,res) {
    console.log(req.body.user)
    let email = req.body.user.email;
    let password = req.body.user.password;
    let otp = req.body.user.otp;

    console.log("In LOGIN");
    var selectSQL = "select email, password, verified, mfa_enabled from login where email = '" + email + "' and password = '" + password + "'";
    // var  addSqlParams = [req.query.emailid,req.query.password];
    pool.query(selectSQL, function (err, result) {
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
    pool.query(insertSql,insertSqlParams, function (err, result)
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

    pool.query(insertSql,insertSqlParams, function (insertError, insertResult)
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
    pool.query(v, function (updateErr, updateResult, updateFields) {
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
});

app.post('/set_verification_status', function (req, res) {
    let isVerified = req.body.user.isVerified;
    let email = req.body.user.email;
    let password = req.body.user.password;

    if(isVerified) {    // if user is verified (Verification OTP entered was correct)
        // Change verification status of user in login table
        let  sqlQuery = 'UPDATE login SET verified = ? where email = ? and password = ?' ;
        let  sqlQueryParams = [isVerified, email, password];

        pool.query(sqlQuery, sqlQueryParams,
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

    pool.query(insertSql,insertSqlParams, function (insertError, insertResult)
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

    pool.query(addSql,addSqlParams,function (err, result) {
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
    let selectSql = "SELECT jp.*, e.user_name, ss.skill_name " +
        "FROM job_post as jp " +
        "INNER JOIN jp_skill_set as jp_ss " +
        "ON jp.id=jp_ss.job_post_id INNER JOIN employer as e " +
        "ON jp.company_id = e.id INNER JOIN skill_set as ss " +
        "ON jp_ss.skill_id = ss.id"
    pool.query(selectSql, function (selectErr, selectResult, selectFields) {
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
                pool.query(selectQuery2, function (selectError2, selectResult2) {
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
                    "skillName" : selectResult[i].skill_name
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

app.get('/profile', function (request,response) {

    let selectSqls = "SELECT job_post.job_name, employer.user_name, " +
        "job_post.function, job_post.city, job_post.state, " +
        "job_post.country FROM job_post " +
        "INNER JOIN employer ON employer.id = job_post.company_id " +
        "INNER JOIN job_application ON job_application.job_post_id = job_post.id " +
        "WHERE job_application.user_profile_id = 1;" +
        "SELECT PERIOD_DIFF(EXTRACT(YEAR_MONTH FROM end_date), " +
        "EXTRACT(YEAR_MONTH FROM start_date)) as num_of_months, " +
        "(CASE WHEN (DAY(end_date)-DAY(start_date) > 15) " +
        " THEN" +
        " 1" +
        " ELSE" +
        " 0" +
        " END)" +
        " as plus_num_of_months" +
        " from work_experience";

    pool.query(selectSqls, function (selectErrs, selectResults) {
        if (selectErrs) {
            console.log("-----DATABASE ERROR-----\nError fetching job details. See below for detailed error information.\n");
            console.log("Error in query " + selectErrs.index);
            // console.log("Error in query "+selectErrs.index);
            return;
        }
        console.log("MULTIPLE QUERY RESULTS");
        console.log(JSON.stringify(selectResults[0]));
        console.log(JSON.stringify(selectResults[1]));

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
    pool.query(selectSql, function (selectErr, selectResult, selectFields) {
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
                pool.query(selectQuery2, function (selectError2, selectResult2) {
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
                "postedByUserId": postedByUserId,
                "jobPosts" : jobPostsArr
            }

            console.log("-----------Returning job posts------------\n"+responseJson);
            response.send(JSON.stringify(responseJson));
        }
    });
});

app.get('/recruiterJobPostApplicants', function (request,response) {
    let postedByUserId = request.body.user.userId;
    let jobId = request.body.user.jobId;

    let selectSql = "SELECT job_application.*, user_profile.email, " +
        "CONCAT(user_profile.first_name, \" \", user_profile.last_name) AS user_name " +
        "FROM job_application " +
        "INNER JOIN user_profile " +
        "ON user_profile.id = job_application.user_profile_id " +
        "WHERE job_application.job_post_id = " + jobId;
    pool.query(selectSql, function (selectErr, selectResult, selectFields) {
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
                "postedByUserId": postedByUserId,
                "jobApplicants" : jobApplicantsArr
            }

            console.log("-----------Returning job applicants------------\n"+JSON.stringify(responseJson));
            response.send(JSON.stringify(responseJson));
        }
    });
});

app.get('/searchRecruiter', function (request,response) {
    let userId = request.query.userId;
    let keyword = request.query.keyword;
    let location = request.query.location;
    let workExFrom = (request.query.workExFrom)?(request.query.workExFrom)*12:(request.query.workExFrom);
    let workExTo = (request.query.workExTo)?(request.query.workExTo)*12:(request.query.workExTo);

    let workExFlag = 0;

    let selectSqlKeyword = "SELECT user_profile.id as user_id, user_profile.first_name, user_profile.last_name, skill_set.skill_name, job_seeker_profile.current_city,  job_seeker_profile.current_state, job_seeker_profile.current_country, job_seeker_profile.current_designation, PERIOD_DIFF(EXTRACT(YEAR_MONTH FROM CURRENT_DATE), EXTRACT(YEAR_MONTH FROM first_start_date)) + (CASE WHEN ABS((DAY(CURRENT_DATE)-DAY(first_start_date)) > 15) THEN 1 ELSE 0 END) as exp_months from user_profile INNER JOIN job_seeker_profile ON job_seeker_profile.user_profile_id = user_profile.id INNER JOIN js_skill_set ON js_skill_set.user_profile_id = user_profile.id INNER JOIN skill_set ON skill_set.id = js_skill_set.skill_id INNER JOIN work_experience_start ON work_experience_start.user_profile_id = user_profile.id WHERE (skill_set.skill_name LIKE \'%"+keyword+"%\' OR job_seeker_profile.current_designation like \'%"+keyword+"%\' or job_seeker_profile.current_job_description like \'%"+keyword+"%\')";
    let selectSqlLocation = "SELECT user_profile.id as user_id, user_profile.first_name, user_profile.last_name, skill_set.skill_name, job_seeker_profile.current_city, job_seeker_profile.current_state, job_seeker_profile.current_country, job_seeker_profile.current_designation, PERIOD_DIFF(EXTRACT(YEAR_MONTH FROM CURRENT_DATE), EXTRACT(YEAR_MONTH FROM first_start_date)) + (CASE WHEN ABS((DAY(CURRENT_DATE)-DAY(first_start_date)) > 15) THEN 1 ELSE 0 END) as exp_months from user_profile INNER JOIN job_seeker_profile ON job_seeker_profile.user_profile_id = user_profile.id INNER JOIN js_skill_set ON js_skill_set.user_profile_id = user_profile.id INNER JOIN skill_set ON skill_set.id = js_skill_set.skill_id INNER JOIN work_experience_start ON work_experience_start.user_profile_id = user_profile.id WHERE (skill_set.skill_name LIKE \'%"+keyword+"%\' OR job_seeker_profile.current_designation like \'%"+keyword+"%\' or job_seeker_profile.current_job_description like \'%"+keyword+"%\') AND (job_seeker_profile.current_city like \'%"+location+"%\' OR job_seeker_profile.current_state like \'%"+location+"%\' OR job_seeker_profile.current_country like \'%"+location+"%\')";
    let selectSqlWorkEx = selectSqlKeyword;
        //"SELECT job_post.id, job_post.job_name, job_post.domain, employer.user_name, skill_set.skill_name FROM job_post INNER JOIN employer ON job_post.company_id = employer.id INNER JOIN jp_skill_set ON job_post.id = jp_skill_set.job_post_id INNER JOIN skill_set ON skill_set.id = jp_skill_set.skill_id WHERE (job_name LIKE \'%"+keyword+"%\' OR job_post.domain LIKE \'%"+keyword+"%\' OR function LIKE \'%"+keyword+"%\' OR description LIKE \'%"+keyword+"%\' OR city LIKE \'%"+keyword+"%\' OR state LIKE \'%"+keyword+"%\' OR state LIKE \'%"+keyword+"%\' OR employer.user_name LIKE \'%"+keyword+"%\' OR skill_set.skill_name LIKE \'%"+keyword+"%\') AND (employer.user_name like \'%"+company+"%\');";
    let selectSqlAll = selectSqlLocation;
        //"SELECT job_post.id, job_post.job_name, job_post.domain, employer.user_name, skill_set.skill_name FROM job_post INNER JOIN employer ON job_post.company_id = employer.id INNER JOIN jp_skill_set ON job_post.id = jp_skill_set.job_post_id INNER JOIN skill_set ON skill_set.id = jp_skill_set.skill_id WHERE (job_name LIKE \'%"+keyword+"%\' OR job_post.domain LIKE \'%"+keyword+"%\' OR function LIKE \'%"+keyword+"%\' OR description LIKE \'%"+keyword+"%\' OR city LIKE \'%"+keyword+"%\' OR state LIKE \'%"+keyword+"%\' OR state LIKE \'%"+keyword+"%\' OR employer.user_name LIKE \'%"+keyword+"%\' OR skill_set.skill_name LIKE \'%"+keyword+"%\') AND (job_post.city LIKE \'%"+location+"%\' OR job_post.state LIKE \'%"+location+"%\' OR job_post.country LIKE \'%"+location+"%\') AND (employer.user_name like \'%"+company+"%\');";

    let selectSql= "";
    // check search parameters
    if(typeof location === "undefined" && (typeof workExFrom === "undefined" && typeof workExTo === "undefined"))
        selectSql = selectSqlKeyword;
    else if(typeof location !== "undefined" && (typeof workExFrom === "undefined" && typeof workExTo === "undefined"))
        selectSql = selectSqlLocation;
    else if(typeof location === "undefined" && (typeof workExFrom !== "undefined" && typeof workExTo !== "undefined")) {
        selectSql = selectSqlWorkEx;
        workExFlag = 1;
    }
    else {
        selectSql = selectSqlAll;
        workExFlag = 1;
    }

    console.log("workExFlag: "+workExFlag);

    pool.query(selectSql, function (selectErr, selectResult, selectFields) {
        if (selectErr) {
            var responseJson = {
                "dbError" : 1,
                "matchedUsers": null
            }
            console.log("Error fetching job details. See below for detailed error information.\n" + selectErr.message)
            console.log("-----DATABASE CONNECTIVITY ERROR-----\nKindly contact ADMIN.\n");
            response.send(JSON.stringify(responseJson));
        }
        else if (selectResult == '') {
            var responseJson = {
                "dbError" : 0,
                "matchedUsers": null
            }
            console.log("-----DATABASE ENTRY ERROR/NO SUCH USER EXISTS-----\nKindly contact ADMIN.\n")
            response.send(JSON.stringify(responseJson));
        }
        else
        {
            var jobSeekersArr = []
            for(var i = 0; i < selectResult.length; i++)
            {
                var jobSeekerId = selectResult[i].id;
                var jobSeekerName = selectResult[i].first_name + " " + selectResult[i].last_name;
                var currDesignation = selectResult[i].current_designation;
                var location = selectResult[i].current_city + ", " + selectResult[i].current_state + ", " + selectResult[i].current_country; ;
                if(workExFlag)
                    if(!((workExFrom <= selectResult[i].exp_months) && (selectResult[i].exp_months <= workExTo)))
                        continue;
                var workEx = calculateWorkEx(selectResult[i].exp_months);

                var jsonObj = {
                    "jobSeekerId" : jobSeekerId,
                    "jobSeekerName" : jobSeekerName,
                    "currDesignation" : currDesignation,
                    "location" : location,
                    "workEx" : workEx
                }
                jobSeekersArr.push(jsonObj);
            }

            var responseJson = {
                "dbError" : 0,
                "userId": userId,
                "matchedJobSeekers" : jobSeekersArr
            }

            console.log("-----------Returning user(s) matched with recruiter's/employers's search------------\n"+JSON.stringify(responseJson));
            response.send(JSON.stringify(responseJson));
            return;
        }
    });
});

app.get('/searchJobSeeker', function (request,response) {
    let userId = request.query.userId;
    let keyword = request.query.keyword;
    let location = request.query.location;
    let company = request.query.company;

    let selectSqlKeyword = "SELECT job_post.*, employer.user_name as company_name, employer.id as company_id, skill_set.skill_name " +
        "FROM job_post INNER JOIN employer ON job_post.company_id = employer.id " +
        "INNER JOIN jp_skill_set ON job_post.id = jp_skill_set.job_post_id " +
        "INNER JOIN skill_set ON skill_set.id = jp_skill_set.skill_id " +
        "WHERE job_name LIKE \'%"+keyword+"%\' OR job_post.domain LIKE \'%"+keyword+"%\' " +
        "OR function LIKE \'%"+keyword+"%\' OR description LIKE \'%"+keyword+"%\' " +
        "OR city LIKE \'%"+keyword+"%\' OR state LIKE \'%"+keyword+"%\' OR state LIKE \'%"+keyword+"%\' " +
        "OR employer.user_name LIKE \'%"+keyword+"%\' OR skill_set.skill_name LIKE \'%"+keyword+"%\'";
    let selectSqlLocation = "SELECT job_post.*, employer.user_name, skill_set.skill_name FROM job_post INNER JOIN employer ON job_post.company_id = employer.id INNER JOIN jp_skill_set ON job_post.id = jp_skill_set.job_post_id INNER JOIN skill_set ON skill_set.id = jp_skill_set.skill_id WHERE (job_name LIKE \'%"+keyword+"%\' OR job_post.domain LIKE \'%"+keyword+"%\' OR function LIKE \'%"+keyword+"%\' OR description LIKE \'%"+keyword+"%\' OR city LIKE \'%"+keyword+"%\' OR state LIKE \'%"+keyword+"%\' OR state LIKE \'%"+keyword+"%\' OR employer.user_name LIKE \'%"+keyword+"%\' OR skill_set.skill_name LIKE \'%"+keyword+"%\') AND (job_post.city LIKE \'%"+location+"%\' OR job_post.state LIKE \'%"+location+"%\' OR job_post.country LIKE \'%"+location+"%\');";
    let selectSqlCompany = "SELECT job_post.*, employer.user_name, skill_set.skill_name FROM job_post INNER JOIN employer ON job_post.company_id = employer.id INNER JOIN jp_skill_set ON job_post.id = jp_skill_set.job_post_id INNER JOIN skill_set ON skill_set.id = jp_skill_set.skill_id WHERE (job_name LIKE \'%"+keyword+"%\' OR job_post.domain LIKE \'%"+keyword+"%\' OR function LIKE \'%"+keyword+"%\' OR description LIKE \'%"+keyword+"%\' OR city LIKE \'%"+keyword+"%\' OR state LIKE \'%"+keyword+"%\' OR state LIKE \'%"+keyword+"%\' OR employer.user_name LIKE \'%"+keyword+"%\' OR skill_set.skill_name LIKE \'%"+keyword+"%\') AND (employer.user_name like \'%"+company+"%\');";
    let selectSqlAll = "SELECT job_post.*, employer.user_name, skill_set.skill_name FROM job_post INNER JOIN employer ON job_post.company_id = employer.id INNER JOIN jp_skill_set ON job_post.id = jp_skill_set.job_post_id INNER JOIN skill_set ON skill_set.id = jp_skill_set.skill_id WHERE (job_name LIKE \'%"+keyword+"%\' OR job_post.domain LIKE \'%"+keyword+"%\' OR function LIKE \'%"+keyword+"%\' OR description LIKE \'%"+keyword+"%\' OR city LIKE \'%"+keyword+"%\' OR state LIKE \'%"+keyword+"%\' OR state LIKE \'%"+keyword+"%\' OR employer.user_name LIKE \'%"+keyword+"%\' OR skill_set.skill_name LIKE \'%"+keyword+"%\') AND (job_post.city LIKE \'%"+location+"%\' OR job_post.state LIKE \'%"+location+"%\' OR job_post.country LIKE \'%"+location+"%\') AND (employer.user_name like \'%"+company+"%\');";

    let selectSql= "";
    // check search parameters
    if(typeof location === "undefined" && typeof company === "undefined")
        selectSql = selectSqlKeyword;
    else if(typeof location !== "undefined" && typeof company === "undefined")
        selectSql = selectSqlLocation;
    else if(typeof location === "undefined" && typeof company !== "undefined")
        selectSql = selectSqlCompany;
    else
        selectSql = selectSqlAll;

    pool.query(selectSql, function (selectErr, selectResult, selectFields) {
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
        else
        {
            var jobsArr = []
            for(var i = 0; i < selectResult.length; i++)
            {
                var jobId = selectResult[i].id;
                var jobName = selectResult[i].job_name;
                var companyId = selectResult[i].company_id;
                var companyName = selectResult[i].company_name;
                var domain = selectResult[i].domain;
                var postedByUserId = selectResult[i].posted_by_id
                var jobType = (selectResult[i].job_type='F')? "Full-Time":"Internship";
                var postedByUserId = selectResult[i].posted_by_id;

                var jsonObj = {
                    "jobId" : jobId,
                    "jobName" : jobName,
                    "postedById": postedByUserId,
                    "companyId" : companyId,
                    "companyName" : companyName,
                    "domain" : domain,
                    "industry": selectResult[i].industry,
                    "city": selectResult[i].city,
                    "state" : selectResult[i].state,
                    "country" : selectResult[i].country,
                    "function": selectResult[i].function,
                    "description": selectResult[i].description,
                    "jobType": jobType,
                    "isActive": selectResult[i].is_active,
                    "skillName" : selectResult[i].skill_name
                }
                jobsArr.push(jsonObj);
            }

            var responseJson = {
                "dbError" : 0,
                "userId" : userId,
                "matchedJobs" : jobsArr
            }

            console.log("-----------Returning jobs matched with user's search------------\n"+JSON.stringify(responseJson));
            response.send(JSON.stringify(responseJson));
            return;
        }
    });

});

app.get('/showEducation', function (request,response) {
    let userId = request.query.userId;

    selectSql = "select * from education where user_profile_id = " + userId;
    pool.query(selectSql, function (selectErr, selectResult) {
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
});

app.get('/showWorkExperience', function (request,response) {
    let userId = request.query.userId;

    selectSql = "select * from work_experience where user_profile_id = " + userId;
    pool.query(selectSql, function (selectErr, selectResult, selectFields) {
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
});

app.get('/userDetails', function (request,response) {
    let userId = request.query.userId;

    selectSql = "select * from user_profile where id = " + userId;
    pool.query(selectSql, function (selectErr, selectResult) {
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
