var mysql  = require('mysql'); 
var express = require('express');
var nodemailer = require('nodemailer');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jobsnu.se@gmail.com',
        pass: 'otvdiffsgnowsugd'
    }
});

var connection = mysql.createConnection({    
  host     : 'db.soic.indiana.edu',      
  user     : 'p565f19_sshriva',             
  password : 'ShubhangiP565F19',      
  port: '3306',                  
  database: 'p565f19_sshriva'
});

connection.connect();

var app = express();
var jobsnuEmail = 'jobsnu.se@gmail.com';
var verificationEmailSubject =  'JOBSNU - E-mail Verification';
var otpEmailSubject =  'JOBSNU - OTP for Login'

app.use(express.static('../jobsnu/build'));
app.use(session({
    secret: 'jobsnuSE12.',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
/*
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "test_login.html" );
})
*/
app.post('/mfaLogin', function (req,res) {
   console.log(req.body.user)
    let email = req.body.user.email;
    let password = req.body.user.password;
    let otp = req.body.user.otp;

    // console.log("In LOGIN");
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
            let response = {
                "invalid" : 0,
                "verified" : 0,
                "otp" : otp
            }
            console.log(response);
            res.send(JSON.stringify(response));
        }
        else {
            if (result[0].mfa_enabled) {
                // User E-mail ID Verification

                // let htmlMessageString = '<html>' +
                //     '<body>' +
                //     '<p>Kindly use the OTP below to log in to Jobsnu.</p>' +
                //     '<p style="font-weight: bold">' + otp + '</p>' +
                //     '</body>' +
                //     '</html>';

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

                console.log("***************\nMFA RESPONSE\n***************\n" + response);
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

                console.log("***************\nMFA RESPONSE\n***************\n" + response);
                // res.send(JSON.stringify(response));
                res.redirect(307, '/login');
            }
        }
    });
});

function logInUser(userEmail)
{
    selectSql = "select * from user_profile where email = '" + userEmail +"'";
    connection.query(selectSql, function (selectErr, selectResult) {
        if(selectErr){
            console.log("Error fetching user details. See below for detailed error information.\n" + selectErr.message)
            // res.send("Error fetching user details.\n" + selectErr.message);
            return -1;
        }
        else if(selectResult === '')
        {
            return 0;
        }
        else
        {
            console.log("Login successful. Logging in user " + selectResult[0].id);
            return (JSON.stringify(selectResult));
        }
        return null;
    });
}

app.post('/login', function(request, response){

    // console.log("SESSION VARIABLE DETAILS - Logged In? " + request.session.loggedIn);
    console.log("IN /login\n", request);
    let loginResult = logInUser(request.body.user.email);
    console.log(loginResult)
    if(loginResult === -1)
    {
        console.log("-----DATABASE CONNECTIVITY ERROR-----\nKindly contact ADMIN.\n");
    }
    else if (loginResult === 0){
        console.log("-----DATABASE ENTRY ERROR-----\nKindly contact ADMIN.\n");
    }
    else if(loginResult === null) {
        console.log("-----UNKNOWN ERROR-----\nContact ADMIN to escalate to DEV team.\n");
    }
    else {
        // Set session variables
        request.session.loggedIn = true;
        request.session.id = loginResult[0].id;
        request.session.username = loginResult[0].first_name;

        console.log("-----------SESSION DETAILS-----------\n"+request.session.loggedIn+"\n"+request.session.id+"\n"+request.session.username);

        var response = {
            "invalid": 0,
            "verified": 1,
            "userId": loginResult[0].id,
            "username": loginResult[0].username
        }
    }

    console.log("***************\nLOGIN RESPONSE\n***************\n"+response);
    res.send(JSON.stringify(response));
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

app.get('/register', function (req, res) {
   res.sendFile( __dirname + "/" + "test_verify.html" );
})

app.post('/verify', function (req, res) {
    let email = req.body.user.email;
    let password = req.body.user.password;
    let otp = req.body.user.otp;

    // Add user to login table
    let  addSql = 'INSERT INTO login (email, password, otp) VALUES(?, ?, ?)';
    let  addSqlParams = [email, password, otp];

    connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
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
            "emailid": email,
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
})

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
            console.log(info);
        }
    });
}

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
        "secondaryContact": secondaryContact,
    };
    // should show profile saved message/saved profile details
    console.log(response);
    res.end(JSON.stringify(response));
});

app.get('/test_home', function(request, response) {
	if (request) {
		response.send('Welcome!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

var server = app.listen(3500, function () {
  
    var host = server.address().address
    var port = server.address().port
    
    console.log("www.jobs-nu.com/login.html", host, port)
    
  });
