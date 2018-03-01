var request = require('request');
var mydate = require('./date');
var credentials = require('./credentials.json');
var entinfo = require('./enterpriseinfo.json');

const UN = credentials.username;
const PWD = credentials.password;

const PROJECT_NAME= entinfo.project;
const WORKING_HOURS = entinfo.hours;
const base = entinfo.urlBase;
                        
var url = "/auth/login?targetUri=%2F";
var loginUrl = "/auth/signIn";
var timeSheetData = "/myTimesheet/getTimesheetData?_search=false&rows=-1&page=1&sidx=&sord=asc";
var addData = "/myTimesheet/getSavedWithValidation";


request = request.defaults({jar: true , followAllRedirects: true});

// The base header is used to populate some header fields
var baseHeader = {
			"Accept" :  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" ,
			"Accept-Language" :  "en-US,en;q=0.5" ,
			"User-Agent" : "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:42.0) Gecko/20100101 Firefox/42.0" ,
    };

var homePageOptions = {
    url : base+url , headers : baseHeader
};

var loginFormOptions = { url:base+loginUrl, form: { 'username':UN , 'password' : PWD , 'targetUri' : '/' } , headers : baseHeader
  };


/** 
Access the index page 
*/

request.get( homePageOptions , handleBasicHomePage);

/**
 * Process the index page.
 * If successful submit the form
 * @param {*} error 
 */
function handleBasicHomePage(error){
    if(error){
     console.log("error : " +error);
    }
   request.post(loginFormOptions, handleLogin); 
}

/**
 * Handle response of login.
 * If successful call dashboard
 */

function handleLogin(error){
    if(error){
     console.log("Error: "+error);
    }
    request.get({ url : base+'/nritimesheet/home/dashboard/' , headers : loginFormOptions.headers } , handleDashBoard);
}


/** 
 * Handle reponse of dashboard.
 * If successful call existing timesheet data
 * 
*/
function handleDashBoard(error){
 
    if(error){
        console.log("Error in dashbaord"+error);
    }
 
   request.get({ url : base+timeSheetData , headers : baseHeader } , handleTimeSheetData);
          
}


/**
 * Access the body data
 * and process
 * @param {*} err 
 * @param {*} httpResponse 
 * @param {*} body 
 */
function handleTimeSheetData(err,httpResponse,body){
                       
      var responseDate = JSON.parse(body);
      processData(responseDate.invdata);
  
}
/**
 * Process the data 
 * TODO - Need to refactor the code
 * @param {*} data 
 */
function processData(data){
 
 var listOfDate = [];
 
 var firstDate = mydate.formatDate();
 
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


  var businessDays = mydate.fetchBusinessDaysInMonth();
  businessDays.forEach( d => {if(listOfDate.indexOf(d)<0){
      console.log("Missing Entry : " + d);
  }})
 

 
 
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

