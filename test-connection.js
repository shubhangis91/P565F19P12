var mysql  = require('mysql'); 
var express = require('express');


  
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
 //参数里为'/'则是默认打开页面
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "test_login.html" );
})
 
 
app.get('/login', function (req,res) {
    var response = {
       "emailid":req.query.emailid,
       "password":req.query.password,
   };
   console.log(res);
   var selectSQL = "select emailid,password from login where emailid = '"+req.query.emailid+"' and password = '"+req.query.password+"'";
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
 
app.get('/register.html', function (req, res) {
   res.sendFile( __dirname + "/" + "test_register.html" );
})
 
//注册模块
var  addSql = 'INSERT INTO login (emailid, password, first_name) VALUES(?, ?, ?)';
 
app.get('/register', function (req, res) {
  
   // 输出 JSON 格式
   var response = {
       "emailid":req.query.emailid,
       "password":req.query.password,
       "firstName": req.query.first_name
   };
   var  addSqlParams = [req.query.emailid,req.query.password,req.query.first_name];
   connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
         console.log('[INSERT ERROR] - ',err.message);
         res.end("0");//如果注册失败就给客户端返回0
         return;//如果失败了就直接return不会继续下面的代码
        }
        // res.end("1");//如果注册成功就给客户端返回1
        console.log("OK");
        res.send('/test_home')
        res.end(JSON.stringify(response));
});
   console.log(response);
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