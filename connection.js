var mysql  = require('mysql'); 
var express = require('express');
var nodemailer = require('nodemailer');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

// User E-mail ID Verification
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

app.use(express.static('public'));
app.use(session({
    secret: 'jobsnuSE12.',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "test_login.html" );
})

app.post('/mfaLogin', function (req,res) {
    let email = req.body.email;
    let password = req.body.password;
    let otp = req.body.otp;

    // console.log("In LOGIN");
    var selectSQL = "select email, password, verified, mfa_enabled from login where email = '" + req.body.email + "' and password = '" + req.body.password + "'";
        // var  addSqlParams = [req.query.emailid,req.query.password];
    connection.query(selectSQL, function (err, result) {
        if (err) {
            console.log('[login ERROR] - ', err.message);
            return;
        }

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
                "verified" : 0
            }
            console.log(response);
            res.end(JSON.stringify(response));
        }
        else {
            if (result[0].mfa_enabled) {
                let htmlMessageString = '<html>' +
                    '<body>' +
                    '<p>Kindly use the OTP below to log in to Jobsnu.</p>' +
                    '<p style="font-weight: bold">' + otp + '</p>' +
                    '</body>' +
                    '</html>';
                let otpMessage = createMessage(htmlMessageString, jobsnuEmail, req.body.email, otpEmailSubject);
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
                res.send(JSON.stringify(response));
                // res.redirect(307, '/login');
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
            return selectResult;
        }
        return null;
    });
}

app.post('/login', function(request, response){
    console.log("SESSION VRIABLE DETAILS - Logged In? " + request.session.loggedIn);

    var loginResult = logInUser(request.body.email);

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
        req.session.loggedIn = true;
        req.session.id = loginResult[0].id;
        req.session.username = loginResult[0].first_name;

        console.log("-----------SESSION DETAILS-----------\n"+req.session.loggedIn+"\n"+req.session.id+"\n"+req.session.username);

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
    let otp = req.body.otp;

    // Add user to login table
    let  addSql = 'INSERT INTO login (email, password, otp) VALUES(?, ?, ?)';
    let  addSqlParams = [req.body.email, req.body.password, otp];

    connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            res.end("0");
            return;
        }

        let htmlMessageString = '<html>' +
            '<body>' +
            '<p>Kindly use the code below to complete your registration process on Jobsnu.</p>' +
            '<p style="font-weight: bold">'+otp+'</p>' +
            '</body>' +
            '</html>';
        let verificationMessage = createMessage(htmlMessageString, jobsnuEmail, req.body.email, verificationEmailSubject);
        sendMessage(verificationMessage);

        // Output JSON format
        var response = {
            "emailid":req.body.email,
            "password":req.body.password,
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
    let isVerified = req.body.isVerified;

    if(isVerified) {    // if user is verified (OTP entered was correct)
        // Change verification status of user in login table
        let  sqlQuery = 'UPDATE login SET verified = ? where email = ? and password = ?' ;
        let  sqlQueryParams = [isVerified, req.body.email, req.body.password];

        connection.query(sqlQuery, sqlQueryParams,
            function (err, result)
            {
                if(err){
                    console.log('[UPDATE ERROR] - ',err.message);
                    res.send(err.message);
                    return;
                }
            });

        let response = {
            "verified" : 1
        }

        console.log("OK");
        console.log(result);
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

// Haozhang
app.post('/register', function (req, res) {

    var response = {
        "emailid":req.body.emailid,
        "password":req.query.password
    };
    var  addSqlParams = [req.query.emailid,req.query.password];
    connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            res.end("0");
            return;
        }
        res.end("1");//如果注册成功就给客户端返回1
        console.log("OK");
    });
    console.log(response);
    res.end(JSON.stringify(response));
})

app.get('/test_home', function(request, response) {
	if (request) {
		response.send('Welcome!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

var server = app.listen(3000, function () {
  
    var host = server.address().address
    var port = server.address().port
    
    console.log("www.jobs-nu.com/login.html", host, port)
    
  });
