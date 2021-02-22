var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

// post
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/',function(req,res){
  res.render('home') //We can omit the .handlebars extension as we do below
});


var queryData = []
var bodyData = []

//get query request
app.get('/get-page',function(req,res){
	// copy queryData list
	var getParam = queryData;
	// add data to getParam list
  for (var name in req.query){
    getParam.push({'name':name,'value':req.query[name]})
  }

  // render get-page dataList with getParam
  var context = {};
  context.dataList = getParam;
  res.render('get-page', context);

  // copy getParam to queryData
  queryData = getParam
});

// post request
app.post('/post-page', function(req,res){
	// copy queryData and bodyData
  var postParam = queryData;
  var postBody = bodyData;
  //add data to postParam list
  for (var name in req.query){
    postParam.push({'name':name,'value':req.query[name]})
  }
  //add data to postBody list
  for (var name in req.body){
    postBody.push({'name':name,'value':req.body[name]})
  }

  // dataList:postParam, bodyList:postBody
  var context = {};
  context.dataList = postParam;
  context.bodyList = postBody;
  res.render('post-page', context);

  // copy data back
  queryData = postParam
  bodyData = postBody
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});