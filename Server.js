var express = require('express');
var nodemailer = require("nodemailer");
var app=express();
var fs = require('fs');

var path = require('path');
// app.use(express.bodyParser());
var bodyParser = require('body-parser')
// var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '/uploads'))); 

// var express	=	require("express");
var multer	=	require('multer');
let email, name1;
// var app	=	express();

/*
	Here we are configuring our SMTP Server details.
	STMP is mail server which is responsible for sending and recieving email.
*/

var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
		user: "abstractmodifier@gmail.com",
        pass: "Souravkapil"
    },
    tls: {rejectUnauthorized: false},
    debug:true
});


/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

app.get('/',function(req,res){
	res.sendfile('index.html');
});
app.post('/register',function(req,res){
	
	let name = req.body.first_name + " " + req.body.last_name;
	email = req.body.email;
	let rpass = req.body.rpassword;
	let wnum = req.body.wnum;
	let users = {
		name: name,
		email: email,
		password: rpass,
		number: wnum
	}
	fs.writeFile(`db/${email}.json`,JSON.stringify(users), function(err, data){
		if(err){
			console.log(err);
		}
		else console.log(data);
	})
	res.sendfile('main.html');
});
app.post('/login',function(req,res){
	let username = req.body.username;
	let password = req.body.lpassword;
	
	fs.readFile(`db/${username}.json`, function(err, data){
		if(err){
			console.log(err);
		}else{
		console.log(JSON.parse(data).password);
		if(JSON.parse(data).password == password){
			username = username.split("@");
			
			fs.readFile(`uploads/${username[0]}.mp4`, function(err, data1){
				if(err){
					console.log(err);
				}else{
			let result = {
				name: JSON.parse(data).name,
				email: JSON.parse(data).email,
				number: JSON.parse(data).number,
				file: `/${username[0]}.mp4`
			}
			res.render('details.hbs',result);
		}
			// res.send('details.hbs',JSON.parse(data));
		});
	}
}
	});
	
});
app.get('/send',function(req,res){
	var mailOptions={
		to : "kapilgurnani4@gmail.com",
		subject : req.query.subject,
		text : req.query.text,
		filename: name1, 
		attachments: [  
			{   
				filename: name1,    
				contents: new Buffer("data", 'utf-8'),   
				path: './uploads/'+name1
			}   
			] 
	}
	console.log(mailOptions);
	smtpTransport.sendMail(mailOptions, function(error, response){
   	 if(error){
        	console.log(error);
		res.end("error");
	 }else{
        	console.log("Message sent: " + response.message+" Login again");
		res.end("sent");
    	 }
});
});

/*--------------------Routing Over----------------------------*/

// app.listen(3000,function(){
// 	console.log("Express Started on Port 3000");
// });

var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
	  let newname = email.split("@");
	  name1 = newname[0]+ ".mp4";
    callback(null,  ''+name1);
  }
});
var upload = multer({ storage : storage}).single('userPhoto');



app.post('/api/photo',function(req,res){
	upload(req,res,function(err) {
		// if(err) {
		// 	return res.end("Error uploading file.");
		// }
		// res.end("File is uploaded");
	});
});

app.listen(3000,function(){
    console.log("Working on port 3000");
});
