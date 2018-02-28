var request = require('request');
var moment = require('moment');
var credentials = require('./credentials.json');

const PROJECT_NAME='NRI-THAI';
const WORKING_HOURS ='9';
const UN = credentials.username;
const PWD = credentials.password;


//var base = "http://localhost:8080";
var base = "http://timesheet.nrifintech.com";
                        
var url = "/nritimesheet/auth/login?targetUri=%2F";
var loginUrl = "/nritimesheet/auth/signIn";
var timeSheetData = "/nritimesheet/myTimesheet/getTimesheetData?_search=false&rows=-1&page=1&sidx=&sord=asc";
var addData = "/nritimesheet/myTimesheet/getSavedWithValidation";


request = request.defaults({jar: true , followAllRedirects: true});


var baseHeader = {
			"Accept" :  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" ,
			"Accept-Language" :  "en-US,en;q=0.5" ,
			"User-Agent" : "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:42.0) Gecko/20100101 Firefox/42.0" ,
            'host' : 'timesheet.nrifintech.com'
    };

var homePageOptions = {
    url : base+url , headers : baseHeader
};

var loginFormOptions = { url:base+loginUrl, form: { 'username':UN , 'password' : PWD , 'targetUri' : '/' } , headers : baseHeader
  };



request.get( homePageOptions , handleBasicHomePage);

function handleBasicHomePage(error){
    if(error){
     console.log("error : " +error);
    }
   request.post(loginFormOptions, handleLogin); 
}



function handleLogin(error){
    if(error){
     console.log("Error: "+error);
    }
    request.get({ url : base+'/nritimesheet/home/dashboard/' , headers : loginFormOptions.headers } , handleDashBoard);
}

function handleDashBoard(){
 
 
 
   request.get({ url : base+timeSheetData , headers : baseHeader } , handleTimeSheetData);
          
}
       
function handleTimeSheetData(err,httpResponse,body){
                       
      var responseDate = JSON.parse(body);
      processData(responseDate.invdata);
  
}

function processData(data){
 
 var listOfDate = [];
 var firstDate = moment().format("DD-MM-YYYY");
 
 var myData = [];
 
 data.forEach( item => listOfDate.push(item.cell[3]));
 
 data.forEach( item => myData.push( {
   'dbid' : item.cell[0]+"" ,
   'msgid' : item.cell[1]+"",
   'id' : item.cell[2]+"" ,
   'date' :  item.cell[3]+"",
   "Activity" : item.cell[4]+"" ,
   'Project' : item.cell[5]+"",
   'Hour' : item.cell[6]+"",
   'delid' : ''
  
  } ));
 

 
 
 if(listOfDate.indexOf(firstDate)<0){
  
  
  
console.log("Add the entry : ");
  myData.unshift({
   'dbid' : "" ,
   'msgid' : "",
   'id' : (listOfDate.length+1)+"" ,
   'date' :  firstDate,
   "Activity" : 'Service' ,
   'Project' : PROJECT_NAME,
   'Hour' : WORKING_HOURS,
    "delid":"&nbsp;<div class=\"left deleteBtn\"></div>"
   
 });
 
 
 var myDataStr = JSON.stringify(myData);
 
 //console.log(myDataStr);
 
 request.post({
  url : base+addData,
  json: true,
  form : {
   'mydata' : myDataStr
  } ,
  headers : baseHeader
  } , function(err,resp,body){
   
   console.log(body.genmsg);
   
  });
 
 
 
 
}else{
 
 console.log("Nothing to add..");
 
}

}

