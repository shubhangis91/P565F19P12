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

app.post('/login', function (req,res) {
    var selectSQL = "select emailid, password, verified from login where emailid = '"+req.body.emailid+"' and password = '"+req.body.password+"'";
    var response = {
       "email": req.query.email,
       "password": req.query.password,
        "verified":
   };
   // console.log(res);
   var selectSQL = "select emailid, password from login where emailid = '"+req.query.emailid+"' and password = '"+req.query.password+"'";
   //var selectSQL = "select password from user where account='"+req.query.account+"'";
   var  addSqlParams = [req.query.emailid,req.query.password];
      connection.query(selectSQL,function (err, result) {
        if(err){
         console.log('[login ERROR] - ',err.message);
         return;
        }
        //console.log(result);
        if(result=='')
        {
            console.log("Wrong password");
            res.end("0");//如果登录失败就给客户端返回0，
        }
        else
        {
            console.log("OK"+result);
			res.redirect('/test_home');
            res.end();//如果登录成就给客户端返回1
        }
});
   console.log(response);
   //res.end(JSON.stringify(response));
})

app.get('/register', function (req, res) {
   res.sendFile( __dirname + "/" + "test_register.html" );
})

app.post('/verify', function (req, res) {
    let otp = req.body.otp;

    // Add user to login table
    let  addSql = 'INSERT INTO login (email, password, otp) VALUES(?, ?, ?)';
    let  addSqlParams = [req.body.email, req.body.password, otp];

    connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            res.end("0");//如果注册失败就给客户端返回0
            return;//如果失败了就直接return不会继续下面的代码
        }
        // If entry into database succeeds, send e-mail
        let verificationMessage = {
            from: 'jobsnu.se@gmail.com',
            to: req.body.email,
            subject: 'Josbnu - E-mail Verification',
            html:   '<html>' +
                        '<body>' +
                            '<p>Kindly use the code below to complete your registration process on Jobsnu.</p>' +
                            '<p style="font-weight: bold">'+otp+'</p>' +
                        '</body>' +
                    '</html>'
        };

        transporter.sendMail(verificationMessage, function(err, info) {
            if (err) {
                console.log("ERROR IN SENDING MAIL.");
                console.log(err)
            } else {
                console.log("SUCCESSFULLY SENT MAIL.");
                console.log(info);
            }
        });
        // Output JSON format
        var response = {
            "emailid":req.body.email,
            "password":req.body.password,
            "verified": 0,        // equals 0; 0: Not verified, 1: Verified;
            "otp": otp
        };
        // res.end("1");//如果注册成功就给客户端返回1
        console.log("OK");
        console.log(result);
        console.log(response);

        //res.end(JSON.stringify(response));
        res.send(response);
    });

   // console.log(response);
})

app.post('/register', function (req, res) {

    var response = {
        "emailid":req.query.emailid,
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
    
  })