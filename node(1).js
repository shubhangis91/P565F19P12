var mysql  = require('mysql'); 
  
 var connection = mysql.createConnection({    
   host     : 'localhost',      
   user     : 'wcztzd428p6b',             
   password : 'jobsnuSE12.',      
   port: '3306',                  
   database: 'test1'
 });

/*var connection = mysql.createConnection({    
   host     : 'localhost',      
   user     : 'root',                  
   port: '3306',                  
   database: 'new_schema1',
   timeout: 600000
 });*/

connection.connect();
 
var express = require('express');
var app = express();
  
app.use(express.static('public'));
 //参数里为'/'则是默认打开页面
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})
 
 
app.get('/login',function (req,res) {
    var response = {
       "emailid":req.query.emailid,
       "password":req.query.password,
   };
   var selectSQL = "select emailid,password from login where emailid = '"+req.query.emailid+"' and password = '"+req.query.password+"'";
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
            console.log("OK");
            res.end("1");//如果登录成就给客户端返回1
        }
});
   console.log(response);
   //res.end(JSON.stringify(response));
})
 
app.get('/register.html', function (req, res) {
   res.sendFile( __dirname + "/" + "register.html" ); 
})
 
var  addSql = 'INSERT INTO user_profile(email, password, first_name, last_name, dob, gender, primary_contact, secondary_contact, registration) VALUES(?,?,?,?,?,?,?,?,?)';
 
app.post('/process_get', function (req, res) {
  
   var response = {
       "email":req.query.email,
       "password":req.query.password,
       "first_name":req.query.first_name,
       "last_name":req.query.last_name,
       "dob":req.query.dob,
       "gender":req.query.gender,
       "primary_contact":req.query.primary_contact,
       "secondary_contact":req.query.secondary_contact,
       "registration":req.query.registration
   };
   var  addSqlParams = [req.query.emailid,req.query.password,req.query.first_name,req.query.last_name,req.query.dob,req.query.gender,req.query.primary_contact,req.query.secondary_contact,req.query.registration];
   connection.query(addSql,addSqlParams,function (err, result) {
      if(err){
         console.log('[INSERT ERROR] - ',err.message);
         res.end("0");
         return;
        }
        res.end("1");
        console.log("OK");     
});
   console.log(response);
   //res.end(JSON.stringify(response));
})

app.get('/employee.html', function (req, res) {
   res.sendFile( __dirname + "/" + "employee.html" ); 
})
 
var  addSql = 'INSERT INTO user_profile(employer_name, establishment_date, size, headquarters, website, domain, industry, email_id, user_name) VALUES(?,?,?,?,?,?,?,?,?)';
 
app.post('/employee', function (req, res) {
  
   var response = {
       "employer_name":req.query.employer_name,
       "establishment_date":req.query.establishment_date,
       "size":req.query.size,
       "headquarters":req.query.headquarters,
       "website":req.query.website,
       "domain":req.query.domain,
       "industry":req.query.industry,
       "email_id":req.query.email_id,
       "user_name":req.query.user_name
   };
   var  addSqlParams = [req.query.employer_name,req.query.establishment_date,req.query.size,req.query.headquarters,req.query.website,req.query.domain,req.query.industry,req.query.email_id,req.query.user_name];
   connection.query(addSql,addSqlParams,function (err, result) {
      if(err){
         console.log('[INSERT ERROR] - ',err.message);
         res.end("0");
         return;
        }
        res.end("1");
        console.log("OK");     
});
   console.log(response);
   //res.end(JSON.stringify(response));
})

app.get('/job_post.html', function (req, res) {
   res.sendFile( __dirname + "/" + "job_post.html" ); 
})
 
var  addSql = 'INSERT INTO user_profile(employer_name, establishment_date, size, headquarters, website, domain, industry, email_id, user_name) VALUES(?,?,?,?,?,?,?,?,?)';
 
app.post('/job_post', function (req, res) {
  
   var response = {
       "posted_by_id":req.query.posted_by_id,
       "location":req.query.location,
       "domain":req.query.domain,
       "industry":req.query.industry,
       "function":req.query.function,
       "description":req.query.description,
       "company_id":req.query.company_id,
       "job_type":req.query.job_type,
       "is_active":req.query.user_name
   };
   var  addSqlParams = [req.query.employer_name,req.query.establishment_date,req.query.size,req.query.headquarters,req.query.website,req.query.domain,req.query.industry,req.query.email_id,req.query.user_name];
   connection.query(addSql,addSqlParams,function (err, result) {
      if(err){
         console.log('[INSERT ERROR] - ',err.message);
         res.end("0");
         return;
        }
        res.end("1");
        console.log("OK");     
});
   console.log(response);
   //res.end(JSON.stringify(response));
})

var server = app.listen(3000, function () {
  
    var host = server.address().address
    var port = server.address().port
    
    console.log("www.jobs-nu.com/login.html", host, port)
    
  })
